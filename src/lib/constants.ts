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
    { name: 'IIT Madras', area: 'Guindy' },
    { name: 'Anna University', area: 'Guindy' },
    { name: 'SRM Institute', area: 'Potheri' },
    { name: 'Madras Medical College', area: 'Park Town' },
    { name: 'Loyola College', area: 'Nungambakkam' },
    { name: 'Stella Maris College', area: 'Cathedral Road' },
    { name: 'Sathyabama University', area: 'Sholinganallur' },
  ],
  Vellore: [
    { name: 'VIT University', area: 'Katpadi' },
    { name: 'CMC Vellore', area: 'CMC Campus' },
  ],
  Coimbatore: [
    { name: 'PSG College of Technology', area: 'Peelamedu' },
    { name: 'Amrita Vishwa Vidyapeetham', area: 'Ettimadai' },
    { name: 'Coimbatore Medical College', area: 'Avinashi Road' },
  ],
  Madurai: [
    { name: 'Madurai Kamaraj University', area: 'Palkalai Nagar' },
    { name: 'Thiagarajar College of Engg', area: 'Thiruparankundram' },
  ],
  Tiruchirappalli: [
    { name: 'NIT Trichy', area: 'Thuvakudi' },
    { name: 'Bharathidasan University', area: 'Palkalaiperur' },
  ],
  Salem: [
    { name: 'Periyar University', area: 'Periyar Nagar' },
    { name: 'Vinayaka Missions University', area: 'Ariyanoor' },
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

export const COLLEGE_TYPES = ['engineering', 'medical', 'arts', 'management', 'polytechnic'] as const;

export const EVENT_CATEGORIES = ['festival', 'cultural', 'social', 'religious'] as const;

export const TREATMENT_TYPES = [
  'Cardiology', 'Orthopedic', 'General Medicine', 'ENT',
  'Gynecology', 'Pediatrics', 'Dental', 'Emergency',
] as const;

export const GOVT_SERVICES = [
  { id: 'ration-card', title: 'Ration Card (PDS)', description: 'Apply for or update your ration card for subsidized food grains.', category: 'Ration card', url: 'https://www.tnpds.gov.in/', icon: 'Home01' },
  { id: 'aadhaar', title: 'Aadhaar Update / Enrolment', description: 'Update your Aadhaar address or biometrics at nearest centre.', category: 'Aadhaar', url: 'https://uidai.gov.in/', icon: 'User01' },
  { id: 'driving-licence', title: 'Driving Licence (TN)', description: 'Apply or renew your driving licence in Tamil Nadu.', category: 'Transport', url: 'https://parivahan.gov.in/', icon: 'Car01' },
  { id: 'ayushman-bharat', title: 'Ayushman Bharat', description: 'Government health insurance covering ₹5 lakh per year per family.', category: 'Health schemes', url: 'https://pmjay.gov.in/', icon: 'MedicalCross' },
  { id: 'mgnregs', title: 'MGNREGS Job Card', description: 'Register for 100 days guaranteed employment scheme.', category: 'Employment', url: 'https://nrega.nic.in/', icon: 'Users01' },
  { id: 'tn-e-seva', title: 'TN e-Seva Portal', description: 'One-stop portal for various Tamil Nadu government services.', category: 'Government', url: 'https://www.tnesevai.tn.gov.in/', icon: 'Building01' },
  { id: 'passport', title: 'Passport Seva', description: 'Apply for a new passport or renew existing one.', category: 'Travel', url: 'https://passportindia.gov.in/', icon: 'Map01' },
  { id: 'visa', title: 'Visa Services', description: 'Apply for an Indian Visa, e-Visa, or check application status online.', category: 'Travel', url: 'https://indianvisaonline.gov.in/', icon: 'Globe01' },
  { id: 'voter-id', title: 'Voter ID (EPIC)', description: 'Register as a voter or update your electoral details.', category: 'Election', url: 'https://voters.eci.gov.in/', icon: 'UserCheck01' },
  { id: 'police-verification', title: 'Police Verification (Cyber Crime)', description: 'Direct link to the Cyber Crime Portal for police verification, reporting cyber fraud and safety checks.', category: 'Safety', url: 'https://cybercrime.gov.in/', icon: 'Shield01' },
  { id: 'biometrics', title: 'Aadhaar Biometric Services', description: 'Lock or unlock your Aadhaar biometrics online for enhanced security.', category: 'Aadhaar', url: 'https://myaadhaar.uidai.gov.in/', icon: 'Shield01' },
  { id: 'labour-registration', title: 'TN Labour Registration', description: 'Register as a migrant worker with the Tamil Nadu Labour Department.', category: 'Employment', url: 'https://labour.tn.gov.in/', icon: 'Users01' },
  { id: 'esic-pf', title: 'ESIC / PF Registration', description: 'Employee health insurance (ESIC) and provident fund (EPFO) portals.', category: 'Employment', url: 'https://www.esic.gov.in/', icon: 'Briefcase01' },
  { id: 'scholarships', title: 'Scholarship Schemes', description: 'Central and state scholarship schemes for students from economically weaker sections.', category: 'Education', url: 'https://scholarships.gov.in/', icon: 'GraduationHat01' },
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

export const MARITAL_STATUSES = ['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce'] as const;

export const COMPLEXIONS = ['Very Fair', 'Fair', 'Wheatish', 'Wheatish Brown', 'Dark'] as const;

export const FAMILY_TYPES = ['Joint', 'Nuclear', 'Semi-Joint'] as const;
export const FAMILY_VALUES = ['Orthodox', 'Moderate', 'Liberal'] as const;
export const FAMILY_STATUS = ['Middle Class', 'Upper Middle Class', 'Rich', 'Affluent'] as const;

export const DIET_TYPES = ['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan'] as const;

export const EDUCATION_LEVELS = [
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

