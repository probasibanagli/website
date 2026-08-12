import { NextResponse } from 'next/server';
import { adminApp, isAdminConfigured } from '@/lib/firebase-admin';

// Temporary diagnostic route – remove after fixing the 500 error
export async function GET() {
  const projectId  = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const rawKey      = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  const keyInfo = rawKey
    ? {
        length: rawKey.length,
        startsWithQuote: rawKey.startsWith('"'),
        hasLiteralBackslashN: rawKey.includes('\\n'),
        hasRealNewline: rawKey.includes('\n'),
        first30Chars: rawKey.slice(0, 30),
      }
    : null;

  let firestoreOk = false;
  let firestoreError: string | null = null;
  if (isAdminConfigured) {
    try {
      // Lightweight Firestore test (just list collections, limited)
      const { adminDb } = await import('@/lib/firebase-admin');
      await adminDb.listCollections();
      firestoreOk = true;
    } catch (e: any) {
      firestoreError = e.message;
    }
  }

  return NextResponse.json({
    isAdminConfigured,
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
  });
}
