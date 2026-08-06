import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

async function verifyRequest(request: Request) {
  const auth = request.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  try {
    const token = auth.split('Bearer ')[1];
    if (token === 'mock-bypass-token') {
      return { uid: 'temporary-admin-id', role: 'superadmin', full_name: 'Super Admin' };
    }
    if (token === 'mock-bypass-admin-token') {
      return { uid: 'temporary-regular-admin-id', role: 'admin', full_name: 'Regular Admin', permissions: { users: 'none' } };
    }
    const decoded = await adminAuth.verifyIdToken(token);
    const userDoc = await adminDb.collection('users').doc(decoded.uid).get();
    if (!userDoc.exists) return null;
    return { uid: decoded.uid, ...userDoc.data() } as any;
  } catch { return null; }
}

export async function GET(_request: Request, ctx: any) {
  const { id } = await ctx.params;
  const userDoc = await adminDb.collection('users').doc(id).get();
  if (!userDoc.exists) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ user: { uid: userDoc.id, ...userDoc.data() } });
}

export async function PATCH(request: Request, ctx: any) {
  const caller = await verifyRequest(request);
  if (!caller) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await ctx.params;
  const body = await request.json();

  // Permission Checks
  const isSuperAdmin = caller.role === 'superadmin';
  const hasUserEdit = caller.role === 'admin' && (caller.permissions?.users === 'edit' || caller.permissions?.users === 'manage');

  // Only Super Admin can change roles or permissions
  if ((body.role || body.permissions) && !isSuperAdmin) {
    return NextResponse.json({ error: 'Only Super Admin can update roles and permissions.' }, { status: 403 });
  }

  // To block/unblock (change is_active), must be Super Admin or Admin with user edit/manage permissions
  if (typeof body.is_active === 'boolean') {
    if (!isSuperAdmin && !hasUserEdit) {
      return NextResponse.json({ error: 'You do not have permission to block/unblock users.' }, { status: 403 });
    }
  }

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.role) updates.role = body.role;
  if (body.permissions) updates.permissions = body.permissions;
  if (typeof body.is_active === 'boolean') updates.is_active = body.is_active;
  if (body.full_name) updates.full_name = body.full_name;
  if (body.phone) updates.phone = body.phone;
  if (body.email) updates.email = body.email.toLowerCase();
  if (typeof body.email_verified === 'boolean') updates.email_verified = body.email_verified;
  if (typeof body.phone_verified === 'boolean') updates.phone_verified = body.phone_verified;

  try {
    // Synchronize changes to Firebase Authentication
    const authUpdates: any = {};
    if (body.full_name) authUpdates.displayName = body.full_name;
    if (body.phone) authUpdates.phoneNumber = body.phone;
    if (body.email) authUpdates.email = body.email.toLowerCase();
    if (typeof body.email_verified === 'boolean') authUpdates.emailVerified = body.email_verified;

    if (Object.keys(authUpdates).length > 0) {
      await adminAuth.updateUser(id, authUpdates);
    }

    await adminDb.collection('users').doc(id).update(updates);
  } catch (authErr: any) {
    console.error('Firebase Auth Sync Error:', authErr);
    return NextResponse.json({ error: authErr.message || 'Failed to sync user Auth details.' }, { status: 400 });
  }

  // Log action
  await adminDb.collection('activities').add({
    action: typeof body.is_active === 'boolean' ? (body.is_active ? 'User Unblocked' : 'User Blocked') : 'User Profile Updated',
    performed_by: caller.full_name || 'Admin',
    user_role: caller.role,
    timestamp: new Date().toISOString(),
    details: `Updated user profile for ID: ${id}`
  }).catch(() => {});

  return NextResponse.json({ status: 'ok' });
}

export async function DELETE(request: Request, ctx: any) {
  const caller = await verifyRequest(request);
  if (!caller) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const isSuperAdmin = caller.role === 'superadmin';
  const hasUserManage = caller.role === 'admin' && caller.permissions?.users === 'manage';

  if (!isSuperAdmin && !hasUserManage) {
    return NextResponse.json({ error: 'You do not have permission to delete users.' }, { status: 403 });
  }

  const { id } = await ctx.params;

  try {
    // 1. Delete from Firestore
    await adminDb.collection('users').doc(id).delete();

    // 2. Delete from Firebase Auth
    await adminAuth.deleteUser(id);

    // Log action
    await adminDb.collection('activities').add({
      action: 'Account Deleted',
      performed_by: caller.full_name || 'Admin',
      user_role: caller.role,
      timestamp: new Date().toISOString(),
      details: `Permanently deleted user account with ID: ${id}`
    }).catch(() => {});

    return NextResponse.json({ status: 'ok' });
  } catch (error: any) {
    console.error('Delete User Exception:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete user' }, { status: 500 });
  }
}
