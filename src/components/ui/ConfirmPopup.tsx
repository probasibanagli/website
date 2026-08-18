'use client';

import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { sanitizeErrorMessage } from '@/lib/utils';

interface ConfirmPopupProps {
  isOpen: boolean;
  message: string;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmPopup({ 
  isOpen, 
  message, 
  title = 'Are you sure?', 
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm, 
  onCancel 
}: ConfirmPopupProps) {
  if (!isOpen) return null;

  const sanitizedMessage = sanitizeErrorMessage(message);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Dim backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/45 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={onCancel}
      />
      
      {/* Premium Elegant Card Container */}
      <div className="relative w-full max-w-sm overflow-hidden rounded-[32px] bg-white border border-black/5 shadow-2xl transition-all duration-300 scale-100 flex flex-col z-10 p-8 pt-10 items-center text-center animate-slide-up">
        
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute right-6 top-6 rounded-full p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon Circle */}
        <div className="mb-8 flex items-center justify-center w-20 h-20 rounded-full bg-[#FCE8E6] text-[#C5221F]">
          <AlertTriangle className="w-9 h-9" />
        </div>

        {/* Title */}
        <h3 className="mb-4 text-2xl font-bold text-neutral-900 tracking-tight leading-tight">
          {title}
        </h3>

        {/* Description Message */}
        <p className="mb-8 text-neutral-500 text-sm leading-relaxed max-w-xs">
          {sanitizedMessage}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3 w-full">
          <button
            onClick={onCancel}
            className="flex-1 py-3.5 px-4 rounded-2xl text-sm font-semibold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition-all duration-200 cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
            }}
            className="flex-1 py-3.5 px-4 rounded-2xl text-sm font-semibold text-white bg-[#D85A30] hover:bg-[#C24D27] transition-all duration-200 shadow-md shadow-[#D85A30]/20 cursor-pointer"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
