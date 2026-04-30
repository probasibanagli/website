'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
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
    };

    await setDoc(doc(db, 'users', user.uid), profile);
  };

  const logOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ ...state, signIn, signUp, logOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
