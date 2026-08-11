import fs from 'fs';
import path from 'path';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';

// Read .env.local manually
const env: Record<string, string> = {};
try {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        env[key] = value;
      }
    });
  }
} catch (e) {
  console.log('Notice: Could not read .env.local', e);
}

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

async function main() {
  console.log('Searching for user with phone 9626855406...');
  const snap = await getDocs(collection(db, 'users'));
  let updatedCount = 0;

  for (const docSnap of snap.docs) {
    const data = docSnap.data();
    const phoneClean = (data.phone || '').replace(/\D/g, '');
    if (phoneClean.includes('9626855406') || docSnap.id.includes('9626855406')) {
      console.log(`Found matching user document: ${docSnap.id} (${data.full_name || 'No Name'})`);
      await updateDoc(doc(db, 'users', docSnap.id), {
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
        updated_at: new Date().toISOString(),
      });
      updatedCount++;
      console.log(`✅ Updated user document ${docSnap.id} role to superadmin!`);
    }
  }

  if (updatedCount === 0) {
    console.log('No existing user document found with phone 9626855406 in Firestore. Role auto-assignment rule is active in AuthContext for when they log in!');
  }
}

main().catch(console.error);
