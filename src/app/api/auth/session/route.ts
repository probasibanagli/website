import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * POST /api/auth/session
 * Create a session cookie from a Firebase ID token.
 */
export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    if (!idToken || typeof idToken !== 'string') {
      return NextResponse.json({ error: 'Missing idToken' }, { status: 400 });
    }

    // We store the ID token in an httpOnly cookie for middleware to check.
    // For production, use Firebase Admin to create a proper session cookie.
    const cookieStore = await cookies();
    cookieStore.set('session', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 5, // 5 days
    });

    return NextResponse.json({ status: 'ok' });
  } catch (err) {
    console.error('Session POST error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

/**
 * DELETE /api/auth/session
 * Clear the session cookie (logout).
 */
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.set('session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    return NextResponse.json({ status: 'ok' });
  } catch (err) {
    console.error('Session DELETE error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
