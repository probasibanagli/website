export const CITIES = [
  'Ambur',
  'Ariyalur',
  'Chennai',
  'Chengalpattu',
  'Coimbatore',
  'Cuddalore',
  'Dharmapuri',
  'Dindigul',
  'Erode',
  'Hosur',
  'Kanchipuram',
  'Kanyakumari',
  'Karur',
  'Krishnagiri',
  'Madurai',
  'Mayiladuthurai',
  'Nagapattinam',
  'Nagercoil',
  'Namakkal',
  'Nilgiris',
  'Perambalur',
  'Pudukkottai',
  'Ramanathapuram',
  'Ranipet',
  'Salem',
  'Sivaganga',
  'Tenkasi',
  'Thanjavur',
  'Theni',
  'Thoothukudi',
  'Tiruchirappalli',
  'Tirunelveli',
  'Tirupathur',
  'Tiruppur',
  'Tiruvallur',
  'Tiruvannamalai',
  'Tiruvarur',
  'Vellore',
  'Viluppuram',
  'Virudhunagar',
];

/* ──── City → Nearby Hospitals (real names per city) ──── */
export const CITY_HOSPITALS: Record<string, { name: string; area: string }[]> = {
  Chennai: [
    { name: 'Apollo Hospital', area: 'Greams Road' },
    { name: 'MIOT International', area: 'Manapakkam' },
    { name: 'Sri Ramachandra Medical Centre', area: 'Porur' },
    { name: 'Kauvery Hospital', area: 'Alwarpet' },
    { name: 'Fortis Malar Hospital', area: 'Adyar' },
    { name: 'Billroth Hospital', area: 'Shenoy Nagar' },
    { name: 'SIMS Hospital', area: 'Vadapalani' },
    { name: 'Rajiv Gandhi Govt General Hospital', area: 'Park Town' },
    { name: 'Stanley Medical College Hospital', area: 'Royapuram' },
    { name: 'Vijaya Hospital', area: 'Vadapalani' },
  ],
  Vellore: [
    { name: 'CMC Hospital', area: 'CMC Campus' },
    { name: 'Naruvi Hospital', area: 'Sathuvachari' },
    { name: 'Vellore Medical College Hospital', area: 'Adukamparai' },
  ],
  Coimbatore: [
    { name: 'Ramakrishna Hospital', area: 'RS Puram' },
    { name: 'KMCH Hospital', area: 'Avinashi Road' },
    { name: 'PSG Hospitals', area: 'Peelamedu' },
    { name: 'Ganga Hospital', area: 'Sathy Road' },
    { name: 'Sri Ramakrishna Hospital', area: 'Saibaba Colony' },
  ],
  Madurai: [
    { name: 'Meenakshi Mission Hospital', area: 'Lake View Road' },
    { name: 'Apollo Hospitals Madurai', area: 'KK Nagar' },
    { name: 'Govt Rajaji Hospital', area: 'Panagal Road' },
    { name: 'Vadamalayan Hospital', area: 'Simmakkal' },
  ],
  Tiruchirappalli: [
    { name: 'Kauvery Hospital Trichy', area: 'KK Nagar' },
    { name: 'Mahatma Gandhi Hospital', area: 'Trichy Main Road' },
    { name: 'CARE Hospitals', area: 'Woraiyur' },
  ],
  Salem: [
    { name: 'SKS Hospital', area: 'Fairlands' },
    { name: 'Vinayaka Missions Hospital', area: 'Ariyanoor' },
    { name: 'Salem Govt Hospital', area: 'Alagapuram' },
  ],
  Tirunelveli: [
    { name: 'Apollo KH Hospital', area: 'South Bypass Road' },
    { name: 'Tirunelveli Medical College Hospital', area: 'High Ground' },
  ],
  Erode: [
    { name: 'Erode Trust Hospital', area: 'Brough Road' },
    { name: 'Lotus Hospital', area: 'Perundurai Road' },
  ],
  Thanjavur: [
    { name: 'Thanjavur Medical College Hospital', area: 'Medical College Rd' },
    { name: 'Sree Balaji Hospital', area: 'Old Bus Stand' },
  ],
  Tiruppur: [
    { name: 'KG Hospital', area: 'Dharapuram Road' },
    { name: 'Tirupur Govt Hospital', area: 'College Road' },
  ],
  Dindigul: [
    { name: 'Govt Medical College Hospital', area: 'Pallapatti' },
    { name: 'Meenakshi Hospital', area: 'Anna Salai' },
  ],
  Hosur: [
    { name: 'Hosur Govt Hospital', area: 'Royakottah Road' },
    { name: 'Athulya Hospital', area: 'Bagalur Road' },
  ],
};

/* ──── Metro / Transport Routes (only Egmore, Tambaram, Beach, Kilambakkam) ──── */
export const METRO_ROUTES = [
  { id: 'egmore', name: 'Egmore', description: 'Chennai Egmore Railway Station — Central suburban hub', type: 'railway' as const },
  { id: 'tambaram', name: 'Tambaram', description: 'Tambaram Junction — Southern suburban railway terminus', type: 'railway' as const },
  { id: 'beach', name: 'Beach', description: 'Chennai Beach Station — Northern suburban railway terminus', type: 'railway' as const },
  { id: 'kilambakkam', name: 'Kilambakkam', description: 'Kilambakkam Bus Terminus — New integrated bus terminus', type: 'bus' as const },
];

/* ──── City → Areas mapping (derived from listings) ──── */
export const CITY_AREAS: Record<string, string[]> = {
  Chennai: [
    'Guindy', 'Anna Nagar', 'T. Nagar', 'Velachery', 'Potheri', 'Vandalur',
    'Sholinganallur', 'Urapakkam', 'Kelambakkam', 'Nungambakkam', 'Kilpauk',
    'Shenoy Nagar', 'Mylapore', 'Choolaimedu', 'Karapakkam', 'Chetpet',
    'Royapettah', 'Thailavaram', 'Thousand Lights',
  ],
  Vellore: ['Katpadi', 'CMC Campus', 'Sathuvachari'],
  Coimbatore: ['RS Puram', 'Peelamedu', 'Townhall', 'Avinashi Road', 'Saibaba Colony'],
  Madurai: ['KK Nagar', 'Tallakulam', 'Simmakkal', 'Anna Nagar'],
  Tiruchirappalli: ['Cantonment', 'Srirangam', 'KK Nagar', 'Woraiyur'],
  Salem: ['Fairlands', 'Five Roads', 'Alagapuram'],
  Tirunelveli: ['Madurai Road', 'Balabagya Nagar', 'High Ground'],
  Erode: ['Perundurai Road', 'Brough Road'],
  Thanjavur: ['Old Bus Stand', 'Medical College Rd'],
  Tiruppur: ['Nehru Nagar', 'Dharapuram Road'],
  Dindigul: ['Pallakadu', 'Anna Salai'],
  Hosur: ['Ho Chi Minh Road', 'Bagalur Road'],
};

/* ──── City → Nearby Colleges ──── */
export const CITY_COLLEGES: Record<string, { name: string; area: string }[]> = {
  Chennai: [
    { name: 'Anna University', area: 'Guindy' },
    { name: 'Madras Medical College', area: 'Park Town' },
    { name: 'Loyola College', area: 'Nungambakkam' },
    { name: 'Presidency College', area: 'Triplicane' },
    { name: 'SSN College of Engineering', area: 'Kalavakkam' },
    { name: 'Madras Christian College (MCC)', area: 'East Tambaram' },
    { name: 'Stanley Medical College', area: 'Royapuram' },
  ],
  Vellore: [
    { name: 'VIT University', area: 'Katpadi' },
    { name: 'CMC Vellore', area: 'CMC Campus' },
    { name: 'Voorhees College', area: 'Officers Line' },
  ],
  Coimbatore: [
    { name: 'PSG College of Technology', area: 'Peelamedu' },
    { name: 'Coimbatore Institute of Technology (CIT)', area: 'Peelamedu' },
    { name: 'Coimbatore Medical College', area: 'Avinashi Road' },
    { name: 'PSG College of Arts and Science', area: 'Peelamedu' },
  ],
  Madurai: [
    { name: 'Thiagarajar College of Engg', area: 'Thiruparankundram' },
    { name: 'Madurai Medical College', area: 'Madurai' },
    { name: 'The American College', area: 'Madurai' },
  ],
  Tiruchirappalli: [
    { name: 'KAP Viswanathan Government Medical College', area: 'Trichy' },
    { name: 'St. Joseph\'s College', area: 'Trichy' },
    { name: 'National College', area: 'Trichy' },
  ],
  Salem: [
    { name: 'Government College of Engineering, Salem', area: 'Karuppur' },
    { name: 'Mohan Kumaramangalam Medical College', area: 'Salem' },
    { name: 'Government Arts College', area: 'Salem' },
  ],
};

export const LISTING_TYPES = ['pg', 'hotel', 'rental'] as const;
export type ListingType = (typeof LISTING_TYPES)[number];

export const FOOD_TYPES = ['restaurant', 'sweets', 'tiffin', 'delivery partner'] as const;
export type FoodType = (typeof FOOD_TYPES)[number];

/* ──── City → Food Areas mapping (derived from food listings) ──── */
export const FOOD_AREAS: Record<string, string[]> = {
  Chennai: ['T Nagar', 'T. Nagar', 'Triplicane', 'Anna Nagar', 'Nungambakkam', 'Central'],
  Coimbatore: ['RS Puram', 'Peelamedu', 'Townhall'],
  Madurai: ['KK Nagar', 'Tallakulam', 'Simmakkal', 'Anna Nagar'],
  Tiruchirappalli: ['Cantonment', 'Srirangam'],
  Salem: ['Fairlands', 'Five Roads'],
  Tirunelveli: ['Madurai Road', 'Balabagya Nagar'],
  Erode: ['Perundurai Road', 'Brough Road'],
  Vellore: ['Anna Nagar', 'Katpadi'],
  Thanjavur: ['Old Bus Stand'],
  Tiruppur: ['Nehru Nagar'],
  Dindigul: ['Pallakadu'],
  Hosur: ['Ho Chi Minh Road'],
  Kanchipuram: ['West Mada Street'],
  Kanyakumari: ['Beach Road'],
  Karur: ['Old Bus Stand'],
  Krishnagiri: ['Kotagiri Road'],
  Nagapattinam: ['Harbour Area'],
  Nagercoil: ['West Gate'],
  Namakkal: ['Vasantha Nagar'],
  Theni: ['Main Road'],
  Thoothukudi: ['Beach Road'],
  Tiruvannamalai: ['Anna Salai'],
  Viluppuram: ['Main Road'],
  Ambur: ['New Bus Stand'],
  Cuddalore: ['Town'],
  Dharmapuri: ['Collectorate Road'],
};

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] as const;
export type BloodGroup = (typeof BLOOD_GROUPS)[number];

export const ROOM_TYPES = ['single', 'double', 'triple'] as const;
export const GENDERS = ['male', 'female', 'mixed'] as const;

export const COMMUNITY_PLATFORMS = ['whatsapp', 'telegram', 'facebook', 'instagram'] as const;
export const COMMUNITY_CATEGORIES = ['general', 'students', 'professionals', 'women', 'seniors'] as const;

export const COLLEGE_TYPES = ['engineering', 'medical', 'arts_science'] as const;

export const EVENT_CATEGORIES = ['festival', 'cultural', 'social', 'religious'] as const;

export const TREATMENT_TYPES = [
  'Cardiology', 'Orthopedic', 'General Medicine', 'ENT',
  'Gynecology', 'Pediatrics', 'Dental', 'Emergency',
] as const;

export const GOVT_SERVICES = [
  { id: 'aadhaar', title: 'Aadhaar Update / Enrolment', description: 'Update your Aadhaar address, mobile number, or biometrics at nearest centre.', category: 'Aadhaar', url: '/services/government/aadhaar', icon: 'User01' },
  { id: 'biometrics', title: 'Aadhaar Biometric Services', description: 'Lock or unlock your Aadhaar biometrics online for enhanced security.', category: 'Aadhaar', url: '/services/government/biometrics', icon: 'Shield01' },
  { id: 'passport', title: 'Passport Seva', description: 'Apply for a new passport, Tatkaal application, or renew existing passport.', category: 'Travel', url: '/services/government/passport', icon: 'Map01' },
  { id: 'visa', title: 'Visa Services', description: 'Apply for international visas, check application status, and view VAC details.', category: 'Travel', url: '/services/government/visa', icon: 'Globe01' },
  { id: 'voter-id', title: 'Voter ID (EPIC)', description: 'Register as a voter, apply for Form 6/8, or update electoral details.', category: 'Election', url: '/services/government/voter-id', icon: 'UserCheck01' },
  { id: 'police-verification', title: 'File a Complaint', description: 'Report cyber crime/fraud, request police verification certificate (PVC), and locate local police stations.', category: 'Safety', url: '/services/government/police-verification', icon: 'Shield01' },
  { id: 'ration-card', title: 'Smart Ration Card (TNPDS)', description: 'Apply for or update your Smart Ration Card for subsidized food grains and essential commodities.', category: 'Ration Card', url: '/services/government/ration-card', icon: 'Home01' },
  { id: 'driving-licence', title: 'Driving Licence & RTO (Parivahan)', description: 'Apply or renew your driving licence, LLR booking, and vehicle registration in Tamil Nadu.', category: 'Transport', url: '/services/government/driving-licence', icon: 'Car01' },
  { id: 'ayushman-bharat', title: 'Ayushman Bharat & CMCHIS', description: 'Government health insurance covering ₹5 lakh per year per family for empanelled hospitals.', category: 'Health Schemes', url: '/services/government/ayushman-bharat', icon: 'MedicalCross' },
  { id: 'mgnregs', title: 'MGNREGS Job Card', description: 'Register for 100 days guaranteed employment scheme under MGNREGA.', category: 'Employment', url: 'https://nrega.nic.in/netnrega/statepage.aspx?Page=C&Action=A', icon: 'Users01' },
  { id: 'tn-e-seva', title: 'Arasu e-Seva Portal (TNeGA)', description: 'One-stop portal for all Tamil Nadu e-Governance certificates and community services.', category: 'Government', url: 'https://www.tnesevai.tn.gov.in/Citizen/Registration.aspx', icon: 'Building01' },
  { id: 'labour-registration', title: 'TN Labour Registration', description: 'Register as an unorganized or migrant worker with the Tamil Nadu Labour Department.', category: 'Employment', url: 'https://labour.tn.gov.in/', icon: 'Users01' },
  { id: 'scholarships', title: 'National Scholarship Portal', description: 'Central and state scholarship schemes for students from pre-matric to higher education.', category: 'Education', url: 'https://scholarships.gov.in/', icon: 'GraduationHat01' },
];

/* ──────────────── Government Service Centres Data ──────────────── */

export const TN_DISTRICTS = [
  'All Districts',
  'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore',
  'Dharmapuri', 'Dindigul', 'Erode', 'Kallakurichi', 'Kanchipuram',
  'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai',
  'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai',
  'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi',
  'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli',
  'Tirupathur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur',
  'Vellore', 'Viluppuram', 'Virudhunagar',
] as const;

export const AADHAAR_CENTRES = [
  { id: 1, name: 'CSC Aadhaar Kendra - T Nagar', address: '12, North Usman Road, T Nagar, Chennai', type: 'CSC / Enrolment Centre', city: 'Chennai', phone: '044-24321000' },
  { id: 2, name: 'UIDAI Authorized Update Centre', address: 'Post Office Building, Anna Nagar, Chennai', type: 'Update Centre', city: 'Chennai', phone: '044-26212345' },
  { id: 3, name: 'CSC Aadhaar Kendra - Vadapalani', address: '23, Arcot Road, Vadapalani, Chennai', type: 'CSC / Enrolment Centre', city: 'Chennai', phone: '044-23456789' },
  { id: 4, name: 'India Post Aadhaar Centre - Mylapore', address: 'Head Post Office, Mylapore, Chennai', type: 'Update Centre', city: 'Chennai', phone: '044-24981234' },
  { id: 5, name: 'CSC Aadhaar Kendra - RS Puram', address: '45, DB Road, RS Puram, Coimbatore', type: 'CSC / Enrolment Centre', city: 'Coimbatore', phone: '0422-2541000' },
  { id: 6, name: 'India Post Aadhaar Centre', address: 'Head Post Office, Town Hall Road, Coimbatore', type: 'Update Centre', city: 'Coimbatore', phone: '0422-2391234' },
  { id: 7, name: 'UIDAI Authorized Update Centre', address: 'Head Post Office, KK Nagar, Madurai', type: 'Update Centre', city: 'Madurai', phone: '0452-2531000' },
  { id: 8, name: 'CSC Aadhaar Kendra - Goripalayam', address: '78, Goripalayam Main Road, Madurai', type: 'CSC / Enrolment Centre', city: 'Madurai', phone: '0452-2345678' },
  { id: 9, name: 'CSC Aadhaar Kendra - Cantonment', address: '15, Cantonment Road, Tiruchirappalli', type: 'CSC / Enrolment Centre', city: 'Tiruchirappalli', phone: '0431-2701000' },
  { id: 10, name: 'India Post Aadhaar Centre', address: 'GPO Building, Thillainagar, Tiruchirappalli', type: 'Update Centre', city: 'Tiruchirappalli', phone: '0431-2414567' },
  { id: 11, name: 'CSC Aadhaar Kendra - Palayamkottai', address: '22, South Car Street, Palayamkottai, Tirunelveli', type: 'CSC / Enrolment Centre', city: 'Tirunelveli', phone: '0462-2501000' },
  { id: 12, name: 'CSC Aadhaar Kendra - Hasthampatti', address: '5, Junction Road, Hasthampatti, Salem', type: 'CSC / Enrolment Centre', city: 'Salem', phone: '0427-2316789' },
  { id: 13, name: 'India Post Aadhaar Centre', address: 'GPO, Omalur Main Road, Salem', type: 'Update Centre', city: 'Salem', phone: '0427-2211234' },
  { id: 14, name: 'CSC Aadhaar Kendra - Katpadi', address: '10, Katpadi Road, Vellore', type: 'CSC / Enrolment Centre', city: 'Vellore', phone: '0416-2241000' },
  { id: 15, name: 'CSC Aadhaar Kendra - Tiruppur', address: '88, Avinashi Road, Tiruppur', type: 'CSC / Enrolment Centre', city: 'Tiruppur', phone: '0421-2201000' },
];

export const PASSPORT_SEVA_KENDRAS = [
  { id: 1, name: 'Passport Seva Kendra, Chennai', address: 'Shastri Bhawan Annexe, 26 Haddows Road, Nungambakkam, Chennai - 600006', type: 'PSK', district: 'Chennai', phone: '1800-258-1800', timings: 'Mon-Fri, 9:30 AM - 5:30 PM' },
  { id: 2, name: 'Post Office Passport Seva Kendra, Anna Nagar', address: 'Head Post Office, Anna Nagar, Chennai - 600040', type: 'POPSK', district: 'Chennai', phone: '1800-258-1800', timings: 'Mon-Fri, 9:30 AM - 5:30 PM' },
  { id: 3, name: 'Post Office Passport Seva Kendra, Tambaram', address: 'Tambaram Head Post Office, GST Road, Tambaram, Chennai', type: 'POPSK', district: 'Chengalpattu', phone: '1800-258-1800', timings: 'Mon-Fri, 9:30 AM - 5:30 PM' },
  { id: 4, name: 'Passport Seva Kendra, Coimbatore', address: 'Valankulam Main Road, Behind BSNL Office, Coimbatore - 641002', type: 'PSK', district: 'Coimbatore', phone: '1800-258-1800', timings: 'Mon-Fri, 9:30 AM - 5:30 PM' },
  { id: 5, name: 'Passport Seva Kendra, Madurai', address: 'No.1, North Veli Street, Madurai - 625001', type: 'PSK', district: 'Madurai', phone: '1800-258-1800', timings: 'Mon-Fri, 9:30 AM - 5:30 PM' },
  { id: 6, name: 'Passport Seva Kendra, Tiruchirappalli', address: 'Collector Office Complex, Tiruchirappalli - 620001', type: 'PSK', district: 'Tiruchirappalli', phone: '1800-258-1800', timings: 'Mon-Fri, 9:30 AM - 5:30 PM' },
  { id: 7, name: 'Post Office Passport Seva Kendra, Salem', address: 'Head Post Office, Omalur Road, Salem - 636001', type: 'POPSK', district: 'Salem', phone: '1800-258-1800', timings: 'Mon-Fri, 9:30 AM - 5:30 PM' },
  { id: 8, name: 'Post Office Passport Seva Kendra, Tirunelveli', address: 'Tirunelveli Head Post Office, South Car Street, Tirunelveli', type: 'POPSK', district: 'Tirunelveli', phone: '1800-258-1800', timings: 'Mon-Fri, 9:30 AM - 5:30 PM' },
  { id: 9, name: 'Post Office Passport Seva Kendra, Vellore', address: 'Vellore Head Post Office, Officers Line, Vellore', type: 'POPSK', district: 'Vellore', phone: '1800-258-1800', timings: 'Mon-Fri, 9:30 AM - 5:30 PM' },
  { id: 10, name: 'Post Office Passport Seva Kendra, Thanjavur', address: 'Head Post Office, South Main Street, Thanjavur', type: 'POPSK', district: 'Thanjavur', phone: '1800-258-1800', timings: 'Mon-Fri, 9:30 AM - 5:30 PM' },
];

export const VISA_COUNTRIES = [
  {
    name: 'United States', code: 'US',
    visaPortalUrl: 'https://ceac.state.gov/genniv/',
    vacAddress: 'US Consulate General, 220 Anna Salai, Gemini Circle, Gopalapuram, Chennai - 600006',
    vacPhone: '044-2811 2000',
    applicationProcess: ['Fill DS-160 form online at ceac.state.gov', 'Pay visa fee ($185 for B1/B2) at designated bank', 'Schedule appointment at ustraveldocs.com', 'Attend visa interview at US Consulate, Chennai', 'Wait for passport to be returned with visa stamp'],
    biometricProcess: ['Biometrics collected at US VAC (Good Shepherd Square / Gemini)', 'Fingerprint scan (10 fingers) and digital photo taken', 'Appointment mandatory prior to interview'],
  },
  {
    name: 'United Kingdom', code: 'GB',
    visaPortalUrl: 'https://www.gov.uk/apply-to-come-to-the-uk',
    vacAddress: 'VFS Global UK VAC, 2nd Floor, Ramee Mall, 365 Anna Salai, Teynampet, Chennai - 600018',
    vacPhone: '022-6786 6002',
    applicationProcess: ['Apply online at gov.uk/apply-to-come-to-the-uk', 'Pay visa fee (£100-£363 depending on type)', 'Upload supporting documents online', 'Book biometric appointment at VFS', 'Wait 15-20 working days for decision'],
    biometricProcess: ['Book appointment at VFS Global Chennai', 'Visit VFS centre with appointment confirmation', 'Fingerprints and photograph captured', 'Submit passport at VFS centre'],
  },
  {
    name: 'Canada', code: 'CA',
    visaPortalUrl: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada.html',
    vacAddress: 'VFS Canada Visa Biometrics Collection, 2nd Floor, Ramee Mall, 365 Anna Salai, Teynampet, Chennai - 600018',
    vacPhone: '022-6786 6002',
    applicationProcess: ['Create account on IRCC portal', 'Fill application form and pay fee (CAD $100)', 'Upload documents (passport, photo, financials, travel history)', 'Submit biometrics at VFS Global', 'Wait 30-60 days for processing'],
    biometricProcess: ['Pay biometric fee (CAD $85) during application', 'Book biometric appointment at VFS Global Chennai', 'Visit centre with appointment letter and passport', 'Fingerprints and photo captured digitally'],
  },
  {
    name: 'Australia', code: 'AU',
    visaPortalUrl: 'https://immi.homeaffairs.gov.au/',
    vacAddress: 'VFS Global Australia VAC, 2nd Floor, Ramee Mall, 365 Anna Salai, Teynampet, Chennai - 600018',
    vacPhone: '022-6786 6002',
    applicationProcess: ['Apply online at immi.homeaffairs.gov.au', 'Pay visa fee (AUD $190 for visitor visa)', 'Upload all supporting documents', 'Attend biometric collection at VFS', 'Wait 20-30 days for decision (typically grant by email)'],
    biometricProcess: ['Biometric instruction letter received after applying', 'Book appointment at VFS Global Chennai', 'Visit with appointment letter and passport', 'Fingerprints and photo captured'],
  },
  {
    name: 'Germany / Schengen', code: 'DE',
    visaPortalUrl: 'https://videx.diplo.de/',
    vacAddress: 'VFS Global Germany VAC, 2nd Floor, Ramee Mall, 365 Anna Salai, Teynampet, Chennai - 600018',
    vacPhone: '022-6786 6002',
    applicationProcess: ['Fill Videx application form online', 'Book appointment at VFS Global website', 'Pay visa fee (€80 for short stay)', 'Submit application with documents at VFS', 'Attend interview if required at German Consulate'],
    biometricProcess: ['Biometrics collected at VFS Global during submission', 'Fingerprints (10 fingers) and digital photo taken', 'Valid for 59 months — re-use for subsequent applications', 'No separate appointment needed'],
  },
  {
    name: 'Singapore', code: 'SG',
    visaPortalUrl: 'https://eservices.ica.gov.sg/esvclandingpage/save',
    vacAddress: 'Consulate-General of Singapore, No. 17, SATVAM, Bishop Wallers Avenue East, CIT Colony, Mylapore, Chennai - 600004',
    vacPhone: '044-2815 8217',
    applicationProcess: ['Obtain a local contact / authorised visa agent in Singapore', 'Submit application through ICA SAVE portal', 'Pay visa fee (SGD $30)', 'Upload documents (passport copy, photo, itinerary, financials)', 'E-visa approval emailed in 3-5 working days'],
    biometricProcess: ['No biometric appointment required for Singapore visa', 'Visa is processed electronically', 'E-visa letter received by email upon approval'],
  },
  {
    name: 'UAE (Dubai)', code: 'AE',
    visaPortalUrl: 'https://smartservices.icp.gov.ae/echannels/web/client/default.html',
    vacAddress: 'VFS Global UAE Visa Centre, 2nd Floor, Ramee Mall, 365 Anna Salai, Teynampet, Chennai - 600018',
    vacPhone: '022-6786 6002',
    applicationProcess: ['Apply through UAE ICP Smart Services portal or sponsor in UAE', 'Upload passport copy, photo, and flight tickets', 'Pay visa fee (AED 100-300 depending on duration)', 'E-visa emailed within 3-5 working days', 'Print e-visa and carry during travel'],
    biometricProcess: ['No biometric appointment required for UAE tourist visa', 'Biometrics captured at UAE airport upon arrival', 'Eye scan and fingerprints taken at immigration'],
  },
  {
    name: 'France / Schengen', code: 'FR',
    visaPortalUrl: 'https://france-visas.gouv.fr/',
    vacAddress: 'VFS Global France VAC, 2nd Floor, Ramee Mall, 365 Anna Salai, Teynampet, Chennai - 600018',
    vacPhone: '022-6786 6002',
    applicationProcess: ['Create account on france-visas.gouv.fr', 'Fill application form and download it', 'Book appointment at VFS Global Chennai', 'Submit documents and pay fee (€80) at VFS', 'Wait 15 working days for decision'],
    biometricProcess: ['Biometrics collected at VFS Global during submission', 'Fingerprints and digital photo captured', 'Valid for 59 months for Schengen area', 'First-time applicants must appear in person'],
  },
  {
    name: 'Japan', code: 'JP',
    visaPortalUrl: 'https://www.in.emb-japan.go.jp/itpr_en/visa.html',
    vacAddress: 'Consulate-General of Japan, No. 12/1, Cenotaph Road, Teynampet, Chennai - 600018',
    vacPhone: '044-2432 3860',
    applicationProcess: ['Download visa application form from embassy website', 'Collect required documents (invitation letter, itinerary, financials)', 'Submit application at Japanese Consulate Chennai', 'Processing takes 5-7 working days', 'Collect passport with visa stamp from Consulate'],
    biometricProcess: ['No biometric collection in India for Japan visa', 'Biometrics captured at Japanese airport upon arrival', 'Fingerprints and photo taken at immigration counter'],
  },
  {
    name: 'South Korea', code: 'KR',
    visaPortalUrl: 'https://www.visa.go.kr/openPage.do?MENU_ID=10101',
    vacAddress: 'VFS Global Korea VAC, 2nd Floor, Ramee Mall, 365 Anna Salai, Teynampet, Chennai - 600018',
    vacPhone: '022-6786 6002',
    applicationProcess: ['Apply online at visa.go.kr or fill paper form', 'Book appointment at VFS Global Chennai', 'Submit documents and pay fee at VFS', 'Processing takes 7-10 working days', 'Collect passport with visa from VFS'],
    biometricProcess: ['Biometrics collected at VFS Global Ramee Mall Chennai', 'Fingerprints and photo captured during submission', 'No separate biometric appointment needed'],
  },
];

export const POLICE_STATIONS = [
  { id: 1, name: 'Commissioner Office - Cybercrime Cell', address: 'Vepery, Chennai - 600007', type: 'Cybercrime Cell', city: 'Chennai', phone: '044-2539 0978' },
  { id: 2, name: 'T. Nagar Police Station', address: 'Usman Road, T. Nagar, Chennai - 600017', type: 'Police Station', city: 'Chennai', phone: '044-2434 5566' },
  { id: 3, name: 'Anna Nagar Police Station', address: '2nd Avenue, Anna Nagar, Chennai - 600040', type: 'Police Station', city: 'Chennai', phone: '044-2621 3456' },
  { id: 4, name: 'Adyar Police Station', address: 'LB Road, Adyar, Chennai - 600020', type: 'Police Station', city: 'Chennai', phone: '044-2441 2345' },
  { id: 5, name: 'RS Puram Police Station', address: 'DB Road, RS Puram, Coimbatore - 641002', type: 'Police Station', city: 'Coimbatore', phone: '0422-254 1000' },
  { id: 6, name: 'Town Hall Police Station', address: 'Big Bazaar Street, Coimbatore - 641001', type: 'Police Station', city: 'Coimbatore', phone: '0422-239 0100' },
  { id: 7, name: 'Goripalayam Police Station', address: 'Goripalayam Main Road, Madurai - 625002', type: 'Police Station', city: 'Madurai', phone: '0452-253 1000' },
  { id: 8, name: 'Tallakulam Police Station', address: 'Tallakulam, Madurai - 625002', type: 'Police Station', city: 'Madurai', phone: '0452-234 5678' },
  { id: 9, name: 'Cantonment Police Station', address: 'Cantonment Road, Tiruchirappalli - 620001', type: 'Police Station', city: 'Tiruchirappalli', phone: '0431-270 1000' },
  { id: 10, name: 'Town Police Station', address: 'Big Bazaar Street, Salem - 636001', type: 'Police Station', city: 'Salem', phone: '0427-231 6789' },
  { id: 11, name: 'Palayamkottai Police Station', address: 'South Car Street, Palayamkottai, Tirunelveli', type: 'Police Station', city: 'Tirunelveli', phone: '0462-250 1000' },
  { id: 12, name: 'Katpadi Police Station', address: 'Katpadi Road, Vellore - 632007', type: 'Police Station', city: 'Vellore', phone: '0416-224 1000' },
];

export const ELECTION_OFFICES = [
  { id: 1, name: 'District Election Office, Chennai', address: 'Collectorate Complex, Rajaji Salai, Chennai - 600001', type: 'District Election Office', city: 'Chennai', phone: '044-2536 0211' },
  { id: 2, name: 'Voter Service Centre - Anna Nagar', address: 'Taluk Office, Anna Nagar, Chennai - 600040', type: 'Voter Service Centre', city: 'Chennai', phone: '044-2621 7890' },
  { id: 3, name: 'Voter Service Centre - Mylapore', address: 'Revenue Divisional Office, Mylapore, Chennai', type: 'Voter Service Centre', city: 'Chennai', phone: '044-2498 5678' },
  { id: 4, name: 'District Election Office, Coimbatore', address: 'Collectorate Complex, Coimbatore - 641018', type: 'District Election Office', city: 'Coimbatore', phone: '0422-230 1111' },
  { id: 5, name: 'District Election Office, Madurai', address: 'Collectorate Complex, Madurai - 625020', type: 'District Election Office', city: 'Madurai', phone: '0452-253 7890' },
  { id: 6, name: 'District Election Office, Tiruchirappalli', address: 'Collectorate Complex, Tiruchirappalli - 620001', type: 'District Election Office', city: 'Tiruchirappalli', phone: '0431-270 5678' },
  { id: 7, name: 'District Election Office, Salem', address: 'Collectorate Complex, Salem - 636001', type: 'District Election Office', city: 'Salem', phone: '0427-231 1234' },
  { id: 8, name: 'District Election Office, Tirunelveli', address: 'Collectorate Complex, Tirunelveli - 627001', type: 'District Election Office', city: 'Tirunelveli', phone: '0462-250 2345' },
  { id: 9, name: 'District Election Office, Vellore', address: 'Collectorate Complex, Vellore - 632004', type: 'District Election Office', city: 'Vellore', phone: '0416-224 5678' },
  { id: 10, name: 'District Election Office, Thanjavur', address: 'Collectorate Complex, Thanjavur - 613001', type: 'District Election Office', city: 'Thanjavur', phone: '04362-230 123' },
];

export const TAMIL_WORDS = [
  { meaning: 'Hello / Welcome', pronunciation: 'Vanakkam', tamil: 'வணக்கம்', bengali: 'ভানাক্কাম' },
  { meaning: 'Thank you', pronunciation: 'Nandri', tamil: 'நன்றி', bengali: 'নানদ্রি' },
  { meaning: 'How much?', pronunciation: 'Evvalavu?', tamil: 'எவ்வளவு?', bengali: 'এভভালাভু?' },
  { meaning: 'When will it come?', pronunciation: 'Eppo varum?', tamil: 'எப்போ வரும்?', bengali: 'এপ্পো ভারুম?' },
  { meaning: 'Where is it?', pronunciation: 'Enge irukku?', tamil: 'எங்கே இருக்கு?', bengali: 'এঙ্গে ইরুক্কু?' },
  { meaning: 'Money', pronunciation: 'Kaasu', tamil: 'காசு', bengali: 'কাসু' },
  { meaning: 'Will auto come?', pronunciation: 'Auto varuma?', tamil: 'ஆட்டோ வருமா?', bengali: 'অটো ভারুমা?' },
  { meaning: 'I need water', pronunciation: 'Thanni venum', tamil: 'தண்ணি வேணும்', bengali: 'থান্নি ভেনুম' },
  { meaning: 'Food / Meal', pronunciation: 'Saapadu', tamil: 'சாப்பாடு', bengali: 'সাপ্পাডু' },
  { meaning: 'Bus station', pronunciation: 'Bus nilayam', tamil: 'பஸ் நிலையம்', bengali: 'বাস নিলাইয়াম' },
  { meaning: 'Hospital', pronunciation: 'Maruthuvamanai', tamil: 'மருத்துவமனை', bengali: 'মারুথুভামানাই' },
  { meaning: 'Help!', pronunciation: 'Udavi!', tamil: 'உদவி!', bengali: 'উদাবি!' },
  { meaning: 'I need to go home', pronunciation: 'Veetuku poganum', tamil: 'வீட்டுக்கு போகணும்', bengali: 'ভেটুকু পোগানুমি' },
  { meaning: 'Very good!', pronunciation: 'Romba nalla irukku', tamil: 'ரொம்ப நல்லা இருக்கு', bengali: 'রোম্বা নাল্লা ইরুক্কু' },
  { meaning: "I don't understand", pronunciation: 'Puriyala', tamil: 'புரியல', bengali: 'পুরিয়ালা' },
  { meaning: 'One moment', pronunciation: 'Oru nimisham', tamil: 'ஒரு நிমিஷம்', bengali: 'অরু নিমিশাম' },
  { meaning: 'Right side', pronunciation: 'Valathu pakkam', tamil: 'வலது பக்கம்', bengali: 'ভালাথু পাক্কাম' },
  { meaning: 'Left side', pronunciation: 'Idathu pakkam', tamil: 'இடது பக்கம்', bengali: 'ইডাথু পাক্কাম' },
  { meaning: 'Stop here', pronunciation: 'Nillu / Niruthunga', tamil: 'நில்லு / நிறுத்துங்க', bengali: 'নিলু / নিরুথুঙ্গা' },
  { meaning: 'Go straight', pronunciation: 'Nera ponga', tamil: 'நேரா போங்க', bengali: 'নেরা পোঙ্গা' },
  { meaning: 'What happened?', pronunciation: 'Enna aachu?', tamil: 'என்ன ஆச்சு?', bengali: 'এন্না আচ্ছু?' },
  { meaning: 'I know', pronunciation: 'Theriyum', tamil: 'தெரியும்', bengali: 'থেরিয়ুম' },
  { meaning: "I don't know", pronunciation: 'Theriyaathu', tamil: 'தெரியாது', bengali: 'থেরিয়াদু' },
  { meaning: 'Come here', pronunciation: 'Inga vaanga', tamil: 'இங்க வாங்க', bengali: 'ইঙ্গা ভাঙ্গা' },
  { meaning: 'Go', pronunciation: 'Ponga', tamil: 'போங்க', bengali: 'পোঙ্গা' },
  { meaning: 'Good', pronunciation: 'Nalla', tamil: 'நல்ல', bengali: 'নাল্লা' },
  { meaning: 'Bad', pronunciation: 'Kettathu', tamil: 'கெட்டது', bengali: 'কেট্টাথু' },
  { meaning: 'Please come', pronunciation: 'Vaanga', tamil: 'வாங்க', bengali: 'ভাঙ্গা' },
  { meaning: 'Okay / Yes', pronunciation: 'Sari', tamil: 'சரி', bengali: 'সারি' },
  { meaning: 'No', pronunciation: 'Illai', tamil: 'இல்லை', bengali: 'ইল্লাই' },
  { meaning: 'Want / Need', pronunciation: 'Venum', tamil: 'வேண்டும்', bengali: 'ভেনুম' },
  { meaning: "Don't want", pronunciation: 'Vendaam', tamil: 'வேண்டாம்', bengali: 'ভেন্ডাম' },
  { meaning: 'Today', pronunciation: 'Inniku', tamil: 'இன்னைকে', bengali: 'ইন্নিক্কু' },
  { meaning: 'Tomorrow', pronunciation: 'Nalaiku', tamil: 'நாளைக்கு', bengali: 'নালাইক্কু' },
  { meaning: 'Yesterday', pronunciation: 'Nethu', tamil: 'நேற்று', bengali: 'নেথু' },
  { meaning: 'Why?', pronunciation: 'Yen?', tamil: 'ஏன்?', bengali: 'য়েন?' },
  { meaning: 'How?', pronunciation: 'Eppadi?', tamil: 'எப்படி?', bengali: 'এপ্পাডি?' },
  { meaning: 'Who?', pronunciation: 'Yaaru?', tamil: 'யார்?', bengali: 'য়ারু?' },
  { meaning: 'What?', pronunciation: 'Enna?', tamil: 'என்ன?', bengali: 'এন্না?' },
  { meaning: 'When?', pronunciation: 'Eppo?', tamil: 'எப்போது?', bengali: 'এপ্পো?' },
  { meaning: 'Where?', pronunciation: 'Enge?', tamil: 'எங்கே?', bengali: 'এঙ্গে?' },
  { meaning: 'One', pronunciation: 'Onnu', tamil: 'ஒன்று', bengali: 'ওন্নু' },
  { meaning: 'Two', pronunciation: 'Rendu', tamil: 'இரண்டு', bengali: 'রেন্ডু' },
  { meaning: 'Very much / A lot', pronunciation: 'Romba', tamil: 'ரொம்ப', bengali: 'রোম্বা' },
  { meaning: 'Shop / Store', pronunciation: 'Kada', tamil: 'கடை', bengali: 'কাডাই' },
  { meaning: 'Way / Path', pronunciation: 'Vazhi', tamil: 'வழி', bengali: 'ভাজি' },
  { meaning: 'What is the time?', pronunciation: 'Mani enna?', tamil: 'மணி என்ன?', bengali: 'মানি এন্না?' },
  { meaning: 'First', pronunciation: 'Mudhala', tamil: 'முதலில்', bengali: 'মুদালিল' },
  { meaning: 'Last', pronunciation: 'Kadaisi', tamil: 'கடைসি', bengali: 'কাডাইসি' },
  { meaning: 'Friend', pronunciation: 'Nanban', tamil: 'நண்பன்', bengali: 'নানবান' },
];

/* ──────────────── Matrimony Constants ──────────────── */

export const HEIGHTS = [
  "4'6\"", "4'7\"", "4'8\"", "4'9\"", "4'10\"", "4'11\"",
  "5'0\"", "5'1\"", "5'2\"", "5'3\"", "5'4\"", "5'5\"", "5'6\"", "5'7\"", "5'8\"", "5'9\"", "5'10\"", "5'11\"",
  "6'0\"", "6'1\"", "6'2\"", "6'3\"", "6'4\"", "6'5\"", "6'6\"",
] as const;

export const AGE_RANGES = [
  '18 - 25 yrs',
  '21 - 28 yrs',
  '25 - 32 yrs',
  '28 - 35 yrs',
  '30 - 40 yrs',
  '35 - 45 yrs',
  '40 - 50 yrs',
  '50+ yrs',
  'Other',
] as const;

export const HEIGHT_RANGES = [
  "4'6\" - 5'2\"",
  "5'0\" - 5'6\"",
  "5'2\" - 5'8\"",
  "5'4\" - 5'10\"",
  "5'6\" - 6'0\"",
  "5'8\" - 6'2\"",
  "6'0\"+",
  'Other',
] as const;

export function parseAgeRange(rangeStr: string | undefined): { min?: number; max?: number } {
  if (!rangeStr || rangeStr === 'Other') return {};
  if (rangeStr.includes('50+')) return { min: 50, max: 75 };
  const match = rangeStr.match(/(\d+)\s*-\s*(\d+)/);
  if (match) {
    return { min: parseInt(match[1], 10), max: parseInt(match[2], 10) };
  }
  return {};
}

export function parseHeightRange(rangeStr: string | undefined): { min?: string; max?: string } {
  if (!rangeStr || rangeStr === 'Other') return {};
  if (rangeStr.includes('6\'0"+') || rangeStr.includes('6\'0" +')) return { min: "6'0\"", max: "6'6\"" };
  const parts = rangeStr.split('-').map(s => s.trim());
  if (parts.length === 2) {
    return { min: parts[0], max: parts[1] };
  }
  return {};
}

export const MARITAL_STATUSES = ['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce'] as const;

export const COMPLEXIONS = ['Very Fair', 'Fair', 'Wheatish', 'Wheatish Brown', 'Dark'] as const;

export const FAMILY_TYPES = ['Joint', 'Nuclear', 'Semi-Joint'] as const;
export const FAMILY_VALUES = ['Orthodox', 'Moderate', 'Liberal'] as const;
export const FAMILY_STATUS = ['Middle Class', 'Upper Middle Class', 'Rich', 'Affluent'] as const;

export const DIET_TYPES = ['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan'] as const;

export const EDUCATION_LEVELS = [
  'Undergraduate', 'Graduate', 'Postgraduate',
  'High School', '12th Pass', 'Diploma', 'Bachelor\'s (B.A/B.Sc/B.Com)',
  'B.Tech / B.E.', 'BBA / BCA', 'MBBS', 'BDS', 'B.Pharm',
  'Master\'s (M.A/M.Sc/M.Com)', 'M.Tech / M.E.', 'MBA', 'MD / MS',
  'M.Pharm', 'CA / CS / ICWA', 'LLB / LLM', 'Ph.D / Doctorate', 'Other',
] as const;

export const INCOME_RANGES = [
  'Below 2 LPA', '2-4 LPA', '4-6 LPA', '6-8 LPA', '8-10 LPA',
  '10-15 LPA', '15-20 LPA', '20-30 LPA', '30-50 LPA', '50+ LPA',
  'Not Disclosed',
] as const;

export const BENGALI_SUBCASTES = [
  'Brahmin', 'Kayastha', 'Baidya', 'Namasudra', 'Mahishya',
  'Sadgop', 'Tili', 'Tambuli', 'Suri', 'Kansari', 'Aguri',
  'Rajput', 'Baishya / Vaishya', 'Muslim – Sheikh', 'Muslim – Syed',
  'Muslim – Pathan', 'Christian', 'Buddhist', 'Jain', 'Sikh', 'Other',
] as const;

export const WEST_BENGAL_DISTRICTS = [
  'Kolkata', 'Howrah', 'Hooghly', 'North 24 Parganas', 'South 24 Parganas',
  'Nadia', 'Murshidabad', 'Burdwan (Purba)', 'Burdwan (Paschim)',
  'Birbhum', 'Bankura', 'Purulia', 'Medinipur (East)', 'Medinipur (West)',
  'Jhargram', 'Malda', 'North Dinajpur (Uttar)', 'South Dinajpur (Dakshin)',
  'Darjeeling', 'Kalimpong', 'Jalpaiguri', 'Alipurduar', 'Cooch Behar',
  'Siliguri', 'Durgapur', 'Asansol', 'Other',
] as const;

export const NATIVE_CITIES = [
  'Kolkata', 'Siliguri', 'Durgapur', 'Asansol', 'Howrah', 'Kharagpur',
  'Burdwan', 'Baharampur', 'Malda', 'Darjeeling', 'Jalpaiguri', 'Cooch Behar',
  'Chennai', 'Bengaluru', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Pune',
  'Patna', 'Ranchi', 'Bhubaneswar', 'Guwahati', 'Agartala', 'Shillong',
  'Lucknow', 'Jaipur', 'Ahmedabad', 'Surat', 'Vadodara', 'Indore',
  'Bhopal', 'Nagpur', 'Chandigarh', 'Dehradun', 'Coimbatore', 'Madurai',
  'Trichy', 'Salem', 'Other',
] as const;

export const MAJOR_INDIAN_CITIES = NATIVE_CITIES;

export const SMOKING_HABITS = ['No', 'Occasionally', 'Yes'] as const;
export const DRINKING_HABITS = ['No', 'Socially', 'Occasionally', 'Yes'] as const;

export const MANGLIK_OPTIONS = ['No', 'Yes', 'Anshik (Partial)', 'Don\'t Know'] as const;

export const HOBBIES_LIST = [
  'Reading', 'Cooking', 'Music', 'Dancing', 'Painting', 'Photography',
  'Traveling', 'Sports', 'Yoga & Fitness', 'Movies', 'Writing',
  'Gardening', 'Gaming', 'Singing', 'Playing Instruments', 'Social Work',
  'Bengali Literature', 'Rabindra Sangeet', 'Cooking Bengali Food',
  'Durga Puja Organizing', 'Adda (Group Conversations)',
] as const;

export const RELIGIONS = ['Hindu', 'Muslim', 'Christian', 'Buddhist', 'Jain', 'Sikh', 'Other'] as const;

export const CASTE_MAPPING: Record<string, readonly string[]> = {
  Hindu: [
    'Aguri',
    'Baidya',
    'Baishya / Vaishya',
    'Brahmin',
    'Kansari',
    'Kayastha',
    'Mahishya',
    'Namasudra',
    'Rajput',
    'Sadgop',
    'Suri',
    'Tambuli',
    'Tili',
    'Other'
  ],
  Muslim: [
    'Hanafi',
    'Pathan',
    'Shafi',
    'Sheikh',
    'Syed',
    'Other'
  ],
  Christian: [
    'Baptist',
    'Methodist',
    'Orthodox',
    'Protestant',
    'Roman Catholic',
    'Other'
  ],
  Buddhist: [
    'Mahayana',
    'Theravada',
    'Vajrayana',
    'Other'
  ],
  Jain: [
    'Digambara',
    'Shvetambara',
    'Other'
  ],
  Sikh: [
    'Arora',
    'Jat',
    'Khatri',
    'Ramgarhia',
    'Other'
  ],
  Other: ['Other']
} as const;

export const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashirsha', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula',
  'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
] as const;

export const SUBCASTE_MAPPING: Record<string, readonly string[]> = {
  // Hindu
  Brahmin: ['Barendra', 'Bhumihar', 'Kanyakubja', 'Kulin', 'Other', 'Rarhi', 'Saraswat', 'Srotriya', 'Vaidik'],
  Kayastha: ['Bangaja', 'Dakshin Rarh', 'Kulin', 'Maulik', 'Other', 'Uttar Rarh'],
  Baidya: ['Das', 'Gupta', 'Kulin', 'Other', 'Sen'],
  Namasudra: ['Namasudra', 'Other'],
  Mahishya: ['Mahishya', 'Other'],
  Sadgop: ['Sadgop', 'Other'],
  Tili: ['Tili', 'Other'],
  Tambuli: ['Tambuli', 'Other'],
  Suri: ['Suri', 'Other'],
  Kansari: ['Kansari', 'Other'],
  Aguri: ['Ugra Kshatriya', 'Other'],
  Rajput: ['Rajput', 'Other'],
  'Baishya / Vaishya': ['Banik', 'Other', 'Saha'],

  // Muslim
  Sheikh: ['Sheikh', 'Other'],
  Syed: ['Syed', 'Other'],
  Pathan: ['Pathan', 'Other'],
  Hanafi: ['Hanafi', 'Other'],
  Shafi: ['Shafi', 'Other'],

  // Christian
  'Roman Catholic': ['Roman Catholic', 'Other'],
  Protestant: ['Protestant', 'Other'],
  Orthodox: ['Orthodox', 'Other'],
  Baptist: ['Baptist', 'Other'],
  Methodist: ['Methodist', 'Other'],

  // Buddhist
  Mahayana: ['Mahayana', 'Other'],
  Theravada: ['Theravada', 'Other'],
  Vajrayana: ['Vajrayana', 'Other'],

  // Jain
  Digambara: ['Digambara', 'Other'],
  Shvetambara: ['Shvetambara', 'Other'],

  // Sikh
  Arora: ['Arora', 'Other'],
  Jat: ['Jat', 'Other'],
  Khatri: ['Khatri', 'Other'],
  Ramgarhia: ['Ramgarhia', 'Other'],

  // Fallbacks / Other
  Other: ['Other']
} as const;

export const ALL_CASTES: readonly string[] = Array.from(
  new Set(Object.values(CASTE_MAPPING).flat())
);

export const ALL_SUBCASTES: readonly string[] = Array.from(
  new Set(Object.values(SUBCASTE_MAPPING).flat())
);

export const RAASIS = [
  'Mesha (Aries)',
  'Vrishabha (Taurus)',
  'Mithuna (Gemini)',
  'Karka (Cancer)',
  'Simha (Leo)',
  'Kanya (Virgo)',
  'Tula (Libra)',
  'Vrishchika (Scorpio)',
  'Dhanu (Sagittarius)',
  'Makara (Capricorn)',
  'Kumbha (Aquarius)',
  'Meena (Pisces)'
] as const;

export const RAASI_NAKSHATRAS_MAPPING: Record<string, readonly string[]> = {
  'Mesha (Aries)': ['Ashwini', 'Bharani', 'Krittika'],
  'Vrishabha (Taurus)': ['Krittika', 'Rohini', 'Mrigashirsha'],
  'Mithuna (Gemini)': ['Mrigashirsha', 'Ardra', 'Punarvasu'],
  'Karka (Cancer)': ['Punarvasu', 'Pushya', 'Ashlesha'],
  'Simha (Leo)': ['Magha', 'Purva Phalguni', 'Uttara Phalguni'],
  'Kanya (Virgo)': ['Uttara Phalguni', 'Hasta', 'Chitra'],
  'Tula (Libra)': ['Chitra', 'Swati', 'Vishakha'],
  'Vrishchika (Scorpio)': ['Vishakha', 'Anuradha', 'Jyeshtha'],
  'Dhanu (Sagittarius)': ['Mula', 'Purva Ashadha', 'Uttara Ashadha'],
  'Makara (Capricorn)': ['Uttara Ashadha', 'Shravana', 'Dhanishta'],
  'Kumbha (Aquarius)': ['Dhanishta', 'Shatabhisha', 'Purva Bhadrapada'],
  'Meena (Pisces)': ['Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati']
} as const;

export const FIELDS_OF_STUDY = [
  'Computer Science',
  'Information Technology',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Electrical Engineering',
  'Civil Engineering',
  'Business Administration (BBA/MBA)',
  'Commerce (B.Com/M.Com)',
  'Science (B.Sc/M.Sc)',
  'Arts & Humanities (B.A/M.A)',
  'Medicine / Dental (MBBS/BDS)',
  'Pharmacy (B.Pharm/M.Pharm)',
  'Law (LLB/LLM)',
  'Chartered Accountancy (CA)',
  'Other'
] as const;

export const INSTITUTIONS = [
  'IIT Madras',
  'IIT Kharagpur',
  'Jadavpur University',
  'Calcutta University',
  'Anna University',
  'SRM University',
  'VIT University',
  'NIT Trichy',
  'BITS Pilani',
  'St. Xavier\'s College',
  'Presidency University',
  'Other'
] as const;

export const PROFESSIONS = [
  'Software Engineer / Developer',
  'IT Professional',
  'Project Manager',
  'Business Analyst',
  'Doctor / Surgeon',
  'Dentist',
  'Nurse / Healthcare Professional',
  'Teacher / Professor',
  'Chartered Accountant (CA)',
  'Banker / Financial Analyst',
  'Civil Servant / IAS / IPS',
  'Lawyer / Legal Consultant',
  'Architect',
  'HR Professional',
  'Marketing / Sales Executive',
  'Business Owner / Entrepreneur',
  'Homemaker',
  'Other'
] as const;

export const COMPANIES = [
  'TCS (Tata Consultancy Services)',
  'Infosys',
  'Wipro',
  'Cognizant (CTS)',
  'Accenture',
  'IBM',
  'Capgemini',
  'HCLTech',
  'Microsoft',
  'Google',
  'Amazon',
  'Government Sector',
  'Banking Sector',
  'Other'
] as const;

export const WORK_CITIES = [
  'Chennai',
  'Kolkata',
  'Bengaluru',
  'Hyderabad',
  'Mumbai',
  'Pune',
  'Delhi NCR',
  'Noida',
  'Gurugram',
  'Coimbatore',
  'Madurai',
  'Trichy',
  'Salem',
  'Other'
] as const;

export const CHENNAI_ZONES = [
  'North Chennai (Tondiarpet, Royapuram, Thiru. Vi. Ka Nagar)',
  'Central Chennai (Anna Nagar, Teynampet, Kodambakkam)',
  'South Chennai (Adyar, Velachery, Sholinganallur)',
  'West Chennai (Ambattur, Valasaravakkam, Alandur)',
  'Suburbs (Tambaram, Avadi, Pallavaram)',
];

export const ESEVA_CENTRES_CHENNAI = [
  { id: 1, name: 'e-Seva Centre, Ripon Building', address: 'Ripon Building Campus, Chennai Corporation, Park Town, Chennai', type: 'Arasu e-Seva', zone: 'Central Chennai', phone: '1100 (Toll Free)' },
  { id: 2, name: 'e-Seva Centre, Tondiarpet Zonal Office', address: 'No. 266, Tiruvottiyur High Road, Tondiarpet, Chennai', type: 'Arasu e-Seva', zone: 'North Chennai', phone: '1100 (Toll Free)' },
  { id: 3, name: 'e-Seva Centre, Adyar Zonal Office', address: 'No. 115, Dr. Muthulakshmi Salai, Adyar, Chennai', type: 'Arasu e-Seva', zone: 'South Chennai', phone: '1100 (Toll Free)' },
  { id: 4, name: 'e-Seva Centre, Ambattur Zonal Office', address: 'No. 536, CTH Road, Ambattur, Chennai', type: 'Arasu e-Seva', zone: 'West Chennai', phone: '1100 (Toll Free)' },
  { id: 5, name: 'e-Seva Centre, Tambaram Taluk Office', address: 'Taluk Office Campus, GST Road, Tambaram', type: 'Arasu e-Seva', zone: 'Suburbs', phone: '1100 (Toll Free)' },
  { id: 6, name: 'e-Seva Centre, Anna Nagar Zonal Office', address: '2nd Avenue, Anna Nagar East, Chennai', type: 'Arasu e-Seva', zone: 'Central Chennai', phone: '1100 (Toll Free)' },
];

export const MAJOR_DISTRICTS = ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'];

export const ESEVA_CENTRES = [
  // Chennai (existing)
  { id: 1, name: 'e-Seva Centre, Ripon Building', address: 'Ripon Building Campus, Chennai Corporation, Park Town, Chennai', type: 'Arasu e-Seva', city: 'Chennai', phone: '1100 (Toll Free)' },
  { id: 2, name: 'e-Seva Centre, Tondiarpet Zonal Office', address: 'No. 266, Tiruvottiyur High Road, Tondiarpet, Chennai', type: 'Arasu e-Seva', city: 'Chennai', phone: '1100 (Toll Free)' },
  { id: 3, name: 'e-Seva Centre, Adyar Zonal Office', address: 'No. 115, Dr. Muthulakshmi Salai, Adyar, Chennai', type: 'Arasu e-Seva', city: 'Chennai', phone: '1100 (Toll Free)' },
  { id: 4, name: 'e-Seva Centre, Ambattur Zonal Office', address: 'No. 536, CTH Road, Ambattur, Chennai', type: 'Arasu e-Seva', city: 'Chennai', phone: '1100 (Toll Free)' },
  { id: 5, name: 'e-Seva Centre, Tambaram Taluk Office', address: 'Taluk Office Campus, GST Road, Tambaram', type: 'Arasu e-Seva', city: 'Chennai', phone: '1100 (Toll Free)' },
  { id: 6, name: 'e-Seva Centre, Anna Nagar Zonal Office', address: '2nd Avenue, Anna Nagar East, Chennai', type: 'Arasu e-Seva', city: 'Chennai', phone: '1100 (Toll Free)' },
  
  // Coimbatore
  { id: 7, name: 'e-Seva Centre, Collectorate', address: 'Collectorate Complex, Coimbatore', type: 'Arasu e-Seva', city: 'Coimbatore', phone: '1100 (Toll Free)' },
  { id: 8, name: 'e-Seva Centre, Corporation Office', address: 'Town Hall, Coimbatore', type: 'Arasu e-Seva', city: 'Coimbatore', phone: '1100 (Toll Free)' },
  
  // Madurai
  { id: 9, name: 'e-Seva Centre, District Collectorate', address: 'Collectorate, Madurai', type: 'Arasu e-Seva', city: 'Madurai', phone: '1100 (Toll Free)' },
  { id: 10, name: 'e-Seva Centre, Tallakulam', address: 'Tallakulam, Madurai', type: 'Arasu e-Seva', city: 'Madurai', phone: '1100 (Toll Free)' },
  
  // Tiruchirappalli
  { id: 11, name: 'e-Seva Centre, Cantonment', address: 'Cantonment, Tiruchirappalli', type: 'Arasu e-Seva', city: 'Tiruchirappalli', phone: '1100 (Toll Free)' },
  
  // Salem
  { id: 12, name: 'e-Seva Centre, Salem Corporation', address: 'Salem Corporation Office, Salem', type: 'Arasu e-Seva', city: 'Salem', phone: '1100 (Toll Free)' },
];

export const GOTRAS = [
  'Bhr̥gu (Jamadagni)',
  'Bhārgava',
  'Cyāvana',
  'Aurva',
  'Jāmadagnya',
  'Vātsa',
  'Kevala Bhr̥gu',
  'Daivodāsa',
  'Vainya',
  'Pārtha',
  'Śaunaka',
  'Gārtsamada',
  'Gautama',
  'Āṅgirasa',
  'Kākṣīvata',
  'Dairghatamasa',
  'Auśanasa',
  'Bharadvāja',
  'Bārhaspatya',
  'Bhāradvāja',
  'Gārgya',
  'Kevala Aṅgiras',
  'Āmbarīṣa',
  'Māndhātra',
  'Kautsa',
  'Kāṇva',
  'Maudgalya',
  'Sāṁkr̥tya',
  'Śāktya',
  'Atri',
  'Ātreya',
  'Viśvāmitra',
  'Vaiśvāmitra',
  'Daivarāta',
  'Mādhucchandasa',
  'Kauśika',
  'Gāthina',
  'Aindra',
  'Kaśyapa',
  'Kāśyapa',
  'Āvatsāra',
  'Āsita',
  'Śāṇḍila',
  'Daivala',
  'Vasiṣṭha',
  'Vāsiṣṭha',
  'Maitrāvaruṇa',
  'Aupamanyava',
  'Pārāśarya',
  'Agastya',
  'Āgastya',
  'Other',
] as const;

export const PARENT_OCCUPATIONS = [
  'Business / Entrepreneur',
  'Government Service / PSU',
  'Private Sector Service',
  'Retired',
  'Homemaker / Housewife',
  'Teacher / Professor / Academic',
  'Doctor / Healthcare Professional',
  'Software / IT Professional',
  'Civil Servant / Administrative',
  'Defense / Police / Armed Forces',
  'Lawyer / Legal Consultant',
  'Chartered Accountant / Financial Professional',
  'Banker / Financial Sector',
  'Real Estate / Construction',
  'Agriculture / Farming',
  'Merchant Navy / Aviation',
  'Passed Away / Late',
  'Other',
] as const;

