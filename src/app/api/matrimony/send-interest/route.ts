import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      recipientEmail,
      senderName,
      senderProfileId,
      senderPhone,
      senderEmail,
      senderSocialHandle,
      senderProfession,
      senderAge,
      senderCity,
      senderProfilePageId,
    } = body;

    if (!recipientEmail) {
      return NextResponse.json({ error: 'Recipient email is required' }, { status: 400 });
    }

    if (!senderName) {
      return NextResponse.json({ error: 'Sender name is required' }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://probasibangali.in';
    const profileLink = `${baseUrl}/community/matrimonial/${senderProfilePageId}`;

    // Build contact details rows for the email
    const contactRows = [
      senderPhone ? `<tr><td style="padding:6px 12px;color:#666;">📞 Phone</td><td style="padding:6px 12px;font-weight:600;color:#333;">${senderPhone}</td></tr>` : '',
      senderEmail ? `<tr><td style="padding:6px 12px;color:#666;">✉️ Email</td><td style="padding:6px 12px;font-weight:600;color:#333;">${senderEmail}</td></tr>` : '',
      senderSocialHandle ? `<tr><td style="padding:6px 12px;color:#666;">🌐 Social</td><td style="padding:6px 12px;font-weight:600;color:#333;">${senderSocialHandle}</td></tr>` : '',
    ].filter(Boolean).join('');

    const htmlContent = `
      <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:560px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#D85A30,#7a2d14);padding:28px 24px;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">💕 Someone is Interested in You!</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">ProbasiBangali Matrimonial</p>
        </div>

        <!-- Body -->
        <div style="padding:28px 24px;background:#fff;">
          <p style="font-size:15px;color:#333;line-height:1.6;margin:0 0 20px;">
            Great news! <strong>${senderName}</strong> has shown interest in your matrimonial profile on ProbasiBangali. Here are their details:
          </p>

          <!-- Profile Summary Card -->
          <div style="background:#fdf7f4;border:1px solid #f3e0d6;border-radius:10px;padding:20px;margin-bottom:20px;">
            <h2 style="margin:0 0 4px;color:#D85A30;font-size:18px;">${senderName}</h2>
            <p style="margin:0 0 12px;color:#888;font-size:13px;">${senderProfileId || ''}</p>
            <table style="width:100%;font-size:14px;border-collapse:collapse;">
              ${senderAge ? `<tr><td style="padding:4px 0;color:#666;">🎂 Age</td><td style="padding:4px 0;font-weight:600;color:#333;">${senderAge} years</td></tr>` : ''}
              ${senderCity ? `<tr><td style="padding:4px 0;color:#666;">📍 City</td><td style="padding:4px 0;font-weight:600;color:#333;">${senderCity}</td></tr>` : ''}
              ${senderProfession ? `<tr><td style="padding:4px 0;color:#666;">💼 Profession</td><td style="padding:4px 0;font-weight:600;color:#333;">${senderProfession}</td></tr>` : ''}
            </table>
          </div>

          <!-- Contact Details -->
          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:16px 12px;margin-bottom:24px;">
            <h3 style="margin:0 0 10px;color:#166534;font-size:15px;">📋 Contact Details</h3>
            <table style="width:100%;font-size:14px;border-collapse:collapse;">
              ${contactRows || '<tr><td style="padding:6px 12px;color:#888;font-style:italic;">No contact details shared.</td></tr>'}
            </table>
          </div>

          <!-- CTA Button -->
          <div style="text-align:center;margin:24px 0 16px;">
            <a href="${profileLink}" style="display:inline-block;background:#D85A30;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:700;font-size:15px;">
              View Their Full Profile →
            </a>
          </div>

          <p style="font-size:13px;color:#999;text-align:center;line-height:1.5;">
            If you are interested, you can reach out to them directly using the contact details above, or view their full profile on ProbasiBangali.
          </p>
        </div>

        <!-- Footer -->
        <div style="background:#f9fafb;padding:16px 24px;border-top:1px solid #e5e7eb;text-align:center;">
          <p style="margin:0;color:#9ca3af;font-size:11px;">
            ProbasiBangali Community Portal — Connecting Bengali families in Tamil Nadu
          </p>
        </div>
      </div>
    `;

    // Send real email if SMTP credentials are configured
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
          from: `"ProbasiBangali Matrimonial" <${gmailEmail}>`,
          to: recipientEmail.trim().toLowerCase(),
          subject: `💕 ${senderName} showed interest in your profile — ProbasiBangali`,
          html: htmlContent,
          text: `${senderName} (${senderProfileId || ''}) has shown interest in your matrimonial profile on ProbasiBangali.\n\nAge: ${senderAge || 'N/A'}\nCity: ${senderCity || 'N/A'}\nProfession: ${senderProfession || 'N/A'}\nPhone: ${senderPhone || 'N/A'}\nEmail: ${senderEmail || 'N/A'}\n\nView their profile: ${profileLink}\n\nRegards,\nProbasiBangali Team`,
        };

        await transporter.sendMail(mailOptions);
        console.log(`[Interest Email] Sent successfully to ${recipientEmail}`);
      } catch (mailError) {
        console.error('[Interest Email] Nodemailer Error:', mailError);
        // Don't fail the request — interest is still saved locally
        return NextResponse.json({ success: true, emailSent: false, reason: 'Email delivery failed' });
      }
    } else {
      console.warn('[Interest Email] GMAIL_EMAIL or GMAIL_PASSWORD not configured. Skipping email.');
      return NextResponse.json({ success: true, emailSent: false, reason: 'SMTP not configured' });
    }

    return NextResponse.json({ success: true, emailSent: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    console.error('[Interest Email] Route Exception:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
