require('dotenv').config({ path: '.env.local' });
const { adminDb } = require('../src/lib/firebase-admin');
const { v4: uuidv4 } = require('uuid');

const LEGAL_AID_CENTRES = [
  { name: 'Tamil Nadu State Legal Services Authority (TNSLSA)', address: 'No. 1, Kamarajar Salai, Royapettah, Chennai - 600 004', city: 'Chennai', district: 'Chennai', phone: '044-28513290', timings: 'Mon–Sat: 10AM–5PM', centre_type: 'State Authority', google_maps_url: 'https://maps.google.com/?q=Tamil+Nadu+State+Legal+Services+Authority+Chennai' },
  { name: 'District Legal Services Authority (DLSA) – Chennai', address: 'City Civil Court Complex, High Court Premises, Chennai - 600 104', city: 'Chennai', district: 'Chennai', phone: '044-25354400', timings: 'Mon–Sat: 10AM–5PM', centre_type: 'District Authority', google_maps_url: 'https://maps.google.com/?q=District+Legal+Services+Authority+Chennai' },
  { name: 'Madurai District Legal Services Authority', address: 'District Court Campus, Madurai - 625 020', city: 'Madurai', district: 'Madurai', phone: '0452-2531230', timings: 'Mon–Sat: 10AM–5PM', centre_type: 'District Authority', google_maps_url: 'https://maps.google.com/?q=District+Legal+Services+Authority+Madurai' },
  { name: 'Coimbatore District Legal Services Authority', address: 'District Sessions Court Campus, Coimbatore - 641 018', city: 'Coimbatore', district: 'Coimbatore', phone: '0422-2391800', timings: 'Mon–Sat: 10AM–5PM', centre_type: 'District Authority', google_maps_url: 'https://maps.google.com/?q=District+Legal+Services+Authority+Coimbatore' },
  { name: 'Trichy District Legal Services Authority', address: 'District Court Campus, Tiruchirappalli - 620 001', city: 'Trichy', district: 'Tiruchirappalli', phone: '0431-2700290', timings: 'Mon–Sat: 10AM–5PM', centre_type: 'District Authority', google_maps_url: 'https://maps.google.com/?q=District+Legal+Services+Authority+Trichy' },
  { name: 'Salem District Legal Services Authority', address: 'District Court Premises, Salem - 636 001', city: 'Salem', district: 'Salem', phone: '0427-2315390', timings: 'Mon–Sat: 10AM–5PM', centre_type: 'District Authority', google_maps_url: 'https://maps.google.com/?q=District+Legal+Services+Authority+Salem' },
  { name: 'Vellore District Legal Services Authority', address: 'District Court Complex, Vellore - 632 001', city: 'Vellore', district: 'Vellore', phone: '0416-2220490', timings: 'Mon–Sat: 10AM–5PM', centre_type: 'District Authority', google_maps_url: 'https://maps.google.com/?q=District+Legal+Services+Authority+Vellore' },
  { name: 'Tirunelveli District Legal Services Authority', address: 'District Court Premises, Tirunelveli - 627 001', city: 'Tirunelveli', district: 'Tirunelveli', phone: '0462-2501150', timings: 'Mon–Sat: 10AM–5PM', centre_type: 'District Authority', google_maps_url: 'https://maps.google.com/?q=District+Legal+Services+Authority+Tirunelveli' },
  { name: 'Madras High Court Legal Services Committee', address: 'High Court of Madras, Chennai - 600 104', city: 'Chennai', district: 'Chennai', phone: '044-25306000', timings: 'Mon–Fri: 10AM–5PM', centre_type: 'High Court Committee', google_maps_url: 'https://maps.google.com/?q=Madras+High+Court+Chennai' },
  { name: 'Tamil Nadu Legal Aid Clinic – Tambaram', address: 'Tambaram Court Complex, Tambaram, Chennai - 600 045', city: 'Chennai', district: 'Chengalpattu', phone: '044-22264390', timings: 'Mon–Sat: 10AM–4PM', centre_type: 'Legal Aid Clinic', google_maps_url: 'https://maps.google.com/?q=Tambaram+Court+Complex+Chennai' },
  { name: 'Erode District Legal Services Authority', address: 'District Court Campus, Erode - 638 001', city: 'Erode', district: 'Erode', phone: '0424-2225295', timings: 'Mon–Sat: 10AM–5PM', centre_type: 'District Authority', google_maps_url: 'https://maps.google.com/?q=District+Legal+Services+Authority+Erode' },
  { name: 'Thanjavur District Legal Services Authority', address: 'District Court Premises, Thanjavur - 613 001', city: 'Thanjavur', district: 'Thanjavur', phone: '04362-276890', timings: 'Mon–Sat: 10AM–5PM', centre_type: 'District Authority', google_maps_url: 'https://maps.google.com/?q=District+Legal+Services+Authority+Thanjavur' },
];

const LEGAL_CATEGORIES = [
  {
    label: 'Labour & Employment', icon_name: 'Briefcase', color: 'blue', description: 'Unpaid wages, wrongful termination, workplace harassment, PF/ESI disputes, contract violations.',
    steps: [
      { title: 'File a complaint online', desc: 'Use the Shram Suvidha portal or TN Labour Dept portal to file online.' },
      { title: 'Labour Commissioner Office', desc: 'Visit the nearest Labour Commissioner Office with employment documents.' },
      { title: 'Labour Court', desc: 'For unresolved disputes, file a case with the Labour Court.' },
    ],
    portals: [
      { label: 'Shram Suvidha (Central)', url: 'https://www.shramlegal.labour.gov.in/login', desc: 'File labour complaints online' },
      { label: 'TN Labour Department', url: 'https://www.labour.tn.gov.in/', desc: 'Tamil Nadu state labour portal' },
      { label: 'EPF Portal', url: 'https://unifiedportal-mem.epfindia.gov.in/', desc: 'Provident fund grievances & claims' },
      { label: 'ESIC Portal', url: 'https://esic.in/', desc: 'Employee State Insurance Corporation' },
    ],
    helplines: [
      { label: 'Labour Helpline', number: '1800-11-0001' },
      { label: 'EPF Helpline', number: '1800-118-005' },
    ],
  },
  {
    label: 'Tenant Rights', icon_name: 'Home', color: 'green', description: 'Illegal eviction, rent disputes, security deposit recovery, uninhabitable conditions, rent increase disputes.',
    steps: [
      { title: 'Get a Rental Agreement', desc: 'Always register your rental agreement. Unregistered agreements have limited legal standing.' },
      { title: 'Rent Controller Court', desc: 'File disputes at the Rent Controller Court (part of the district civil court).' },
      { title: 'Legal Aid', desc: 'If income is below Rs 3 lakh/year, you are entitled to free legal aid from DLSA.' },
    ],
    portals: [
      { label: 'TN Registration Dept', url: 'https://www.tnreginet.gov.in/', desc: 'Register rental agreement online' },
      { label: 'RERA Tamil Nadu', url: 'https://www.tnrera.in/', desc: 'Real estate disputes & builder complaints' },
      { label: 'NALSA Portal', url: 'https://nalsa.gov.in/', desc: 'National Legal Services Authority' },
    ],
    helplines: [
      { label: 'NALSA Helpline', number: '15100' },
    ],
  },
  {
    label: 'Consumer Rights', icon_name: 'Shield', color: 'purple', description: 'Product defects, fake goods, overcharging, service failures, online shopping fraud, insurance claims.',
    steps: [
      { title: 'File on National Consumer Helpline', desc: 'Register your complaint online at consumerhelpline.gov.in.' },
      { title: 'Consumer Forum', desc: 'File a case at the District Consumer Disputes Redressal Commission (DCDRC).' },
      { title: 'No Lawyer Needed', desc: 'For claims under Rs 1 crore you can represent yourself.' },
    ],
    portals: [
      { label: 'National Consumer Helpline', url: 'https://consumerhelpline.gov.in/', desc: 'File consumer complaints online' },
      { label: 'E-DAAKHIL Portal', url: 'https://edaakhil.nic.in/', desc: 'File consumer forum cases online' },
      { label: 'IRDAI (Insurance)', url: 'https://www.bimabharosa.irdai.gov.in/', desc: 'Insurance complaints portal' },
    ],
    helplines: [
      { label: 'National Consumer Helpline', number: '1915' },
    ],
  },
  {
    label: 'Civil Disputes', icon_name: 'Gavel', color: 'amber', description: 'Property disputes, money recovery, agreements, family property partition, injunctions, debt recovery.',
    steps: [
      { title: 'Try Mediation First', desc: 'Use Lok Adalat for fast, free settlement of civil disputes.' },
      { title: 'File in Civil Court', desc: 'Hire a lawyer and file a civil suit in the appropriate court based on claim value.' },
      { title: 'Lok Adalat', desc: 'Lok Adalats offer binding settlements — free of cost and faster than courts.' },
    ],
    portals: [
      { label: 'eCourt Services', url: 'https://services.ecourts.gov.in/', desc: 'Track court cases, get e-copies' },
      { label: 'Lok Adalat Portal', url: 'https://nalsa.gov.in/lsams/', desc: 'Find Lok Adalat dates & file' },
      { label: 'TN Judiciary', url: 'https://www.hcmadras.tn.nic.in/', desc: 'Madras High Court portal' },
    ],
    helplines: [],
  },
  {
    label: 'Domestic Violence', icon_name: 'Heart', color: 'red', description: 'Protection orders, shelter support, legal aid for women and children facing domestic abuse.',
    steps: [
      { title: 'Contact a Protection Officer', desc: 'Every district has a Protection Officer under the PWDVA 2005. Contact your District Collector office.' },
      { title: 'File a DV Application', desc: 'File for a protection order at the nearest Magistrate court.' },
      { title: 'Emergency Shelter', desc: 'Call 181 for emergency shelter and immediate support.' },
    ],
    portals: [
      { label: 'WCD Ministry Portal', url: 'https://wcd.nic.in/', desc: 'Women & Child Development resources' },
      { label: 'One Stop Centre (Sakhi)', url: 'https://oscm.wcd.gov.in/', desc: 'Find nearest Sakhi Centre' },
      { label: 'NCW Complaint Portal', url: 'https://ncwapps.nic.in/', desc: 'National Commission for Women' },
    ],
    helplines: [
      { label: 'Women Helpline (TN)', number: '181' },
      { label: 'Childline', number: '1098' },
      { label: 'NCW Helpline', number: '7827-170-170' },
    ],
  },
  {
    label: 'FIR & Police Matters', icon_name: 'BadgeCheck', color: 'slate', description: 'Filing an FIR, complaint against police, bail applications, custody rights, cyber crime.',
    steps: [
      { title: 'File an FIR', desc: 'Any police station must register your FIR (First Information Report) free of charge. They cannot refuse.' },
      { title: 'Online FIR (TN Police)', desc: 'Use the Tamil Nadu Police online complaint portal for non-cognizable offences.' },
      { title: 'Complaint about Police', desc: 'File a complaint with the Superintendent of Police or State Police Complaints Authority.' },
    ],
    portals: [
      { label: 'TN Police Online Complaint', url: 'https://www.eservices.tnpolice.gov.in/', desc: 'File online FIR / complaint' },
      { label: 'CBI Complaints', url: 'https://cbi.gov.in/', desc: 'Central Bureau of Investigation' },
      { label: 'Cyber Crime Portal', url: 'https://cybercrime.gov.in/', desc: 'Report cybercrime / online fraud' },
    ],
    helplines: [
      { label: 'Police Emergency', number: '100' },
      { label: 'Cyber Crime', number: '1930' },
    ],
  },
];

const EMERGENCY_HELPLINES = [
  { label: 'NALSA Helpline', number: '15100', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { label: 'Women Helpline', number: '181', color: 'bg-rose-50 border-rose-200 text-rose-700' },
  { label: 'Police Emergency', number: '100', color: 'bg-slate-50 border-slate-200 text-slate-700' },
  { label: 'Cyber Crime', number: '1930', color: 'bg-orange-50 border-orange-200 text-orange-700' },
  { label: 'Consumer Helpline', number: '1915', color: 'bg-purple-50 border-purple-200 text-purple-700' },
  { label: 'Labour Helpline', number: '1800-11-0001', color: 'bg-green-50 border-green-200 text-green-700' },
];

const IMPORTANT_PORTALS = [
  { label: 'eCourts Services', url: 'https://services.ecourts.gov.in/', desc: 'Track case status, get orders, find courts', icon_name: 'Gavel' },
  { label: 'NALSA – Legal Services', url: 'https://nalsa.gov.in/', desc: 'National Legal Services Authority portal', icon_name: 'Scale' },
  { label: 'Lok Adalat – NALSA', url: 'https://nalsa.gov.in/lsams/', desc: 'Free fast settlement via Lok Adalat', icon_name: 'Users' },
  { label: 'TN Judiciary Portal', url: 'https://www.hcmadras.tn.nic.in/', desc: 'Madras High Court case information', icon_name: 'Landmark' },
  { label: 'eDaakhil – Consumer', url: 'https://edaakhil.nic.in/', desc: 'File consumer forum cases online', icon_name: 'Shield' },
  { label: 'Cyber Crime Portal', url: 'https://cybercrime.gov.in/', desc: 'Report online fraud & cyber offences', icon_name: 'AlertTriangle' },
];

async function seed() {
  const collectionRef = adminDb.collection('legal_services');
  const now = new Date().toISOString();

  // 1. Centres
  console.log('Seeding Legal Aid Centres...');
  for (const c of LEGAL_AID_CENTRES) {
    await collectionRef.add({
      ...c,
      type: 'centre',
      is_active: true,
      created_at: now,
      updated_at: now
    });
  }

  // 2. Categories
  console.log('Seeding Categories...');
  for (const c of LEGAL_CATEGORIES) {
    await collectionRef.add({
      ...c,
      type: 'category',
      is_active: true,
      created_at: now,
      updated_at: now
    });
  }

  // 3. Helplines
  console.log('Seeding Helplines...');
  for (const h of EMERGENCY_HELPLINES) {
    await collectionRef.add({
      ...h,
      type: 'helpline',
      is_active: true,
      created_at: now,
      updated_at: now
    });
  }

  // 4. Portals
  console.log('Seeding Portals...');
  for (const p of IMPORTANT_PORTALS) {
    await collectionRef.add({
      ...p,
      type: 'portal',
      is_active: true,
      created_at: now,
      updated_at: now
    });
  }

  console.log('Successfully seeded all legal services data!');
  process.exit(0);
}

seed().catch(console.error);
