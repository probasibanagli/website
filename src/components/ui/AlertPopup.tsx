import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, RotateCw, AlertTriangle, Info } from 'lucide-react';

import { sanitizeErrorMessage } from '@/lib/utils';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertPopupProps {
  isOpen: boolean;
  message: string;
  type?: AlertType;
  onClose: () => void;
}

export function AlertPopup({ isOpen, message, type = 'info', onClose }: AlertPopupProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const sanitizedMessage = sanitizeErrorMessage(message);

  const typeConfig = {
    success: {
      title: 'Success',
      iconBg: 'bg-[#E6F4EA] text-[#137333]',
      icon: <Check className="w-9 h-9" />,
      buttonText: 'Continue',
      buttonIcon: <Check className="w-4 h-4" />,
    },
    error: {
      title: 'Error',
      iconBg: 'bg-[#FCE8E6] text-[#C5221F]',
      icon: (
        <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {/* Key Head */}
          <circle cx="8" cy="16" r="3" />
          {/* Key Shaft */}
          <line x1="10.1" y1="13.9" x2="18" y2="6" />
          {/* Teeth */}
          <path d="M19 5l-2.5 2.5" />
          <path d="M16 8l-2 2" />
          {/* Slash Line crossing the key */}
          <line x1="4" y1="4" x2="20" y2="20" />
        </svg>
      ),
      buttonText: 'Try Again',
      buttonIcon: <RotateCw className="w-4 h-4" />,
    },
    warning: {
      title: 'Warning',
      iconBg: 'bg-[#FEF7E0] text-[#B06000]',
      icon: <AlertTriangle className="w-9 h-9" />,
      buttonText: 'Okay',
      buttonIcon: <AlertTriangle className="w-4 h-4" />,
    },
    info: {
      title: 'Notification',
      iconBg: 'bg-[#E8F0FE] text-[#1A73E8]',
      icon: <Info className="w-9 h-9" />,
      buttonText: 'Got it',
      buttonIcon: <Info className="w-4 h-4" />,
    },
  };

  const currentType = typeConfig[type] || typeConfig.info;

  // Intelligently choose the title for authentication errors
  let displayTitle = currentType.title;
  if (type === 'error') {
    const msgLower = sanitizedMessage.toLowerCase();
    if (msgLower.includes('verification') || msgLower.includes('code') || msgLower.includes('auth') || msgLower.includes('incorrect') || msgLower.includes('expired')) {
      displayTitle = 'Authentication Failed';
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Dim backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/45 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Premium Elegant Card Container */}
      <div className="relative w-full max-w-sm overflow-hidden rounded-[32px] bg-white border border-black/5 shadow-2xl transition-all duration-300 scale-100 flex flex-col z-10 p-8 pt-10 items-center text-center animate-slide-up">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 rounded-full p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon Circle */}
        <div className={`mb-8 flex items-center justify-center w-20 h-20 rounded-full ${currentType.iconBg}`}>
          {currentType.icon}
        </div>

        {/* Title */}
        <h3 className="mb-4 text-2xl font-bold text-neutral-900 tracking-tight leading-tight">
          {displayTitle}
        </h3>

        {/* Description Message */}
        <p className="mb-8 text-neutral-500 text-sm leading-relaxed max-w-xs">
          {sanitizedMessage}
        </p>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-4 px-6 rounded-full text-base font-semibold text-white bg-[#D85A30] hover:bg-[#C24D27] flex items-center justify-center gap-2 transition-all duration-200 shadow-md shadow-[#D85A30]/20 active:scale-[0.98] cursor-pointer"
        >
          {currentType.buttonIcon}
          {currentType.buttonText}
        </button>
      </div>
    </div>,
    document.body
  );
}
