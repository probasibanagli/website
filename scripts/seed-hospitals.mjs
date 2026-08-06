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

const hospitals = [
  {
    id: 'hosp-cmc',
    name: 'Christian Medical College (Vellore)',
    city: 'Vellore',
    state: 'Tamil Nadu',
    district: 'Vellore',
    area: 'Ida Scudder Road',
    address: 'Ida Scudder Road, Vellore, Tamil Nadu 632004',
    phone: '0416-2281000',
    emergency_phone: '0416-2282000',
    specializations: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Oncology', 'Emergency Medicine'],
    is_24_7: true,
    has_bengali_doctor: true,
    has_bengali_staff: true,
    category: 'Government',
    status: 'Active',
    created_at: new Date().toISOString(),
  },
  {
    id: 'hosp-kilpauk',
    name: 'Kilpauk Medical College Hospital',
    city: 'Chennai',
    state: 'Tamil Nadu',
    district: 'Chennai',
    area: 'Kilpauk',
    address: '825, Poonamallee High Rd, Kilpauk, Chennai, Tamil Nadu 600010',
    phone: '044-26412976',
    emergency_phone: '044-26431927',
    specializations: ['Cardiology', 'Orthopedics', 'Pediatrics', 'Emergency Medicine'],
    is_24_7: true,
    has_bengali_doctor: true,
    has_bengali_staff: true,
    category: 'Government',
    status: 'Active',
    created_at: new Date().toISOString(),
  },
  {
    id: 'hosp-stanley',
    name: 'Stanley Medical College Hospital',
    city: 'Chennai',
    state: 'Tamil Nadu',
    district: 'Chennai',
    area: 'George Town',
    address: 'Old Jail Rd, gesture Town, Chennai, Tamil Nadu 600001',
    phone: '044-25281351',
    emergency_phone: '044-25280900',
    specializations: ['Neurology', 'Orthopedics', 'Emergency Medicine'],
    is_24_7: true,
    has_bengali_doctor: true,
    has_bengali_staff: true,
    category: 'Government',
    status: 'Active',
    created_at: new Date().toISOString(),
  },
  {
    id: 'hosp-icf',
    name: 'Government Hospital, ICF (Ayanavaram)',
    city: 'Chennai',
    state: 'Tamil Nadu',
    district: 'Chennai',
    area: 'Ayanavaram',
    address: 'ICF Colony, Ayanavaram, Chennai, Tamil Nadu 600038',
    phone: '044-26146640',
    emergency_phone: '044-26146643',
    specializations: ['Cardiology', 'Neurology', 'Emergency Medicine'],
    is_24_7: true,
    has_bengali_doctor: true,
    has_bengali_staff: false,
    category: 'Government',
    status: 'Active',
    created_at: new Date().toISOString(),
  },
  {
    id: 'hosp-adyar',
    name: 'Adyar Cancer Institute',
    city: 'Chennai',
    state: 'Tamil Nadu',
    district: 'Chennai',
    area: 'Adyar',
    address: 'W Canal Bank Rd, Gandhi Nagar, Adyar, Chennai, Tamil Nadu 600020',
    phone: '044-24911526',
    emergency_phone: '044-24910754',
    specializations: ['Oncology', 'Emergency Medicine'],
    is_24_7: true,
    has_bengali_doctor: true,
    has_bengali_staff: true,
    category: 'Government',
    status: 'Active',
    created_at: new Date().toISOString(),
  },
  {
    id: 'hosp-apollo',
    name: 'Apollo Hospital Greams Road',
    city: 'Chennai',
    state: 'Tamil Nadu',
    district: 'Chennai',
    area: 'Greams Road',
    address: '21, Greams Lane, Off Greams Road, Chennai, Tamil Nadu 600006',
    phone: '044-28290200',
    emergency_phone: '1066',
    specializations: ['Cardiology', 'Neurology', 'Orthopedics', 'Oncology', 'Emergency Medicine'],
    is_24_7: true,
    has_bengali_doctor: true,
    has_bengali_staff: true,
    category: 'Private',
    status: 'Active',
    created_at: new Date().toISOString(),
  }
];

const doctors = [
  {
    id: 'doc-anirban',
    doctor_name: 'Dr. Anirban Roy',
    specialization: 'Cardiology',
    hospital_ids: ['hosp-cmc', 'hosp-kilpauk'],
    hospital_id: 'hosp-cmc',
    experience: '15 years',
    qualifications: ['MBBS', 'MD (Cardiology)', 'FACC'],
    languages: ['Bengali', 'English', 'Tamil'],
    photo: '',
    phone: '9876543210',
    email: 'anirban.roy@example.com',
    consultation_timings: 'Mon-Fri 10:00 AM - 1:00 PM',
    otp_required: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'doc-saptarshi',
    doctor_name: 'Dr. Saptarshi Chatterjee',
    specialization: 'Neurology',
    hospital_ids: ['hosp-stanley'],
    hospital_id: 'hosp-stanley',
    experience: '12 years',
    qualifications: ['MBBS', 'DM (Neurology)'],
    languages: ['Bengali', 'English'],
    photo: '',
    phone: '8765432109',
    email: 's.chatterjee@example.com',
    consultation_timings: 'Tue-Sat 2:00 PM - 5:00 PM',
    otp_required: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'doc-debasish',
    doctor_name: 'Dr. Debasish Banerjee',
    specialization: 'Orthopedics',
    hospital_ids: ['hosp-icf', 'hosp-apollo'],
    hospital_id: 'hosp-icf',
    experience: '20 years',
    qualifications: ['MBBS', 'MS (Orthopedics)'],
    languages: ['Bengali', 'English', 'Hindi'],
    photo: '',
    phone: '7654321098',
    email: 'debasish.b@example.com',
    consultation_timings: 'Mon-Wed-Fri 4:00 PM - 7:00 PM',
    otp_required: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'doc-soumya',
    doctor_name: 'Dr. Soumya Mukherjee',
    specialization: 'Pediatrics',
    hospital_ids: ['hosp-adyar'],
    hospital_id: 'hosp-adyar',
    experience: '8 years',
    qualifications: ['MBBS', 'MD (Pediatrics)'],
    languages: ['Bengali', 'English', 'Tamil'],
    photo: '',
    phone: '6543210987',
    email: 'soumya.m@example.com',
    consultation_timings: 'Daily 9:00 AM - 11:00 AM',
    otp_required: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'doc-priyanka',
    doctor_name: 'Dr. Priyanka Ghosh',
    specialization: 'Oncology',
    hospital_ids: ['hosp-adyar', 'hosp-apollo'],
    hospital_id: 'hosp-adyar',
    experience: '10 years',
    qualifications: ['MBBS', 'DNB (Oncology)'],
    languages: ['Bengali', 'English'],
    photo: '',
    phone: '5432109876',
    email: 'priyanka.ghosh@example.com',
    consultation_timings: 'Thu-Sat 10:00 AM - 12:00 PM',
    otp_required: true,
    created_at: new Date().toISOString(),
  }
];

const staff = [
  {
    id: 'staff-amit',
    name: 'Amit Roy',
    role: 'Nurse Coordinator',
    department: 'ICU',
    hospital_id: 'hosp-cmc',
    experience: '5 years',
    languages: ['Bengali', 'Tamil', 'English'],
    photo: '',
    phone: '9000100010',
    email: 'amit.roy@example.com',
    availability: 'Day Shift',
    description: 'Assists patients in Bengali translation.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'staff-riya',
    name: 'Riya Das',
    role: 'Helpdesk Executive',
    department: 'Reception',
    hospital_id: 'hosp-kilpauk',
    experience: '3 years',
    languages: ['Bengali', 'English'],
    photo: '',
    phone: '9000200020',
    email: 'riya.das@example.com',
    availability: 'Mon-Sat 9AM-5PM',
    description: 'Assists with admissions and local guidance.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'staff-sanjay',
    name: 'Sanjay Sen',
    role: 'Radiology Technician',
    department: 'Radiology',
    hospital_id: 'hosp-stanley',
    experience: '8 years',
    languages: ['Bengali', 'Tamil', 'Hindi'],
    photo: '',
    phone: '9000300030',
    email: 'sanjay.sen@example.com',
    availability: '24/7 on call',
    description: 'Assists with medical scan documentation translation.',
    created_at: new Date().toISOString(),
  }
];

async function main() {
  console.log('Seeding hospitals, doctors, and staff to Firestore...');
  
  // Seed Hospitals
  for (const h of hospitals) {
    await setDoc(doc(db, 'hospitals', h.id), h);
    console.log(`Seeded Hospital: ${h.name}`);
  }

  // Seed Doctors
  for (const d of doctors) {
    await setDoc(doc(db, 'bengali_doctors', d.id), d);
    console.log(`Seeded Doctor: ${d.doctor_name}`);
  }

  // Seed Staff
  for (const s of staff) {
    await setDoc(doc(db, 'bengali_staff', s.id), s);
    console.log(`Seeded Staff: ${s.name}`);
  }

  console.log('Seeding completed successfully!');
  process.exit(0);
}

main().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
