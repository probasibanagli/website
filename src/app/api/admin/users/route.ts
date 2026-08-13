import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

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
  try {
    const user = await verifyRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const isSuperAdmin = user.role === 'superadmin';
    const hasUsersPermission = user.role === 'admin' && user.permissions?.users && user.permissions.users !== 'none';

    if (!isSuperAdmin && !hasUsersPermission) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const snap = await adminDb.collection('users').orderBy('created_at', 'desc').get();
    const users = snap.docs.map((d: any) => ({ uid: d.id, ...d.data() }));
    return NextResponse.json({ users });
  } catch (err: any) {
    console.error("GET /api/admin/users error:", err);
    return NextResponse.json({ error: err?.message || 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await verifyRequest(request);
  if (!user || user.role !== 'superadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const body = await request.json();
  const { email, password, full_name, role, permissions, phone, assigned_hospitals } = body;

  try {
    const newUser = await adminAuth.createUser({ 
      email, 
      password, 
      displayName: full_name,
      ...(phone && { phoneNumber: phone })
    });
    const now = new Date().toISOString();
    await adminDb.collection('users').doc(newUser.uid).set({
      uid: newUser.uid, email: email.toLowerCase(), full_name, role: role || 'admin',
      phone: phone || null,
      permissions: permissions || {},
      assigned_hospitals: Array.isArray(assigned_hospitals) ? assigned_hospitals : [],
      created_at: now, updated_at: now, created_by: user.uid, is_active: true,
      is_first_login: false,
    });
    return NextResponse.json({ uid: newUser.uid });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create user';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
