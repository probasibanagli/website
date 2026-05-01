export interface User {
  id: string;
  email?: string;
  phone?: string;
  full_name?: string;
  bengali_name?: string;
  role: 'user' | 'admin';
  avatar_url?: string;
  created_at: string;
}

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
  type?: 'restaurant' | 'sweets' | 'tiffin' | 'delivery';
  city: string;
  area?: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  google_maps_url?: string;
  lat?: number;
  lng?: number;
  specialties: string[];
  zomato_url?: string;
  swiggy_url?: string;
  magicpin_url?: string;
  dunzo_url?: string;
  eatsure_url?: string;
  uber_eats_url?: string;
  images: string[];
  verified: boolean;
  created_at: string;
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
  platform?: 'whatsapp' | 'telegram' | 'facebook' | 'instagram';
  city?: string;
  description?: string;
  member_count?: number;
  join_url?: string;
  category?: string;
}

export interface MatrimonialProfile {
  id: string;
  user_id: string;
  full_name?: string;
  age?: number;
  gender?: string;
  city?: string;
  native_district?: string;
  education?: string;
  profession?: string;
  annual_income?: string;
  religion?: string;
  caste?: string;
  about_me?: string;
  partner_preference?: string;
  profile_photo?: string;
  verified: boolean;
  published: boolean;
  contact_visible_after_login: boolean;
  created_at: string;
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
