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

const DUMMY_USER_1 = 'dummy-user-1';

const newProfiles = [
  // First 5 from dummy user 1
  {
    user_id: DUMMY_USER_1, profile_id: 'PB-0012', profile_for: 'Myself', full_name: 'Amit Chatterjee', date_of_birth: '1990-05-15', age: 34, gender: 'male',
    height: '5 ft 8 in', weight: '70', complexion: 'Fair', blood_group: 'B+', marital_status: 'Never Married', mother_tongue: 'Bengali', physical_disability: 'None',
    city: 'Chennai', native_district: 'Kolkata', education: 'B.Tech', profession: 'Software Engineer', religion: 'Hindu', caste: 'Brahmin',
    diet: 'Non-Vegetarian', smoking: 'No', drinking: 'No', status: 'verified', published: true
  },
  {
    user_id: DUMMY_USER_1, profile_id: 'PB-0013', profile_for: 'Daughter', full_name: 'Sneha Chatterjee', date_of_birth: '1995-08-20', age: 29, gender: 'female',
    height: '5 ft 4 in', weight: '55', complexion: 'Wheatish', blood_group: 'O+', marital_status: 'Never Married', mother_tongue: 'Bengali', physical_disability: 'None',
    city: 'Coimbatore', native_district: 'Howrah', education: 'MBA', profession: 'HR Manager', religion: 'Hindu', caste: 'Brahmin',
    diet: 'Vegetarian', smoking: 'No', drinking: 'No', status: 'verified', published: true
  },
  {
    user_id: DUMMY_USER_1, profile_id: 'PB-0014', profile_for: 'Brother', full_name: 'Rahul Chatterjee', date_of_birth: '1988-12-10', age: 35, gender: 'male',
    height: '5 ft 10 in', weight: '78', complexion: 'Fair', blood_group: 'A+', marital_status: 'Divorced', mother_tongue: 'Bengali', physical_disability: 'None',
    city: 'Chennai', native_district: 'Darjeeling', education: 'Ph.D', profession: 'Professor', religion: 'Hindu', caste: 'Brahmin',
    diet: 'Non-Vegetarian', smoking: 'No', drinking: 'Occasionally', status: 'verified', published: true
  },
  {
    user_id: DUMMY_USER_1, profile_id: 'PB-0015', profile_for: 'Sister', full_name: 'Pooja Chatterjee', date_of_birth: '1998-02-14', age: 26, gender: 'female',
    height: '5 ft 3 in', weight: '52', complexion: 'Fair', blood_group: 'AB+', marital_status: 'Never Married', mother_tongue: 'Bengali', physical_disability: 'None',
    city: 'Madurai', native_district: 'Kolkata', education: 'MBBS', profession: 'Doctor', religion: 'Hindu', caste: 'Brahmin',
    diet: 'Non-Vegetarian', smoking: 'No', drinking: 'No', status: 'verified', published: true
  },
  {
    user_id: DUMMY_USER_1, profile_id: 'PB-0016', profile_for: 'Son', full_name: 'Vikram Chatterjee', date_of_birth: '1992-07-22', age: 32, gender: 'male',
    height: '5 ft 11 in', weight: '82', complexion: 'Wheatish', blood_group: 'B-', marital_status: 'Never Married', mother_tongue: 'Bengali', physical_disability: 'None',
    city: 'Chennai', native_district: 'Hooghly', education: 'CA', profession: 'Chartered Accountant', religion: 'Hindu', caste: 'Brahmin',
    diet: 'Vegetarian', smoking: 'No', drinking: 'No', status: 'verified', published: true
  },
  
  // Next 5 with different religions/castes
  {
    user_id: 'dummy-user-2', profile_id: 'PB-0017', profile_for: 'Myself', full_name: 'Imran Ali', date_of_birth: '1991-03-05', age: 33, gender: 'male',
    height: '5 ft 9 in', weight: '74', complexion: 'Fair', blood_group: 'O+', marital_status: 'Never Married', mother_tongue: 'Bengali', physical_disability: 'None',
    city: 'Chennai', native_district: 'Murshidabad', education: 'B.Sc', profession: 'Business', religion: 'Muslim', caste: 'Sunni',
    diet: 'Non-Vegetarian', smoking: 'No', drinking: 'No', status: 'verified', published: true
  },
  {
    user_id: 'dummy-user-3', profile_id: 'PB-0018', profile_for: 'Myself', full_name: 'Fatima Sheikh', date_of_birth: '1996-09-11', age: 28, gender: 'female',
    height: '5 ft 5 in', weight: '58', complexion: 'Wheatish', blood_group: 'A+', marital_status: 'Never Married', mother_tongue: 'Bengali', physical_disability: 'None',
    city: 'Trichy', native_district: 'Malda', education: 'B.Ed', profession: 'Teacher', religion: 'Muslim', caste: 'Sunni',
    diet: 'Non-Vegetarian', smoking: 'No', drinking: 'No', status: 'verified', published: true
  },
  {
    user_id: 'dummy-user-4', profile_id: 'PB-0019', profile_for: 'Myself', full_name: 'John Biswas', date_of_birth: '1989-11-25', age: 34, gender: 'male',
    height: '5 ft 7 in', weight: '71', complexion: 'Dark', blood_group: 'B+', marital_status: 'Widowed', mother_tongue: 'Bengali', physical_disability: 'None',
    city: 'Chennai', native_district: 'Kolkata', education: 'B.Com', profession: 'Banker', religion: 'Christian', caste: 'Catholic',
    diet: 'Non-Vegetarian', smoking: 'Occasionally', drinking: 'Occasionally', status: 'verified', published: true
  },
  {
    user_id: 'dummy-user-5', profile_id: 'PB-0020', profile_for: 'Myself', full_name: 'Anjali Das', date_of_birth: '1997-04-30', age: 27, gender: 'female',
    height: '5 ft 2 in', weight: '50', complexion: 'Fair', blood_group: 'AB-', marital_status: 'Never Married', mother_tongue: 'Bengali', physical_disability: 'None',
    city: 'Salem', native_district: 'Nadia', education: 'M.Sc', profession: 'Researcher', religion: 'Hindu', caste: 'Kayastha',
    diet: 'Vegetarian', smoking: 'No', drinking: 'No', status: 'verified', published: true
  },
  {
    user_id: 'dummy-user-6', profile_id: 'PB-0021', profile_for: 'Myself', full_name: 'Suresh Bose', date_of_birth: '1993-01-18', age: 31, gender: 'male',
    height: '6 ft 0 in', weight: '85', complexion: 'Wheatish', blood_group: 'O-', marital_status: 'Never Married', mother_tongue: 'Bengali', physical_disability: 'None',
    city: 'Chennai', native_district: 'Burdwan', education: 'B.Arch', profession: 'Architect', religion: 'Hindu', caste: 'Baidya',
    diet: 'Non-Vegetarian', smoking: 'No', drinking: 'Yes', status: 'verified', published: true
  },
];

async function run() {
  let count = 0;
  for (const profile of newProfiles) {
    const docRef = db.collection('matrimony_profiles').doc();
    const id = docRef.id;
    try {
      await docRef.set({ ...profile, id, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
      console.log(`Created profile ${profile.profile_id} for ${profile.full_name}`);
      count++;
    } catch (e) {
      console.error(e);
    }
  }
  console.log(`Successfully created ${count} profiles.`);
}

run();
