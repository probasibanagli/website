import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { config } from 'dotenv';
config({ path: '.env.local' });

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

async function getOtp() {
  const docId = Buffer.from('phone_+919626855406').toString('base64');
  const snap = await db.collection('otps').doc(docId).get();
  if (snap.exists) {
    const data = snap.data();
    console.log("--- OTP FOUND ---");
    console.log("OTP IS:", data.phoneOtp);
    console.log("Expires At:", new Date(data.expiresAt).toLocaleTimeString());
    console.log("-----------------");
  } else {
    console.log("No OTP found in DB for +919626855406");
  }
  process.exit(0);
}

getOtp().catch(console.error);
