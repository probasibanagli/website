import { config } from 'dotenv';
config({ path: '.env' });

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';

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
  const csvPath = 'c:/Users/balaj/OneDrive/Desktop/bloodbank.csv';
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

  const headers = lines[0].map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
  const nameIdx = headers.findIndex(h => h.includes('name') || h.includes('title'));
  const cityIdx = headers.findIndex(h => h.includes('district') || h.includes('city'));
  const addressIdx = headers.findIndex(h => h.includes('address'));
  const phoneIdx = headers.findIndex(h => h.includes('phone') || h.includes('mobile'));

  if (nameIdx === -1) {
    console.error('Could not find Name column.');
    return;
  }

  const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  const CITIES = ['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem']; // standard cities in consts

  console.log('Importing to Firestore...');
  const now = new Date().toISOString();
  let count = 0;

  for (let idx = 1; idx < lines.length; idx++) {
    const cols = lines[idx];
    if (cols.length <= Math.max(nameIdx, cityIdx, addressIdx, phoneIdx)) continue;

    const name = cols[nameIdx];
    if (!name) continue;

    const rawCity = cityIdx !== -1 ? cols[cityIdx] : 'Chennai';
    // Match city, default to Chennai or raw city if not in list
    const matchedCity = CITIES.find(c => c.toLowerCase() === rawCity.toLowerCase()) || rawCity;

    const address = addressIdx !== -1 ? cols[addressIdx] : '';
    const rawPhone = phoneIdx !== -1 ? cols[phoneIdx] : '';
    const phoneVal = (rawPhone === 'NA' || rawPhone === '-' || !rawPhone) ? '' : rawPhone;

    const id = `bb-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newBank = {
      id,
      name,
      city: matchedCity,
      address,
      phone: phoneVal,
      available_groups: [...BLOOD_GROUPS],
      created_at: now,
      updated_at: now
    };

    await db.collection('blood_banks').doc(id).set(newBank);
    count++;
  }

  console.log(`✅ Successfully imported ${count} blood banks to Firestore!`);
}

importCsv().catch(err => {
  console.error('Import failed:', err);
});
