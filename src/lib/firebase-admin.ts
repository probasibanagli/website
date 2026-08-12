import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

/**
 * Normalise the Firebase Admin private key so it works regardless of how
 * the environment variable was stored:
 *   - Vercel UI: stores literal \n (two chars) → need to replace with real newline
 *   - .env.local with quotes: might have \\n → same replacement
 *   - Already has real newlines: replacement is a no-op
 */
function normalisePrivateKey(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  // Strip wrapping double-quotes added by some env editors
  let key = raw.replace(/^"|"$/g, '');
  // Replace any literal \n (two-char sequence) with a real newline
  key = key.replace(/\\n/g, '\n');
  return key;
}

function getAdminApp(): App | null {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const projectId  = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey  = normalisePrivateKey(process.env.FIREBASE_ADMIN_PRIVATE_KEY);

  if (!projectId || !clientEmail || !privateKey) {
    console.warn(
      '[firebase-admin] Missing credentials – ' +
      `projectId=${!!projectId} clientEmail=${!!clientEmail} privateKey=${!!privateKey}`
    );
    return null;
  }

  try {
    return initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    });
  } catch (error) {
    console.warn('[firebase-admin] initializeApp failed:', (error as Error).message);
    return null;
  }
}

const adminApp = getAdminApp();

/** true when Firebase Admin SDK initialised successfully */
export const isAdminConfigured = adminApp !== null;

// Create proxies that throw a recognizable error if Firebase is not configured
const createFallbackProxy = (serviceName: string) => {
  return new Proxy({}, {
    get: () => {
      throw new Error(
        `Firebase Admin (${serviceName}) is not initialised. ` +
        'Check FIREBASE_ADMIN_PROJECT_ID / CLIENT_EMAIL / PRIVATE_KEY env vars.'
      );
    },
  }) as any;
};

const adminAuth = adminApp ? getAuth(adminApp)      : createFallbackProxy('Auth');
const adminDb   = adminApp ? getFirestore(adminApp) : createFallbackProxy('Firestore');

export { adminApp, adminAuth, adminDb };
