import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCnk81vPJw3o9Qtav3sM5aSvQrQDdDqMBY",
  authDomain: "probasibangali-5c90f.firebaseapp.com",
  projectId: "probasibangali-5c90f",
  storageBucket: "probasibangali-5c90f.firebasestorage.app",
  messagingSenderId: "860538801765",
  appId: "1:860538801765:web:d0908a5325c2a17b48c08c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function main() {
  console.log("Fetching hospitals...");
  try {
    const snap = await getDocs(collection(db, 'hospitals'));
    console.log(`Found ${snap.docs.length} hospitals.`);
    snap.docs.forEach(doc => {
      const data = doc.data();
      console.log(`- ${data.name} | Category: ${data.category} | Status: ${data.status}`);
    });
  } catch (err) {
    console.error("Error:", err);
  }
}

main();
