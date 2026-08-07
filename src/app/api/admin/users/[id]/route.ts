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

export async function GET(_request: Request, ctx: RouteContext<'/api/admin/users/[id]'>) {
  const { id } = await ctx.params;
  const userDoc = await adminDb.collection('users').doc(id).get();
  if (!userDoc.exists) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ user: { uid: userDoc.id, ...userDoc.data() } });
}

export async function PATCH(request: Request, ctx: RouteContext<'/api/admin/users/[id]'>) {
  const caller = await verifyRequest(request);
  if (!caller || caller.role !== 'superadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const { id } = await ctx.params;
  const body = await request.json();
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.role) updates.role = body.role;
  if (body.permissions) updates.permissions = body.permissions;
  if (typeof body.is_active === 'boolean') updates.is_active = body.is_active;

  await adminDb.collection('users').doc(id).update(updates);
  return NextResponse.json({ status: 'ok' });
}

export async function DELETE(request: Request, ctx: RouteContext<'/api/admin/users/[id]'>) {
  const caller = await verifyRequest(request);
  if (!caller || caller.role !== 'superadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const { id } = await ctx.params;
  await adminDb.collection('users').doc(id).update({ is_active: false, updated_at: new Date().toISOString() });
  return NextResponse.json({ status: 'ok' });
}
