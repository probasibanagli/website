import { NextResponse } from 'next/server';
import dotenv from 'dotenv';
import path from 'path';

export const dynamic = 'force-dynamic';

// Temporary diagnostic route – remove after fixing the 500 error
export async function GET() {
  dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });
  // Top-level try-catch: this route MUST always return JSON, never 500
  try {
    const projectId   = process.env['FIREBASE_ADMIN_PROJECT_ID'];
    const clientEmail = process.env['FIREBASE_ADMIN_CLIENT_EMAIL'];
    const rawKey      = process.env['FIREBASE_ADMIN_PRIVATE_KEY'];

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
      isAdminConfigured = adminModule.isAdminConfigured();

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

    const fs = await import('fs');
    const envPath = path.resolve(process.cwd(), '.env.local');
    const exists = fs.existsSync(envPath);
    let rawContent = '';
    if (exists) {
      rawContent = fs.readFileSync(envPath, 'utf-8');
    }
    const dotenvResult = dotenv.config({ path: envPath, override: true });
    
    return NextResponse.json({
      cwd: process.cwd(),
      envPath,
      exists,
      rawContentLength: rawContent.length,
      dotenvResult: dotenvResult.error ? dotenvResult.error.message : dotenvResult.parsed,
      isAdminConfigured: (await import('@/lib/firebase-admin')).isAdminConfigured(),
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
