import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // 1. Get user profile
    const snap = await adminDb.collection('users')
      .where('email', '==', email.trim().toLowerCase())
      .limit(1)
      .get();

    if (snap.empty) {
      return NextResponse.json({ error: 'Admin account not found.' }, { status: 404 });
    }

    const userDoc = snap.docs[0];
    const data = userDoc.data();

    if (data.role !== 'admin' || data.is_first_login === false) {
      return NextResponse.json({ error: 'Action not allowed.' }, { status: 400 });
    }

    // 2. Update password in Firebase Auth
    const userRecord = await adminAuth.getUserByEmail(email.trim().toLowerCase());
    await adminAuth.updateUser(userRecord.uid, {
      password: password,
      emailVerified: true,
    });

    // 3. Update status in Firestore
    await adminDb.collection('users').doc(userRecord.uid).update({
      is_first_login: false,
      phone_verified: true,
      email_verified: true,
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Setup Admin Password Exception:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
