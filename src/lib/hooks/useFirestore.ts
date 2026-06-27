import { useState, useEffect } from 'react';
import { collection, getDocs, query, type QueryConstraint } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const PUBLIC_COLLECTIONS = new Set(['listings', 'food_listings', 'community_groups']);

export function useFirestore<T>(collectionName: string, constraints: QueryConstraint[] = []) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        if (PUBLIC_COLLECTIONS.has(collectionName)) {
          const res = await fetch(`/api/public/firestore?collection=${collectionName}`);
          if (!res.ok) {
            throw new Error(`Failed to fetch ${collectionName} via API: ${res.statusText}`);
          }
          const json = await res.json();
          setData(json.items || []);
        } else {
          const q = query(collection(db, collectionName), ...constraints);
          const snapshot = await getDocs(q);
          const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as T[];
          setData(items);
        }
      } catch (err) {
        console.error(`Error fetching ${collectionName}:`, err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [collectionName, JSON.stringify(constraints)]);

  return { data, loading, error };
}
