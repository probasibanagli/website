'use client';

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/lib/auth/AuthContext';

export function GlobalLoader() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { loading: authLoading } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (pathname?.startsWith('/admin')) {
      setIsLoading(false);
      return;
    }
    if (!authLoading) {
      // Small delay to prevent flashing for very fast loads
      const timer = setTimeout(() => setIsLoading(false), 300);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams, authLoading]);

  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      if (pathname?.startsWith('/admin')) return;
      const target = event.target as HTMLElement;
      const anchor = target.closest('a');

      if (anchor) {
        const href = anchor.getAttribute('href');
        const targetAttr = anchor.getAttribute('target');
        
        if (href && href.startsWith('/') && targetAttr !== '_blank' && !href.includes('#')) {
          const currentUrl = new URL(window.location.href);
          const targetUrl = new URL(href, window.location.origin);

          if (currentUrl.origin === targetUrl.origin && (currentUrl.pathname !== targetUrl.pathname || currentUrl.search !== targetUrl.search)) {
            setIsLoading(true);
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, [pathname]);

  if (!mounted) return null;
  if (pathname?.startsWith('/admin')) return null;
  if (!isLoading && !authLoading) return null;

  return <PageSkeleton />;
}
