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

async function listUsers() {
  console.log('Querying users from Firestore...');
  const snap = await db.collection('users').get();
  console.log(`Found ${snap.size} total documents in users collection:\n`);
  
  snap.docs.forEach((doc) => {
    console.log(`- ID: ${doc.id}`);
    console.log(`  Data:`, JSON.stringify(doc.data(), null, 2));
  });
}

listUsers().catch(console.error);
