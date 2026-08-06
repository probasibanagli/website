const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');
require('dotenv').config({ path: '.env.local' });

if (getApps().length === 0) {
  const hasAdminCreds = process.env.FIREBASE_ADMIN_CLIENT_EMAIL && process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  if (!hasAdminCreds) {
    console.error('❌ Missing Firebase Admin Service Account credentials in .env.local');
    console.error('Please ensure the following environment variables are set in .env.local:');
    console.error('  - FIREBASE_ADMIN_PROJECT_ID');
    console.error('  - FIREBASE_ADMIN_CLIENT_EMAIL');
    console.error('  - FIREBASE_ADMIN_PRIVATE_KEY');
    process.exit(1);
  }

  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin SDK:', error.message);
    process.exit(1);
  }
}

const db = getFirestore();
const auth = getAuth();

async function run() {
  const email = 'admin@pro.in';
  const password = 'SuperAdmin123!';
  const phone = '+919874563210';
  let uid = '';

  console.log(`Setting up Super Admin: ${email}`);

  // Try finding and deleting any user holding this phone number first to free it up
  try {
    const existingPhoneUser = await auth.getUserByPhoneNumber(phone);
    if (existingPhoneUser && existingPhoneUser.email !== email) {
      console.log(`⚠️ Phone number ${phone} is owned by user ${existingPhoneUser.uid} (${existingPhoneUser.email || 'No Email'}). Deleting user to free the number...`);
      await auth.deleteUser(existingPhoneUser.uid);
      
      // Also delete from Firestore if present
      await db.collection('users').doc(existingPhoneUser.uid).delete();
      console.log(`✅ Deleted user ${existingPhoneUser.uid} from Auth & Firestore.`);
    }
  } catch (err) {
    if (err.code !== 'auth/user-not-found') {
      console.warn('Could not check/delete phone user:', err.message);
    }
  }

  // 1. Firebase Auth Create or Update
  try {
    const userRecord = await auth.createUser({
      email,
      password,
      phoneNumber: phone,
      displayName: 'Super Admin',
    });
    uid = userRecord.uid;
    console.log(`✅ Super Admin created in Auth with UID: ${uid}`);
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      const user = await auth.getUserByEmail(email);
      uid = user.uid;
      
      // Update existing user with correct password and phone number
      await auth.updateUser(uid, {
        password,
        phoneNumber: phone,
      });
      console.log(`✅ Existing Super Admin password & phone updated (UID: ${uid})`);
    } else {
      console.error('❌ Error creating user in Auth:', error);
      process.exit(1);
    }
  }

  // 2. Firestore Document Write
  const now = new Date().toISOString();
  await db.collection('users').doc(uid).set({
    uid,
    email,
    phone,
    full_name: 'Super Admin',
    role: 'superadmin',
    permissions: {
      stay: 'manage',
      food: 'manage',
      travel: 'manage',
      emergency: 'manage',
      community: 'manage',
      services: 'manage',
      blog: 'manage',
      users: 'manage',
    },
    created_at: now,
    updated_at: now,
    is_active: true,
  }, { merge: true });

  console.log(`✅ Super Admin document written to Firestore`);
  console.log('\n--- Credentials ---');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  console.log(`Phone: ${phone}`);
  console.log('-------------------');
}

run().catch(console.error);
