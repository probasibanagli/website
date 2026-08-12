const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
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

const MALE_NAMES = ['Aarav', 'Vihaan', 'Aditya', 'Sai', 'Krishna', 'Ishaan', 'Dhruv', 'Kabir', 'Aryan', 'Rohan'];
const FEMALE_NAMES = ['Diya', 'Sanya', 'Aanya', 'Kavya', 'Priya', 'Meera', 'Riya', 'Neha', 'Pooja', 'Sneha'];
const PROFESSIONS = ['Software Engineer', 'Doctor', 'Teacher', 'Business', 'Marketing Manager', 'Banker', 'Architect'];
const RELIGIONS = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain'];
const CASTES = ['Brahmin', 'Kshatriya', 'Vaishya', 'Kayastha', 'None'];
const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Pune', 'Hyderabad', 'Ahmedabad'];

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateProfile(userId, isMale) {
  const gender = isMale ? 'Male' : 'Female';
  const name = isMale ? randomElement(MALE_NAMES) : randomElement(FEMALE_NAMES);
  const lastName = 'Kumar';
  
  const now = new Date().toISOString();
  const profileId = `MAT-${Math.floor(Math.random() * 90000) + 10000}`;
  const religion = randomElement(RELIGIONS);
  const caste = religion === 'Hindu' ? randomElement(CASTES) : '';
  const age = Math.floor(Math.random() * 15) + 24; // 24 to 38
  
  return {
    user_id: userId,
    profile_id: profileId,
    profile_for: 'Myself',
    full_name: `${name} ${lastName}`,
    date_of_birth: `19${90 + Math.floor(Math.random() * 10)}-01-01`,
    age: age,
    gender: gender,
    height: `${Math.floor(Math.random() * 2) + 4} ft ${Math.floor(Math.random() * 11)} in`,
    weight: '65',
    complexion: 'Fair',
    blood_group: 'O+',
    marital_status: 'Never Married',
    mother_tongue: 'Hindi',
    physical_disability: 'None',
    city: randomElement(CITIES),
    native_district: 'Delhi',
    father_name: `Father ${lastName}`,
    father_occupation: 'Retired',
    mother_name: `Mother ${lastName}`,
    mother_occupation: 'Homemaker',
    siblings: '1 Brother',
    family_type: 'Nuclear',
    family_values: 'Moderate',
    family_status: 'Middle Class',
    education: "Master's Degree",
    field_of_study: 'Engineering',
    institution: 'Delhi University',
    profession: randomElement(PROFESSIONS),
    company: 'Tech Corp',
    annual_income: 'Rs. 10 - 15 Lakh',
    work_city: randomElement(CITIES),
    religion: religion,
    caste: caste,
    sub_caste: '',
    gotra: '',
    raasi: '',
    star: '',
    manglik: 'No',
    diet: 'Vegetarian',
    smoking: 'No',
    drinking: 'No',
    hobbies: ['Reading', 'Traveling'],
    about_me: 'I am a simple and caring person.',
    partner_preference: 'Looking for a kind and understanding partner.',
    pref_age_min: age - 3,
    pref_age_max: age + 3,
    pref_height_min: '5 ft',
    pref_height_max: '6 ft',
    pref_education: 'Any',
    pref_profession: 'Any',
    pref_city: 'Any',
    pref_diet: 'Any',
    pref_marital_status: 'Never Married',
    phone: '+919999999999',
    email: `${name.toLowerCase()}@example.com`,
    whatsapp: '+919999999999',
    social_handle: '',
    photos: [],
    video: '',
    verified: true,
    published: true,
    status: 'verified',
    contact_visible_after_login: true,
    created_at: now,
    updated_at: now,
  };
}

async function seed() {
  const dummyUser1 = 'seed-user-1';
  const dummyUser2 = 'seed-user-2';

  const profiles = [];
  
  // 5 Profiles from user 1 (all Male for example)
  for (let i = 0; i < 5; i++) {
    profiles.push(generateProfile(dummyUser1, true));
  }
  
  // 5 Profiles from user 2 (all Female for example)
  for (let i = 0; i < 5; i++) {
    profiles.push(generateProfile(dummyUser2, false));
  }

  let successCount = 0;
  for (const profile of profiles) {
    const docRef = db.collection('matrimony_profiles').doc();
    try {
      await docRef.set({ ...profile, id: docRef.id });
      console.log(`✅ Created profile: ${profile.full_name} (${profile.profile_id})`);
      successCount++;
    } catch (e) {
      console.error(`❌ Failed to create profile: ${e.message}`);
    }
  }

  console.log(`\n🎉 Successfully added ${successCount} dummy profiles!`);
  process.exit(0);
}

seed();
