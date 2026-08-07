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
  { id: 'voter-id', title: 'Voter ID (EPIC)', description: 'Register as a voter or update your electoral details.', category: 'Election', url: 'https://voters.eci.gov.in/', icon: 'UserCheck01' },
  { id: 'police-verification', title: 'Police Verification (Tenants)', description: 'Mandatory police verification for tenants and migrants in Tamil Nadu.', category: 'Safety', url: 'https://eservices.tnpolice.gov.in/', icon: 'Shield01' },
  { id: 'ration-card', title: 'Ration Card (PDS)', description: 'Apply for or update your ration card for subsidized food grains.', category: 'Ration card', url: '/services/government/ration-card', icon: 'Home01' },
  { id: 'aadhaar', title: 'Aadhaar Update / Enrolment', description: 'Update your Aadhaar address or biometrics at nearest centre.', category: 'Aadhaar', url: '/services/government/aadhaar', icon: 'User01' },
  { id: 'biometrics', title: 'Aadhaar Biometric Services', description: 'Lock or unlock your Aadhaar biometrics online for enhanced security.', category: 'Aadhaar', url: '/services/government/biometrics', icon: 'Shield01' },
  { id: 'driving-licence', title: 'Driving Licence (TN)', description: 'Apply or renew your driving licence in Tamil Nadu.', category: 'Transport', url: '/services/government/driving-licence', icon: 'Car01' },
  { id: 'ayushman-bharat', title: 'Ayushman Bharat', description: 'Government health insurance covering ₹5 lakh per year per family.', category: 'Health schemes', url: '/services/government/ayushman-bharat', icon: 'MedicalCross' },
  { id: 'mgnregs', title: 'MGNREGS Job Card', description: 'Register for 100 days guaranteed employment scheme.', category: 'Employment', url: 'https://nrega.nic.in/netnrega/statepage.aspx?Page=C&Action=A', icon: 'Users01' },
  { id: 'tn-e-seva', title: 'TN e-Seva Portal', description: 'One-stop portal for various Tamil Nadu government services.', category: 'Government', url: 'https://www.tnesevai.tn.gov.in/Citizen/Registration.aspx', icon: 'Building01' },
  { id: 'passport', title: 'Passport Seva', description: 'Apply for a new passport or renew existing one.', category: 'Travel', url: '/services/government/passport', icon: 'Map01' },
  { id: 'visa', title: 'Visa Services', description: 'Apply for an Indian Visa, e-Visa, or check application status online.', category: 'Travel', url: '/services/government/visa', icon: 'Globe01' },
  { id: 'voter-id', title: 'Voter ID (EPIC)', description: 'Register as a voter or update your electoral details.', category: 'Election', url: '/services/government/voter-id', icon: 'UserCheck01' },
  { id: 'police-verification', title: 'Register a Complaint (Police & Cyber Crime)', description: 'Direct link to the Cyber Crime Portal to register complaints, report cyber fraud, request police verification and safety checks.', category: 'Safety', url: '/services/government/police-verification', icon: 'Shield01' },
  { id: 'labour-registration', title: 'TN Labour Registration', description: 'Register as a migrant worker with the Tamil Nadu Labour Department.', category: 'Employment', url: 'https://labour.tn.gov.in/', icon: 'Users01' },
  { id: 'esic-pf', title: 'ESIC / PF Registration', description: 'Employee health insurance (ESIC) and provident fund (EPFO) portals.', category: 'Employment', url: 'https://www.esic.gov.in/', icon: 'Briefcase01' },
  { id: 'scholarships', title: 'Scholarship Schemes', description: 'Central and state scholarship schemes for students from economically weaker sections.', category: 'Education', url: 'https://scholarships.gov.in/', icon: 'GraduationHat01' },
];

export const TAMIL_WORDS = [
  { tamil: 'Vanakkam', meaning: 'Hello / Welcome', script: 'வணக்கம்', benPron: 'বনক্কম', benMean: 'স্বাগতম / নমস্কার' },
  { tamil: 'Nandri', meaning: 'Thank you', script: 'நன்றி', benPron: 'নন্দ্রি', benMean: 'ধন্যবাদ' },
  { tamil: 'Evvalavu', meaning: 'How much?', script: 'எவ்வளவு?', benPron: 'এভভলবু', benMean: 'কত দাম?' },
  { tamil: 'Eppo varum?', meaning: 'When will it come?', script: 'எப்போ வரும்?', benPron: 'এপ্পো ভরুম', benMean: 'কখন আসবে?' },
  { tamil: 'Enge irukku?', meaning: 'Where is it?', script: 'எங்கே இருக்கு?', benPron: 'এঙ্গে ইরুক্কু', benMean: 'কোথায় আছে?' },
  { tamil: 'Kaasu', meaning: 'Money', script: 'காசு', benPron: 'কাসু', benMean: 'টাকা / পয়সা' },
  { tamil: 'Auto varumo?', meaning: 'Will auto come?', script: 'ஆட்டோ வருமா?', benPron: 'আটো ভরুমা', benMean: 'অটো কি আসবে?' },
  { tamil: 'Thanni venum', meaning: 'I need water', script: 'தண்ணி வேணும்', benPron: 'তন্নি ভেনুম', benMean: 'আমার জল লাগবে' },
  { tamil: 'Saapadu', meaning: 'Food / Meal', script: 'சாப்பாடு', benPron: 'সাপ্পাড়ু', benMean: 'খাবার / ভাত' },
  { tamil: 'Bus nilayam', meaning: 'Bus station', script: 'பஸ் நிலையம்', benPron: 'বাস নিলায়ম', benMean: 'বাস স্টেশন' },
  { tamil: 'Maruthuvamani', meaning: 'Hospital', script: 'மருத்துவமனை', benPron: 'মরুথুবামনাই', benMean: 'হাসপাতাল' },
  { tamil: 'Udavi', meaning: 'Help!', script: 'உதவி!', benPron: 'উদভি', benMean: 'সাহায্য!' },
  { tamil: 'Veetuku poganum', meaning: 'I need to go home', script: 'வீட்டுக்கு போகணும்', benPron: 'ভীটুকু পোগানুম', benMean: 'আমি বাড়ি যেতে চাই' },
  { tamil: 'Romba nalla irukku', meaning: 'Very good!', script: 'ரொம்ப நல்லா இருக்கு', benPron: 'রোম্বা নাল্লা ইরুক্কু', benMean: 'খুব ভালো!' },
  { tamil: 'Puriyala', meaning: 'I don\'t understand', script: 'புரியல', benPron: 'পুরিয়ালা', benMean: 'বুঝতে পারছি না' },
  { tamil: 'Oru nimisham', meaning: 'One moment', script: 'ஒரு நிமிஷம்', benPron: 'ওরু নিমিশম', benMean: 'এক মিনিট' },
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
