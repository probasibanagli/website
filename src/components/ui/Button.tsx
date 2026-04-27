'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 cursor-pointer',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        {
          'bg-primary text-white hover:bg-primary-dark focus-visible:ring-primary shadow-md hover:shadow-lg active:scale-[0.98]':
            variant === 'primary',
          'bg-accent text-white hover:bg-emerald-700 focus-visible:ring-accent shadow-md hover:shadow-lg active:scale-[0.98]':
            variant === 'secondary',
          'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 shadow-md hover:shadow-lg active:scale-[0.98]':
            variant === 'danger',
          'bg-transparent text-text-primary hover:bg-surface focus-visible:ring-primary':
            variant === 'ghost',
          'border-2 border-primary text-primary hover:bg-primary-light focus-visible:ring-primary':
            variant === 'outline',
        },
        {
          'text-sm px-4 py-2 gap-1.5': size === 'sm',
          'text-sm px-6 py-2.5 gap-2': size === 'md',
          'text-base px-8 py-3 gap-2.5': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
