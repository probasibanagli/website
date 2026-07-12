import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { config } from 'dotenv';
config({ path: '.env.local' });

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

async function listColleges() {
  console.log("Fetching colleges from Firestore...");
  const collegesRef = db.collection('colleges');
  const snap = await collegesRef.get();
  
  const colleges = [];
  snap.forEach(doc => {
    colleges.push({ id: doc.id, ...doc.data() });
  });

  // Sort them by ranking
  colleges.sort((a, b) => {
    const rankA = a.ranking !== undefined && a.ranking !== null ? Number(a.ranking) : 9999;
    const rankB = b.ranking !== undefined && b.ranking !== null ? Number(b.ranking) : 9999;
    return rankA - rankB;
  });

  console.log(`\nFound ${colleges.length} colleges in database (sorted by ranking):`);
  colleges.forEach((c, index) => {
    console.log(`${index + 1}. [Rank ${c.ranking || 'N/A'}] ${c.name} (${c.type}) - ${c.city}`);
  });

  process.exit(0);
}

listColleges().catch(console.error);
