const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
require('dotenv').config({ path: '.env.local' });

if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

async function run() {
  console.log('Clearing is_first_login flag for all admins in Firestore...');
  const snap = await db.collection('users').where('role', '==', 'admin').get();
  
  console.log(`Found ${snap.size} admin documents.`);
  
  for (const doc of snap.docs) {
    await doc.ref.update({
      is_first_login: false
    });
    console.log(`✅ Updated Admin: ${doc.data().email || doc.id}`);
  }
  
  console.log('Finished updating existing admin accounts!');
}

run().catch(console.error);
