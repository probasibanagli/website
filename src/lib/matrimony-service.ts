'use client';

import type { MatrimonialProfile } from '@/types';
import { sampleMatrimonialProfiles } from '@/data/sample-data';

const PROFILES_KEY = 'pb_matrimony_profiles';
const MY_PROFILE_KEY = 'pb_matrimony_my_profile';
const INTERESTS_KEY = 'pb_matrimony_interests';
const SHORTLIST_KEY = 'pb_matrimony_shortlist';
const VIEWS_KEY = 'pb_matrimony_views';

/* ── Helpers ── */

function getFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

/* ── Profile ID Generator ── */

export function generateProfileId(): string {
  const existing = getAllProfiles();
  const maxNum = existing.reduce((max, p) => {
    const match = p.profile_id?.match(/PB-(\d+)/);
    return match ? Math.max(max, parseInt(match[1])) : max;
  }, 0);
  return `PB-${String(maxNum + 1).padStart(4, '0')}`;
}

/* ── Profile CRUD ── */

export function getAllProfiles(): MatrimonialProfile[] {
  const userProfiles = getFromStorage<MatrimonialProfile[]>(PROFILES_KEY, []);
  const deletedSampleIds = getFromStorage<string[]>('pb_matrimony_deleted_samples', []);
  const ids = new Set(userProfiles.map(p => p.id));
  const merged = [...userProfiles];
  for (const sp of sampleMatrimonialProfiles) {
    if (!ids.has(sp.id) && !deletedSampleIds.includes(sp.id)) {
      merged.push(sp);
    }
  }
  return merged;
}

export function getProfile(id: string): MatrimonialProfile | undefined {
  return getAllProfiles().find(p => p.id === id);
}

export function saveProfile(profile: MatrimonialProfile): void {
  const profiles = getFromStorage<MatrimonialProfile[]>(PROFILES_KEY, []);
  const idx = profiles.findIndex(p => p.id === profile.id);
  if (idx >= 0) {
    profiles[idx] = { ...profile, updated_at: new Date().toISOString() };
  } else {
    profiles.push({ ...profile, created_at: profile.created_at || new Date().toISOString() });
  }
  setToStorage(PROFILES_KEY, profiles);
}

export function getMyProfile(): MatrimonialProfile | null {
  return getFromStorage<MatrimonialProfile | null>(MY_PROFILE_KEY, null);
}

export function saveMyProfile(profile: MatrimonialProfile): void {
  setToStorage(MY_PROFILE_KEY, profile);
  saveProfile(profile);
}

export function deleteMyProfile(): void {
  if (typeof window === 'undefined') return;
  const myProfile = getMyProfile();
  if (myProfile) {
    const profiles = getFromStorage<MatrimonialProfile[]>(PROFILES_KEY, []);
    setToStorage(PROFILES_KEY, profiles.filter(p => p.id !== myProfile.id));
  }
  localStorage.removeItem(MY_PROFILE_KEY);
}

/* ── Interests ── */

interface Interest {
  fromId: string;
  toId: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export function sendInterest(fromId: string, toId: string): void {
  const interests = getFromStorage<Interest[]>(INTERESTS_KEY, []);
  // Don't duplicate
  if (interests.some(i => i.fromId === fromId && i.toId === toId)) return;
  interests.push({ fromId, toId, timestamp: new Date().toISOString(), status: 'pending' });
  setToStorage(INTERESTS_KEY, interests);
}

export function getInterestsSent(profileId: string): Interest[] {
  return getFromStorage<Interest[]>(INTERESTS_KEY, []).filter(i => i.fromId === profileId);
}

export function getInterestsReceived(profileId: string): Interest[] {
  return getFromStorage<Interest[]>(INTERESTS_KEY, []).filter(i => i.toId === profileId);
}

export function hasInterest(fromId: string, toId: string): boolean {
  return getFromStorage<Interest[]>(INTERESTS_KEY, []).some(i => i.fromId === fromId && i.toId === toId);
}

export function updateInterestStatus(fromId: string, toId: string, status: 'accepted' | 'rejected'): void {
  const interests = getFromStorage<Interest[]>(INTERESTS_KEY, []);
  const idx = interests.findIndex(i => i.fromId === fromId && i.toId === toId);
  if (idx >= 0) {
    interests[idx].status = status;
    setToStorage(INTERESTS_KEY, interests);
  }
}

/* ── Shortlist ── */

export function getShortlist(): string[] {
  return getFromStorage<string[]>(SHORTLIST_KEY, []);
}

export function toggleShortlist(profileId: string): boolean {
  const list = getShortlist();
  const idx = list.indexOf(profileId);
  if (idx >= 0) {
    list.splice(idx, 1);
    setToStorage(SHORTLIST_KEY, list);
    return false; // removed
  } else {
    list.push(profileId);
    setToStorage(SHORTLIST_KEY, list);
    return true; // added
  }
}

export function isShortlisted(profileId: string): boolean {
  return getShortlist().includes(profileId);
}

/* ── Profile Views ── */

export function recordView(profileId: string): void {
  const views = getFromStorage<Record<string, number>>(VIEWS_KEY, {});
  views[profileId] = (views[profileId] || 0) + 1;
  setToStorage(VIEWS_KEY, views);
}

export function getViewCount(profileId: string): number {
  const views = getFromStorage<Record<string, number>>(VIEWS_KEY, {});
  return views[profileId] || 0;
}

/* ── Search / Filter ── */

export interface MatrimonyFilters {
  gender?: string;
  ageMin?: number;
  ageMax?: number;
  city?: string;
  education?: string;
  profession?: string;
  maritalStatus?: string;
  diet?: string;
  religion?: string;
  searchQuery?: string;
}

export function searchProfiles(filters: MatrimonyFilters): MatrimonialProfile[] {
  let profiles = getAllProfiles().filter(p => p.published && (p.status === 'approved' || p.status === 'verified'));

  if (filters.gender) profiles = profiles.filter(p => p.gender === filters.gender);
  if (filters.ageMin) profiles = profiles.filter(p => (p.age || 0) >= filters.ageMin!);
  if (filters.ageMax) profiles = profiles.filter(p => (p.age || 99) <= filters.ageMax!);
  if (filters.city) profiles = profiles.filter(p => p.city === filters.city);
  if (filters.education) profiles = profiles.filter(p => p.education?.toLowerCase().includes(filters.education!.toLowerCase()));
  if (filters.maritalStatus) profiles = profiles.filter(p => p.marital_status === filters.maritalStatus);
  if (filters.diet) profiles = profiles.filter(p => p.diet === filters.diet);
  if (filters.religion) profiles = profiles.filter(p => p.religion === filters.religion);
  if (filters.searchQuery) {
    const q = filters.searchQuery.toLowerCase();
    profiles = profiles.filter(p =>
      p.full_name?.toLowerCase().includes(q) ||
      p.profile_id?.toLowerCase().includes(q) ||
      p.profession?.toLowerCase().includes(q) ||
      p.city?.toLowerCase().includes(q)
    );
  }

  return profiles;
}

export type SortOption = 'newest' | 'age-low' | 'age-high';

export function sortProfiles(profiles: MatrimonialProfile[], sort: SortOption): MatrimonialProfile[] {
  const sorted = [...profiles];
  switch (sort) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    case 'age-low':
      return sorted.sort((a, b) => (a.age || 0) - (b.age || 0));
    case 'age-high':
      return sorted.sort((a, b) => (b.age || 0) - (a.age || 0));
    default:
      return sorted;
  }
}

/* ── IndexedDB Media Storage Helpers ── */

export function storeMedia(key: string, file: Blob): Promise<string> {
  if (typeof window === 'undefined') return Promise.resolve('');
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('pb_matrimony_media', 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains('media')) {
        request.result.createObjectStore('media');
      }
    };
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction('media', 'readwrite');
      tx.objectStore('media').put(file, key);
      tx.oncomplete = () => {
        resolve(URL.createObjectURL(file));
      };
      tx.onerror = () => reject(tx.error);
    };
    request.onerror = () => reject(request.error);
  });
}

export function getMedia(key: string): Promise<string | null> {
  if (typeof window === 'undefined') return Promise.resolve(null);
  return new Promise((resolve) => {
    const request = indexedDB.open('pb_matrimony_media', 1);
    request.onsuccess = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('media')) {
        resolve(null);
        return;
      }
      const tx = db.transaction('media', 'readonly');
      const req = tx.objectStore('media').get(key);
      req.onsuccess = () => {
        if (req.result) {
          resolve(URL.createObjectURL(req.result));
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    };
    request.onerror = () => resolve(null);
  });
}

/* ── Admin Management Functions ── */

export function adminUpdateProfileStatus(profileId: string, status: 'pending' | 'verified' | 'rejected' | 'married'): void {
  const userProfiles = getFromStorage<MatrimonialProfile[]>(PROFILES_KEY, []);
  const idx = userProfiles.findIndex(p => p.id === profileId);
  
  if (idx >= 0) {
    userProfiles[idx] = {
      ...userProfiles[idx],
      status,
      published: status === 'verified',
      updated_at: new Date().toISOString()
    };
    setToStorage(PROFILES_KEY, userProfiles);
  } else {
    // If it's a sample profile, clone it to user storage with the updated status
    const sample = sampleMatrimonialProfiles.find(p => p.id === profileId);
    if (sample) {
      const cloned = {
        ...sample,
        status,
        published: status === 'verified',
        created_at: sample.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      userProfiles.push(cloned);
      setToStorage(PROFILES_KEY, userProfiles);
    }
  }
}

export function adminDeleteProfile(profileId: string): void {
  const userProfiles = getFromStorage<MatrimonialProfile[]>(PROFILES_KEY, []);
  setToStorage(PROFILES_KEY, userProfiles.filter(p => p.id !== profileId));
  
  // Track deleted sample profiles separately to make sure they do not load
  const deletedSampleIds = getFromStorage<string[]>('pb_matrimony_deleted_samples', []);
  if (sampleMatrimonialProfiles.some(p => p.id === profileId)) {
    if (!deletedSampleIds.includes(profileId)) {
      deletedSampleIds.push(profileId);
      setToStorage('pb_matrimony_deleted_samples', deletedSampleIds);
    }
  }
}
