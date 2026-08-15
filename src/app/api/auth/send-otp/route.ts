import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firestore/collections';

// SMS Gateway Config
const SMS_API_KEY = process.env.SMS_API_KEY || 'e5b0e5f6cbdc6a23b9e0bd29ce8522c4';
const SENDER_ID = process.env.SENDER_ID || 'VECTRC';
const TEMPLATE_ID = process.env.TEMPLATE_ID || '1707177349007929181';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, phone, email } = body;

    if (!type || !phone) {
      return NextResponse.json({ error: 'Type and Phone are required' }, { status: 400 });
    }

    const normalizedPhone = phone.trim();
    const otpCollection = collection(db, COLLECTIONS.otps);

    if (type === 'phone') {
      // ── Step 1: Phone OTP ──
      
      // Check if already completely verified with any email
      const existingQuery = query(otpCollection, where('phone', '==', normalizedPhone), where('verified', '==', true));
      const existingSnap = await getDocs(existingQuery);
      if (!existingSnap.empty) {
        const existingData = existingSnap.docs[0].data();
        if (existingData.expiresAt && Date.now() < existingData.expiresAt) {
          return NextResponse.json({
            success: true,
            alreadyVerified: true,
            message: 'Your phone is already verified.',
          });
        }
      }

      const phoneOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 10 * 60 * 1000;
      
      // We use just phone as doc ID for step 1
      const otpDocId = Buffer.from(`phone_${normalizedPhone}`).toString('base64');
      await setDoc(doc(db, COLLECTIONS.otps, otpDocId), {
        phone: normalizedPhone,
        phoneOtp,
        expiresAt,
        phoneVerified: false,
        verified: false,
        createdAt: Date.now(),
      });

      console.log(`[DEV] Phone OTP for ${normalizedPhone}: ${phoneOtp}`);

      // Send SMS
      try {
        const message = `Dear user, Your OTP login verification ${phoneOtp} This OTP is valid for 10 minutes Thank you. VECTRA`;
        if (process.env.NODE_ENV === 'development' && process.env.SEND_REAL_SMS !== 'true') {
          console.log(`[DEV] SMS Not Sent (set SEND_REAL_SMS=true to send) | To: ${normalizedPhone} | Message: ${message}`);
        } else {
          const smsUrl = `https://api.textlocal.in/send/?apikey=${SMS_API_KEY}&numbers=${normalizedPhone}&sender=${SENDER_ID}&message=${encodeURIComponent(message)}&template_id=${TEMPLATE_ID}`;
          if (process.env.NODE_ENV === 'development') {
            console.log(`[DEV] Sending Real SMS to ${normalizedPhone}: ${smsUrl}`);
          }
          const response = await fetch(smsUrl);
          const responseText = await response.text();
          console.log(`SMS Gateway Response:`, responseText);
        }
      } catch (e) {
        console.error('SMS Error:', e);
      }

      return NextResponse.json({ success: true, message: 'Phone OTP sent' });

    } else if (type === 'email') {
      // ── Step 2: Email OTP ──
      if (!email) {
        return NextResponse.json({ error: 'Email is required for email step' }, { status: 400 });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const otpDocId = Buffer.from(`phone_${normalizedPhone}`).toString('base64');
      
      const emailOtp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Update the existing document with email info
      await setDoc(doc(db, COLLECTIONS.otps, otpDocId), {
        email: normalizedEmail,
        emailOtp,
      }, { merge: true });

      console.log(`[DEV] Email OTP for ${normalizedEmail}: ${emailOtp}`);

      // Send Email
      try {
        const smtpUser = process.env.SMTP_USER || process.env.GMAIL_EMAIL;
        let smtpPass = process.env.SMTP_PASS || process.env.GMAIL_PASSWORD || '';
        if (smtpPass.startsWith('"') && smtpPass.endsWith('"')) {
          smtpPass = smtpPass.slice(1, -1);
        }

        if (smtpUser && smtpPass) {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: smtpUser, pass: smtpPass },
          });
          await transporter.sendMail({
            from: `"Probasi Bangali Directory" <${smtpUser}>`,
            to: normalizedEmail,
            subject: 'Your Doctor Directory OTP – Probasi Bangali',
            html: `
              <div style="font-family: Arial, sans-serif; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px; max-width: 480px;">
                <h2 style="color: #B81D18; margin-top: 0;">Email Verification Code</h2>
                <p>Hello,</p>
                <p>Your 6-digit verification OTP is:</p>
                <div style="text-align: center; margin: 24px 0;">
                  <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; background: #f8fafc; padding: 12px 24px; border-radius: 8px; border: 1px dashed #cbd5e1; color: #1e293b;">
                    ${emailOtp}
                  </span>
                </div>
                <p style="color: #64748b; font-size: 13px;">This OTP is valid for <strong>10 minutes</strong>. Do not share this code with anyone.</p>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin-top: 24px;" />
                <p style="color: #94a3b8; font-size: 11px; text-align: center;">Probasi Bangali Emergency & Community Portal</p>
              </div>
            `,
          });
          console.log(`[Email OTP] Real email sent successfully to ${normalizedEmail}`);
        } else {
          console.log(`[DEV / SIMULATION] Email OTP generated for ${normalizedEmail}: ${emailOtp}`);
        }
      } catch (e) {
        console.error('Email Sending Error:', e);
      }

      return NextResponse.json({ success: true, message: 'Email OTP sent' });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });

  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json({ error: 'Failed to process request.' }, { status: 500 });
  }
}
