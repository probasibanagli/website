import { config } from 'dotenv';
config({ path: '.env' });

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';

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

async function importCsv() {
  const csvPath = 'c:/Users/balaj/AppData/Local/Packages/5319275A.51895FA4EA97F_cv1g1gvanyjgm/LocalState/sessions/957E8B8FEAC73DFF69649C40CFF7614A34B1A769/transfers/2026-30/ambulance.csv';
  console.log(`Reading CSV from ${csvPath}...`);
  
  if (!fs.existsSync(csvPath)) {
    console.error('CSV file not found!');
    return;
  }

  const text = fs.readFileSync(csvPath, 'utf-8');
  const lines: string[][] = [];
  let row: string[] = [];
  let inQuotes = false;
  let currentValue = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      row.push(currentValue.trim());
      currentValue = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      row.push(currentValue.trim());
      if (row.some(val => val !== '')) {
        lines.push(row);
      }
      row = [];
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  if (currentValue || row.length > 0) {
    row.push(currentValue.trim());
    lines.push(row);
  }

  if (lines.length < 2) {
    console.error('Invalid CSV or empty rows.');
    return;
  }

  console.log("Cleaning up old ambulance records...");
  const snap = await db.collection('ambulances').get();
  const batchDel = db.batch();
  snap.docs.forEach(doc => {
    batchDel.delete(doc.ref);
  });
  await batchDel.commit();

  const now = new Date().toISOString();
  let count = 0;

  for (let idx = 1; idx < lines.length; idx++) {
    const cols = lines[idx];
    if (cols.length < 7) continue;

    const subCategory = cols[1];
    const name = cols[2];
    const cityRoute = cols[3];
    const contact = cols[4];
    const typeMode = cols[5];
    const addressDetails = cols[6];

    if (!name) continue;

    const id = `amb-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newAmbulance = {
      id,
      name,
      city: cityRoute,
      phone: contact ? contact.replace(/^-/, '').trim() : '',
      address: `${subCategory ? `[${subCategory}] ` : ''}${addressDetails}${typeMode ? ` (${typeMode})` : ''}`,
      created_at: now,
      updated_at: now
    };

    await db.collection('ambulances').doc(id).set(newAmbulance);
    count++;
  }

  console.log(`✅ Successfully imported ${count} ambulances to Firestore!`);
}

importCsv().catch(err => {
  console.error('Import failed:', err);
});
