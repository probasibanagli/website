import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

const WHITELISTED_COLLECTIONS = new Set([
  'listings',
  'food_listings',
  'community_groups',
  'hospitals',
  'bengali_doctors',
  'bengali_staff',
  'blog_posts',
  'blood_banks',
  'colleges',
  'events',
  'travel_info',
  'ambulances'
]);

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

    const docId = searchParams.get('docId');
    if (docId) {
      const docSnap = await adminDb.collection(collectionName).doc(docId).get();
      if (!docSnap.exists) {
        return NextResponse.json({ error: 'Document not found' }, { status: 404 });
      }
      return NextResponse.json({ id: docSnap.id, ...docSnap.data() });
    }

    let queryRef: any = adminDb.collection(collectionName);

    const whereField = searchParams.get('whereField');
    const whereValue = searchParams.get('whereValue');
    const whereOp = searchParams.get('whereOp') || '==';

    if (whereField && whereValue !== null && whereValue !== undefined) {
      let val: any = whereValue;
      if (whereValue === 'true') val = true;
      else if (whereValue === 'false') val = false;
      queryRef = queryRef.where(whereField, whereOp, val);
    }

    const orderByField = searchParams.get('orderByField');
    const orderDirection = searchParams.get('orderDirection') || 'asc';
    if (orderByField) {
      queryRef = queryRef.orderBy(orderByField, orderDirection as 'asc' | 'desc');
    }

    const snap = await queryRef.get();
    const items = snap.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ items });
  } catch (error: any) {
    console.error('API Firestore query error:', error);
    
    // In local development, if Firebase Admin is not fully configured (missing service credentials),
    // return a successful empty items array to let the frontend components gracefully fall back to sample lists
    // and avoid polluting the developer console with HTTP 500 errors.
    const errMsg = (error.message || '').toLowerCase();
    if (errMsg.includes('credential') || errMsg.includes('initialize') || errMsg.includes('default') || errMsg.includes('token')) {
      return NextResponse.json({ items: [], fallback: true });
    }

    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}

