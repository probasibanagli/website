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

// Import match algorithm logic
const HEIGHTS = [
  "4'5\"", "4'6\"", "4'7\"", "4'8\"", "4'9\"", "4'10\"", "4'11\"",
  "5'0\"", "5'1\"", "5'2\"", "5'3\"", "5'4\"", "5'5\"", "5'6\"", "5'7\"", "5'8\"", "5'9\"", "5'10\"", "5'11\"",
  "6'0\"", "6'1\"", "6'2\"", "6'3\""
];

function heightToIndex(height) {
  if (!height) return -1;
  return HEIGHTS.indexOf(height);
}

function calculateMatchPercentage(myProfile, candidate) {
  const criteria = [];
  
  if ((myProfile.pref_age_min || myProfile.pref_age_max) && candidate.age) {
    const min = myProfile.pref_age_min || 0;
    const max = myProfile.pref_age_max || 100;
    criteria.push({ key: 'age', weight: 20, matched: candidate.age >= min && candidate.age <= max });
  }

  if ((myProfile.pref_height_min || myProfile.pref_height_max) && candidate.height) {
    const candidateIdx = heightToIndex(candidate.height);
    const minIdx = myProfile.pref_height_min ? heightToIndex(myProfile.pref_height_min) : 0;
    const maxIdx = myProfile.pref_height_max ? heightToIndex(myProfile.pref_height_max) : HEIGHTS.length - 1;
    criteria.push({ key: 'height', weight: 10, matched: candidateIdx >= 0 && candidateIdx >= minIdx && candidateIdx <= maxIdx });
  }

  if (myProfile.pref_education && candidate.education) {
    criteria.push({ key: 'education', weight: 15, matched: candidate.education.toLowerCase() === myProfile.pref_education.toLowerCase() });
  }

  if (myProfile.pref_profession && candidate.profession) {
    criteria.push({ key: 'profession', weight: 10, matched: candidate.profession.toLowerCase().includes(myProfile.pref_profession.toLowerCase()) });
  }

  if (myProfile.pref_city && candidate.city) {
    criteria.push({ key: 'city', weight: 15, matched: candidate.city === myProfile.pref_city });
  }

  if (myProfile.pref_diet && candidate.diet) {
    criteria.push({ key: 'diet', weight: 10, matched: candidate.diet === myProfile.pref_diet });
  }

  if (myProfile.pref_marital_status && candidate.marital_status) {
    criteria.push({ key: 'maritalStatus', weight: 10, matched: candidate.marital_status === myProfile.pref_marital_status });
  }

  if (myProfile.religion && candidate.religion) {
    criteria.push({ key: 'religion', weight: 5, matched: candidate.religion === myProfile.religion });
    if (myProfile.caste) {
      criteria.push({ key: 'caste', weight: 5, matched: candidate.caste === myProfile.caste });
    }
  }

  const totalBaseWeight = criteria.reduce((sum, c) => sum + c.weight, 0);
  const matchedWeight = criteria.filter(c => c.matched).reduce((sum, c) => sum + c.weight, 0);
  const percentage = totalBaseWeight > 0 ? Math.round((matchedWeight / totalBaseWeight) * 100) : 0;

  return { percentage, criteria };
}

async function run() {
  const saravananSnap = await db.collection('matrimony_profiles').where('email', '==', 'saravanan14.4.2005@gmail.com').get();
  const saravanan = saravananSnap.docs[0].data();

  const femaleSnap = await db.collection('matrimony_profiles').where('gender', '==', 'female').get();
  console.log(`\n💖 MATCH RESULTS FOR ${saravanan.full_name} (${saravanan.email}):`);
  console.log('='.repeat(65));

  femaleSnap.docs.forEach(doc => {
    const candidate = doc.data();
    const result = calculateMatchPercentage(saravanan, candidate);
    console.log(`👤 ${candidate.full_name} (${candidate.profile_id}) | Match Score: ${result.percentage}%`);
    console.log(`   City: ${candidate.city} | Profession: ${candidate.profession} | Edu: ${candidate.education} | Caste: ${candidate.caste}`);
  });
}

run();
