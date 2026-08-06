import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      // Recipient info
      recipientEmail,
      recipientName,
      recipientProfileId,
      recipientPhone,
      recipientSocialHandle,
      recipientProfession,
      recipientAge,
      recipientCity,
      recipientProfilePageId,
      // Sender info
      senderName,
      senderProfileId,
      senderPhone,
      senderEmail,
      senderSocialHandle,
      senderProfession,
      senderAge,
      senderCity,
      senderProfilePageId,
      // Sender's registered account email
      senderRegisteredEmail,
    } = body;

    if (!recipientEmail) {
      return NextResponse.json({ error: 'Recipient email is required' }, { status: 400 });
    }

    if (!senderName) {
      return NextResponse.json({ error: 'Sender name is required' }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://probasibangali.in';
    const senderProfileLink = `${baseUrl}/community/matrimonial/${senderProfilePageId}`;
    const recipientProfileLink = `${baseUrl}/community/matrimonial/${recipientProfilePageId}`;

    // ─── Helper: build an interest email ───
    function buildEmailHtml({
      heading,
      introText,
      personName,
      personProfileId,
      personAge,
      personCity,
      personProfession,
      personPhone,
      personEmail,
      personSocial,
      profileLink,
    }: Record<string, string | undefined>) {
      const contactRows = [
        personPhone ? `<tr><td style="padding:6px 12px;color:#666;">📞 Phone</td><td style="padding:6px 12px;font-weight:600;color:#333;">${personPhone}</td></tr>` : '',
        personEmail ? `<tr><td style="padding:6px 12px;color:#666;">✉️ Email</td><td style="padding:6px 12px;font-weight:600;color:#333;">${personEmail}</td></tr>` : '',
        personSocial ? `<tr><td style="padding:6px 12px;color:#666;">🌐 Social</td><td style="padding:6px 12px;font-weight:600;color:#333;">${personSocial}</td></tr>` : '',
      ].filter(Boolean).join('');

      return `
        <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:560px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#D85A30,#7a2d14);padding:28px 24px;text-align:center;">
            <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">${heading}</h1>
            <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">ProbasiBangali Matrimonial</p>
          </div>
          <div style="padding:28px 24px;background:#fff;">
            <p style="font-size:15px;color:#333;line-height:1.6;margin:0 0 20px;">${introText}</p>
            <div style="background:#fdf7f4;border:1px solid #f3e0d6;border-radius:10px;padding:20px;margin-bottom:20px;">
              <h2 style="margin:0 0 4px;color:#D85A30;font-size:18px;">${personName}</h2>
              <p style="margin:0 0 12px;color:#888;font-size:13px;">${personProfileId || ''}</p>
              <table style="width:100%;font-size:14px;border-collapse:collapse;">
                ${personAge ? `<tr><td style="padding:4px 0;color:#666;">🎂 Age</td><td style="padding:4px 0;font-weight:600;color:#333;">${personAge} years</td></tr>` : ''}
                ${personCity ? `<tr><td style="padding:4px 0;color:#666;">📍 City</td><td style="padding:4px 0;font-weight:600;color:#333;">${personCity}</td></tr>` : ''}
                ${personProfession ? `<tr><td style="padding:4px 0;color:#666;">💼 Profession</td><td style="padding:4px 0;font-weight:600;color:#333;">${personProfession}</td></tr>` : ''}
              </table>
            </div>
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:16px 12px;margin-bottom:24px;">
              <h3 style="margin:0 0 10px;color:#166534;font-size:15px;">📋 Contact Details</h3>
              <table style="width:100%;font-size:14px;border-collapse:collapse;">
                ${contactRows || '<tr><td style="padding:6px 12px;color:#888;font-style:italic;">No contact details shared.</td></tr>'}
              </table>
            </div>
            <div style="text-align:center;margin:24px 0 16px;">
              <a href="${profileLink}" style="display:inline-block;background:#D85A30;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:700;font-size:15px;">
                View Their Full Profile →
              </a>
            </div>
            <p style="font-size:13px;color:#999;text-align:center;line-height:1.5;">
              If you are interested, you can reach out to them directly using the contact details above.
            </p>
          </div>
          <div style="background:#f9fafb;padding:16px 24px;border-top:1px solid #e5e7eb;text-align:center;">
            <p style="margin:0;color:#9ca3af;font-size:11px;">
              ProbasiBangali Community Portal — Connecting Bengali families in Tamil Nadu
            </p>
          </div>
        </div>
      `;
    }

    // Email 1: To the recipient — "Someone is interested in you"
    const emailToRecipient = buildEmailHtml({
      heading: '💕 Someone is Interested in You!',
      introText: `Great news! <strong>${senderName}</strong> has shown interest in your matrimonial profile on ProbasiBangali. Here are their details:`,
      personName: senderName,
      personProfileId: senderProfileId,
      personAge: senderAge?.toString(),
      personCity: senderCity,
      personProfession: senderProfession,
      personPhone: senderPhone,
      personEmail: senderEmail,
      personSocial: senderSocialHandle,
      profileLink: senderProfileLink,
    });

    // Email 2: To the sender — "Here are the contact details of the person you're interested in"
    const emailToSender = buildEmailHtml({
      heading: '📬 Interest Confirmed — Contact Details Inside',
      introText: `You expressed interest in <strong>${recipientName || 'a profile'}</strong> on ProbasiBangali Matrimonial. As promised, here are their details shared securely via email:`,
      personName: recipientName,
      personProfileId: recipientProfileId,
      personAge: recipientAge?.toString(),
      personCity: recipientCity,
      personProfession: recipientProfession,
      personPhone: recipientPhone,
      personEmail: recipientEmail,
      personSocial: recipientSocialHandle,
      profileLink: recipientProfileLink,
    });

    // Send real emails if SMTP credentials are configured
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

        // Send to recipient
        await transporter.sendMail({
          from: `"ProbasiBangali Matrimonial" <${gmailEmail}>`,
          to: recipientEmail.trim().toLowerCase(),
          subject: `💕 ${senderName} showed interest in your profile — ProbasiBangali`,
          html: emailToRecipient,
          text: `${senderName} (${senderProfileId || ''}) has shown interest in your matrimonial profile on ProbasiBangali.\n\nAge: ${senderAge || 'N/A'}\nCity: ${senderCity || 'N/A'}\nProfession: ${senderProfession || 'N/A'}\nPhone: ${senderPhone || 'N/A'}\nEmail: ${senderEmail || 'N/A'}\n\nView their profile: ${senderProfileLink}\n\nRegards,\nProbasiBangali Team`,
        });
        console.log(`[Interest Email] Sent to recipient: ${recipientEmail}`);

        // Send to sender (reverse email with recipient's details)
        const senderMailTo = (senderRegisteredEmail || senderEmail || '').trim().toLowerCase();
        if (senderMailTo) {
          await transporter.sendMail({
            from: `"ProbasiBangali Matrimonial" <${gmailEmail}>`,
            to: senderMailTo,
            subject: `📬 Contact details of ${recipientName || 'your match'} — ProbasiBangali`,
            html: emailToSender,
            text: `You expressed interest in ${recipientName || 'a profile'} on ProbasiBangali Matrimonial.\n\nAge: ${recipientAge || 'N/A'}\nCity: ${recipientCity || 'N/A'}\nProfession: ${recipientProfession || 'N/A'}\nPhone: ${recipientPhone || 'N/A'}\nEmail: ${recipientEmail || 'N/A'}\n\nView their profile: ${recipientProfileLink}\n\nRegards,\nProbasiBangali Team`,
          });
          console.log(`[Interest Email] Sent to sender: ${senderMailTo}`);
        }
      } catch (mailError) {
        console.error('[Interest Email] Nodemailer Error:', mailError);
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
