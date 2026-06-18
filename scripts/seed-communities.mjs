import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCnk81vPJw3o9Qtav3sM5aSvQrQDdDqMBY',
  authDomain: 'probasibangali-5c90f.firebaseapp.com',
  projectId: 'probasibangali-5c90f',
  storageBucket: 'probasibangali-5c90f.firebasestorage.app',
  messagingSenderId: '860538801765',
  appId: '1:860538801765:web:d0908a5325c2a17b48c08c',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const communities = [
  // ── Chennai ──
  {
    name: 'The Bengal Association',
    platform: 'website',
    city: 'Chennai',
    region: 'tamil_nadu',
    category: 'cultural',
    website_url: 'https://www.thebengalassociation.com/',
    facebook_url: 'https://www.facebook.com/thebengalassociation',
    description: 'One of the oldest Bengali cultural associations in Chennai.',
  },
  {
    name: 'South Madras Cultural Association',
    platform: 'website',
    city: 'Chennai',
    region: 'tamil_nadu',
    category: 'cultural',
    website_url: 'https://smcachennai.in/',
    facebook_url: 'https://www.facebook.com/groups/226071534104132/',
    instagram_url: 'https://www.instagram.com/smcachennai/',
    description: 'South Madras Cultural Association (SMCA) – Bengali cultural body in South Chennai.',
  },
  {
    name: 'Dakshini Society',
    platform: 'website',
    city: 'Chennai',
    region: 'tamil_nadu',
    category: 'cultural',
    website_url: 'https://dakshinisociety.com/',
    facebook_url: 'https://www.facebook.com/Dakshinifamily?mibextid=ZbWKwL',
    description: 'Dakshini Society – a Bengali community group in Chennai.',
  },
  {
    name: 'Dakshin Chennai Prabasi Cultural Association',
    platform: 'website',
    city: 'Chennai',
    region: 'tamil_nadu',
    category: 'cultural',
    website_url: 'https://www.dcpca.in/',
    facebook_url: 'https://www.facebook.com/groups/245993940185955',
    instagram_url: 'https://www.instagram.com/dcpca_omr/',
    linkedin_url: 'https://www.linkedin.com/in/dcpca-association-023579289/',
    description: 'DCPCA – Bengali cultural association serving the OMR/South Chennai community.',
  },
  {
    name: 'Chetla Agrani Club',
    platform: 'website',
    city: 'Chennai',
    region: 'tamil_nadu',
    category: 'cultural',
    website_url: 'https://chetlaagraniclub.com/',
    facebook_url: 'https://www.facebook.com/ChetlaAgraniClub/',
    instagram_url: 'https://www.instagram.com/chetla_agrani/',
    description: 'Chetla Agrani Club – Bengali cultural and social club in Chennai.',
  },
  {
    name: 'Bengali Cultural Association',
    platform: 'website',
    city: 'Chennai',
    region: 'tamil_nadu',
    category: 'cultural',
    website_url: 'https://www.dcpca.in/',
    facebook_url: 'https://www.facebook.com/profile.php?id=61558647747693',
    instagram_url: 'https://www.instagram.com/dcpca_omr/',
    linkedin_url: 'https://www.linkedin.com/in/dcpca-association-023579289/',
    description: 'Bengali Cultural Association in Chennai.',
  },
  {
    name: 'Bengali Sangha Avadi',
    platform: 'facebook',
    city: 'Chennai',
    region: 'tamil_nadu',
    category: 'cultural',
    website_url: 'https://www.thebengalassociation.com/',
    facebook_url: 'https://www.facebook.com/groups/356921118761909/',
    join_url: 'https://www.facebook.com/groups/356921118761909/',
    description: 'Bengali Sangha Avadi – Bengali community group in the Avadi area of Chennai.',
  },
  {
    name: 'Durgapuja Ramakrishna Math Chennai',
    platform: 'website',
    city: 'Chennai',
    region: 'tamil_nadu',
    category: 'religious',
    website_url: 'https://chennaimath.org/',
    facebook_url: 'https://www.facebook.com/ramakrishnamath',
    instagram_url: 'https://www.instagram.com/ramakrishnamath',
    description: 'Ramakrishna Math Chennai – Durga Puja celebrations and spiritual activities.',
  },
  {
    name: 'Bengali Milon Sangho',
    platform: 'facebook',
    city: 'Chennai',
    region: 'tamil_nadu',
    category: 'cultural',
    facebook_url: 'https://www.facebook.com/groups/3268377266791010',
    join_url: 'https://www.facebook.com/groups/3268377266791010',
    description: 'Bengali Milon Sangho – a Facebook community for Bengalis in Chennai.',
  },
  {
    name: 'South Chennai Bengalees',
    platform: 'facebook',
    city: 'Chennai',
    region: 'tamil_nadu',
    category: 'general',
    website_url: 'https://smcachennai.in/',
    facebook_url: 'https://www.facebook.com/groups/2283898985246706/',
    join_url: 'https://www.facebook.com/groups/2283898985246706/',
    description: 'South Chennai Bengalees – Facebook group for Bengali residents of South Chennai.',
  },
  {
    name: 'Bengali in OMR',
    platform: 'website',
    city: 'Chennai',
    region: 'tamil_nadu',
    category: 'general',
    website_url: 'https://obmschennai.in/',
    facebook_url: 'https://www.facebook.com/groups/1656951674390382',
    instagram_url: 'https://www.instagram.com/obmschennai4/?g=5',
    description: 'Bengali in OMR – community group for Bengalis living along the OMR corridor in Chennai.',
  },
  {
    name: 'Korattur Pooja Association',
    platform: 'facebook',
    city: 'Chennai',
    region: 'tamil_nadu',
    category: 'religious',
    facebook_url: 'https://www.facebook.com/groups/6869883776369306/',
    instagram_url: 'https://www.instagram.com/koratturpujaassociation/',
    join_url: 'https://www.facebook.com/groups/6869883776369306/',
    description: 'Korattur Pooja Association – organises Durga Puja and cultural events in Korattur, Chennai.',
  },
  {
    name: 'Madambakkam Kali Bari',
    platform: 'facebook',
    city: 'Chennai',
    region: 'tamil_nadu',
    category: 'religious',
    facebook_url: 'https://www.facebook.com/madambakkamkalitemple/',
    instagram_url: 'https://www.instagram.com/explore/locations/255944721547714/madambakkam-kali-temple/',
    description: 'Madambakkam Kali Bari – Kali temple and Bengali community in Madambakkam, Chennai.',
  },
  {
    name: 'Nandavanam Durgotsav Committee',
    platform: 'facebook',
    city: 'Chennai',
    region: 'tamil_nadu',
    category: 'religious',
    facebook_url: 'https://www.facebook.com/groups/228305683303138/',
    join_url: 'https://www.facebook.com/groups/228305683303138/',
    description: 'Nandavanam Durgotsav Committee – organises Durga Puja in Nandavanam, Chennai.',
  },
  {
    name: 'Anya Mukh Durgotsov',
    platform: 'website',
    city: 'Chennai',
    region: 'tamil_nadu',
    category: 'religious',
    website_url: 'https://www.anyamukh.com/',
    facebook_url: 'https://www.facebook.com/people/%E0%A6%85%E0%A6%A8%E0%A7%8D%E0%A6%AF-%E0%A6%AE%E0%A7%81%E0%A6%96/100083421592158/',
    instagram_url: 'https://www.instagram.com/anyamukh?igsh=MW1tbDJ1Z21iY2EwdQ%3D%3D',
    description: 'Anya Mukh Durgotsov – Durga Puja celebrations and Bengali cultural events in Chennai.',
  },
  {
    name: 'The Assam Spiritual Society Durgotsav',
    platform: 'facebook',
    city: 'Chennai',
    region: 'tamil_nadu',
    category: 'religious',
    facebook_url: 'https://www.facebook.com/events/odisha-bhawan-chennai/assam-spiritual-society-durga-puja-2025/1992510888183625/',
    description: 'Assam Spiritual Society Durgotsav celebration at Odisha Bhawan, Chennai.',
  },
  {
    name: 'Madras Kali Bari',
    platform: 'website',
    city: 'Chennai',
    region: 'tamil_nadu',
    category: 'religious',
    website_url: 'https://www.madraskalibari.com/',
    facebook_url: 'https://www.facebook.com/madraskalibari.chennai/',
    instagram_url: 'https://www.instagram.com/explore/locations/74865356/madras-kali-bari/',
    description: 'Madras Kali Bari – one of the oldest Bengali temples in Chennai.',
  },
  // ── Coimbatore ──
  {
    name: 'SNV Kalyana Mandapam',
    platform: 'website',
    city: 'Coimbatore',
    region: 'tamil_nadu',
    category: 'cultural',
    website_url: 'https://srisnvkalyanamandapam.in/',
    description: 'Sri SNV Kalyana Mandapam – Bengali community venue in Coimbatore.',
  },
  {
    name: 'Durgapuja Ramakrishna Math Coimbatore',
    platform: 'website',
    city: 'Coimbatore',
    region: 'tamil_nadu',
    category: 'religious',
    website_url: 'https://chennaimath.org/',
    facebook_url: 'https://www.facebook.com/srkmv/',
    instagram_url: 'https://www.instagram.com/ramakrishnamath',
    description: 'Ramakrishna Math Coimbatore – Durga Puja and spiritual activities.',
  },
  {
    name: 'The Bengali Association Coimbatore',
    platform: 'website',
    city: 'Coimbatore',
    region: 'tamil_nadu',
    category: 'cultural',
    website_url: 'https://www.bengaliassociationcoimbatore.com/',
    facebook_url: 'https://www.facebook.com/tbacbe',
    description: 'The Bengali Association Coimbatore – cultural body for Bengalis in Coimbatore.',
  },
  // ── Trichy ──
  {
    name: 'The Bengali Association Trichy',
    platform: 'website',
    city: 'Tiruchirappalli',
    region: 'tamil_nadu',
    category: 'cultural',
    website_url: 'https://www.thebengalassociation.com/',
    facebook_url: 'https://www.facebook.com/profile.php?id=61558647747693',
    instagram_url: 'https://www.instagram.com/bengaliassociationtrichy/',
    description: 'The Bengali Association Trichy – cultural association for Bengalis in Tiruchirappalli.',
  },
  // ── Puducherry ──
  {
    name: 'Bangabharathi Puducherry',
    platform: 'website',
    city: 'Puducherry',
    region: 'tamil_nadu',
    category: 'cultural',
    website_url: 'https://bangabharati.weebly.com/',
    facebook_url: 'https://www.facebook.com/BangabharathiPuducherry',
    description: 'Bangabharathi – Bengali cultural organisation in Puducherry.',
  },
  // ── Madurai ──
  {
    name: 'Durgapuja Ramakrishna Math Madurai',
    platform: 'website',
    city: 'Madurai',
    region: 'tamil_nadu',
    category: 'religious',
    website_url: 'https://chennaimath.org/',
    description: 'Ramakrishna Math Madurai – Durga Puja and spiritual activities.',
  },
];

async function seed() {
  const now = new Date().toISOString();
  let count = 0;

  for (const entry of communities) {
    const id = `community-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const data = {
      id,
      ...entry,
      verified: false,
      created_at: now,
    };

    try {
      await setDoc(doc(db, 'community_groups', id), data);
      count++;
      console.log(`✅ [${count}/${communities.length}] Added: ${entry.name} (${entry.city})`);
    } catch (err) {
      console.error(`❌ Failed: ${entry.name}`, err);
    }

    // Small delay to avoid rate limits
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\n🎉 Done! Added ${count} of ${communities.length} community groups.`);
  process.exit(0);
}

seed();
