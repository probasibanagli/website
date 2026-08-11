/**
 * Firestore collection name constants and helpers.
 * Centralized mapping from module keys to Firestore collection names.
 */

import type { ModuleKey } from '@/types';

export const COLLECTIONS = {
  users: 'users',
  listings: 'listings',
  food_listings: 'food_listings',
  hospitals: 'hospitals',
  blood_banks: 'blood_banks',
  community_groups: 'community_groups',
  matrimonial_profiles: 'matrimonial_profiles',
  colleges: 'colleges',
  events: 'events',
  blog_posts: 'blog_posts',
  travel_info: 'travel_info',
  bengali_doctors: 'bengali_doctors',
  bengali_staff: 'bengali_staff',
  otps: 'otps',
  ambulances: 'ambulances',
} as const;

/**
 * Map a module key to its primary Firestore collection name.
 */
export const MODULE_TO_COLLECTION: Record<ModuleKey, string> = {
  stay: COLLECTIONS.listings,
  food: COLLECTIONS.food_listings,
  emergency: COLLECTIONS.hospitals,
  community: COLLECTIONS.community_groups,
  services: COLLECTIONS.colleges,
  blog: COLLECTIONS.blog_posts,
  users: COLLECTIONS.users,
  matrimony: COLLECTIONS.matrimonial_profiles,
  blood_bank: COLLECTIONS.blood_banks,
  events: COLLECTIONS.events,
  ambulance: COLLECTIONS.ambulances,
};
