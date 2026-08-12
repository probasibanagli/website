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
  const snapshot = await db.collection('matrimony_profiles').get();
  console.log(`Searching among ${snapshot.size} profiles...`);
  snapshot.forEach(doc => {
    const data = doc.data();
    if (
      (data.full_name && data.full_name.toLowerCase().includes('saravanan')) ||
      (data.email && data.email.toLowerCase().includes('saravanan')) ||
      (data.user_id && data.user_id.toLowerCase().includes('saravanan'))
    ) {
      console.log('FOUND MATCH:', JSON.stringify(data, null, 2));
    }
  });
}

run();
