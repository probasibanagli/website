import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatPhoneForWhatsApp(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.startsWith('91') ? cleaned : `91${cleaned}`;
}

export function getWhatsAppUrl(phone: string, message?: string): string {
  const number = formatPhoneForWhatsApp(phone);
  const msg = message ? encodeURIComponent(message) : '';
  return `https://wa.me/${number}${msg ? `?text=${msg}` : ''}`;
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.substring(0, length) + '...' : str;
}

export function getZomatoSearchUrl(name: string, city: string): string {
  const query = encodeURIComponent(`${name} ${city}`);
  return `https://www.zomato.com/search?q=${query}`;
}

export function getSwiggySearchUrl(name: string, city: string): string {
  const query = encodeURIComponent(`${name} ${city}`);
  return `https://www.swiggy.com/search?query=${query}`;
}

export function getMagicpinSearchUrl(name: string, city: string): string {
  const query = encodeURIComponent(`${name} ${city}`);
  return `https://magicpin.in/search/?q=${query}`;
}

export function getEatsureSearchUrl(name: string): string {
  const query = encodeURIComponent(name);
  return `https://www.eatsure.com/search?q=${query}`;
}

export function getUberEatsSearchUrl(name: string, city: string): string {
  const query = encodeURIComponent(`${name} ${city}`);
  return `https://www.ubereats.com/search?q=${query}`;
}

export function sanitizeErrorMessage(message: string): string {
  if (!message) return '';
  const msgLower = message.toLowerCase();
  
  if (msgLower.includes('firebase') || msgLower.includes('auth/')) {
    if (msgLower.includes('invalid-credential') || msgLower.includes('user-not-found') || msgLower.includes('wrong-password')) {
      return 'Invalid email or password. Please try again.';
    }
    if (msgLower.includes('invalid-email')) {
      return 'Please enter a valid email address.';
    }
    if (msgLower.includes('email-already-in-use')) {
      return 'This email address is already in use by another account.';
    }
    if (msgLower.includes('weak-password')) {
      return 'Password should be at least 6 characters long.';
    }
    if (msgLower.includes('phone-already-in-use')) {
      return 'This phone number is already registered.';
    }
    if (msgLower.includes('invalid-verification-code') || msgLower.includes('code-expired') || msgLower.includes('session-expired')) {
      return 'The verification code entered is incorrect or has expired. Please try again.';
    }
    if (msgLower.includes('too-many-requests')) {
      return 'Too many attempts. Please try again later.';
    }
    if (msgLower.includes('network-request-failed')) {
      return 'Network error. Please check your internet connection and try again.';
    }
    if (msgLower.includes('popup-closed-by-user') || msgLower.includes('cancelled-popup-request')) {
      return 'Login window was closed before completion. Please try again.';
    }
    if (msgLower.includes('user-disabled')) {
      return 'This account has been disabled. Please contact support.';
    }
    return 'Authentication failed. Please check your inputs and try again.';
  }
  
  return message;
}
