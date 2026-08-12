'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AlertPopup, AlertType } from '@/components/ui/AlertPopup';

interface AlertContextType {
  showAlert: (message: string, type?: AlertType) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<AlertType>('info');

  const showAlert = (msg: string, t: AlertType = 'info') => {
    setMessage(msg);
    setType(t);
    setIsOpen(true);
  };

  const hideAlert = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const originalAlert = window.alert;
      window.alert = (msg: string) => {
        const msgStr = String(msg || '');
        const msgLower = msgStr.toLowerCase();
        let detectedType: AlertType = 'info';

        if (
          msgLower.includes('error') ||
          msgLower.includes('fail') ||
          msgLower.includes('invalid') ||
          msgLower.includes('required') ||
          msgLower.includes('denied') ||
          msgLower.includes('not supported')
        ) {
          detectedType = 'error';
        } else if (
          msgLower.includes('success') ||
          msgLower.includes('successfully') ||
          msgLower.includes('saved') ||
          msgLower.includes('added') ||
          msgLower.includes('updated') ||
          msgLower.includes('published') ||
          msgLower.includes('approved') ||
          msgLower.includes('unblocked') ||
          msgLower.includes('blocked')
        ) {
          detectedType = 'success';
        } else if (
          msgLower.includes('warning') ||
          msgLower.includes('caution') ||
          msgLower.includes('attention') ||
          msgLower.includes('are you sure')
        ) {
          detectedType = 'warning';
        }

        showAlert(msgStr, detectedType);
      };

      return () => {
        window.alert = originalAlert;
      };
    }
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <AlertPopup
        isOpen={isOpen}
        message={message}
        type={type}
        onClose={hideAlert}
      />
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}
