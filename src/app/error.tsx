'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl mb-6">⚠️</div>
        <h1 className="text-3xl font-bold font-display text-text-primary mb-3">Something went wrong</h1>
        <p className="text-text-muted mb-8 max-w-md mx-auto">
          An unexpected error occurred. Please try again.
        </p>
        <Button variant="primary" size="lg" onClick={reset}>Try Again</Button>
      </div>
    </div>
  );
}
