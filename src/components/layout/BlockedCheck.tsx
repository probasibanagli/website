'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';

export function BlockedCheck({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isBlocked = profile && profile.is_active === false;

  useEffect(() => {
    if (!loading && profile) {
      if (profile.is_active === false) {
        if (pathname !== '/blocked') {
          router.push('/blocked');
        }
      } else {
        if (pathname === '/blocked') {
          router.push('/');
        }
      }
    }
  }, [profile, loading, pathname, router]);

  // If blocked or on /blocked page, restrict layout to only the content (no navbar/footer/chat)
  if (isBlocked || pathname === '/blocked') {
    // Find the main children structure to render without chrome
    // To make sure we only render the page content itself
    return (
      <main className="flex-1 min-h-screen bg-surface">
        {children}
      </main>
    );
  }

  return <>{children}</>;
}
