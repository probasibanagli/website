import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
import path from 'path';

// Ensure .env.local is explicitly resolved from workspace root
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

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

  // Ensure environment variables are loaded with override enabled
  const envPath = path.resolve(process.cwd(), '.env.local');
  dotenv.config({ path: envPath, override: true });
  dotenv.config({ override: true });

  const projectId   = process.env['FIREBASE_ADMIN_PROJECT_ID'] || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env['FIREBASE_ADMIN_CLIENT_EMAIL'];
  const privateKey  = normalisePrivateKey(process.env['FIREBASE_ADMIN_PRIVATE_KEY']);

  console.log('[firebase-admin] Attempting init:', {
    envPath,
    projectId,
    hasClientEmail: !!clientEmail,
    hasPrivateKey: !!privateKey,
    privateKeyLength: privateKey ? privateKey.length : 0
  });

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

/** true when Firebase Admin SDK credentials are present */
export const isAdminConfigured = () => getAdminApp() !== null;

const adminDbProxy = new Proxy({}, {
  get(_target, prop, receiver) {
    const app = getAdminApp();
    if (!app) {
      throw new Error(
        'Firebase Admin (Firestore) is not initialised. ' +
        'Check FIREBASE_ADMIN_PROJECT_ID / CLIENT_EMAIL / PRIVATE_KEY env vars.'
      );
    }
    const instance = getFirestore(app);
    const value = Reflect.get(instance, prop, receiver);
    return typeof value === 'function' ? value.bind(instance) : value;
  }
});

const adminAuthProxy = new Proxy({}, {
  get(_target, prop, receiver) {
    const app = getAdminApp();
    if (!app) {
      throw new Error(
        'Firebase Admin (Auth) is not initialised. ' +
        'Check FIREBASE_ADMIN_PROJECT_ID / CLIENT_EMAIL / PRIVATE_KEY env vars.'
      );
    }
    const instance = getAuth(app);
    const value = Reflect.get(instance, prop, receiver);
    return typeof value === 'function' ? value.bind(instance) : value;
  }
});

export const adminApp = getAdminApp();
export const adminAuth = adminAuthProxy as unknown as Auth;
export const adminDb = adminDbProxy as unknown as Firestore;

