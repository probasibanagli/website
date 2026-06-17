/* ──────────────── Role & Permission Types ──────────────── */

export type UserRole = 'user' | 'admin' | 'superadmin';

export type PermissionLevel = 'none' | 'view' | 'edit' | 'manage';

export type ModuleKey =
  | 'stay'
  | 'food'
  | 'travel'
  | 'emergency'
  | 'community'
  | 'services'
  | 'blog'
  | 'users';

export type ModulePermissions = Record<ModuleKey, PermissionLevel>;

export interface UserProfile {
  uid: string;
  email: string;
  phone?: string;
  full_name: string;
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
}

/* ──────────────── Module Labels (for UI) ──────────────── */

export const MODULE_LABELS: Record<ModuleKey, string> = {
  stay: 'Stay & Accommodation',
  food: 'Bengali Food & Sweets',
  travel: 'Travel & Transport',
  emergency: 'Emergency Services',
  community: 'Community',
  services: 'Campus & Government',
  blog: 'Blog Posts',
  users: 'User Management',
};

/* ──────────────── Data Models ──────────────── */

export interface Listing {
  id: string;
  type: 'pg' | 'hotel' | 'rental';
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
  lat?: number;
  lng?: number;
  images: string[];
  verified: boolean;
  available_rooms?: number;
  deposit_amount?: number;
  created_at: string;
}

export interface FoodListing {
  id: string;
  name: string;
  type?: 'restaurant' | 'sweets' | 'tiffin' | 'delivery partner';
  city: string;
  area: string;
  address?: string;
  pincode?: string;
  phone?: string;
  whatsapp?: string;
  google_maps_url?: string;
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
  verified: boolean;
  bengali_friendly?: boolean;
  created_at?: string;
}

export interface Hospital {
  id: string;
  name: string;
  city: string;
  area?: string;
  address?: string;
  phone?: string;
  emergency_phone?: string;
  specializations: string[];
  is_24_7: boolean;
  has_bengali_doctor: boolean;
  google_maps_url?: string;
  lat?: number;
  lng?: number;
  created_at: string;
}

export interface BloodBank {
  id: string;
  name: string;
  city: string;
  address?: string;
  phone?: string;
  available_groups: string[];
  google_maps_url?: string;
  lat?: number;
  lng?: number;
}

export interface CommunityGroup {
  id: string;
  name: string;
  platform?: 'whatsapp' | 'telegram' | 'facebook' | 'instagram' | 'linkedin' | 'website';
  city?: string;
  region?: 'tamil_nadu' | 'india' | 'all';
  description?: string;
  member_count?: number;
  join_url?: string;
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

  // Lifestyle
  diet?: string;
  smoking?: string;
  drinking?: string;
  hobbies?: string[];

  // About
  about_me?: string;

  // Partner Preferences
  partner_preference?: string;
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

  // Photos
  profile_photo?: string;

  // System
  verified: boolean;
  published: boolean;
  status?: 'draft' | 'pending' | 'approved' | 'rejected';
  contact_visible_after_login: boolean;
  created_at: string;
  updated_at?: string;
}

export interface College {
  id: string;
  name: string;
  type?: string;
  city?: string;
  area?: string;
  address?: string;
  phone?: string;
  website?: string;
  google_maps_url?: string;
  lat?: number;
  lng?: number;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  event_date?: string;
  city?: string;
  venue?: string;
  organizer?: string;
  contact?: string;
  image_url?: string;
  category?: string;
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
