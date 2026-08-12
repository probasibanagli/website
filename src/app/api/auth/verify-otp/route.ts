import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
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
    const { type, phone, email, phoneOtp, emailOtp, doctorId } = body;

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

      // Automatically email doctor's details if doctorId is provided
      if (doctorId) {
        try {
          const doctorDoc = await getDoc(doc(db, COLLECTIONS.bengali_doctors, doctorId));
          if (doctorDoc.exists()) {
            const docData = doctorDoc.data();
            const name = docData.doctor_name || 'Dr.';
            const specs = docData.specialization || 'General';
            const exp = docData.experience || '';
            const qual = docData.qualifications ? docData.qualifications.join(', ') : '';
            const timings = docData.consultation_timings || '';
            const emailAddr = docData.email || 'N/A';
            const ph = docData.phone || 'N/A';
            
            // Get affiliated hospitals
            const hospitalNames: string[] = [];
            const hospIds = docData.hospital_ids || (docData.hospital_id ? [docData.hospital_id] : []);
            for (const hid of hospIds) {
              const hdoc = await getDoc(doc(db, COLLECTIONS.hospitals, hid));
              if (hdoc.exists()) {
                hospitalNames.push(hdoc.data().name);
              }
            }

            const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
            });
            
            const htmlContent = `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; color: #1f2937;">
                <h2 style="color: #ef4444; border-bottom: 2px solid #fee2e2; padding-bottom: 12px; margin-top: 0;">Doctor Profile Details</h2>
                <p>Hello,</p>
                <p>As requested, here are the details of the doctor you verified:</p>
                
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; width: 150px; border-bottom: 1px solid #f3f4f6;">Name:</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f3f4f6;">Specialization:</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${specs}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f3f4f6;">Qualification:</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${qual || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f3f4f6;">Experience:</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${exp || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f3f4f6;">Consultation:</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${timings || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f3f4f6;">Associated Hospitals:</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${hospitalNames.join(', ') || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f3f4f6;">Contact Phone:</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${ph}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f3f4f6;">Contact Email:</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${emailAddr}</td>
                  </tr>
                </table>
                
                <p style="font-size: 12px; color: #9ca3af; margin-top: 30px; border-top: 1px solid #f3f4f6; padding-top: 12px;">
                  This is an automated email from Probasi Bangali Directory. If you did not request this, please disregard this email.
                </p>
              </div>
            `;

            await transporter.sendMail({
              from: `"Probasi Bangali Directory" <${process.env.SMTP_USER}>`,
              to: normalizedEmail,
              subject: `Doctor Profile: ${name} – Probasi Bangali`,
              html: htmlContent,
            });
          }
        } catch (smtpErr) {
          console.error('Failed to send SMTP email with doctor details:', smtpErr);
        }
      }

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
