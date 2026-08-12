'use client';

import React from 'react';
import { X, CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertPopupProps {
  isOpen: boolean;
  message: string;
  type?: AlertType;
  onClose: () => void;
}

export function AlertPopup({ isOpen, message, type = 'info', onClose }: AlertPopupProps) {
  if (!isOpen) return null;

  const typeConfig = {
    success: {
      borderColor: 'border-emerald-100',
      iconColor: 'text-emerald-500',
      icon: <CheckCircle2 className="w-6 h-6" />,
      buttonClass: 'bg-emerald-600 hover:bg-emerald-700 text-white focus-visible:ring-emerald-500',
      title: 'Success',
    },
    error: {
      borderColor: 'border-rose-100',
      iconColor: 'text-rose-500',
      icon: <XCircle className="w-6 h-6" />,
      buttonClass: 'bg-rose-600 hover:bg-rose-700 text-white focus-visible:ring-rose-500',
      title: 'Error',
    },
    warning: {
      borderColor: 'border-amber-100',
      iconColor: 'text-amber-500',
      icon: <AlertTriangle className="w-6 h-6" />,
      buttonClass: 'bg-amber-600 hover:bg-amber-700 text-white focus-visible:ring-amber-500',
      title: 'Warning',
    },
    info: {
      borderColor: 'border-blue-100',
      iconColor: 'text-blue-500',
      icon: <Info className="w-6 h-6" />,
      buttonClass: 'bg-blue-600 hover:bg-blue-700 text-white focus-visible:ring-blue-500',
      title: 'Notification',
    },
  };

  const currentType = typeConfig[type] || typeConfig.info;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Premium Backdrop blur */}
      <div 
        className="absolute inset-0 bg-neutral-950/45 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Premium Sleek Minimal Card - Forced White Background (no dark mode styling) */}
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white border border-neutral-200/80 shadow-[0_12px_38px_-4px_rgba(0,0,0,0.12),0_8px_16px_-4px_rgba(0,0,0,0.06)] transition-all duration-300 scale-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="p-6 pt-8 flex flex-col items-center text-center">
          {/* Elegant Icon Border Wrapper */}
          <div className={`mb-4 flex items-center justify-center p-2.5 rounded-full border bg-neutral-50 ${currentType.borderColor} ${currentType.iconColor}`}>
            {currentType.icon}
          </div>

          {/* Title */}
          <h3 className="mb-2 text-base font-bold text-neutral-900 tracking-tight">
            {currentType.title}
          </h3>

          {/* Message */}
          <p className="mb-6 text-sm text-neutral-500 leading-relaxed break-words max-w-full px-2">
            {message}
          </p>

          {/* Premium Custom Styled Button */}
          <button
            onClick={onClose}
            className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer shadow-sm active:scale-[0.98] ${currentType.buttonClass}`}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
