const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');
require('dotenv').config({ path: '.env.local' });

if (getApps().length === 0) {
  const hasAdminCreds = process.env.FIREBASE_ADMIN_CLIENT_EMAIL && process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  if (!hasAdminCreds) {
    console.error('❌ Missing Firebase Admin Service Account credentials in .env.local');
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
  const email = 'sec23cj051@sairamtap.edu.in';
  const rawPhone = '7094902295';
  const phone = '+917094902295';
  const password = 'SuperAdmin123!';
  let uid = '';

  console.log(`Setting up Super Admin for Email: ${email}, Phone: ${phone}`);

  // 1. Check if phone is owned by another user and free it if needed
  try {
    const existingPhoneUser = await auth.getUserByPhoneNumber(phone);
    if (existingPhoneUser && existingPhoneUser.email !== email) {
      console.log(`⚠️ Phone number ${phone} is owned by user ${existingPhoneUser.uid} (${existingPhoneUser.email || 'No Email'}). Updating user email...`);
      // Delete user if orphan or update
    }
  } catch (err) {
    if (err.code !== 'auth/user-not-found') {
      console.warn('Phone search note:', err.message);
    }
  }

  // 2. Auth user create or update
  try {
    const userRecord = await auth.getUserByEmail(email);
    uid = userRecord.uid;
    await auth.updateUser(uid, {
      phoneNumber: phone,
      emailVerified: true,
    });
    console.log(`✅ Existing Auth user updated (UID: ${uid})`);
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      try {
        const phoneUser = await auth.getUserByPhoneNumber(phone);
        uid = phoneUser.uid;
        await auth.updateUser(uid, {
          email: email,
          emailVerified: true,
        });
        console.log(`✅ Found Auth user by phone and updated email to ${email} (UID: ${uid})`);
      } catch (pErr) {
        if (pErr.code === 'auth/user-not-found') {
          const newUser = await auth.createUser({
            email,
            password,
            phoneNumber: phone,
            displayName: 'Super Admin',
            emailVerified: true,
          });
          uid = newUser.uid;
          console.log(`✅ New Super Admin created in Auth with UID: ${uid}`);
        } else {
          throw pErr;
        }
      }
    } else {
      throw error;
    }
  }

  // 3. Set custom claims for role superadmin
  await auth.setCustomUserClaims(uid, { role: 'superadmin' });
  console.log(`✅ Custom user claims set to superadmin for UID: ${uid}`);

  // 4. Firestore Document Write
  const now = new Date().toISOString();
  const permissions = {
    stay: 'manage',
    food: 'manage',
    travel: 'manage',
    emergency: 'manage',
    community: 'manage',
    services: 'manage',
    blog: 'manage',
    users: 'manage',
    matrimony: 'manage',
    blood_bank: 'manage',
    events: 'manage',
    ambulance: 'manage',
    government_services: 'manage',
    legal: 'manage'
  };

  await db.collection('users').doc(uid).set({
    uid,
    email,
    phone: rawPhone,
    full_name: 'Super Admin',
    role: 'superadmin',
    permissions,
    created_at: now,
    updated_at: now,
    is_active: true,
    email_verified: true,
    phone_verified: true,
  }, { merge: true });

  console.log(`✅ Super Admin document written to Firestore users collection`);
  console.log('\n--- Credentials & Details ---');
  console.log(`UID: ${uid}`);
  console.log(`Email: ${email}`);
  console.log(`Phone: ${phone} (${rawPhone})`);
  console.log(`Role: superadmin`);
  console.log('------------------------------');
}

run().catch((err) => {
  console.error('❌ Error executing script:', err);
  process.exit(1);
});
