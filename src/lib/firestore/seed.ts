/**
 * Firestore Seed Script
 *
 * Run with: npx tsx src/lib/firestore/seed.ts
 *
 * This script:
 * 1. Creates a Super Admin user in Firestore (you must first create them in Firebase Auth console)
 * 2. Populates sample data from src/data/sample-data.ts
 *
 * Prerequisites:
 * - Set FIREBASE_ADMIN_* env vars in .env.local
 * - Create the superadmin user in Firebase Auth console first
 * - Then run this script with their UID
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Initialize admin
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

// --- Sample data imports (inline to avoid path alias issues in scripts) ---
import {
  sampleListings,
  sampleFoodListings,
  sampleHospitals,
  sampleBloodBanks,
  sampleCommunityGroups,
  sampleColleges,
  sampleEvents,
  sampleBlogPosts,
} from '../../data/sample-data';

async function seed() {
  console.log('🌱 Starting Firestore seed...\n');

  let SUPER_ADMIN_UID = process.argv[2];

  if (!SUPER_ADMIN_UID) {
    console.log('No UID provided. Attempting to create default super admin in Firebase Auth...');
    try {
      const userRecord = await getAuth().createUser({
        email: 'admin@probasibangali.in',
        password: 'SuperAdmin123!',
        displayName: 'Super Admin',
      });
      SUPER_ADMIN_UID = userRecord.uid;
      console.log(`✅ Created default super admin with UID: ${SUPER_ADMIN_UID}`);
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      if (err.code === 'auth/email-already-exists') {
        const userRecord = await getAuth().getUserByEmail('admin@probasibangali.in');
        SUPER_ADMIN_UID = userRecord.uid;
        console.log(`✅ Found existing super admin with UID: ${SUPER_ADMIN_UID}`);
      } else {
        console.error('❌ Failed to create super admin user in Auth:', err.message);
        console.log('\nPlease create a user manually in the Firebase Console and pass their UID:');
        console.log('npx tsx src/lib/firestore/seed.ts <UID>\n');
        return;
      }
    }
  }

  const now = new Date().toISOString();
  await db.collection('users').doc(SUPER_ADMIN_UID).set({
    uid: SUPER_ADMIN_UID,
    email: 'admin@probasibangali.in',
    full_name: 'Super Admin',
    role: 'superadmin',
    permissions: {
      stay: 'manage', food: 'manage', travel: 'manage', emergency: 'manage',
      community: 'manage', services: 'manage', blog: 'manage', users: 'manage',
    },
    created_at: now,
    updated_at: now,
    is_active: true,
  });
  console.log('✅ Super Admin profile created in Firestore');

  // 2. Seed listings
  for (const item of sampleListings) {
    await db.collection('listings').doc(item.id).set(item);
  }
  console.log(`✅ ${sampleListings.length} listings seeded`);

  // 3. Seed food listings
  for (const item of sampleFoodListings) {
    await db.collection('food_listings').doc(item.id).set(item);
  }
  console.log(`✅ ${sampleFoodListings.length} food listings seeded`);

  // 4. Seed hospitals
  for (const item of sampleHospitals) {
    await db.collection('hospitals').doc(item.id).set(item);
  }
  console.log(`✅ ${sampleHospitals.length} hospitals seeded`);

  // 5. Seed blood banks
  for (const item of sampleBloodBanks) {
    await db.collection('blood_banks').doc(item.id).set(item);
  }
  console.log(`✅ ${sampleBloodBanks.length} blood banks seeded`);

  // 6. Seed community groups
  for (const item of sampleCommunityGroups) {
    await db.collection('community_groups').doc(item.id).set(item);
  }
  console.log(`✅ ${sampleCommunityGroups.length} community groups seeded`);

  // 7. Seed colleges
  for (const item of sampleColleges) {
    await db.collection('colleges').doc(item.id).set(item);
  }
  console.log(`✅ ${sampleColleges.length} colleges seeded`);

  // 8. Seed events
  for (const item of sampleEvents) {
    await db.collection('events').doc(item.id).set(item);
  }
  console.log(`✅ ${sampleEvents.length} events seeded`);

  // 9. Seed blog posts
  for (const item of sampleBlogPosts) {
    await db.collection('blog_posts').doc(item.id).set(item);
  }
  console.log(`✅ ${sampleBlogPosts.length} blog posts seeded`);

  console.log('\n🎉 Seed complete!');
}

seed().catch(console.error);
