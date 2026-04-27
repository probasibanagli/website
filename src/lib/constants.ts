export const CITIES = [
  'Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 'Vellore', 'Tiruppur', 'Erode',
];

export const LISTING_TYPES = ['pg', 'hotel', 'rental'] as const;
export type ListingType = (typeof LISTING_TYPES)[number];

export const FOOD_TYPES = ['restaurant', 'sweets', 'tiffin', 'delivery'] as const;
export type FoodType = (typeof FOOD_TYPES)[number];

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
  { id: 'ration-card', title: 'Ration Card (PDS)', description: 'Apply for or update your ration card for subsidized food grains.', category: 'Ration card', url: 'https://www.tnpds.gov.in/', icon: '🍚' },
  { id: 'aadhaar', title: 'Aadhaar Update / Enrolment', description: 'Update your Aadhaar address or biometrics at nearest centre.', category: 'Aadhaar', url: 'https://uidai.gov.in/', icon: '🪪' },
  { id: 'driving-licence', title: 'Driving Licence (TN)', description: 'Apply or renew your driving licence in Tamil Nadu.', category: 'Transport', url: 'https://parivahan.gov.in/', icon: '🚗' },
  { id: 'ayushman-bharat', title: 'Ayushman Bharat', description: 'Government health insurance covering ₹5 lakh per year per family.', category: 'Health schemes', url: 'https://pmjay.gov.in/', icon: '🏥' },
  { id: 'mgnregs', title: 'MGNREGS Job Card', description: 'Register for 100 days guaranteed employment scheme.', category: 'Employment', url: 'https://nrega.nic.in/', icon: '👷' },
  { id: 'tn-e-seva', title: 'TN e-Seva Portal', description: 'One-stop portal for various Tamil Nadu government services.', category: 'Government', url: 'https://www.tnesevai.tn.gov.in/', icon: '🏛️' },
  { id: 'passport', title: 'Passport Seva', description: 'Apply for a new passport or renew existing one.', category: 'Travel', url: 'https://passportindia.gov.in/', icon: '✈️' },
  { id: 'voter-id', title: 'Voter ID (EPIC)', description: 'Register as a voter or update your electoral details.', category: 'Education', url: 'https://voters.eci.gov.in/', icon: '🗳️' },
];

export const TAMIL_WORDS = [
  { tamil: 'Vanakkam', meaning: 'Hello / Welcome', script: 'வணக்கம்' },
  { tamil: 'Nandri', meaning: 'Thank you', script: 'நன்றி' },
  { tamil: 'Evvalavu', meaning: 'How much?', script: 'எவ்வளவு?' },
  { tamil: 'Eppo varum?', meaning: 'When will it come?', script: 'எப்போ வரும்?' },
  { tamil: 'Enge irukku?', meaning: 'Where is it?', script: 'எங்கே இருக்கு?' },
  { tamil: 'Kaasu', meaning: 'Money', script: 'காசு' },
  { tamil: 'Auto varumo?', meaning: 'Will auto come?', script: 'ஆட்டோ வருமா?' },
  { tamil: 'Thanni venum', meaning: 'I need water', script: 'தண்ணி வேணும்' },
];
