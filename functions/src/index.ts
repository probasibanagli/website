import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';
import { defineString } from 'firebase-functions/params';

const gmailEmailParam = defineString('GMAIL_EMAIL');
const gmailPasswordParam = defineString('GMAIL_PASSWORD');

// Initialize Firebase Admin SDK
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Validates email format.
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate a secure 6-digit OTP.
 */
function generateOTP(): string {
  // Generates values between 100000 and 999999
  const num = Math.floor(100000 + Math.random() * 900000);
  return num.toString();
}

/**
 * Send OTP via Gmail SMTP using Nodemailer and Firebase Config variables.
 * Firebase Config should be set via CLI:
 * firebase functions:config:set gmail.email="USER@gmail.com" gmail.password="APP_PASSWORD"
 */
export const sendOtp = functions.https.onCall(async (data, context) => {
  const email = data.email;

  // 1. Input Validation
  if (!email || typeof email !== 'string') {
    throw new functions.https.HttpsError('invalid-argument', 'The function must be called with a valid email.');
  }

  const cleanEmail = email.trim().toLowerCase();
  if (!isValidEmail(cleanEmail)) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid email address format.');
  }

  try {
    // 2. Rate Limiting Check (Only allow sending a new OTP if 60 seconds have passed since last)
    const otpRef = db.collection('email_otps').doc(cleanEmail);
    const docSnap = await otpRef.get();
    if (docSnap.exists) {
      const existingData = docSnap.data();
      const lastSent = existingData?.createdAt?.toDate();
      if (lastSent && Date.now() - lastSent.getTime() < 60 * 1000) {
        throw new functions.https.HttpsError(
          'resource-exhausted',
          'Please wait 60 seconds before requesting another OTP.'
        );
      }
    }

    // 3. Generate OTP and Expiry (5 minutes)
    const otpCode = generateOTP();
    const now = new Date();
    const expiry = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes validity

    // Store in Firestore
    await otpRef.set({
      otp: otpCode,
      createdAt: admin.firestore.Timestamp.fromDate(now),
      expiresAt: admin.firestore.Timestamp.fromDate(expiry),
    });

    // 4. Retrieve Credentials
    const gmailEmail = gmailEmailParam.value();
    const gmailPassword = gmailPasswordParam.value();

    if (!gmailEmail || !gmailPassword) {
      console.error('SMTP credentials are not configured in Firebase Config.');
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Email service is not currently configured.'
      );
    }

    // 5. Send Mail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailEmail,
        pass: gmailPassword,
      },
    });

    const mailOptions = {
      from: `"ProbasiBangali Support" <${gmailEmail}>`,
      to: cleanEmail,
      subject: 'Your Email Verification Code - ProbasiBangali',
      text: `Hello,\n\nYour 6-digit verification code is: ${otpCode}\n\nThis OTP is valid for 5 minutes. Please do not share this code with anyone.\n\nThank you,\nProbasiBangali Team`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px; max-width: 500px;">
          <h2 style="color: #D85A30; text-align: center;">Email Verification Code</h2>
          <p>Hello,</p>
          <p>Your 6-digit verification code is:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 28px; font-weight: bold; letter-spacing: 5px; background: #f7f7f7; padding: 10px 20px; border-radius: 5px; border: 1px dashed #ccc; color: #333;">
              ${otpCode}
            </span>
          </div>
          <p style="color: #666; font-size: 12px;">This OTP is valid for <strong>5 minutes</strong>. If you did not request this code, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin-top: 20px;" />
          <p style="color: #999; font-size: 11px; text-align: center;">ProbasiBangali Community Portal</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: 'OTP sent successfully.' };

  } catch (error: any) {
    console.error('Error in sendOtp:', error);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError('internal', error.message || 'Failed to send OTP.');
  }
});

/**
 * Verify OTP entered by user.
 */
export const verifyOtp = functions.https.onCall(async (data, context) => {
  const { email, otp } = data;

  // 1. Input Validation
  if (!email || typeof email !== 'string' || !otp || typeof otp !== 'string') {
    throw new functions.https.HttpsError('invalid-argument', 'Email and OTP code are required.');
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanOtp = otp.trim();

  try {
    // 2. Fetch OTP from Firestore
    const otpRef = db.collection('email_otps').doc(cleanEmail);
    const docSnap = await otpRef.get();

    if (!docSnap.exists) {
      throw new functions.https.HttpsError('not-found', 'No OTP request found for this email.');
    }

    const otpData = docSnap.data();
    const expiresAt = otpData?.expiresAt?.toDate();

    // 3. Check Expiry
    if (expiresAt && Date.now() > expiresAt.getTime()) {
      await otpRef.delete(); // Delete expired OTP
      throw new functions.https.HttpsError('failed-precondition', 'Verification code has expired. Please request a new one.');
    }

    // 4. Validate OTP
    if (otpData?.otp !== cleanOtp) {
      throw new functions.https.HttpsError('permission-denied', 'Incorrect verification code.');
    }

    // 5. Delete on Success (Prevent replay attacks)
    await otpRef.delete();

    return { success: true, message: 'Verification successful.' };

  } catch (error: any) {
    console.error('Error in verifyOtp:', error);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError('internal', error.message || 'Failed to verify OTP.');
  }
});
