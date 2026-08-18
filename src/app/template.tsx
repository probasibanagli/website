'use client';

import React from 'react';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ScrollReveal direction="up" duration={0.5} delay={0.05} className="flex-1 flex flex-col w-full">
      {children}
    </ScrollReveal>
  );
}
