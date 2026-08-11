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
