import { db } from '@/lib/firebase';
import { collection, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { CommunityEvent } from '@/types';

const EVENTS_COLLECTION = 'events';

/**
 * Clean an object by removing undefined properties before saving to Firestore.
 */
function cleanFirestoreData<T extends Record<string, any>>(obj: T): T {
  const cleaned: Record<string, any> = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== undefined) {
      cleaned[key] = obj[key];
    }
  });
  return cleaned as T;
}

/**
 * Save an event to Firestore (creates if no ID, updates if ID exists)
 */
export async function saveEvent(event: Partial<CommunityEvent>): Promise<void> {
  try {
    const isNew = !event.id;
    const docRef = isNew 
      ? doc(collection(db, EVENTS_COLLECTION)) 
      : doc(db, EVENTS_COLLECTION, event.id!);
      
    const eventData = cleanFirestoreData({
      ...event,
      id: docRef.id,
      updated_at: new Date().toISOString(),
      ...(isNew ? { created_at: new Date().toISOString() } : {})
    });

    await setDoc(docRef, eventData, { merge: true });
    console.log(`Successfully saved event: ${docRef.id}`);
  } catch (error) {
    console.error("Error saving event:", error);
    throw error;
  }
}

/**
 * Delete an event from Firestore
 */
export async function deleteEvent(id: string): Promise<void> {
  try {
    const docRef = doc(db, EVENTS_COLLECTION, id);
    await deleteDoc(docRef);
    console.log(`Successfully deleted event: ${id}`);
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
}
