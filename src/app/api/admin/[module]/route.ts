import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import type { ModuleKey, PermissionLevel } from '@/types';

const MODULE_COLLECTIONS: Record<string, string> = {
  stay: 'listings',
  food: 'food_listings',
  travel: 'travel_info',
  emergency: 'hospitals',
  community: 'community_groups',
  services: 'colleges',
  blog: 'blog_posts',
};

function hasPermission(actual: PermissionLevel, required: PermissionLevel): boolean {
  const levels: PermissionLevel[] = ['none', 'view', 'edit', 'manage'];
  return levels.indexOf(actual) >= levels.indexOf(required);
}

async function verifyAndAuthorize(request: Request, module: string, required: PermissionLevel) {
  const auth = request.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) return { error: 'No token', status: 401 };
  try {
    const decoded = await adminAuth.verifyIdToken(auth.split('Bearer ')[1]);
    const userDoc = await adminDb.collection('users').doc(decoded.uid).get();
    if (!userDoc.exists) return { error: 'User not found', status: 404 };
    const data = userDoc.data()! as any;
    if (data.role === 'superadmin') return { user: data };
    if (data.role !== 'admin') return { error: 'Not admin', status: 403 };
    const perm = data.permissions?.[module] || 'none';
    if (!hasPermission(perm, required)) return { error: 'Insufficient permission', status: 403 };
    return { user: data };
  } catch { return { error: 'Invalid token', status: 401 }; }
}

export async function GET(request: Request, ctx: RouteContext<'/api/admin/[module]'>) {
  const { module } = await ctx.params;
  const col = MODULE_COLLECTIONS[module];
  if (!col) return NextResponse.json({ error: 'Unknown module' }, { status: 400 });

  const result = await verifyAndAuthorize(request, module, 'view');
  if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status });

  const snap = await adminDb.collection(col).get();
  return NextResponse.json({ items: snap.docs.map(d => ({ id: d.id, ...d.data() })) });
}

export async function POST(request: Request, ctx: RouteContext<'/api/admin/[module]'>) {
  const { module } = await ctx.params;
  const col = MODULE_COLLECTIONS[module];
  if (!col) return NextResponse.json({ error: 'Unknown module' }, { status: 400 });

  const result = await verifyAndAuthorize(request, module, 'edit');
  if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status });

  const body = await request.json();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  await adminDb.collection(col).doc(id).set({ ...body, id, created_at: new Date().toISOString() });
  return NextResponse.json({ id });
}
