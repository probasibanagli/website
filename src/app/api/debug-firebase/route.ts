import { NextResponse } from 'next/server';

// Temporary diagnostic route – remove after fixing the 500 error
export async function GET() {
  // Top-level try-catch: this route MUST always return JSON, never 500
  try {
    const projectId   = process.env.FIREBASE_ADMIN_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    const rawKey      = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

    const keyInfo = rawKey
      ? {
          length: rawKey.length,
          startsWithQuote: rawKey.startsWith('"'),
          hasLiteralBackslashN: rawKey.includes('\\n'),
          hasRealNewline: rawKey.includes('\n'),
          first30Chars: rawKey.slice(0, 30),
          last20Chars: rawKey.slice(-20),
        }
      : null;

    // Dynamically import so any module-level crash is caught here
    let isAdminConfigured = false;
    let importError: string | null = null;
    let firestoreOk = false;
    let firestoreError: string | null = null;
    let authOk = false;
    let authError: string | null = null;

    try {
      const adminModule = await import('@/lib/firebase-admin');
      isAdminConfigured = adminModule.isAdminConfigured;

      if (isAdminConfigured) {
        // Test Firestore
        try {
          const cols = await adminModule.adminDb.listCollections();
          firestoreOk = true;
        } catch (e: any) {
          firestoreError = e.message;
        }

        // Test Auth
        try {
          // Just verify the auth service is accessible
          const authService = adminModule.adminAuth;
          authOk = typeof authService.createCustomToken === 'function';
        } catch (e: any) {
          authError = e.message;
        }
      }
    } catch (e: any) {
      importError = e.message;
    }

    return NextResponse.json({
      isAdminConfigured,
      importError,
      envVarsPresent: {
        FIREBASE_ADMIN_PROJECT_ID: !!projectId,
        FIREBASE_ADMIN_CLIENT_EMAIL: !!clientEmail,
        FIREBASE_ADMIN_PRIVATE_KEY: !!rawKey,
      },
      projectId,
      clientEmail,
      privateKeyInfo: keyInfo,
      firestoreOk,
      firestoreError,
      authOk,
      authError,
    });
  } catch (fatal: any) {
    // Absolute last resort – should never reach here
    return NextResponse.json(
      { fatalError: fatal?.message ?? String(fatal) },
      { status: 500 }
    );
  }
}
