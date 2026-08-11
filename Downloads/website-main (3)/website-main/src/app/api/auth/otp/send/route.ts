import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone || typeof phone !== 'string') {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // Clean phone number (keep only digits, e.g. "+91 98765 43210" -> "919876543210")
    const cleanedPhone = phone.replace(/\D/g, '');

    const apiKey = process.env.OTP_DEV_KEY;
    const templateId = process.env.OTP_DEV_TEMPLATE_ID || '6d16aa9d-bf19-4141-8169-48b46d972fc6';

    if (!apiKey) {
      console.error('OTP_DEV_KEY is not configured in environment');
      return NextResponse.json({ error: 'SMS service is currently unavailable.' }, { status: 500 });
    }

    const res = await fetch('https://api.otp.dev/v1/verifications', {
      method: 'POST',
      headers: {
        'X-OTP-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          channel: 'sms',
          sender: process.env.OTP_DEV_SENDER || 'OTP Dev',
          phone: cleanedPhone,
          template: templateId,
          code_length: 6,
        }
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('otp.dev send verification error:', data);
      return NextResponse.json({ error: data.message || 'Failed to send OTP' }, { status: res.status });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('API Send OTP Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
