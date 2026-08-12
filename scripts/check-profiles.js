const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
require('dotenv').config({ path: '.env.local' });

if (getApps().length === 0) {
  const hasAdminCreds = process.env.FIREBASE_ADMIN_CLIENT_EMAIL && process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  if (!hasAdminCreds) {
    console.error('❌ Missing Firebase Admin Service Account credentials in .env.local');
    process.exit(1);
  }

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
  const snapshot = await db.collection('matrimony_profiles').get();
  console.log(`Total profiles in DB: ${snapshot.size}`);
  snapshot.forEach(doc => {
    const data = doc.data();
    console.log(`- ID: ${doc.id}, Name: ${data.full_name}, Status: ${data.status}, User_ID: ${data.user_id}`);
  });
}

run();
