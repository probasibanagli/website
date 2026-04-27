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
