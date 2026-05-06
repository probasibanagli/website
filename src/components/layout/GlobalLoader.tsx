'use client';

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Loader from '@/components/ui/loader';
import { useAuth } from '@/lib/auth/AuthContext';

export function GlobalLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading) {
      setIsLoading(false);
    }
  }, [pathname, searchParams, authLoading]);

  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const anchor = target.closest('a');

      if (anchor) {
        const href = anchor.getAttribute('href');
        const targetAttr = anchor.getAttribute('target');
        
        if (href && href.startsWith('/') && targetAttr !== '_blank') {
          const currentUrl = new URL(window.location.href);
          const targetUrl = new URL(href, window.location.origin);

          if (currentUrl.origin === targetUrl.origin && currentUrl.pathname !== targetUrl.pathname) {
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

  return isLoading || authLoading ? <Loader /> : null;
}
