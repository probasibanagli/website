import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

async function verifyRequest(request: Request) {
  const auth = request.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  try {
    const token = auth.split('Bearer ')[1];
    const decoded = await adminAuth.verifyIdToken(token);
    const userDoc = await adminDb.collection('users').doc(decoded.uid).get();
    if (!userDoc.exists) return null;
    return { uid: decoded.uid, ...userDoc.data() } as any;
  } catch { return null; }
}

export async function GET(request: Request) {
  const user = await verifyRequest(request);
  if (!user || (user.role !== 'superadmin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const snap = await adminDb.collection('users').orderBy('created_at', 'desc').get();
  const users = snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  const user = await verifyRequest(request);
  if (!user || user.role !== 'superadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const body = await request.json();
  const { email, password, full_name, role, permissions } = body;

  try {
    const newUser = await adminAuth.createUser({ email, password, displayName: full_name });
    const now = new Date().toISOString();
    await adminDb.collection('users').doc(newUser.uid).set({
      uid: newUser.uid, email, full_name, role: role || 'admin',
      permissions: permissions || {},
      created_at: now, updated_at: now, created_by: user.uid, is_active: true,
    });
    return NextResponse.json({ uid: newUser.uid });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create user';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
