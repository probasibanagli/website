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

  // Check if profile already exists for this email
  const existingSnap = await db.collection('matrimony_profiles').where('email', '==', email).get();

  const profileData = {
    user_id: 'user-kumaresan-407',
    profile_id: 'PB-K407',
    profile_for: 'Myself',
    full_name: 'Kumaresan S',
    date_of_birth: '2001-08-15',
    age: 24,
    gender: 'female',
    height: "5'4\"",
    weight: '53',
    complexion: 'Fair',
    blood_group: 'O+',
    marital_status: 'Never Married',
    mother_tongue: 'Bengali',
    physical_disability: 'None',
    city: 'Chennai',
    native_district: 'Kolkata',
    father_name: 'S. Kumaresan',
    father_occupation: 'Business',
    mother_name: 'R. Kumaresan',
    mother_occupation: 'Homemaker',
    siblings: '1 Brother',
    family_type: 'Nuclear',
    family_values: 'Traditional',
    family_status: 'Upper Middle Class',
    education: 'B.Tech',
    field_of_study: 'Computer Science',
    institution: 'Anna University',
    profession: 'Software Engineer',
    company: 'Tech Corp',
    annual_income: '10-15 Lakhs',
    work_city: 'Chennai',
    religion: 'Hindu',
    caste: 'Brahmin',
    sub_caste: 'Bhumihar',
    gotra: 'Kashyap',
    raasi: 'Mesha (Aries)',
    star: 'Krittika',
    manglik: 'No',
    diet: 'Eggetarian',
    smoking: 'No',
    drinking: 'No',
    hobbies: ['Reading', 'Music', 'Travel'],
    about_me: 'Software engineer residing in Chennai with deep roots in Bengali culture.',
    partner_preference: 'Looking for an educated, respectful Bengali groom based in Tamil Nadu.',
    pref_age_min: 24,
    pref_age_max: 30,
    pref_height_min: "4'5\"",
    pref_height_max: "6'0\"",
    pref_education: 'Diploma',
    pref_profession: 'Project Manager',
    pref_city: 'Ariyalur',
    pref_diet: 'Eggetarian',
    pref_marital_status: 'Divorced',
    phone: '+919876543210',
    email: email,
    whatsapp: '+919876543210',
    social_handle: '@kumaresan',
    photos: [],
    video: '',
    contact_visible_after_login: true,
    status: 'verified',
    published: true,
    verified: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (!existingSnap.empty) {
    const docRef = existingSnap.docs[0].ref;
    await docRef.update(profileData);
    console.log(`✅ Updated existing profile for ${email} with ID: ${docRef.id}`);
  } else {
    const docRef = db.collection('matrimony_profiles').doc();
    await docRef.set({ ...profileData, id: docRef.id });
    console.log(`✨ Created new matching profile for ${email} with document ID: ${docRef.id}`);
  }
}

run();
