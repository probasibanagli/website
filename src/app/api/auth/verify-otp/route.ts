import { NextResponse } from 'next/server';
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firestore/collections';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, phone, email, phoneOtp, emailOtp } = body;

    if (!type || !phone) {
      return NextResponse.json({ error: 'Type and Phone are required' }, { status: 400 });
    }

    const normalizedPhone = phone.trim();
    const otpDocId = Buffer.from(`phone_${normalizedPhone}`).toString('base64');
    const otpDocRef = doc(db, COLLECTIONS.otps, otpDocId);
    const otpSnap = await getDoc(otpDocRef);

    if (!otpSnap.exists()) {
      return NextResponse.json({ error: 'OTP request not found.' }, { status: 404 });
    }
    const otpData = otpSnap.data();

    if (Date.now() > otpData.expiresAt) {
      return NextResponse.json({ error: 'OTP has expired.' }, { status: 400 });
    }

    if (type === 'phone') {
      if (!phoneOtp) {
        return NextResponse.json({ error: 'Phone OTP required' }, { status: 400 });
      }
      
      const enteredPhoneOtp = phoneOtp.toString().trim();
      const storedPhoneOtp = otpData.phoneOtp?.toString().trim();

      if (enteredPhoneOtp !== storedPhoneOtp) {
        return NextResponse.json({ error: 'Invalid Phone OTP.' }, { status: 400 });
      }

      await updateDoc(otpDocRef, { phoneVerified: true });
      return NextResponse.json({ success: true, message: 'Phone verified' });

    } else if (type === 'email') {
      if (!email || !emailOtp) {
        return NextResponse.json({ error: 'Email and Email OTP required' }, { status: 400 });
      }

      const normalizedEmail = email.trim().toLowerCase();
      
      // Ensure email matches what was sent
      if (otpData.email !== normalizedEmail) {
        return NextResponse.json({ error: 'Email mismatch' }, { status: 400 });
      }

      const enteredEmailOtp = emailOtp.toString().trim();
      const storedEmailOtp = otpData.emailOtp?.toString().trim();

      if (enteredEmailOtp !== storedEmailOtp) {
        return NextResponse.json({ error: 'Invalid Email OTP.' }, { status: 400 });
      }

      await updateDoc(otpDocRef, { verified: true, verifiedAt: Date.now() });

      // Set cookie since both are verified
      const cookieStore = await cookies();
      const sessionToken = Buffer.from(`${normalizedPhone}_${normalizedEmail}_${Date.now()}`).toString('base64');
      cookieStore.set('verified_directory_user', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
        sameSite: 'lax',
      });

      return NextResponse.json({ success: true, message: 'Fully verified' });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
