import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    // Authorize token (support both mock tokens and real firebase tokens)
    let isAuthorized = false;
    if (token === 'mock-bypass-token' || token === 'mock-bypass-admin-token') {
      isAuthorized = true;
    } else {
      const decoded = await adminAuth.verifyIdToken(token);
      const userDoc = await adminDb.collection('users').doc(decoded.uid).get();
      if (userDoc.exists) {
        const data = userDoc.data()!;
        if (data.role === 'superadmin' || data.role === 'admin') {
          isAuthorized = true;
        }
      }
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { collection: colName, items } = await request.json();
    if (!colName || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    console.log(`Server-side importing ${items.length} items into ${colName}...`);
    
    // Batch write to Firestore (up to 500 operations per batch)
    const batch = adminDb.batch();
    for (const item of items) {
      const docRef = adminDb.collection(colName).doc(item.id);
      batch.set(docRef, item);
    }
    await batch.commit();

    return NextResponse.json({ success: true, count: items.length });
  } catch (error: any) {
    console.error('Import API error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
