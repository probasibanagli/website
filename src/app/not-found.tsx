import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl mb-6 animate-bounce">🏠</div>
        <h1 className="text-4xl font-bold font-display text-text-primary mb-3">Page Not Found</h1>
        <p className="text-text-muted mb-8 max-w-md mx-auto">
          Looks like this page has moved! Don&apos;t worry — let&apos;s help you find your way back home.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/"><Button variant="primary" size="lg">Go Home</Button></Link>
          <Link href="/explore/stay"><Button variant="outline" size="lg">Explore Services</Button></Link>
        </div>
      </div>
    </div>
  );
}
