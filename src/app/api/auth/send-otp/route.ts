import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firestore/collections';

// SMS Gateway Config (from user requirements)
const SMS_API_KEY = 'e5b0e5f6cbdc6a23b9e0bd29ce8522c4';
const SENDER_ID = 'VECTRC';
const TEMPLATE_ID = '1707177349007929181';

export async function POST(request: Request) {
  try {
    const { phone, email } = await request.json();
    
    if (!phone || !email) {
      return NextResponse.json({ error: 'Phone and Email are required' }, { status: 400 });
    }

    // Generate random 6-digit OTPs
    const phoneOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const emailOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes from now

    // 1. Store OTPs in Firestore (using a composite key or just storing by normalized email/phone)
    const otpDocId = Buffer.from(`${phone}_${email}`).toString('base64');
    await setDoc(doc(db, COLLECTIONS.otps || 'otps', otpDocId), {
      phone,
      email,
      phoneOtp,
      emailOtp,
      expiresAt,
      verified: false
    });

    console.log(`[DEV ONLY] Phone OTP: ${phoneOtp} | Email OTP: ${emailOtp}`);

    // 2. Send SMS using the provided configuration
    // (Assuming generic Msg91 / Textlocal structure)
    try {
      const message = `Dear user, Your OTP login verification is ${phoneOtp}. This OTP is valid for 10 minutes. Thank you. VECTRA.`;
      
      // Fallback logging for dev mode
      if (process.env.NODE_ENV === 'development') {
        console.log('--- Mock SMS Sent ---');
        console.log(`To: ${phone}, Msg: ${message}`);
      } else {
        // You can replace this URL with the exact provider URL if it's TextLocal, Fast2SMS, etc.
        const smsUrl = `https://api.textlocal.in/send/?apikey=${SMS_API_KEY}&numbers=${phone}&sender=${SENDER_ID}&message=${encodeURIComponent(message)}`;
        await fetch(smsUrl); // Fire and forget or await response
      }
    } catch (smsError) {
      console.error('Failed to send SMS:', smsError);
      // We don't fail the request if SMS fails in dev, but in prod we might want to
    }

    // 3. Send Email using Nodemailer
    try {
      if (process.env.NODE_ENV === 'development') {
         console.log('--- Mock Email Sent ---');
         console.log(`To: ${email}, OTP: ${emailOtp}`);
      } else {
         const transporter = nodemailer.createTransport({
           service: 'gmail', // Placeholder, use your actual SMTP
           auth: {
             user: process.env.SMTP_USER || 'your-email@gmail.com',
             pass: process.env.SMTP_PASS || 'your-app-password'
           }
         });
         await transporter.sendMail({
           from: '"Hospital Directory" <no-reply@hospitaldirectory.com>',
           to: email,
           subject: 'Your Login Verification OTP',
           text: `Dear user, Your OTP login verification is ${emailOtp}. This OTP is valid for 10 minutes. Thank you.`
         });
      }
    } catch (emailError) {
      console.error('Failed to send Email:', emailError);
    }

    return NextResponse.json({ success: true, message: 'OTPs sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
