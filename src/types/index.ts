/* ──────────────── Role & Permission Types ──────────────── */

export type UserRole = 'user' | 'admin' | 'superadmin';

export type PermissionLevel = 'none' | 'view' | 'edit' | 'manage';

export type ModuleKey =
  | 'stay'
  | 'food'
  | 'emergency'
  | 'community'
  | 'services'
  | 'blog'
  | 'users'
  | 'matrimony'
  | 'blood_bank'
  | 'events'
  | 'ambulance'
  | 'government_services'
  | 'legal'
  | 'travel';

export type ModulePermissions = Record<ModuleKey, PermissionLevel>;

export interface UserProfile {
  uid: string;
  email: string;
  phone?: string;
  full_name: string;
  dob?: string;
  gender?: string;
  address?: string;
  assigned_hospitals?: string[];
  bengali_name?: string;
  avatar_url?: string;
  role: UserRole;
  permissions: ModulePermissions;
  created_at: string;
  updated_at: string;
  created_by?: string;
  is_active: boolean;
  phone_verified?: boolean;
  email_verified?: boolean;
  is_first_login?: boolean;
}

/* ──────────────── Module Labels (for UI) ──────────────── */

export const MODULE_LABELS: Record<ModuleKey, string> = {
  stay: 'Stay & Accommodation',
  food: 'Bengali Food & Sweets',
  emergency: 'Hospital Management',
  community: 'Community',
  services: 'Colleges and Schools',
  blog: 'Blog Posts',
  users: 'User Management',
  matrimony: 'Matrimonial',
  blood_bank: 'Blood Banks',
  events: 'Events & Festivals',
  ambulance: 'Ambulance Directory',
  government_services: 'Government Services',
  legal: 'Legal Services',
  travel: 'Travel',
};

/* ──────────────── Government Service Data Model ──────────────── */

export interface GovernmentServiceItem {
  id: string;
  title: string;
  category: 'identity' | 'civic' | 'welfare' | 'transport' | 'police' | 'passport' | 'other';
  description: string;
  official_url?: string;
  online_portal_name?: string;
  offline_centres?: string[];
  documents_required?: string[];
  fees?: string;
  processing_time?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

/* ──────────────── Data Models ──────────────── */

export type LegalItemType = 'centre' | 'helpline' | 'category' | 'portal';

export interface LegalServiceBase {
  id: string;
  type: LegalItemType;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
}

export interface LegalAidCentre extends LegalServiceBase {
  type: 'centre';
  name: string;
  address: string;
  city: string;
  district?: string;
  phone?: string;
  timings?: string;
  centre_type: string;
  google_maps_url?: string;
}

export interface LegalHelpline extends LegalServiceBase {
  type: 'helpline';
  label: string;
  number: string;
  color?: string;
}

export interface LegalCategory extends LegalServiceBase {
  type: 'category';
  label: string;
  icon_name: string;
  color: string;
  description: string;
  steps: { title: string; desc: string }[];
  portals: { label: string; url: string; desc: string }[];
  helplines?: { label: string; number: string }[];
}

export interface LegalPortal extends LegalServiceBase {
  type: 'portal';
  label: string;
  url: string;
  desc: string;
  icon_name: string;
}

export interface LegalServiceListing {
  id: string;
  category: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  city?: string;
  district?: string;
  google_maps_url?: string;
  timings?: string;
  description?: string;
  verified?: boolean;
  created_at?: string;
  updated_at?: string;
}

export type LegalServiceItem = LegalAidCentre | LegalHelpline | LegalCategory | LegalPortal | LegalServiceListing;

export interface Listing {
  id: string;
  type: 'pg' | 'hotel' | 'rental' | 'rental-house';
  name: string;
  description?: string;
  city: string;
  area: string;
  address?: string;
  price_per_month?: number;
  room_type?: 'single' | 'double' | 'triple';
  gender?: 'male' | 'female' | 'mixed';
  amenities: string[];
  bengali_friendly: boolean;
  bengali_food: boolean;
  owner_name?: string;
  owner_phone?: string;
  owner_whatsapp?: string;
  google_maps_url?: string;
  map_embed_code?: string;
  rating?: string | number;
  lat?: number;
  lng?: number;
  images: string[];
  image_url?: string;
  verified: boolean;
  available_rooms?: number;
  deposit_amount?: number;
  accommodation_type?: 'PG' | 'Hotel' | 'Service Apartment' | 'Rental House';
  contact_person_name?: string;
  contact_whatsapp?: string;
  contact_email?: string;
  contact_phone?: string;
  price_range?: string;
  price_daily?: number;
  price_monthly?: number;
  website_link?: string;
  nearby_hospital?: string;
  landmark?: string;
  created_at: string;
}

export interface FoodListing {
  id: string;
  name: string;
  type?: 'restaurant' | 'sweets' | 'tiffin' | 'delivery partner' | 'cloud kitchen';
  city: string;
  area: string;
  address?: string;
  pincode?: string;
  phone?: string;
  whatsapp?: string;
  rating?: string | number;
  google_maps_url?: string;
  map_embed_code?: string;
  magicpin_url?: string;
  dunzo_url?: string;
  eatsure_url?: string;
  uber_eats_url?: string;
  lat?: number;
  lng?: number;
  specialties: string[];
  zomato_url?: string;
  swiggy_url?: string;
  images?: string[];
  image_url?: string;
  verified: boolean;
  bengali_friendly?: boolean;
  created_at?: string;
}

export interface Hospital {
  id: string;
  name: string;
  city: string;
  state?: string;
  district?: string;
  area?: string;
  address?: string;
  pincode?: string;
  phone?: string;
  emergency_phone?: string;
  specializations: string[];
  is_24_7: boolean;
  has_bengali_doctor: boolean;
  has_bengali_staff?: boolean;
  google_maps_url?: string;
  lat?: number;
  lng?: number;
  created_at: string;
  // New Enhanced Fields
  website?: string;
  email?: string;
  description?: string;
  main_branch?: boolean;
  images?: string[];
  image_url?: string;
  updated_at?: string;
  category?: 'Government' | 'Private';
  status?: 'Active' | 'Inactive';
}

export interface BengaliDoctor {
  id: string;
  doctor_name: string;
  specialization: string;
  designation?: string;
  department?: string;
  hospital_id?: string; // Keep for compatibility but deprecating in favor of hospital_ids
  hospital_ids?: string[];
  experience: string;
  qualifications?: string[];
  languages: string[];
  consultation_timings?: string;
  photo: string;
  phone: string;
  email: string;
  google_rating?: number;
  google_review_count?: number;
  google_review_url?: string;
  google_review_link?: string;
  instagram_url?: string;
  facebook_url?: string;
  social_links?: {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    x?: string;
  };
  created_at?: string;
  updated_at?: string;
  otp_required?: boolean;
}

export interface BengaliStaff {
  id: string;
  name: string;
  photo: string;
  hospital_id: string;
  department: string;
  role: string;
  designation?: string;
  languages: string[];
  phone: string;
  email: string;
  experience: string;
  availability: string;
  description: string;
  instagram_url?: string;
  facebook_url?: string;
  social_links?: {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    x?: string;
  };
  created_at?: string;
  updated_at?: string;
  otp_required?: boolean;
}

export interface BloodBank {
  id: string;
  name: string;
  city: string;
  address?: string;
  phone?: string;
  available_groups?: string[];
  google_maps_url?: string;
  website?: string;
  coordinator_name?: string;
  whatsapp_url?: string;
  lat?: number;
  lng?: number;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Ambulance {
  id: string;
  name: string;
  city: string;
  phone?: string;
  address?: string;
  google_maps_url?: string;
  website?: string;
  image_url?: string;
  unit_type?: string;
  eta?: string;
  equipment?: string;
  base_rate?: string;
  sub_category?: string; // e.g. private, government
  type_mode?: string;
  source_notes?: string;
  created_at?: string;
  updated_at?: string;

  // Premium category fields
  main_category?: 'flight' | 'local' | 'train';
  size_category?: 'small' | 'medium' | 'large';
  approx_cost?: string;
  specialization?: string;
  
  // Boolean flags for features/displays
  icu_ambulance?: boolean;
  cardiac_ambulance?: boolean;
  neonatal_ambulance?: boolean;
  ventilator_ambulance?: boolean;
  nurse_support?: boolean;
  multi_specialty?: boolean;
  
  // Additional services flags
  patient_shifting?: boolean;
  dead_body_transport?: boolean;
  tn_to_wb?: boolean;
  wb_to_tn?: boolean;
}

export interface CommunityGroup {
  id: string;
  name: string;
  image_url?: string;
  platform?: 'whatsapp' | 'telegram' | 'facebook' | 'instagram' | 'linkedin' | 'website' | 'discord';
  city?: string;
  state?: string;
  description?: string;
  member_count?: number;
  join_url?: string;
  whatsapp_url?: string;
  telegram_url?: string;
  discord_url?: string;
  instagram_url?: string;
  facebook_url?: string;
  linkedin_url?: string;
  website_url?: string;
  category?: string;
}

export interface MatrimonialProfile {
  id: string;
  user_id: string;
  profile_id?: string; // e.g. PB-0001
  profile_for?: string; // added

  // Personal
  full_name?: string;
  date_of_birth?: string;
  age?: number;
  gender?: string;
  height?: string;
  weight?: string;
  complexion?: string;
  blood_group?: string;
  marital_status?: string;
  mother_tongue?: string;
  physical_disability?: string;

  // Location
  city?: string; // Current city in TN
  native_district?: string; // District in West Bengal

  // Family
  father_name?: string;
  father_occupation?: string;
  mother_name?: string;
  mother_occupation?: string;
  siblings?: string;
  family_type?: string;
  family_values?: string;
  family_status?: string;

  // Education & Career
  education?: string;
  field_of_study?: string;
  institution?: string;
  profession?: string;
  company?: string;
  annual_income?: string;
  work_city?: string;

  // Religious & Cultural
  religion?: string;
  caste?: string;
  sub_caste?: string;
  gotra?: string;
  manglik?: string;
  raasi?: string;
  star?: string;

  // Lifestyle
  diet?: string;
  smoking?: string;
  drinking?: string;
  hobbies?: string[];

  // About
  about_me?: string;

  // Partner Preferences
  partner_preference?: string;
  pref_age_range?: string;
  pref_height_range?: string;
  pref_age_min?: number;
  pref_age_max?: number;
  pref_height_min?: string;
  pref_height_max?: string;
  pref_education?: string;
  pref_profession?: string;
  pref_city?: string;
  pref_income_min?: string;
  pref_diet?: string;
  pref_marital_status?: string;

  // Contact
  phone?: string;
  email?: string;
  whatsapp?: string;
  social_handle?: string;

  // Photos & Videos
  profile_photo?: string;
  profile_picture_index?: number;
  photos?: string[];
  video?: string;

  // System
  verified: boolean;
  published: boolean;
  status?: 'draft' | 'pending' | 'approved' | 'rejected' | 'married' | 'verified';
  contact_visible_after_login: boolean;
  created_at: string;
  updated_at?: string;
}

export interface BengaliForum {
  name: string;
  link: string;
}

export interface CollegeStaffContact {
  name: string;
  role: 'lecturer' | 'staff';
  department: string;
  phone: string;
  email: string;
}

export interface College {
  id: string;
  category?: 'college' | 'school';
  name: string;
  type?: 'engineering' | 'medical' | 'arts_science' | 'cbse' | 'icse' | 'kv';
  city?: string;
  area?: string;
  address?: string;
  phone?: string;
  website?: string;
  google_maps_url?: string;
  lat?: number;
  lng?: number;
  ranking?: number;
  image_url?: string;
  bengali_forums?: BengaliForum[];
  staff_contacts?: CollegeStaffContact[];
}

export interface CommunityEvent {
  id: string;
  title: string;
  description?: string;
  event_date?: string;
  city?: string;
  venue?: string;
  location?: string;
  organizer?: string;
  contact?: string;
  image_url?: string;
  category?: string;
  community_group_id?: string;
  booking_url?: string;
  google_maps_url?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  cover_image?: string;
  author?: string;
  tags: string[];
  published: boolean;
  created_at: string;
}

export interface Pharmacy {
  id: string;
  name: string; // Pharmacy Name
  government_level: 'Central Government' | 'State Government'; // Government Level (Strictly Government)
  scheme_name: string; // Scheme Name: e.g. "PMBJP – Pradhan Mantri Bhartiya Janaushadhi Pariyojana" or "Mudhalvar Marundhagam"
  pharmacy_type?: string; // Pharmacy Type: e.g. "Jan Aushadhi Kendra" or "Mudhalvar Marundhagam"
  medicine_name?: string; // Medicine Name
  mrp?: number; // MRP
  offer_price?: number; // Offer Price
  stock?: string | number; // Stock status or quantity
  state?: string; // State (e.g. Tamil Nadu)
  district?: string; // District
  city: string; // City
  area?: string; // Area
  pin_code?: string; // PIN Code
  address: string;
  hospital_id?: string;
  hospital_name?: string;
  phone?: string;
  email?: string;
  opening_time?: string;
  closing_time?: string;
  is_24_7?: boolean;
  home_delivery?: boolean;
  languages?: string[];
  services?: string[];
  description?: string;
  image_url?: string;
  google_maps_url?: string;
  created_at?: string;
}

export interface HospitalReview {
  id: string;
  hospital_id: string;
  hospital_name?: string;
  user_id?: string;
  user_name: string;
  user_avatar?: string;
  is_verified?: boolean;
  hospital_rating: number;
  website_rating: number;
  category: 'Hospital Services' | 'Doctors & Staff' | 'Cleanliness' | 'Facilities' | 'Website Experience' | 'Other';
  comment: string;
  created_at: string;
}

