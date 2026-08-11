'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  User, 
  Phone, 
  ExternalLink, 
  ArrowRight, 
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Info,
  Users,
  Globe,
  MessageSquare,
  Send,
  Filter,
  ListOrdered,
  ArrowUpRight,
  Sparkles,
  Sprout,
  Flame,
  Coins,
  Feather,
  PartyPopper,
  Palette,
  Heart,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CITIES } from '@/lib/constants';
import { useFirestore } from '@/lib/hooks/useFirestore';
import { CommunityEvent, CommunityGroup } from '@/types';

const categoryColors: Record<string, string> = { 
  festival: 'bg-amber-100 text-amber-700', 
  cultural: 'bg-purple-100 text-purple-700', 
  social: 'bg-blue-100 text-blue-700', 
  religious: 'bg-emerald-100 text-emerald-700' 
};

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  festival: PartyPopper,
  cultural: Palette,
  social: Users,
  religious: Heart,
};

const festivalIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'durga-puja': Sparkles,
  'poila-boishakh': Sprout,
  'saraswati-puja': BookOpen,
  'kali-puja': Flame,
  'lakshmi-puja': Coins,
  'rabindra-jayanti': Feather,
};

/* ── Inline SVG Social Icons for Compatibility ── */
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

/* ══════════════════════════════════════════════════════════
   Bengali Calendar Conversion Logic
   Bengali calendar (Bangabda) — based on the fixed Bangla calendar
   reform (BS 1402 / AD 1995 onward).
   Months: Boishakh(1)..Choitro(12)
   Boishakh 1 = April 14 (or 15 in leap years)
   ══════════════════════════════════════════════════════════ */

const BENGALI_MONTHS = [
  'বৈশাখ', 'জ্যৈষ্ঠ', 'আষাঢ়', 'শ্রাবণ', 'ভাদ্র', 'আশ্বিন',
  'কার্তিক', 'অগ্রহায়ণ', 'পৌষ', 'মাঘ', 'ফাল্গুন', 'চৈত্র',
];

const BENGALI_MONTHS_EN = [
  'Boishakh', 'Jyoishtho', 'Asharh', 'Shrabon', 'Bhadro', 'Ashshin',
  'Kartik', 'Ogrohayon', 'Poush', 'Magh', 'Falgun', 'Choitro',
];

const BENGALI_DAYS = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
const BENGALI_DAYS_EN = ['Robibar', 'Sombar', 'Mongolbar', 'Budhbar', 'Brihoshpotibar', 'Shukrobar', 'Shonibar'];
const BENGALI_DAYS_SHORT = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'];

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

const ENGLISH_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function toBengaliDigits(num: number): string {
  return String(num).split('').map(d => BENGALI_DIGITS[parseInt(d)] || d).join('');
}

/* Days in each Bengali month (reformed calendar):
   Boishakh–Bhadro: 31 days each (months 1–5)
   Ashshin–Choitro: 30 days each (months 6–12)
   Exception: Choitro has 31 days in a leap year */
function bengaliMonthDays(month: number, isLeap: boolean): number {
  if (month <= 5) return 31;
  if (month === 12 && isLeap) return 31;
  return 30;
}

function isGregorianLeap(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
}

function convertToBengaliDate(date: Date): { day: number; month: number; year: number; dayOfWeek: number } {
  const gYear = date.getFullYear();
  const gMonth = date.getMonth() + 1; // 1-based
  const gDay = date.getDate();
  const dayOfWeek = date.getDay(); // 0=Sun

  // Bengali New Year: April 14 (April 15 for leap year source, but
  // the reformed calendar fixes Boishakh 1 = April 14)
  const boishakhStart = 14; // April 14

  // Calculate day-of-year for the Gregorian date
  const daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (isGregorianLeap(gYear)) daysInMonth[2] = 29;

  let gDayOfYear = 0;
  for (let i = 1; i < gMonth; i++) gDayOfYear += daysInMonth[i];
  gDayOfYear += gDay;

  // Day of year for April 14
  let boishakhDayOfYear = 0;
  for (let i = 1; i < 4; i++) boishakhDayOfYear += daysInMonth[i]; // Jan+Feb+Mar
  boishakhDayOfYear += boishakhStart;

  let bengaliYear: number;
  let daysSinceBoishakh: number;

  if (gDayOfYear >= boishakhDayOfYear) {
    // We're in Boishakh or later of this Bengali year
    bengaliYear = gYear - 593;
    daysSinceBoishakh = gDayOfYear - boishakhDayOfYear;
  } else {
    // We're before Boishakh 1 (Jan 1 – Apr 13): previous Bengali year
    bengaliYear = gYear - 594;
    // Days from April 14 of previous Gregorian year to Dec 31
    const prevDaysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (isGregorianLeap(gYear - 1)) prevDaysInMonth[2] = 29;
    let prevBoishakhDayOfYear = 0;
    for (let i = 1; i < 4; i++) prevBoishakhDayOfYear += prevDaysInMonth[i];
    prevBoishakhDayOfYear += boishakhStart;
    let totalDaysPrevYear = 0;
    for (let i = 1; i <= 12; i++) totalDaysPrevYear += prevDaysInMonth[i];
    daysSinceBoishakh = (totalDaysPrevYear - prevBoishakhDayOfYear) + gDayOfYear;
  }

  // Determine Bengali month and day
  const isLeap = isGregorianLeap(gYear);
  let bengaliMonth = 1;
  let remaining = daysSinceBoishakh;
  for (let m = 1; m <= 12; m++) {
    const daysInBMonth = bengaliMonthDays(m, isLeap);
    if (remaining < daysInBMonth) {
      bengaliMonth = m;
      break;
    }
    remaining -= daysInBMonth;
    if (m === 12) bengaliMonth = 12;
  }

  const bengaliDay = remaining + 1;

  return { day: bengaliDay, month: bengaliMonth, year: bengaliYear, dayOfWeek };
}

/* ── Important Bengali Observances (Tithi-based for 2026) ── */
const BENGALI_OBSERVANCES: Record<string, { nameBn: string; nameEn: string; type: 'purnima' | 'amavasya' | 'ekadashi' | 'special' }> = {
  '2026-01-13': { nameBn: 'পূর্ণিমা', nameEn: 'Purnima (Full Moon)', type: 'purnima' },
  '2026-01-28': { nameBn: 'অমাবস্যা', nameEn: 'Amavasya (New Moon)', type: 'amavasya' },
  '2026-02-12': { nameBn: 'পূর্ণিমা', nameEn: 'Purnima', type: 'purnima' },
  '2026-02-27': { nameBn: 'অমাবস্যা', nameEn: 'Amavasya', type: 'amavasya' },
  '2026-03-14': { nameBn: 'পূর্ণিমা (দোল)', nameEn: 'Purnima (Dol)', type: 'purnima' },
  '2026-03-29': { nameBn: 'অমাবস্যা', nameEn: 'Amavasya', type: 'amavasya' },
  '2026-04-12': { nameBn: 'পূর্ণিমা', nameEn: 'Purnima', type: 'purnima' },
  '2026-04-27': { nameBn: 'অমাবস্যা', nameEn: 'Amavasya', type: 'amavasya' },
  '2026-05-12': { nameBn: 'পূর্ণিমা (বুদ্ধ)', nameEn: 'Purnima (Buddha)', type: 'purnima' },
  '2026-05-26': { nameBn: 'অমাবস্যা', nameEn: 'Amavasya', type: 'amavasya' },
  '2026-06-11': { nameBn: 'পূর্ণিমা', nameEn: 'Purnima', type: 'purnima' },
  '2026-06-25': { nameBn: 'অমাবস্যা', nameEn: 'Amavasya', type: 'amavasya' },
  '2026-07-10': { nameBn: 'পূর্ণিমা (গুরু)', nameEn: 'Purnima (Guru)', type: 'purnima' },
  '2026-07-25': { nameBn: 'অমাবস্যা', nameEn: 'Amavasya', type: 'amavasya' },
  '2026-08-08': { nameBn: 'পূর্ণিমা (রাখী)', nameEn: 'Purnima (Rakhi)', type: 'purnima' },
  '2026-08-23': { nameBn: 'অমাবস্যা', nameEn: 'Amavasya', type: 'amavasya' },
  '2026-09-07': { nameBn: 'পূর্ণিমা', nameEn: 'Purnima', type: 'purnima' },
  '2026-09-21': { nameBn: 'অমাবস্যা (মহালয়া)', nameEn: 'Amavasya (Mahalaya)', type: 'special' },
  '2026-10-06': { nameBn: 'পূর্ণিমা (কোজাগরী)', nameEn: 'Purnima (Kojagori)', type: 'special' },
  '2026-10-20': { nameBn: 'অমাবস্যা (কালীপূজা)', nameEn: 'Amavasya (Kali Puja)', type: 'special' },
  '2026-11-05': { nameBn: 'পূর্ণিমা', nameEn: 'Purnima', type: 'purnima' },
  '2026-11-19': { nameBn: 'অমাবস্যা', nameEn: 'Amavasya', type: 'amavasya' },
  '2026-12-04': { nameBn: 'পূর্ণিমা', nameEn: 'Purnima', type: 'purnima' },
  '2026-12-19': { nameBn: 'অমাবস্যা', nameEn: 'Amavasya', type: 'amavasya' },
  // Ekadashis
  '2026-01-10': { nameBn: 'একাদশী', nameEn: 'Ekadashi', type: 'ekadashi' },
  '2026-01-25': { nameBn: 'একাদশী', nameEn: 'Ekadashi', type: 'ekadashi' },
  '2026-02-09': { nameBn: 'একাদশী', nameEn: 'Ekadashi', type: 'ekadashi' },
  '2026-02-24': { nameBn: 'একাদশী', nameEn: 'Ekadashi', type: 'ekadashi' },
  '2026-03-11': { nameBn: 'একাদশী', nameEn: 'Ekadashi', type: 'ekadashi' },
  '2026-03-26': { nameBn: 'একাদশী', nameEn: 'Ekadashi', type: 'ekadashi' },
};

/* ── Panjika Links ── */
const PANJIKA_LINKS = [
  {
    title: 'Bengali Panjika (Annual)',
    titleBn: 'বাংলা পঞ্জিকা',
    description: 'Complete yearly Bengali almanac with tithis, nakshatras, festivals, and auspicious timings.',
    icon: '📅',
    url: 'https://bengalipanjika.com/',
    color: 'from-orange-500 to-red-500',
  },
  {
    title: 'Monthly Panjika Calendar',
    titleBn: 'মাসিক পঞ্জিকা',
    description: 'Month-by-month Bengali calendar with daily tithi, yoga, and important dates.',
    icon: '🗓️',
    url: 'https://www.bengalicalendar.com/',
    color: 'from-violet-500 to-purple-600',
  },
];

/* ── Major Festivals Dataset ── */
interface Festival {
  id: string;
  name: string;
  nameBn: string;
  description: string;
  externalUrl: string;
  monthEn: string;
  monthBn: string;
  icon: string;
  communityIds: string[];
  image?: string;
}

const MAJOR_FESTIVALS: Festival[] = [
  {
    id: 'durga-puja',
    name: 'Durga Puja',
    nameBn: 'দুর্গাপূজা',
    description: 'The largest and most grand Bengali festival celebrating the victory of Goddess Durga over Mahishasura. It is marked by vibrant pandals, traditional dhunuchi dance, beautiful music, and delicious community feasts.',
    externalUrl: 'https://en.wikipedia.org/wiki/Durga_Puja',
    monthEn: 'Ashshin / Kartik (Oct)',
    monthBn: 'আশ্বিন / কার্তিক',
    icon: '🥁',
    communityIds: ['1', 'web-2', 'fb-1', 'ig-1', 'fb-2', '6', 'ig-4', 'web-1'],
    image: '/images/durga_puja_idol.png',
  },
  {
    id: 'poila-boishakh',
    name: 'Poila Boishakh (Bengali New Year)',
    nameBn: 'পহেলা বৈশাখ',
    description: 'The first day of the Bengali calendar, celebrated with new clothes, visiting temples for halkhata, sharing sweets, and warm greetings of Shubho Noboborsho.',
    externalUrl: 'https://en.wikipedia.org/wiki/Poila_Boishakh',
    monthEn: 'Boishakh (Apr 14)',
    monthBn: 'বৈশাখ',
    icon: '🌾',
    communityIds: ['1', '5', '6', 'fb-1', 'fb-2', 'web-1'],
    image: '/images/bengali_festive_sweets.png',
  },
  {
    id: 'saraswati-puja',
    name: 'Saraswati Puja',
    nameBn: 'সরস্বতী পূজা',
    description: 'Dedicated to the Goddess of learning and music. Students and children offer their notebooks, pens, and musical instruments, dress in yellow basanti attire, and share delicious khichuri prasad.',
    externalUrl: 'https://en.wikipedia.org/wiki/Saraswati_Puja',
    monthEn: 'Magh / Falgun (Jan/Feb)',
    monthBn: 'মাঘ / ফাল্গুন',
    icon: '🌸',
    communityIds: ['2', '5', 'ig-3', 'fb-1', 'fb-2'],
    image: '/images/bengali_festive_sweets.png',
  },
  {
    id: 'kali-puja',
    name: 'Kali Puja & Diwali',
    nameBn: 'কালীপূজা ও দীপাবলি',
    description: 'Worship of Goddess Kali, celebrated on the new moon night of Kartik month. Houses are lit with clay lamps (pradips), candles, and beautiful designs (alpana) to conquer darkness and evil.',
    externalUrl: 'https://en.wikipedia.org/wiki/Kali_Puja',
    monthEn: 'Kartik (Oct/Nov)',
    monthBn: 'কার্তিক',
    icon: '🪔',
    communityIds: ['1', 'web-2', 'fb-1', 'fb-2', '6'],
    image: '/images/dakshineswar_temple.png',
  },
  {
    id: 'lakshmi-puja',
    name: 'Kojagori Lakshmi Puja',
    nameBn: 'কোজাগরী লক্ষ্মী পূজা',
    description: 'Celebrated on the full moon night (Kojagori Purnima) after Vijaya Dashami, inviting the Goddess of wealth and prosperity into clean, alpana-decorated homes.',
    externalUrl: 'https://en.wikipedia.org/wiki/Lakshmi_Puja',
    monthEn: 'Ashshin / Kartik (Oct)',
    monthBn: 'আশ্বিন / কার্তিক',
    icon: '💰',
    communityIds: ['1', 'fb-1', 'fb-2', '4'],
    image: '/images/bengali_festive_sweets.png',
  },
  {
    id: 'rabindra-jayanti',
    name: 'Rabindra Jayanti',
    nameBn: 'রবীন্দ্র জয়ন্তী',
    description: 'The birth anniversary of Asia\'s first Nobel laureate Gurudev Rabindranath Tagore, commemorated globally with recitations, Rabindra Sangeet performances, and classical dances.',
    externalUrl: 'https://en.wikipedia.org/wiki/Rabindra_Jayanti',
    monthEn: 'Boishakh (May 8/9)',
    monthBn: '২৫শে বৈশাখ',
    icon: '✍️',
    communityIds: ['2', '5', 'ig-3', 'fb-1'],
    image: '/images/bengali_culture_hero.png',
  },
];

function getEventImage(title: string, category: string): string | null {
  const t = title.toLowerCase();
  if (t.includes('durga') || (t.includes('puja') && (t.includes('shasthi') || t.includes('saptami') || t.includes('ashtami') || t.includes('navami') || t.includes('dashami')))) {
    return '/images/durga_puja_idol.png';
  }
  if (t.includes('saraswati') || t.includes('lakshmi') || t.includes('poila') || t.includes('noboborsho') || t.includes('new year') || t.includes('bhai phonta') || t.includes('cooking') || t.includes('food festival')) {
    return '/images/bengali_festive_sweets.png';
  }
  if (t.includes('kali') || t.includes('diwali') || t.includes('rath yatra') || t.includes('janmashtami') || t.includes('heritage walk') || t.includes('temple')) {
    return '/images/dakshineswar_temple.png';
  }
  if (t.includes('rabindra') || t.includes('jayanti') || t.includes('literature') || t.includes('film') || t.includes('drama') || t.includes('music night') || t.includes('adda') || t.includes('networking')) {
    return '/images/bengali_culture_hero.png';
  }
  return null;
}

function getFestivalsForDate(date: Date, firestoreEvents: CommunityEvent[] = []) {
  const y = date.getFullYear();
  const m = date.getMonth() + 1; // 1-based
  const d = date.getDate();
  const ymd = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  
  const bDate = convertToBengaliDate(date);
  const festivals: { name: string; nameBn?: string; id: string; url: string }[] = [];
  
  // Solar Bengali festivals
  if (bDate.month === 1 && bDate.day === 1) {
    festivals.push({ name: 'Poila Boishakh / Bengali New Year', nameBn: 'পহেলা বৈশাখ', id: 'poila-boishakh', url: 'https://en.wikipedia.org/wiki/Poila_Boishakh' });
  }
  if (bDate.month === 1 && bDate.day === 25) {
    festivals.push({ name: 'Rabindra Jayanti', nameBn: 'রবীন্দ্র জয়ন্তী', id: 'rabindra-jayanti', url: 'https://en.wikipedia.org/wiki/Rabindra_Jayanti' });
  }
  
  // Lunar/Gregorian-mapped festivals (for 2026)
  if (ymd === '2026-10-01') festivals.push({ name: 'Durga Puja (Maha Shasthi)', nameBn: 'দুর্গাপূজা (মহাষষ্ঠী)', id: 'durga-puja', url: 'https://en.wikipedia.org/wiki/Durga_Puja' });
  if (ymd === '2026-10-02') festivals.push({ name: 'Durga Puja (Maha Saptami)', nameBn: 'দুর্গাপূজা (মহাসপ্তমী)', id: 'durga-puja', url: 'https://en.wikipedia.org/wiki/Durga_Puja' });
  if (ymd === '2026-10-03') festivals.push({ name: 'Durga Puja (Maha Ashtami)', nameBn: 'দুর্গাপূজা (মহাঅষ্টমী)', id: 'durga-puja', url: 'https://en.wikipedia.org/wiki/Durga_Puja' });
  if (ymd === '2026-10-04') festivals.push({ name: 'Durga Puja (Maha Navami)', nameBn: 'দুর্গাপূজা (মহানবমী)', id: 'durga-puja', url: 'https://en.wikipedia.org/wiki/Durga_Puja' });
  if (ymd === '2026-10-05') festivals.push({ name: 'Durga Puja (Bijoya Dashami)', nameBn: 'দুর্গাপূজা (বিজয়া দশমী)', id: 'durga-puja', url: 'https://en.wikipedia.org/wiki/Durga_Puja' });
  if (ymd === '2026-10-20') festivals.push({ name: 'Kali Puja & Diwali', nameBn: 'কালীপূজা ও দীপাবলি', id: 'kali-puja', url: 'https://en.wikipedia.org/wiki/Kali_Puja' });
  if (ymd === '2026-01-30') festivals.push({ name: 'Saraswati Puja', nameBn: 'সরস্বতী পূজা', id: 'saraswati-puja', url: 'https://en.wikipedia.org/wiki/Saraswati_Puja' });
  if (ymd === '2026-10-06') festivals.push({ name: 'Kojagori Lakshmi Puja', nameBn: 'কোজাগরী লক্ষ্মী পূজা', id: 'lakshmi-puja', url: 'https://en.wikipedia.org/wiki/Lakshmi_Puja' });
  if (ymd === '2026-03-03') festivals.push({ name: 'Dol Yatra / Holi', nameBn: 'দোল যাত্রা / হোলি', id: 'dol-yatra', url: 'https://en.wikipedia.org/wiki/Holi' });
  if (ymd === '2026-07-07') festivals.push({ name: 'Rath Yatra', nameBn: 'রথযাত্রা', id: 'rath-yatra', url: 'https://en.wikipedia.org/wiki/Rath_Yatra' });
  if (ymd === '2026-08-14') festivals.push({ name: 'Janmashtami', nameBn: 'জন্মাষ্টমী', id: 'janmashtami', url: 'https://en.wikipedia.org/wiki/Krishna_Janmashtami' });
  if (ymd === '2026-09-21') festivals.push({ name: 'Mahalaya', nameBn: 'মহালয়া', id: 'mahalaya', url: 'https://en.wikipedia.org/wiki/Mahalaya' });
  if (ymd === '2026-11-01') festivals.push({ name: 'Bhai Phonta', nameBn: 'ভাইফোঁটা', id: 'bhai-phonta', url: 'https://en.wikipedia.org/wiki/Bhai_Dooj' });
  
  // Also check if any firestoreEvents match
  firestoreEvents.forEach(e => {
    if (e.event_date === ymd) {
      festivals.push({
        name: e.title,
        id: 'event-' + e.id,
        url: '#'
      });
    }
  });
  
  const seen = new Set();
  return festivals.filter(f => {
    const isDup = seen.has(f.name);
    seen.add(f.name);
    return !isDup;
  });
}

function getPlatformIcon(platform?: string) {
  switch (platform) {
    case 'whatsapp':
      return <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />;
    case 'telegram':
      return <Send className="w-3.5 h-3.5 text-sky-500" />;
    case 'facebook':
      return <FacebookIcon className="w-3.5 h-3.5 text-blue-600" />;
    case 'instagram':
      return <InstagramIcon className="w-3.5 h-3.5 text-pink-600" />;
    case 'linkedin':
      return <LinkedinIcon className="w-3.5 h-3.5 text-blue-700" />;
    default:
      return <Globe className="w-3.5 h-3.5 text-text-muted" />;
  }
}



export default function EventsPage() {
  const { data: firestoreEvents } = useFirestore<CommunityEvent>('community_events');
  const { data: firestoreGroups } = useFirestore<CommunityGroup>('community_groups');

  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const [activeTab, setActiveTab] = useState<'events' | 'panjika' | 'annual' | 'converter'>('events');

  // Selected festival state
  const [selectedFestivalId, setSelectedFestivalId] = useState<string | null>(null);

  // Calendar states
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(6); // July (0-indexed)
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<Date | null>(() => new Date());

  // Date converter state
  const [converterDate, setConverterDate] = useState(() => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  });

  // Annual calendar filters
  const [annualCommunityFilter, setAnnualCommunityFilter] = useState('');
  const [annualCategoryFilter, setAnnualCategoryFilter] = useState('');
  const [annualCityFilter, setAnnualCityFilter] = useState('');

  const selectedFestival = useMemo(() => {
    if (!selectedFestivalId) return null;
    return MAJOR_FESTIVALS.find(f => f.id === selectedFestivalId) || null;
  }, [selectedFestivalId]);

  const celebratingCommunities = useMemo(() => {
    if (!selectedFestival) return [];
    return firestoreGroups.filter(group => selectedFestival.communityIds.includes(group.id));
  }, [selectedFestival, firestoreGroups]);

  const bengaliDate = useMemo(() => {
    const d = new Date(converterDate + 'T12:00:00');
    if (isNaN(d.getTime())) return null;
    return convertToBengaliDate(d);
  }, [converterDate]);

  // Today's Bengali date
  const todayBengali = useMemo(() => convertToBengaliDate(new Date()), []);

  const filtered = useMemo(() => {
    return firestoreEvents.filter((e) => {
      if (city && e.city !== city) return false;
      if (category && e.category !== category) return false;
      return true;
    });
  }, [city, category, firestoreEvents]);

  // Calendar calculations
  const daysInMonth = useMemo(() => {
    return new Date(currentYear, currentMonth + 1, 0).getDate();
  }, [currentYear, currentMonth]);

  const startDayOfWeek = useMemo(() => {
    return new Date(currentYear, currentMonth, 1).getDay();
  }, [currentYear, currentMonth]);

  const calendarCells = useMemo(() => {
    const cells = [];
    
    // Padding for days before the 1st of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      cells.push({ date: null, isCurrentMonth: false, bengaliDate: null, festivals: [], observance: null });
    }
    
    // Calendar days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const bDate = convertToBengaliDate(date);
      const festivals = getFestivalsForDate(date, firestoreEvents);
      const ymd = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const observance = BENGALI_OBSERVANCES[ymd] || null;
      cells.push({
        date,
        isCurrentMonth: true,
        bengaliDate: bDate,
        festivals,
        observance,
      });
    }
    
    return cells;
  }, [currentYear, currentMonth, startDayOfWeek, daysInMonth]);

  // Annual calendar — events grouped by month
  const annualEvents = useMemo(() => {
    const filteredEvents = firestoreEvents.filter(e => {
      if (annualCommunityFilter && e.community_group_id !== annualCommunityFilter) return false;
      if (annualCategoryFilter && e.category !== annualCategoryFilter) return false;
      if (annualCityFilter && e.city !== annualCityFilter) return false;
      return true;
    });

    // Group by month
    const grouped: Record<number, typeof filteredEvents> = {};
    for (let i = 0; i < 12; i++) grouped[i] = [];
    
    filteredEvents.forEach(e => {
      if (e.event_date) {
        const month = parseInt(e.event_date.split('-')[1]) - 1;
        if (grouped[month]) grouped[month].push(e);
      }
    });

    // Sort each month by date
    Object.keys(grouped).forEach(m => {
      grouped[parseInt(m)].sort((a, b) => (a.event_date || '').localeCompare(b.event_date || ''));
    });

    return grouped;
  }, [annualCommunityFilter, annualCategoryFilter, annualCityFilter]);

  // Unique community groups in events for filter
  const communityGroupsInEvents = useMemo(() => {
    const ids = new Set(firestoreEvents.map(e => e.community_group_id).filter(Boolean));
    return firestoreGroups.filter(g => ids.has(g.id));
  }, [firestoreEvents, firestoreGroups]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
            <Link href="/" className="hover:text-primary">Home</Link><span>/</span>
            <Link href="/community/groups" className="hover:text-primary">Community</Link><span>/</span>
            <span className="text-text-primary font-medium">Events & Festivals</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-text-primary">Events & Festivals</h1>
          <p className="mt-2 text-text-muted">Celebrate Bengali culture — Panjika, calendar tools, community events, and annual festival calendar.</p>

          {/* ── Today's Bengali Date Banner ── */}
          <div className="mt-5 p-4 bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 rounded-2xl border border-amber-200/50 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white shadow-md">
                <CalendarIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-amber-700 uppercase tracking-wider">Today&apos;s Bengali Date</p>
                <p className="text-lg font-bold text-text-primary bengali-text">
                  {toBengaliDigits(todayBengali.day)} {BENGALI_MONTHS[todayBengali.month - 1]}, {toBengaliDigits(todayBengali.year)} বঙ্গাব্দ
                </p>
                <p className="text-xs text-text-muted">
                  {BENGALI_DAYS_EN[todayBengali.dayOfWeek]}, {todayBengali.day} {BENGALI_MONTHS_EN[todayBengali.month - 1]} {todayBengali.year} BS
                </p>
              </div>
            </div>
          </div>

          {/* ── Tab Navigation ── */}
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { key: 'events' as const, label: 'Events & Festivals', icon: PartyPopper },
              { key: 'panjika' as const, label: 'Bengali Panjika', icon: CalendarIcon },
              { key: 'annual' as const, label: 'Annual Calendar', icon: ListOrdered },
              { key: 'converter' as const, label: 'Date Converter', icon: Globe },
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === tab.key
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-white text-text-primary border border-border hover:border-primary'
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ═══════════════ EVENTS & FESTIVALS TAB ═══════════════ */}
        {activeTab === 'events' && (
          <div className="space-y-10 animate-fade-in">
            {/* Major Bengali Festivals Card Grid */}
            <div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-2xl font-bold font-display text-text-primary flex items-center gap-2">
                    🕌 Explore Major Bengali Festivals
                  </h2>
                  <p className="text-sm text-text-muted mt-1">
                    Select a festival below to see celebrating communities and visit related pages.
                  </p>
                </div>
                
                {selectedFestivalId && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedFestivalId(null)}
                    className="self-start md:self-auto cursor-pointer"
                  >
                    Clear Selection
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {MAJOR_FESTIVALS.map((fest) => {
                  const isSelected = selectedFestivalId === fest.id;
                  return (
                    <button
                      key={fest.id}
                      onClick={() => setSelectedFestivalId(isSelected ? null : fest.id)}
                      className={`p-5 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                        isSelected 
                          ? 'border-primary ring-2 ring-primary/20 bg-gradient-to-br from-amber-50/60 to-orange-50/60' 
                          : 'border-border bg-white hover:border-primary/50 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                          isSelected ? 'bg-primary text-white' : 'bg-surface text-primary group-hover:scale-110 transition-transform'
                        }`}>
                          {(() => {
                            const Icon = festivalIcons[fest.id] || Sparkles;
                            return <Icon className="w-5 h-5" />;
                          })()}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-bold text-text-primary group-hover:text-primary transition-colors">
                            {fest.name}
                          </h3>
                          <p className="text-xs bengali-text text-text-muted mt-0.5">{fest.nameBn}</p>
                          <p className="text-xs text-text-muted mt-2 font-medium bg-surface px-2.5 py-0.5 rounded-full inline-block">
                            🕒 {fest.monthEn}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-text-muted">
                        <span className="font-semibold text-primary flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" /> Celebrated by {fest.communityIds.length} Communities
                        </span>
                        
                        <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted group-hover:text-primary transition-colors">
                          {isSelected ? 'Selected' : 'View Info'} →
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Festival Details Card */}
              {selectedFestival && (
                <Card className="mt-6 p-6 border-amber-200 bg-amber-50/10 animate-fade-in">
                  <div className="flex flex-col lg:flex-row gap-6 justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        {(() => {
                          const Icon = festivalIcons[selectedFestival.id] || Sparkles;
                          return (
                            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                              <Icon className="w-6 h-6" />
                            </div>
                          );
                        })()}
                        <div>
                          <h3 className="text-xl font-bold text-text-primary">{selectedFestival.name}</h3>
                          <p className="text-sm bengali-text text-primary font-medium">{selectedFestival.nameBn} • Month of {selectedFestival.monthBn}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-col md:flex-row gap-5 items-start">
                        {selectedFestival.image && (
                          <div className="w-full md:w-60 shrink-0 aspect-[4/3] rounded-2xl overflow-hidden border border-border/80 shadow-sm bg-white">
                            <img 
                              src={selectedFestival.image} 
                              alt={selectedFestival.name} 
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <p className="text-sm text-text-muted leading-relaxed flex-1">
                          {selectedFestival.description}
                        </p>
                      </div>
                      
                      {/* REDIRECT LINKS */}
                      <div className="mt-5 flex flex-wrap gap-3">
                        <a
                          href={selectedFestival.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 shadow-md transition-all group"
                        >
                          Learn More <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </a>
                        <button
                          onClick={() => setActiveTab('annual')}
                          className="inline-flex items-center gap-2 bg-white text-primary border-2 border-primary px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/5 shadow-sm transition-all cursor-pointer"
                        >
                          <CalendarIcon className="w-4 h-4" /> View Annual Calendar <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="lg:w-96 border-t lg:border-t-0 lg:border-l border-border pt-6 lg:pt-0 lg:pl-6">
                      <h4 className="font-bold text-text-primary text-sm flex items-center gap-1.5 mb-3">
                        <Users className="w-4 h-4 text-primary" /> Celebrating Communities ({celebratingCommunities.length})
                      </h4>
                      
                      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                        {celebratingCommunities.map((group) => (
                          <div key={group.id} className="p-3 rounded-xl border border-border bg-white hover:border-primary/40 transition-colors flex items-center justify-between gap-3">
                            <div>
                              <h5 className="font-semibold text-xs text-text-primary">{group.name}</h5>
                              <div className="flex items-center gap-1.5 mt-1 text-[10px] text-text-muted">
                                {getPlatformIcon(group.platform)}
                                <span className="capitalize">{group.platform}</span>
                                {group.city && <span>• {group.city}</span>}
                              </div>
                            </div>
                            
                            <div className="flex gap-1.5">
                              <Link
                                href="/community/groups"
                                className="px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-[10px] font-bold text-primary transition-all whitespace-nowrap"
                              >
                                View Group
                              </Link>
                              <a
                                href={group.join_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 rounded-lg bg-surface hover:bg-primary/10 hover:text-primary border border-border hover:border-primary/30 text-[10px] font-bold text-text-primary transition-all whitespace-nowrap"
                              >
                                Join
                              </a>
                            </div>
                          </div>
                        ))}
                        
                        {celebratingCommunities.length === 0 && (
                          <p className="text-xs text-text-muted italic">No specific community groups listed for this festival.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Upcoming Community Events Section */}
            <div>
              <h2 className="text-2xl font-bold font-display text-text-primary mb-2 flex items-center gap-2">
                <PartyPopper className="w-6 h-6 text-primary shrink-0" /> All Community Events & Celebrations
              </h2>
              <p className="text-sm text-text-muted mb-6">Events from all community groups across Tamil Nadu. Click on any event to view its community group.</p>

              {/* Filters */}
              <div className="flex flex-wrap gap-3 mb-6">
                <select value={city} onChange={(e) => setCity(e.target.value)} className="px-4 py-2.5 rounded-xl border border-border bg-white text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="">All Cities</option>
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-4 py-2.5 rounded-xl border border-border bg-white text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="">All Categories</option>
                  <option value="festival">Festival</option>
                  <option value="cultural">Cultural</option>
                  <option value="social">Social</option>
                  <option value="religious">Religious</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((event) => {
                  const communityGroup = event.community_group_id ? firestoreGroups.find((g: any) => g.id === event.community_group_id) : null;
                  return (
                    <Card key={event.id} className="group overflow-hidden p-0 bg-white hover:shadow-lg transition-shadow">
                      <div className="h-36 overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center relative">
                        {(() => {
                          const img = getEventImage(event.title, event.category || '');
                          if (img) {
                            return (
                              <img 
                                src={img} 
                                alt={event.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                              />
                            );
                          }
                          const Icon = categoryIcons[event.category || 'festival'] || PartyPopper;
                          return <Icon className="w-14 h-14 text-primary/20" />;
                        })()}
                        <div className="absolute top-3 left-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${categoryColors[event.category || 'festival']}`}>
                            {event.category}
                          </span>
                        </div>
                        {communityGroup && (
                          <div className="absolute top-3 right-3">
                            <Link
                              href="/community/groups"
                              className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 text-primary border border-primary/20 hover:bg-primary hover:text-white transition-all flex items-center gap-1 shadow-sm"
                            >
                              {getPlatformIcon(communityGroup.platform)}
                              {communityGroup.name.length > 20 ? communityGroup.name.substring(0, 20) + '...' : communityGroup.name}
                            </Link>
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors">{event.title}</h3>
                        <div className="space-y-2 mt-3 text-sm text-text-muted">
                          <div className="flex items-center gap-2"><CalendarIcon className="w-4 h-4 text-primary" />{event.event_date ? new Date(event.event_date + 'T12:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'TBA'}</div>
                          <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" />{event.venue}, {event.city}</div>
                          <div className="flex items-center gap-2"><User className="w-4 h-4 text-primary" />{event.organizer}</div>
                        </div>
                        {event.description && <p className="mt-3 text-sm text-text-muted line-clamp-2">{event.description}</p>}
                        
                        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between gap-2">
                          {event.contact && (
                            <a href={`tel:${event.contact}`} className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline">
                              <Phone className="w-3.5 h-3.5" /> Contact
                            </a>
                          )}
                          <div className="flex gap-2 ml-auto">
                            {communityGroup && (
                              <Link
                                href="/community/groups"
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors"
                              >
                                <Users className="w-3 h-3" /> View Group
                              </Link>
                            )}
                            <button
                              onClick={() => { setAnnualCommunityFilter(event.community_group_id || ''); setActiveTab('annual'); }}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface text-text-primary text-xs font-bold hover:bg-primary/10 hover:text-primary border border-border transition-colors cursor-pointer"
                            >
                              📆 Calendar
                            </button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
              {filtered.length === 0 && (
                <div className="text-center py-20 bg-white rounded-2xl border border-border">
                  <p className="text-5xl mb-4">🎉</p>
                  <h3 className="text-xl font-bold mb-2">No events found</h3>
                  <p className="text-text-muted">Check back soon or try different filters.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════ PANJIKA TAB — DUAL CALENDAR ═══════════════ */}
        {activeTab === 'panjika' && (
          <div className="space-y-8 animate-fade-in">
            {/* Panjika Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PANJIKA_LINKS.map((panjika) => (
                <a
                  key={panjika.title}
                  href={panjika.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <div className="relative overflow-hidden rounded-2xl border border-border bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className={`h-2 bg-gradient-to-r ${panjika.color}`} />
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${panjika.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                          <CalendarIcon className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors">{panjika.title}</h3>
                          <p className="text-sm bengali-text text-text-muted mt-0.5">{panjika.titleBn}</p>
                          <p className="text-sm text-text-muted mt-2 leading-relaxed">{panjika.description}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-2 text-primary text-sm font-semibold">
                        Open Panjika <ExternalLink className="w-4 h-4" />
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* ── DUAL CALENDAR ── */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                    📅 Monthly Calendar — English & Bengali
                  </h3>
                  <p className="text-xs text-text-muted mt-1">
                    Both English (Gregorian) and Bengali (বাংলা) calendars showing the same month. Festivals and observances highlighted.
                  </p>
                </div>
                
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={handlePrevMonth}
                    className="p-2.5 rounded-xl border border-border bg-white hover:bg-surface text-text-primary transition-all cursor-pointer shadow-sm hover:border-primary/30"
                    aria-label="Previous Month"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="text-center min-w-[160px]">
                    <p className="text-sm font-bold text-text-primary">{ENGLISH_MONTHS[currentMonth]} {currentYear}</p>
                    <p className="text-xs bengali-text text-primary font-semibold">
                      {BENGALI_MONTHS[convertToBengaliDate(new Date(currentYear, currentMonth, 15)).month - 1]} {toBengaliDigits(convertToBengaliDate(new Date(currentYear, currentMonth, 15)).year)}
                    </p>
                  </div>
                  <button
                    onClick={handleNextMonth}
                    className="p-2.5 rounded-xl border border-border bg-white hover:bg-surface text-text-primary transition-all cursor-pointer shadow-sm hover:border-primary/30"
                    aria-label="Next Month"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* ── Dual Calendar Grid ── */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* ENGLISH CALENDAR */}
                <Card className="p-5 bg-white">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                      EN
                    </div>
                    <div>
                      <h4 className="font-bold text-text-primary text-sm">English Calendar</h4>
                      <p className="text-[10px] text-text-muted">{ENGLISH_MONTHS[currentMonth]} {currentYear}</p>
                    </div>
                  </div>
                  
                  {/* Day headers */}
                  <div className="grid grid-cols-7 gap-1 text-center font-semibold text-[10px] text-text-muted mb-1.5">
                    <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                  </div>
                  
                  {/* Calendar grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {calendarCells.map((cell, index) => {
                      if (!cell.date) {
                        return <div key={`en-empty-${index}`} className="aspect-square bg-surface/30 rounded-lg" />;
                      }
                      const isToday = cell.date.toDateString() === new Date().toDateString();
                      const isSelected = selectedCalendarDay && cell.date.toDateString() === selectedCalendarDay.toDateString();
                      const hasFestivals = cell.festivals.length > 0;
                      const hasObservance = !!cell.observance;
                      
                      return (
                        <button
                          key={`en-${cell.date.toDateString()}`}
                          onClick={() => setSelectedCalendarDay(cell.date)}
                          className={`aspect-square rounded-lg border flex flex-col items-center justify-center text-center transition-all cursor-pointer relative ${
                            isSelected
                              ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                              : isToday
                                ? 'border-blue-400 bg-blue-50'
                                : hasFestivals
                                  ? 'border-amber-200 bg-amber-50/30 hover:border-amber-400'
                                  : hasObservance
                                    ? 'border-violet-200/50 bg-violet-50/20 hover:border-violet-300'
                                    : 'border-border bg-white hover:border-primary/50'
                          }`}
                        >
                          <span className={`text-sm font-semibold ${isSelected ? 'text-primary' : isToday ? 'text-blue-700' : 'text-text-primary'}`}>
                            {cell.date.getDate()}
                          </span>
                          {hasFestivals && <div className="absolute bottom-0.5 w-1.5 h-1.5 rounded-full bg-amber-500" />}
                          {hasObservance && !hasFestivals && <div className="absolute bottom-0.5 w-1 h-1 rounded-full bg-violet-400" />}
                        </button>
                      );
                    })}
                  </div>
                </Card>

                {/* BENGALI CALENDAR */}
                <Card className="p-5 bg-gradient-to-br from-amber-50/30 to-orange-50/20">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-amber-200/50">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white text-sm font-bold shadow-sm bengali-text">
                      বা
                    </div>
                    <div>
                      <h4 className="font-bold text-text-primary text-sm bengali-text">বাংলা পঞ্জিকা</h4>
                      <p className="text-[10px] text-text-muted bengali-text">
                        {BENGALI_MONTHS[convertToBengaliDate(new Date(currentYear, currentMonth, 15)).month - 1]}, {toBengaliDigits(convertToBengaliDate(new Date(currentYear, currentMonth, 15)).year)} বঙ্গাব্দ
                      </p>
                    </div>
                  </div>
                  
                  {/* Bengali day headers */}
                  <div className="grid grid-cols-7 gap-1 text-center font-semibold text-[10px] text-amber-800/70 mb-1.5 bengali-text">
                    {BENGALI_DAYS_SHORT.map((day) => (
                      <div key={day}>{day}</div>
                    ))}
                  </div>
                  
                  {/* Bengali calendar grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {calendarCells.map((cell, index) => {
                      if (!cell.date || !cell.bengaliDate) {
                        return <div key={`bn-empty-${index}`} className="aspect-square bg-amber-50/20 rounded-lg" />;
                      }
                      const isToday = cell.date.toDateString() === new Date().toDateString();
                      const isSelected = selectedCalendarDay && cell.date.toDateString() === selectedCalendarDay.toDateString();
                      const hasFestivals = cell.festivals.length > 0;
                      const hasObservance = !!cell.observance;
                      const isBengaliMonthStart = cell.bengaliDate.day === 1;
                      
                      return (
                        <button
                          key={`bn-${cell.date.toDateString()}`}
                          onClick={() => setSelectedCalendarDay(cell.date)}
                          className={`aspect-square rounded-lg border flex flex-col items-center justify-center text-center transition-all cursor-pointer relative ${
                            isSelected
                              ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                              : isToday
                                ? 'border-orange-400 bg-orange-100/50'
                                : isBengaliMonthStart
                                  ? 'border-red-300 bg-red-50/40 hover:border-red-400'
                                  : hasFestivals
                                    ? 'border-amber-300 bg-amber-100/40 hover:border-amber-400'
                                    : hasObservance
                                      ? 'border-violet-200/50 bg-violet-50/20 hover:border-violet-300'
                                      : 'border-amber-100 bg-white/60 hover:border-amber-300'
                          }`}
                        >
                          <span className={`text-sm font-bold bengali-text ${isSelected ? 'text-primary' : isToday ? 'text-orange-700' : isBengaliMonthStart ? 'text-red-600' : 'text-amber-900'}`}>
                            {toBengaliDigits(cell.bengaliDate.day)}
                          </span>
                          {isToday && <span className="text-[7px] font-bold text-orange-600 bengali-text leading-none">আজ</span>}
                          {isBengaliMonthStart && !isToday && <span className="text-[6px] font-bold text-red-500 bengali-text leading-none truncate w-full px-0.5">{BENGALI_MONTHS[cell.bengaliDate.month - 1]}</span>}
                          {hasFestivals && <div className="absolute bottom-0.5 w-1.5 h-1.5 rounded-full bg-amber-500" />}
                          {hasObservance && !hasFestivals && <div className="absolute bottom-0.5 w-1 h-1 rounded-full bg-violet-400" />}
                        </button>
                      );
                    })}
                  </div>
                </Card>
              </div>

              {/* Selected Day Details Panel */}
              {selectedCalendarDay && (() => {
                const cell = calendarCells.find(c => c.date && c.date.toDateString() === selectedCalendarDay.toDateString());
                if (!cell || !cell.date || !cell.bengaliDate) return null;
                const isToday = cell.date.toDateString() === new Date().toDateString();
                const ymd = `${cell.date.getFullYear()}-${String(cell.date.getMonth() + 1).padStart(2, '0')}-${String(cell.date.getDate()).padStart(2, '0')}`;
                const observance = BENGALI_OBSERVANCES[ymd];
                return (
                  <div className="mt-6 p-5 border border-amber-200/50 bg-gradient-to-r from-amber-50/30 to-orange-50/20 rounded-2xl animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* English Date */}
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex flex-col items-center justify-center text-white shadow-md shrink-0">
                          <span className="text-lg font-bold leading-none">{cell.date.getDate()}</span>
                          <span className="text-[8px] font-semibold uppercase">{cell.date.toLocaleDateString('en-US', { month: 'short' })}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-text-primary text-sm flex items-center gap-1.5">
                            {cell.date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                            {isToday && <span className="text-[9px] font-bold uppercase tracking-wider bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full border border-orange-200">Today</span>}
                          </h4>
                          <p className="text-xs text-text-muted mt-0.5">
                            {cell.date.toLocaleDateString('en-IN', { weekday: 'long' })} • {ENGLISH_MONTHS[cell.date.getMonth()]} {cell.date.getFullYear()}
                          </p>
                        </div>
                      </div>
                      
                      {/* Bengali Date */}
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex flex-col items-center justify-center text-white shadow-md shrink-0 bengali-text">
                          <span className="text-lg font-bold leading-none">{toBengaliDigits(cell.bengaliDate.day)}</span>
                          <span className="text-[8px] font-semibold">{BENGALI_MONTHS[cell.bengaliDate.month - 1].substring(0, 4)}</span>
                        </div>
                        <div>
                          <p className="font-bold text-text-primary text-sm bengali-text">
                            {toBengaliDigits(cell.bengaliDate.day)} {BENGALI_MONTHS[cell.bengaliDate.month - 1]}, {toBengaliDigits(cell.bengaliDate.year)} বঙ্গাব্দ
                          </p>
                          <p className="text-xs text-text-muted bengali-text mt-0.5">
                            {BENGALI_DAYS[cell.bengaliDate.dayOfWeek]} • {BENGALI_MONTHS_EN[cell.bengaliDate.month - 1]} {cell.bengaliDate.year} BS
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Observances and Festivals */}
                    <div className="mt-4 pt-4 border-t border-amber-200/50 flex flex-wrap gap-2 items-center">
                      {observance && (
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${
                          observance.type === 'purnima' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                          observance.type === 'amavasya' ? 'bg-slate-100 text-slate-700 border-slate-200' :
                          observance.type === 'ekadashi' ? 'bg-violet-100 text-violet-800 border-violet-200' :
                          'bg-amber-100 text-amber-800 border-amber-200'
                        }`}>
                          <span className="bengali-text">{observance.nameBn}</span> • {observance.nameEn}
                        </span>
                      )}
                      {cell.festivals.length > 0 ? (
                        cell.festivals.map(f => (
                          <span
                            key={f.name}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200"
                          >
                            🎉 {f.name} {f.nameBn && <span className="bengali-text">({f.nameBn})</span>}
                          </span>
                        ))
                      ) : !observance ? (
                        <span className="text-xs text-text-muted italic flex items-center gap-1"><Info className="w-3.5 h-3.5 text-text-muted" /> No major festivals or observances.</span>
                      ) : null}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Bengali Months Reference */}
            <Card className="bg-white">
              <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" /> Bengali Months (বাংলা মাস)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {BENGALI_MONTHS.map((month, i) => (
                  <div key={month} className="p-3 bg-gradient-to-br from-surface to-white rounded-xl border border-border text-center hover:shadow-md transition-shadow">
                    <p className="text-lg font-bold bengali-text text-text-primary">{month}</p>
                    <p className="text-xs text-text-muted mt-1">{BENGALI_MONTHS_EN[i]}</p>
                    <p className="text-[10px] text-primary font-semibold mt-0.5">Month {i + 1}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Legend */}
            <Card className="bg-white p-4">
              <h4 className="text-sm font-bold text-text-primary mb-3">Calendar Legend</h4>
              <div className="flex flex-wrap gap-4 text-xs text-text-muted">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-amber-500" /> Festival / Event</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-yellow-400" /> <span className="bengali-text">পূর্ণিমা</span> (Full Moon)</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-slate-400" /> <span className="bengali-text">অমাবস্যা</span> (New Moon)</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-violet-400" /> <span className="bengali-text">একাদশী</span> (Ekadashi)</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded border-2 border-red-300 bg-red-50" /> Bengali month start</div>
              </div>
            </Card>
          </div>
        )}

        {/* ═══════════════ ANNUAL EVENTS CALENDAR TAB ═══════════════ */}
        {activeTab === 'annual' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold font-display text-text-primary flex items-center gap-2">
                📆 Annual Events Calendar — {currentYear}
              </h2>
              <p className="text-sm text-text-muted mt-1">
                Complete listing of all community events and festivals throughout the year. Click on any community name to visit their group page.
              </p>
            </div>

            {/* Filters */}
            <Card className="bg-white p-5">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-text-primary">Filter Events</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                <select value={annualCommunityFilter} onChange={(e) => setAnnualCommunityFilter(e.target.value)} className="px-4 py-2.5 rounded-xl border border-border bg-white text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 min-w-[200px]">
                  <option value="">All Community Groups</option>
                  {communityGroupsInEvents.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
                <select value={annualCategoryFilter} onChange={(e) => setAnnualCategoryFilter(e.target.value)} className="px-4 py-2.5 rounded-xl border border-border bg-white text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="">All Categories</option>
                  <option value="festival">🎊 Festival</option>
                  <option value="cultural">🎭 Cultural</option>
                  <option value="social">🤝 Social</option>
                  <option value="religious">🙏 Religious</option>
                </select>
                <select value={annualCityFilter} onChange={(e) => setAnnualCityFilter(e.target.value)} className="px-4 py-2.5 rounded-xl border border-border bg-white text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="">All Cities</option>
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {(annualCommunityFilter || annualCategoryFilter || annualCityFilter) && (
                  <button
                    onClick={() => { setAnnualCommunityFilter(''); setAnnualCategoryFilter(''); setAnnualCityFilter(''); }}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors cursor-pointer"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </Card>

            {/* Quick Month Jump */}
            <div className="flex flex-wrap gap-2">
              {ENGLISH_MONTHS.map((month, i) => {
                const count = annualEvents[i]?.length || 0;
                return (
                  <a
                    key={month}
                    href={`#month-${i}`}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      count > 0
                        ? 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20'
                        : 'bg-surface text-text-muted border border-border'
                    }`}
                  >
                    {month.substring(0, 3)} {count > 0 && <span className="font-bold">({count})</span>}
                  </a>
                );
              })}
            </div>

            {/* Month-by-Month Timeline */}
            <div className="space-y-6">
              {ENGLISH_MONTHS.map((month, monthIndex) => {
                const events = annualEvents[monthIndex];
                const bengaliInfo = convertToBengaliDate(new Date(2026, monthIndex, 15));
                
                return (
                  <div key={month} id={`month-${monthIndex}`} className="scroll-mt-24">
                    {/* Month Header */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex flex-col items-center justify-center text-white shadow-lg shrink-0">
                        <span className="text-xl font-bold leading-none">{month.substring(0, 3).toUpperCase()}</span>
                        <span className="text-[9px] font-semibold opacity-80">{currentYear}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-text-primary">{month} {currentYear}</h3>
                        <p className="text-xs text-text-muted bengali-text">
                          {BENGALI_MONTHS[bengaliInfo.month - 1]} • {BENGALI_MONTHS_EN[bengaliInfo.month - 1]}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface text-text-muted text-xs font-semibold border border-border">
                        <ListOrdered className="w-3.5 h-3.5" />
                        {events.length} event{events.length !== 1 ? 's' : ''}
                      </div>
                    </div>

                    {/* Events List */}
                    {events.length > 0 ? (
                      <div className="space-y-3 ml-8 border-l-2 border-primary/20 pl-6">
                        {events.map((event) => {
                          const communityGroup = event.community_group_id ? firestoreGroups.find((g: any) => g.id === event.community_group_id) : null;
                          const eventDate = event.event_date ? new Date(event.event_date + 'T12:00:00') : null;
                          const bDate = eventDate ? convertToBengaliDate(eventDate) : null;
                          
                          return (
                            <div key={event.id} className="relative group">
                              {/* Timeline dot */}
                              <div className="absolute -left-[31px] top-4 w-4 h-4 rounded-full bg-white border-2 border-primary shadow-sm group-hover:bg-primary group-hover:border-primary transition-colors" />
                              
                              <Card className="p-4 bg-white hover:shadow-md transition-shadow border-l-4 border-l-transparent group-hover:border-l-primary">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                  <div className="flex-1">
                                    <div className="flex items-start gap-3">
                                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center shrink-0 border border-amber-100">
                                        {(() => {
                                          const img = getEventImage(event.title, event.category || '');
                                          if (img) {
                                            return <img src={img} alt={event.title} className="w-full h-full object-cover" />;
                                          }
                                          const Icon = categoryIcons[event.category || 'festival'] || PartyPopper;
                                          return <Icon className="w-5 h-5 text-primary" />;
                                        })()}
                                      </div>
                                      <div className="flex-1">
                                        <h4 className="font-bold text-text-primary group-hover:text-primary transition-colors">{event.title}</h4>
                                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${categoryColors[event.category || 'festival']}`}>
                                            {event.category}
                                          </span>
                                          {eventDate && (
                                            <span className="text-xs text-text-muted flex items-center gap-1">
                                              <CalendarIcon className="w-3 h-3" />
                                              {eventDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                              {bDate && (
                                                <span className="bengali-text text-primary font-semibold">
                                                  • {toBengaliDigits(bDate.day)} {BENGALI_MONTHS[bDate.month - 1]}
                                                </span>
                                              )}
                                            </span>
                                          )}
                                          <span className="text-xs text-text-muted flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />{event.venue}, {event.city}
                                          </span>
                                        </div>
                                        {event.description && (
                                          <p className="text-xs text-text-muted mt-2 line-clamp-1">{event.description}</p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Community Group Link */}
                                  <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end shrink-0">
                                    {communityGroup && (
                                      <Link
                                        href="/community/groups"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary hover:text-white transition-all"
                                      >
                                        {getPlatformIcon(communityGroup.platform)}
                                        <span className="max-w-[150px] truncate">{communityGroup.name}</span>
                                        <ArrowUpRight className="w-3 h-3" />
                                      </Link>
                                    )}
                                    {event.contact && (
                                      <a
                                        href={`tel:${event.contact}`}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface text-text-muted text-xs font-medium hover:text-primary border border-border transition-colors"
                                      >
                                        <Phone className="w-3 h-3" /> Contact
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </Card>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="ml-8 pl-6 border-l-2 border-border/30">
                        <p className="text-sm text-text-muted italic py-3">No events scheduled for {month}.</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Summary Stats */}
            <Card className="bg-gradient-to-r from-primary/5 to-accent/5 p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">{firestoreEvents.length}</p>
                  <p className="text-xs text-text-muted font-medium">Total Events</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{communityGroupsInEvents.length}</p>
                  <p className="text-xs text-text-muted font-medium">Community Groups</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{new Set(firestoreEvents.map(e => e.city).filter(Boolean)).size}</p>
                  <p className="text-xs text-text-muted font-medium">Cities</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">12</p>
                  <p className="text-xs text-text-muted font-medium">Months Covered</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ═══════════════ DATE CONVERTER TAB ═══════════════ */}
        {activeTab === 'converter' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <Card className="overflow-hidden p-0 bg-white">
              <div className="h-2 bg-gradient-to-r from-primary to-accent" />
              <div className="p-6 sm:p-8">
                <h3 className="text-xl font-bold text-text-primary flex items-center gap-2 mb-1">
                  🔄 English to Bengali Date Converter
                </h3>
                <p className="text-sm text-text-muted mb-6">Convert any Gregorian (English) date to the Bengali calendar (Bangabda).</p>

                <div className="space-y-6">
                  {/* Date Input */}
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">Select English Date</label>
                    <input
                      type="date"
                      value={converterDate}
                      onChange={(e) => setConverterDate(e.target.value)}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                  </div>

                  {/* Converter Result Card */}
                  {bengaliDate && (() => {
                    const d = new Date(converterDate + 'T12:00:00');
                    const festivals = getFestivalsForDate(d);
                    return (
                      <div className="p-6 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 rounded-2xl border border-amber-200/50">
                        <p className="text-[10px] font-semibold text-amber-700 uppercase tracking-wider mb-3">Bengali Date Result</p>

                        {/* Bengali Script */}
                        <div className="text-center mb-4">
                          <p className="text-3xl sm:text-4xl font-bold bengali-text text-text-primary">
                            {toBengaliDigits(bengaliDate.day)} {BENGALI_MONTHS[bengaliDate.month - 1]}
                          </p>
                          <p className="text-xl font-bold bengali-text text-primary mt-1">
                            {toBengaliDigits(bengaliDate.year)} বঙ্গাব্দ
                          </p>
                          <p className="text-sm bengali-text text-text-muted mt-1">
                            {BENGALI_DAYS[bengaliDate.dayOfWeek]}
                          </p>
                        </div>

                        {/* Romanized details */}
                        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-amber-200/50">
                          <div className="text-center p-3 bg-white/60 rounded-xl">
                            <p className="text-[10px] text-text-muted uppercase tracking-wider">Day</p>
                            <p className="text-lg font-bold text-text-primary">{bengaliDate.day}</p>
                          </div>
                          <div className="text-center p-3 bg-white/60 rounded-xl">
                            <p className="text-[10px] text-text-muted uppercase tracking-wider">Month</p>
                            <p className="text-lg font-bold text-text-primary">{BENGALI_MONTHS_EN[bengaliDate.month - 1]}</p>
                          </div>
                          <div className="text-center p-3 bg-white/60 rounded-xl">
                            <p className="text-[10px] text-text-muted uppercase tracking-wider">Year (BS)</p>
                            <p className="text-lg font-bold text-text-primary">{bengaliDate.year}</p>
                          </div>
                          <div className="text-center p-3 bg-white/60 rounded-xl">
                            <p className="text-[10px] text-text-muted uppercase tracking-wider">Day Name</p>
                            <p className="text-lg font-bold text-text-primary">{BENGALI_DAYS_EN[bengaliDate.dayOfWeek]}</p>
                          </div>
                        </div>

                        {/* Overlapping Festivals */}
                        <div className="mt-4 pt-4 border-t border-amber-200/50">
                          <p className="text-xs font-semibold text-text-primary mb-2">Festivals on this Day</p>
                          {festivals.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {festivals.map(f => (
                                <span
                                  key={f.name}
                                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200"
                                >
                                  🎉 {f.name}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-text-muted italic">No major festivals on this date.</p>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </Card>

            {/* Quick shortcuts */}
            <Card className="bg-white">
              <h4 className="text-sm font-semibold text-text-primary mb-3">Quick Dates</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Today', date: new Date() },
                  { label: 'Poila Boishakh 2026', date: new Date('2026-04-14') },
                  { label: 'Durga Puja 2026', date: new Date('2026-10-01') },
                  { label: 'Kali Puja 2026', date: new Date('2026-10-20') },
                  { label: 'Saraswati Puja 2026', date: new Date('2026-01-30') },
                ].map((q) => (
                  <button
                    key={q.label}
                    onClick={() => setConverterDate(q.date.toISOString().split('T')[0])}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-surface text-text-primary border border-border hover:border-primary hover:text-primary transition-all cursor-pointer"
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
