import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const { phone, code } = await request.json();

    if (!phone || typeof phone !== 'string') {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }
    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'OTP code is required' }, { status: 400 });
    }

    // Clean phone number (keep only digits)
    const cleanedPhone = phone.replace(/\D/g, '');

    const apiKey = process.env.OTP_DEV_KEY;

    if (!apiKey) {
      console.error('OTP_DEV_KEY is not configured in environment');
      return NextResponse.json({ error: 'SMS service is currently unavailable.' }, { status: 500 });
    }

    // Call otp.dev to verify the code
    const res = await fetch(`https://api.otp.dev/v1/verifications?code=${encodeURIComponent(code)}&phone=${encodeURIComponent(cleanedPhone)}`, {
      method: 'GET',
      headers: {
        'X-OTP-Key': apiKey,
        'accept': 'application/json',
      },
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('otp.dev verify error:', data);
      return NextResponse.json({ error: data.message || 'OTP verification failed' }, { status: res.status });
    }

    // Check if verification data was returned (data.data array is non-empty)
    if (!data.data || data.data.length === 0) {
      return NextResponse.json({ error: 'Invalid or expired OTP. Please try again.' }, { status: 400 });
    }

    // Verification succeeded!
    // Construct the formatted E.164 phone number stored in Firestore (starts with '+')
    const formattedPhone = `+${cleanedPhone}`;

    // Query Firestore to see if a profile already exists for this phone number
    const usersRef = adminDb.collection('users');
    const querySnapshot = await usersRef.where('phone', '==', formattedPhone).limit(1).get();

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const profile = userDoc.data();
      const uid = profile.uid || userDoc.id;

      // Generate a Firebase Custom Token so the client can log in
      const customToken = await adminAuth.createCustomToken(uid);
      return NextResponse.json({ success: true, customToken, userExists: true });
    }

    return NextResponse.json({ success: true, userExists: false });
  } catch (err) {
    console.error('API Verify OTP Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
