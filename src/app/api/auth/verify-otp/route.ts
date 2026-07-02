import { NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firestore/collections';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { phone, email, phoneOtp, emailOtp } = await request.json();
    
    if (!phone || !email || !phoneOtp || !emailOtp) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const otpDocId = Buffer.from(`${phone}_${email}`).toString('base64');
    const otpRef = doc(db, COLLECTIONS.otps || 'otps', otpDocId);
    const otpSnap = await getDoc(otpRef);

    if (!otpSnap.exists()) {
      return NextResponse.json({ error: 'OTP request not found or expired' }, { status: 404 });
    }

    const data = otpSnap.data();

    // Check expiration
    if (Date.now() > data.expiresAt) {
      await deleteDoc(otpRef);
      return NextResponse.json({ error: 'OTPs have expired. Please request new ones.' }, { status: 400 });
    }

    // Verify OTPs
    if (data.phoneOtp !== phoneOtp || data.emailOtp !== emailOtp) {
      return NextResponse.json({ error: 'Invalid OTP(s) provided' }, { status: 400 });
    }

    // Mark as verified
    await updateDoc(otpRef, { verified: true });
    
    // Instead of forcing a full firebase auth session, we can drop a secure cookie 
    // to identify this user has verified their OTPs for the directory session.
    const cookieStore = await cookies();
    cookieStore.set('verified_directory_user', otpDocId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/'
    });

    return NextResponse.json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
