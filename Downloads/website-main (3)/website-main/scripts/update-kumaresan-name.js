const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
require('dotenv').config({ path: '.env.local' });

if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

async function run() {
  const email = 'kumaresans407@gmail.com';
  const snapshot = await db.collection('matrimony_profiles').where('email', '==', email).get();

  if (!snapshot.empty) {
    for (const doc of snapshot.docs) {
      await doc.ref.update({
        full_name: 'Geetha S',
        updated_at: new Date().toISOString(),
      });
      console.log(`✅ Successfully updated profile name for ${email} to "Geetha S" (Doc ID: ${doc.id})`);
    }
  } else {
    console.error(`❌ Profile for ${email} not found.`);
  }
}

run();
