import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

function getAdminApp(): App | null {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  try {
    return initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/^"|"$/g, '')?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.warn('Firebase Admin init warning:', (error as Error).message);
    return null;
  }
}

const adminApp = getAdminApp();

// Create proxies that throw a recognizable error if Firebase is not configured
const createFallbackProxy = (serviceName: string) => {
  return new Proxy({}, {
    get: (target, prop) => {
      throw new Error(`Firebase Admin ${serviceName} is not configured. Missing credentials.`);
    }
  }) as any;
};

const adminAuth = adminApp ? getAuth(adminApp) : createFallbackProxy('Auth');
const adminDb = adminApp ? getFirestore(adminApp) : createFallbackProxy('Firestore');

export { adminApp, adminAuth, adminDb };
