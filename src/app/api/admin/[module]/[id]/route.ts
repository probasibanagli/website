import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import type { PermissionLevel } from '@/types';

const MODULE_COLLECTIONS: Record<string, string> = {
  stay: 'listings', food: 'food_listings', travel: 'travel_info',
  emergency: 'hospitals', community: 'community_groups',
  services: 'colleges', blog: 'blog_posts',
};

function hasPerm(actual: PermissionLevel, required: PermissionLevel): boolean {
  const l: PermissionLevel[] = ['none', 'view', 'edit', 'manage'];
  return l.indexOf(actual) >= l.indexOf(required);
}

async function verify(request: Request, module: string, required: PermissionLevel) {
  const auth = request.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) return { error: 'No token', status: 401 };
  try {
    const decoded = await adminAuth.verifyIdToken(auth.split('Bearer ')[1]);
    const doc = await adminDb.collection('users').doc(decoded.uid).get();
    if (!doc.exists) return { error: 'Not found', status: 404 };
    const data = doc.data()! as any;
    if (data.role === 'superadmin') return { user: data };
    if (data.role !== 'admin') return { error: 'Forbidden', status: 403 };
    if (!hasPerm(data.permissions?.[module] || 'none', required)) return { error: 'Forbidden', status: 403 };
    return { user: data };
  } catch { return { error: 'Invalid token', status: 401 }; }
}

export async function GET(request: Request, ctx: RouteContext<'/api/admin/[module]/[id]'>) {
  const { module, id } = await ctx.params;
  const col = MODULE_COLLECTIONS[module];
  if (!col) return NextResponse.json({ error: 'Unknown module' }, { status: 400 });
  const result = await verify(request, module, 'view');
  if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status });
  const doc = await adminDb.collection(col).doc(id).get();
  if (!doc.exists) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ item: { id: doc.id, ...doc.data() } });
}

export async function PATCH(request: Request, ctx: RouteContext<'/api/admin/[module]/[id]'>) {
  const { module, id } = await ctx.params;
  const col = MODULE_COLLECTIONS[module];
  if (!col) return NextResponse.json({ error: 'Unknown module' }, { status: 400 });
  const result = await verify(request, module, 'edit');
  if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status });
  const body = await request.json();
  await adminDb.collection(col).doc(id).update({ ...body, updated_at: new Date().toISOString() });
  return NextResponse.json({ status: 'ok' });
}

export async function DELETE(request: Request, ctx: RouteContext<'/api/admin/[module]/[id]'>) {
  const { module, id } = await ctx.params;
  const col = MODULE_COLLECTIONS[module];
  if (!col) return NextResponse.json({ error: 'Unknown module' }, { status: 400 });
  const result = await verify(request, module, 'manage');
  if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status });
  await adminDb.collection(col).doc(id).delete();
  return NextResponse.json({ status: 'ok' });
}
