require('dotenv').config({ path: '.env.local' });
import { adminAuth, adminDb } from './src/lib/firebase-admin';

async function main() {
  const email = 'dm@vectratech.in';
  const phone = '9363413008';
  
  try {
    // 1. Try to get user by email, or create if not exists
    let userRecord;
    try {
      userRecord = await adminAuth.getUserByEmail(email);
      console.log(`Found existing auth user by email: ${userRecord.uid}`);
    } catch (e: any) {
      if (e.code === 'auth/user-not-found') {
        try {
          userRecord = await adminAuth.getUserByPhoneNumber(`+91${phone}`);
          console.log(`Found existing auth user by phone: ${userRecord.uid}`);
          // Update the user's email since we found them by phone
          await adminAuth.updateUser(userRecord.uid, { email: email });
          console.log(`Updated user's email to ${email}`);
        } catch (phoneErr: any) {
          if (phoneErr.code === 'auth/user-not-found') {
            console.log(`User not found in Auth. Creating new user...`);
            userRecord = await adminAuth.createUser({
              email: email,
              phoneNumber: `+91${phone}`,
              emailVerified: true,
              password: 'Password@123'
            });
            console.log(`Created new auth user: ${userRecord.uid}`);
          } else {
            throw phoneErr;
          }
        }
      } else {
        throw e;
      }
    }

    // 2. Set custom claims for role
    await adminAuth.setCustomUserClaims(userRecord.uid, { role: 'superadmin' });
    console.log(`Successfully set custom claims (superadmin) for ${email}.`);

    // 3. Update or create user document in Firestore
    const userRef = adminDb.collection('users').doc(userRecord.uid);
    const docSnap = await userRef.get();

    const fullPermissions = {
      stay: 'manage',
      food: 'manage',
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

    if (!docSnap.exists) {
      console.log(`Creating new Firestore document for ${email}...`);
      await userRef.set({
        uid: userRecord.uid,
        email: email,
        phone: phone,
        full_name: 'Super Admin (Vectratech)',
        role: 'superadmin',
        permissions: fullPermissions,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    } else {
      console.log(`Updating existing Firestore document for ${email}...`);
      await userRef.update({
        role: 'superadmin',
        permissions: fullPermissions,
        phone: phone,
        updated_at: new Date().toISOString()
      });
    }

    console.log(`Successfully completed superadmin setup for ${email}`);
    process.exit(0);

  } catch (error) {
    console.error('Error adding super admin:', error);
    process.exit(1);
  }
}

main();
