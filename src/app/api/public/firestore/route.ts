import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

const WHITELISTED_COLLECTIONS = new Set([
  'listings',
  'food_listings',
  'community_groups',
  'hospitals',
  'bengali_doctors',
  'bengali_staff',
  'pharmacies',
  'blog_posts',
  'blood_banks',
  'colleges',
  'events',
  'travel_info',
  'ambulances',
  'hospital_reviews'
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
    // Log the actual error for debugging in Vercel logs
    console.error('API Firestore query error:', error?.message || error);
    
    // Always return empty items instead of a 500 so the frontend gracefully
    // falls back to sample data rather than crashing with an error.
    return NextResponse.json({ items: [], fallback: true, reason: error?.message });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const collectionName = body.collection;
    const docData = body.data || body;
    const customId = body.id || docData.id;

    if (!collectionName || !WHITELISTED_COLLECTIONS.has(collectionName)) {
      return NextResponse.json(
        { error: 'Invalid or unauthorized collection access.' },
        { status: 400 }
      );
    }

    if (!docData || typeof docData !== 'object') {
      return NextResponse.json(
        { error: 'Invalid document payload.' },
        { status: 400 }
      );
    }

    const docId = customId || `doc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const finalData = {
      ...docData,
      id: docId,
      created_at: docData.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await adminDb.collection(collectionName).doc(docId).set(finalData, { merge: true });

    return NextResponse.json({ success: true, id: docId, item: finalData });
  } catch (error: any) {
    console.error('API Firestore POST error:', error?.message || error);
    return NextResponse.json(
      { error: error?.message || 'Failed to save document to Firestore' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const collectionName = searchParams.get('collection');
    const docId = searchParams.get('docId');

    if (!collectionName || !WHITELISTED_COLLECTIONS.has(collectionName) || !docId) {
      return NextResponse.json(
        { error: 'Invalid collection or docId parameter.' },
        { status: 400 }
      );
    }

    await adminDb.collection(collectionName).doc(docId).delete();

    return NextResponse.json({ success: true, id: docId });
  } catch (error: any) {
    console.error('API Firestore DELETE error:', error?.message || error);
    return NextResponse.json(
      { error: error?.message || 'Failed to delete document from Firestore' },
      { status: 500 }
    );
  }
}

