'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  sendEmailVerification,
  PhoneAuthProvider,
  linkWithCredential,
  updateProfile,
  User as FirebaseUser,
  ConfirmationResult,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { UserProfile, UserRole, ModulePermissions } from '@/types';
import { getDefaultPermissions } from '@/lib/permissions';

interface AuthState {
  firebaseUser: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<void>;
  logOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  sendPhoneOtp: (phoneNumber: string, recaptchaContainerId: string) => Promise<ConfirmationResult>;
  verifyPhoneOtp: (confirmationResult: ConfirmationResult, otp: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  linkPhoneToAccount: (phoneNumber: string, recaptchaContainerId: string) => Promise<ConfirmationResult>;
  confirmLinkPhone: (confirmationResult: ConfirmationResult, otp: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    firebaseUser: null,
    profile: null,
    loading: true,
  });

  const fetchProfile = useCallback(async (user: FirebaseUser): Promise<UserProfile | null> => {
    try {
      const docRef = doc(db, 'users', user.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as UserProfile;
      }
      return null;
    } catch (err) {
      console.error('Error fetching user profile:', err);
      return null;
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!state.firebaseUser) return;
    const profile = await fetchProfile(state.firebaseUser);
    setState((prev) => ({ ...prev, profile }));
  }, [state.firebaseUser, fetchProfile]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const profile = await fetchProfile(user);

        // Sync email_verified from Firebase Auth to Firestore profile
        if (profile && user.emailVerified && !profile.email_verified) {
          try {
            await updateDoc(doc(db, 'users', user.uid), { email_verified: true, updated_at: new Date().toISOString() });
            profile.email_verified = true;
          } catch (err) {
            console.error('Failed to sync email verification:', err);
          }
        }

        // Create/sync session cookie
        try {
          const idToken = await user.getIdToken();
          await fetch('/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken }),
          });
        } catch (err) {
          console.error('Session sync error:', err);
        }

        setState({ firebaseUser: user, profile, loading: false });
      } else {
        // Clear session cookie
        try {
          await fetch('/api/auth/session', { method: 'DELETE' });
        } catch {
          // Ignore on sign out
        }
        setState({ firebaseUser: null, profile: null, loading: false });
      }
    });
    return () => unsub();
  }, [fetchProfile]);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, fullName: string, phone?: string) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const user = credential.user;

    const role: UserRole = 'user';
    const permissions: ModulePermissions = getDefaultPermissions(role);
    const now = new Date().toISOString();

    const profile: UserProfile = {
      uid: user.uid,
      email: user.email || email,
      phone: phone || undefined,
      full_name: fullName,
      role,
      permissions,
      created_at: now,
      updated_at: now,
      is_active: true,
      email_verified: false,
      phone_verified: false,
    };

    await setDoc(doc(db, 'users', user.uid), profile);

    // Send email verification automatically
    try {
      await sendEmailVerification(user);
    } catch (err) {
      console.error('Failed to send verification email:', err);
    }
  };

  /* ── Phone OTP Login ── */
  const sendPhoneOtp = async (phoneNumber: string, recaptchaContainerId: string): Promise<ConfirmationResult> => {
    // Clean up any existing recaptcha
    if ((window as unknown as Record<string, unknown>).recaptchaVerifier) {
      try {
        ((window as unknown as Record<string, unknown>).recaptchaVerifier as RecaptchaVerifier).clear();
      } catch { /* ignore */ }
    }

    const recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
      size: 'invisible',
      callback: () => { /* reCAPTCHA solved */ },
    });

    (window as unknown as Record<string, unknown>).recaptchaVerifier = recaptchaVerifier;

    const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    return confirmation;
  };

  const verifyPhoneOtp = async (confirmationResult: ConfirmationResult, otp: string): Promise<void> => {
    const result = await confirmationResult.confirm(otp);
    const user = result.user;

    // Check if profile exists, if not create one (first-time phone login)
    const existingProfile = await fetchProfile(user);
    if (!existingProfile) {
      const role: UserRole = 'user';
      const permissions: ModulePermissions = getDefaultPermissions(role);
      const now = new Date().toISOString();

      const profile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        phone: user.phoneNumber || '',
        full_name: user.displayName || 'Phone User',
        role,
        permissions,
        created_at: now,
        updated_at: now,
        is_active: true,
        phone_verified: true,
        email_verified: false,
      };
      await setDoc(doc(db, 'users', user.uid), profile);
    } else {
      // Update phone_verified
      await updateDoc(doc(db, 'users', user.uid), {
        phone_verified: true,
        phone: user.phoneNumber || existingProfile.phone,
        updated_at: new Date().toISOString(),
      });
    }
  };

  /* ── Link Phone to Existing Account ── */
  const linkPhoneToAccount = async (phoneNumber: string, recaptchaContainerId: string): Promise<ConfirmationResult> => {
    if ((window as unknown as Record<string, unknown>).recaptchaVerifier) {
      try {
        ((window as unknown as Record<string, unknown>).recaptchaVerifier as RecaptchaVerifier).clear();
      } catch { /* ignore */ }
    }

    const recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
      size: 'invisible',
      callback: () => { /* reCAPTCHA solved */ },
    });

    (window as unknown as Record<string, unknown>).recaptchaVerifier = recaptchaVerifier;

    const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    return confirmation;
  };

  const confirmLinkPhone = async (confirmationResult: ConfirmationResult, otp: string): Promise<void> => {
    const credential = PhoneAuthProvider.credential(confirmationResult.verificationId, otp);
    const user = auth.currentUser;
    if (user) {
      await linkWithCredential(user, credential);
      await updateDoc(doc(db, 'users', user.uid), {
        phone_verified: true,
        phone: user.phoneNumber,
        updated_at: new Date().toISOString(),
      });
    }
  };

  /* ── Email Verification ── */
  const sendVerificationEmail = async (): Promise<void> => {
    const user = auth.currentUser;
    if (user) {
      await sendEmailVerification(user);
    }
  };

  const logOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{
      ...state, signIn, signUp, logOut, refreshProfile,
      sendPhoneOtp, verifyPhoneOtp, sendVerificationEmail,
      linkPhoneToAccount, confirmLinkPhone,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
