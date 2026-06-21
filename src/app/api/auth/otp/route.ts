import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

const API_KEY = 'e5b0e5f6cbdc6a23b9e0bd29ce8522c4';
const SENDER_ID = 'VECTRC';
const TEMPLATE_ID = '1707177349007929181';

function cleanPhoneNumber(phone: string): string {
  // Strip non-digit characters
  let cleaned = phone.replace(/\D/g, '');
  // If it's a 10-digit number, prepend 91 for India
  if (cleaned.length === 10) {
    cleaned = '91' + cleaned;
  }
  return cleaned;
}

async function findUserUidByPhone(firebasePhone: string): Promise<string | null> {
  // 1. Check in Firestore 'users' collection
  try {
    const usersSnap = await adminDb.collection('users')
      .where('phone', '==', firebasePhone)
      .limit(1)
      .get();
    if (!usersSnap.empty) {
      return usersSnap.docs[0].id;
    }
  } catch (err) {
    console.error('Error checking Firestore for phone:', err);
  }

  // 2. Check in Firebase Auth
  try {
    const userRecord = await adminAuth.getUserByPhoneNumber(firebasePhone);
    return userRecord.uid;
  } catch (err: any) {
    if (err.code !== 'auth/user-not-found') {
      console.error('Error checking Firebase Auth for phone:', err);
    }
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, phone, otp, uid, flow } = body;

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    const cleanedPhone = cleanPhoneNumber(phone);
    // Standard format with leading + for Firebase (e.g. +919876543210)
    const firebasePhone = '+' + cleanedPhone;

    if (action === 'send') {
      // Check if user exists (either in Firestore or Firebase Auth)
      const targetUid = await findUserUidByPhone(firebasePhone);
      const userExists = !!targetUid;

      if (flow === 'login' && !userExists) {
        return NextResponse.json({ error: 'This phone number is not registered. Please register first.' }, { status: 404 });
      }

      if (flow === 'register' && userExists) {
        return NextResponse.json({ error: 'This phone number is already registered. Please login instead.' }, { status: 400 });
      }

      // Generate a 6-digit OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity

      // Save to Firestore using admin SDK
      await adminDb.collection('phone_otps').doc(cleanedPhone).set({
        otp: otpCode,
        expiresAt: expiry,
        createdAt: new Date(),
      });

      // Construct DLT template message:
      // Template: Dear user, Your OTP login verification {#var#} This OTP is valid for {#var#} Thank you. VECTRA
      const messageText = `Dear user, Your OTP login verification ${otpCode} This OTP is valid for 5 mins Thank you. VECTRA`;

      // Correct MessageWall HTTP API endpoint (from Developer > HTTP API section in panel)
      // http://text.messagewall.in/api/smsapi?key=KEY&route=ROUTE&sender=SENDER&number=NUMBER&templateid=TEMPLATE_ID&sms=MESSAGE
      const smsUrl = `http://text.messagewall.in/api/smsapi?key=${API_KEY}&sender=${SENDER_ID}&number=${cleanedPhone}&route=2&templateid=${TEMPLATE_ID}&sms=${encodeURIComponent(messageText)}`;

      const smsResponse = await fetch(smsUrl, { method: 'GET' });
      const responseText = await smsResponse.text();
      console.log('MessageWall raw response:', responseText);

      // MessageWall returns a plain string like "1234|<messageId>" on success or an error message
      // Success is indicated by a numeric response code or a response starting with a digit
      const trimmed = responseText.trim();
      const isSuccess =
        /^\d/.test(trimmed) || // starts with digit (e.g. message ID)
        trimmed.toLowerCase().includes('success') ||
        trimmed.toLowerCase().includes('submitted');

      if (!isSuccess) {
        console.error('MessageWall Error Response:', trimmed);
        return NextResponse.json({ error: trimmed || 'Failed to send OTP via MessageWall' }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    if (action === 'verify') {
      if (!otp) {
        return NextResponse.json({ error: 'OTP is required' }, { status: 400 });
      }

      const otpDocRef = adminDb.collection('phone_otps').doc(cleanedPhone);
      const otpDoc = await otpDocRef.get();

      if (!otpDoc.exists) {
        return NextResponse.json({ error: 'No OTP request found. Please request a new one.' }, { status: 400 });
      }

      const data = otpDoc.data();
      const expiresAt = data?.expiresAt?.toDate();

      if (!data || data.otp !== otp || new Date() > expiresAt) {
        return NextResponse.json({ error: 'Invalid or expired OTP.' }, { status: 400 });
      }

      // Delete the OTP document after successful verification
      await otpDocRef.delete();

      let targetUid = uid;
      if (!targetUid) {
        // Try finding user by phone first
        targetUid = await findUserUidByPhone(firebasePhone);
        if (!targetUid) {
          // Create new user if not found anywhere
          try {
            const userRecord = await adminAuth.createUser({
              phoneNumber: firebasePhone,
              displayName: 'Phone User',
            });
            targetUid = userRecord.uid;
          } catch (error: any) {
            console.error('Error creating Firebase user:', error);
            return NextResponse.json({ error: 'Authentication service error' }, { status: 500 });
          }
        } else {
          // If we found them (e.g. from Firestore), ensure Firebase Auth object has the phone number set
          try {
            const authUser = await adminAuth.getUser(targetUid);
            if (!authUser.phoneNumber) {
              await adminAuth.updateUser(targetUid, {
                phoneNumber: firebasePhone,
              });
            }
          } catch (error: any) {
            console.warn('Could not sync phoneNumber to Firebase Auth:', error);
          }
        }
      } else {
        // Link scenario: update phone number on existing user
        try {
          await adminAuth.updateUser(targetUid, {
            phoneNumber: firebasePhone,
          });
        } catch (error: any) {
          console.error('Error updating phone number on user:', error);
          return NextResponse.json({ error: error.message || 'Failed to link phone number' }, { status: 500 });
        }
      }

      // Generate custom token for signing in
      const customToken = await adminAuth.createCustomToken(targetUid);
      return NextResponse.json({ customToken });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('OTP Route Exception:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
