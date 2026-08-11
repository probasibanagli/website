'use client';

import { collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, app } from '@/lib/firebase';
import type { MatrimonialProfile } from '@/types';

// Constants for Collections
const PROFILES_COLLECTION = 'matrimony_profiles';
const INTERESTS_COLLECTION = 'matrimony_interests';
const SHORTLIST_COLLECTION = 'matrimony_shortlists';
const VIEWS_COLLECTION = 'matrimony_views';

/* ── Profile ID Generator ── */
export async function generateProfileId(): Promise<string> {
  const existing = await getAllProfiles();
  const maxNum = existing.reduce((max, p) => {
    const match = p.profile_id?.match(/PB-(\d+)/);
    return match ? Math.max(max, parseInt(match[1])) : max;
  }, 0);
  return `PB-${String(maxNum + 1).padStart(4, '0')}`;
}

/* ── Profile CRUD ── */
export async function getAllProfiles(): Promise<MatrimonialProfile[]> {
  try {
    const q = query(collection(db, PROFILES_COLLECTION));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as MatrimonialProfile);
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return [];
  }
}

export async function getProfile(id: string): Promise<MatrimonialProfile | undefined> {
  try {
    const docRef = doc(db, PROFILES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as MatrimonialProfile;
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
  }
  return undefined;
}

function cleanFirestoreData<T extends Record<string, any>>(obj: T): T {
  const cleaned: Record<string, any> = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== undefined) {
      cleaned[key] = obj[key];
    }
  });
  return cleaned as T;
}

export async function saveProfile(profile: MatrimonialProfile): Promise<void> {
  try {
    const cleaned = cleanFirestoreData(profile as unknown as Record<string, any>) as unknown as MatrimonialProfile;
    const docRef = doc(db, PROFILES_COLLECTION, cleaned.id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await updateDoc(docRef, { ...cleaned, updated_at: new Date().toISOString() });
    } else {
      await setDoc(docRef, { ...cleaned, created_at: cleaned.created_at || new Date().toISOString() });
    }
  } catch (error) {
    console.error("Error saving profile:", error);
    throw error;
  }
}

export async function getMyProfile(userId: string): Promise<MatrimonialProfile | null> {
  if (!userId) return null;
  try {
    const q = query(collection(db, PROFILES_COLLECTION), where('user_id', '==', userId));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs[0].data() as MatrimonialProfile;
    }
  } catch (error) {
    console.error("Error fetching my profile:", error);
  }
  return null;
}

export async function saveMyProfile(profile: MatrimonialProfile): Promise<void> {
  await saveProfile(profile);
}

export async function deleteMyProfile(profileId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, PROFILES_COLLECTION, profileId));
  } catch (error) {
    console.error("Error deleting profile:", error);
  }
}

/* ── Interests ── */
export interface Interest {
  id?: string;
  fromId: string;
  toId: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export async function sendInterest(fromId: string, toId: string): Promise<void> {
  try {
    const q = query(collection(db, INTERESTS_COLLECTION), where('fromId', '==', fromId), where('toId', '==', toId));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) return;
    
    const docRef = doc(collection(db, INTERESTS_COLLECTION));
    await setDoc(docRef, {
      id: docRef.id,
      fromId,
      toId,
      timestamp: new Date().toISOString(),
      status: 'pending'
    });
  } catch (error) {
    console.error("Error sending interest:", error);
  }
}

export async function getInterestsSent(profileId: string): Promise<Interest[]> {
  try {
    const q = query(collection(db, INTERESTS_COLLECTION), where('fromId', '==', profileId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Interest);
  } catch (error) {
    console.error("Error fetching sent interests:", error);
    return [];
  }
}

export async function getInterestsReceived(profileId: string): Promise<Interest[]> {
  try {
    const q = query(collection(db, INTERESTS_COLLECTION), where('toId', '==', profileId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Interest);
  } catch (error) {
    console.error("Error fetching received interests:", error);
    return [];
  }
}

export async function hasInterest(fromId: string, toId: string): Promise<boolean> {
  try {
    const q = query(collection(db, INTERESTS_COLLECTION), where('fromId', '==', fromId), where('toId', '==', toId));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    return false;
  }
}

export async function updateInterestStatus(fromId: string, toId: string, status: 'accepted' | 'rejected'): Promise<void> {
  try {
    const q = query(collection(db, INTERESTS_COLLECTION), where('fromId', '==', fromId), where('toId', '==', toId));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const interestDoc = snapshot.docs[0];
      await updateDoc(interestDoc.ref, { status });
    }
  } catch (error) {
    console.error("Error updating interest status:", error);
  }
}

/* ── Shortlist ── */
export async function getShortlist(profileId: string): Promise<string[]> {
  try {
    const q = query(collection(db, SHORTLIST_COLLECTION), where('profileId', '==', profileId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data().shortlistedId);
  } catch (error) {
    return [];
  }
}

export async function toggleShortlist(profileId: string, targetProfileId: string): Promise<boolean> {
  try {
    const docId = `${profileId}_${targetProfileId}`;
    const docRef = doc(db, SHORTLIST_COLLECTION, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await deleteDoc(docRef);
      return false;
    } else {
      await setDoc(docRef, { profileId, shortlistedId: targetProfileId });
      return true;
    }
  } catch (error) {
    console.error("Error toggling shortlist:", error);
    return false;
  }
}

export async function isShortlisted(profileId: string, targetProfileId: string): Promise<boolean> {
  try {
    const docId = `${profileId}_${targetProfileId}`;
    const docRef = doc(db, SHORTLIST_COLLECTION, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (error) {
    return false;
  }
}

/* ── Profile Views ── */
export async function recordView(targetProfileId: string): Promise<void> {
  try {
    const docRef = doc(db, VIEWS_COLLECTION, targetProfileId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await updateDoc(docRef, { count: (docSnap.data().count || 0) + 1 });
    } else {
      await setDoc(docRef, { count: 1 });
    }
  } catch (error) {
    console.error("Error recording view:", error);
  }
}

export async function getViewCount(profileId: string): Promise<number> {
  try {
    const docRef = doc(db, VIEWS_COLLECTION, profileId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().count || 0;
    }
  } catch (error) {
    console.error("Error getting view count:", error);
  }
  return 0;
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

export function searchProfiles(profiles: MatrimonialProfile[], filters: MatrimonyFilters): MatrimonialProfile[] {
  let results = profiles.filter(p => p.published && (p.status === 'approved' || p.status === 'verified'));

  if (filters.gender) {
    const target = filters.gender.toLowerCase();
    results = results.filter(p => {
      if (!p.gender) return false;
      const pg = p.gender.toLowerCase();
      if (target === 'male') return pg === 'male' || pg === 'groom' || pg === 'm';
      if (target === 'female') return pg === 'female' || pg === 'bride' || pg === 'f';
      return pg === target;
    });
  }
  if (filters.ageMin) results = results.filter(p => (p.age || 0) >= filters.ageMin!);
  if (filters.ageMax) results = results.filter(p => (p.age || 99) <= filters.ageMax!);
  if (filters.city) results = results.filter(p => p.city?.toLowerCase() === filters.city!.toLowerCase());
  if (filters.education) results = results.filter(p => p.education?.toLowerCase().includes(filters.education!.toLowerCase()));
  if (filters.maritalStatus) results = results.filter(p => p.marital_status?.toLowerCase() === filters.maritalStatus!.toLowerCase());
  if (filters.diet) results = results.filter(p => p.diet?.toLowerCase() === filters.diet!.toLowerCase());
  if (filters.religion) results = results.filter(p => p.religion?.toLowerCase() === filters.religion!.toLowerCase());
  if (filters.searchQuery) {
    const q = filters.searchQuery.toLowerCase();
    results = results.filter(p =>
      p.full_name?.toLowerCase().includes(q) ||
      p.profile_id?.toLowerCase().includes(q) ||
      p.profession?.toLowerCase().includes(q) ||
      p.city?.toLowerCase().includes(q) ||
      p.gender?.toLowerCase().includes(q) ||
      p.caste?.toLowerCase().includes(q)
    );
  }

  return results;
}

export type SortOption = 'newest' | 'age-low' | 'age-high';

export function sortProfiles(profiles: MatrimonialProfile[], sort: SortOption): MatrimonialProfile[] {
  const sorted = [...profiles];
  switch (sort) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    case 'age-low':
      return sorted.sort((a, b) => (a.age || 0) - (b.age || 0));
    case 'age-high':
      return sorted.sort((a, b) => (b.age || 0) - (a.age || 0));
    default:
      return sorted;
  }
}

/* ── Media Storage (Firebase Storage + Base64 Fallback) ── */
export async function storeMedia(key: string, file: Blob): Promise<string> {
  try {
    const storage = getStorage(app);
    const storageRef = ref(storage, `matrimony_media/${key}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    if (downloadUrl) return downloadUrl;
  } catch (error) {
    console.warn("Firebase Storage upload failed, utilizing resilient base64 fallback:", error);
  }

  // Resilient Fallback: Convert image blob to compressed JPEG Base64 Data URL
  return new Promise<string>((resolve) => {
    if (!file.type || !file.type.startsWith('image/')) {
      resolve('');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (result) {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 800;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', 0.7);
            resolve(compressed);
            return;
          }
          resolve(result);
        };
        img.onerror = () => resolve(result);
        img.src = result;
      } else {
        resolve('');
      }
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

export async function getMedia(key: string): Promise<string | null> {
  if (!key) return null;
  try {
    // If key is an HTTP URL or Base64 Data URL, return directly
    if (key.startsWith('http') || key.startsWith('data:')) return key;
    
    const storage = getStorage(app);
    const storageRef = ref(storage, `matrimony_media/${key}`);
    return await getDownloadURL(storageRef);
  } catch (error) {
    return null;
  }
}

/* ── Admin Management Functions ── */
export async function adminUpdateProfileStatus(profileId: string, status: 'pending' | 'verified' | 'rejected' | 'married'): Promise<void> {
  try {
    const docRef = doc(db, PROFILES_COLLECTION, profileId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await updateDoc(docRef, {
        status,
        published: status === 'verified' || status === 'married',
        verified: status === 'verified' || status === 'married',
        updated_at: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error("Error updating profile status:", error);
  }
}

export async function adminDeleteProfile(profileId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, PROFILES_COLLECTION, profileId));
  } catch (error) {
    console.error("Error deleting profile:", error);
  }
}
