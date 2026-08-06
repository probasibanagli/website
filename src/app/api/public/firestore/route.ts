import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

const WHITELISTED_COLLECTIONS = new Set(['listings', 'food_listings', 'community_groups']);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const collectionName = searchParams.get('collection');

    if (!collectionName || !WHITELISTED_COLLECTIONS.has(collectionName)) {
      return NextResponse.json(
        { error: 'Invalid or unauthorized collection access.' },
        { status: 400 }
      );
    }

    const snap = await adminDb.collection(collectionName).get();
    const items = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ items });
  } catch (error: any) {
    console.error('API Firestore query error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}
