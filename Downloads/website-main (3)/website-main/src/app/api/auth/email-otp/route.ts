import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, email, otp } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (action === 'send') {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity

      await adminDb.collection('email_otps').doc(email).set({
        otp: otpCode,
        expiresAt: expiry,
        createdAt: new Date(),
      });

      console.log(`[Email OTP] Generating OTP ${otpCode} for ${email}`);

      // Send real email if SMTP credentials are set
      const gmailEmail = process.env.GMAIL_EMAIL;
      let gmailPassword = process.env.GMAIL_PASSWORD || '';
      if (gmailPassword.startsWith('"') && gmailPassword.endsWith('"')) {
        gmailPassword = gmailPassword.slice(1, -1);
      }

      if (gmailEmail && gmailPassword) {
        try {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: gmailEmail,
              pass: gmailPassword,
            },
          });

          const mailOptions = {
            from: `"ProbasiBangali Support" <${gmailEmail}>`,
            to: email.trim().toLowerCase(),
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
          console.log(`[Email OTP] Real email sent successfully to ${email}`);
        } catch (mailError) {
          console.error('[Email OTP] Nodemailer Send Error:', mailError);
        }
      } else {
        console.warn('[Email OTP] GMAIL_EMAIL or GMAIL_PASSWORD is not configured in .env.local. Local simulation only.');
      }

      // Returning the OTP in response for local testing/simulation ease
      return NextResponse.json({ success: true, debugOtp: otpCode });
    }

    if (action === 'verify') {
      if (!otp) {
        return NextResponse.json({ error: 'OTP is required' }, { status: 400 });
      }

      const docRef = adminDb.collection('email_otps').doc(email);
      const docSnap = await docRef.get();

      if (!docSnap.exists) {
        return NextResponse.json({ error: 'No OTP request found for this email.' }, { status: 400 });
      }

      const data = docSnap.data();
      const expiresAt = data?.expiresAt?.toDate();

      if (!data || data.otp !== otp || new Date() > expiresAt) {
        return NextResponse.json({ error: 'Invalid or expired OTP.' }, { status: 400 });
      }

      // Delete OTP on success
      await docRef.delete();

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Email OTP Route Exception:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
