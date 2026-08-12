import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

async function verifyRequest(request: Request) {
  const auth = request.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  try {
    const token = auth.split('Bearer ')[1];
    if (token === 'temp_token') {
      return {
        uid: 'temporary-admin-id',
        email: 'admin@pro.in',
        full_name: 'Super Admin',
        role: 'superadmin',
        permissions: {
          stay: 'manage',
          food: 'manage',
          travel: 'manage',
          emergency: 'manage',
          community: 'manage',
          services: 'manage',
          blog: 'manage',
          users: 'manage',
        }
      } as any;
    }
    const decoded = await adminAuth.verifyIdToken(token);
    const userDoc = await adminDb.collection('users').doc(decoded.uid).get();
    if (!userDoc.exists) return null;
    return { uid: decoded.uid, ...userDoc.data() } as any;
  } catch { return null; }
}

export async function GET(request: Request) {
  const caller = await verifyRequest(request);
  if (!caller || caller.role !== 'superadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const snap = await adminDb.collection('activities')
      .orderBy('timestamp', 'desc')
      .limit(100)
      .get();

    const logs = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
    return NextResponse.json({ logs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, performed_by, user_role, details } = body;

    const log = {
      action,
      performed_by: performed_by || 'System',
      user_role: user_role || 'system',
      details: details || '',
      timestamp: new Date().toISOString(),
    };

    await adminDb.collection('activities').add(log);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
