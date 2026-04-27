import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'pg' | 'hotel' | 'rental' | 'verified' | 'bengali' | 'teal' | 'amber' | 'red' | 'default';
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<string, string> = {
  pg: 'bg-blue-100 text-blue-700 border-blue-200',
  hotel: 'bg-purple-100 text-purple-700 border-purple-200',
  rental: 'bg-amber-100 text-amber-700 border-amber-200',
  verified: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  bengali: 'bg-primary-light text-primary-dark border-primary/20',
  teal: 'bg-accent-light text-emerald-800 border-accent/20',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  red: 'bg-red-100 text-red-700 border-red-200',
  default: 'bg-gray-100 text-gray-700 border-gray-200',
};

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
