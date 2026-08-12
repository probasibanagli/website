require('dotenv').config({ path: '.env.local' });
const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

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
const auth = getAuth();

async function removePhone() {
  const phone = "+918124794990";
  try {
    const userRecord = await auth.getUserByPhoneNumber(phone);
    console.log("Found user in Auth:", userRecord.uid);
    await auth.updateUser(userRecord.uid, { phoneNumber: null });
    console.log("Removed phone from Auth.");
    
    const snap = await db.collection("users").where("phone", "==", phone).get();
    if (snap.empty) {
      console.log("No user found in Firestore with this phone.");
    } else {
      for (const doc of snap.docs) {
        await doc.ref.update({ phone: FieldValue.delete() });
        console.log("Removed phone from Firestore document:", doc.id);
      }
    }
  } catch (error) {
    console.error("Error from Auth:", error.message);
    
    // Also try to find in firestore if not in auth
    const snap = await db.collection("users").where("phone", "==", phone).get();
    if (!snap.empty) {
      for (const doc of snap.docs) {
        await doc.ref.update({ phone: FieldValue.delete() });
        console.log("Removed phone from Firestore document:", doc.id);
      }
    } else {
      console.log("No user found in Firestore with this phone either.");
    }
  }
  process.exit(0);
}

removePhone();
