import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const snap = await adminDb.collection('users')
      .where('email', '==', email.trim().toLowerCase())
      .limit(1)
      .get();

    if (snap.empty) {
      return NextResponse.json({ isAdmin: false, isFirstLogin: false });
    }

    const userDoc = snap.docs[0];
    const data = userDoc.data();

    const isAdmin = data.role === 'admin';
    const isFirstLogin = isAdmin && data.is_first_login === true;

    return NextResponse.json({
      isAdmin,
      isFirstLogin,
      phone: data.phone || '',
    });
  } catch (error: any) {
    console.error('Check Admin Exception:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
