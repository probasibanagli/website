import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, where, type QueryConstraint } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useFirestore<T>(collectionName: string, constraints: QueryConstraint[] = []) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const q = query(collection(db, collectionName), ...constraints);
        const snapshot = await getDocs(q);
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as T[];
        setData(items);
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
