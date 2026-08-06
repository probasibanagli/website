'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, User, Phone, ExternalLink, ArrowRight, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { sampleEvents } from '@/data/sample-data';
import { CITIES } from '@/lib/constants';

const categoryColors: Record<string, string> = { festival: 'bg-amber-100 text-amber-700', cultural: 'bg-purple-100 text-purple-700', social: 'bg-blue-100 text-blue-700', religious: 'bg-emerald-100 text-emerald-700' };

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

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

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

/* ── Panjika Links ── */
const PANJIKA_LINKS = [
  {
    title: 'Bengali Panjika (Annual)',
    titleBn: 'বাংলা পঞ্জিকা',
    description: 'Complete yearly Bengali almanac with tithis, nakshatras, festivals, and auspicious timings.',
    icon: '📅',
    url: 'https://www.thebengalipanjika.com/',
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

export default function EventsPage() {
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const [activeTab, setActiveTab] = useState<'events' | 'panjika' | 'converter'>('events');

  // Date converter state
  const [converterDate, setConverterDate] = useState(() => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  });

  const bengaliDate = useMemo(() => {
    const d = new Date(converterDate + 'T12:00:00');
    if (isNaN(d.getTime())) return null;
    return convertToBengaliDate(d);
  }, [converterDate]);

  // Today's Bengali date
  const todayBengali = useMemo(() => convertToBengaliDate(new Date()), []);

  const filtered = useMemo(() => {
    return sampleEvents.filter((e) => {
      if (city && e.city !== city) return false;
      if (category && e.category !== category) return false;
      return true;
    });
  }, [city, category]);

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
            <Link href="/" className="hover:text-primary">Home</Link><span>/</span>
            <span className="text-text-primary font-medium">Events & Festivals</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-text-primary">Events & Festivals</h1>
          <p className="mt-2 text-text-muted">Celebrate Bengali culture — Panjika, calendar tools, and community events.</p>

          {/* ── Today's Bengali Date Banner ── */}
          <div className="mt-5 p-4 bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 rounded-2xl border border-amber-200/50 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-xl shadow-md">
                📅
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
              { key: 'events' as const, label: '🎉 Events & Festivals' },
              { key: 'panjika' as const, label: '📅 Bengali Panjika' },
              { key: 'converter' as const, label: '🔄 Date Converter' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                  activeTab === tab.key
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-text-primary border border-border hover:border-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ═══════════════ PANJIKA TAB ═══════════════ */}
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
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${panjika.color} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform`}>
                          {panjika.icon}
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

            {/* Bengali Months Reference */}
            <Card>
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
          </div>
        )}

        {/* ═══════════════ DATE CONVERTER TAB ═══════════════ */}
        {activeTab === 'converter' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <Card className="overflow-hidden p-0">
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

                  {/* Result */}
                  {bengaliDate && (
                    <div className="p-6 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 rounded-2xl border border-amber-200/50">
                      <p className="text-[10px] font-semibold text-amber-700 uppercase tracking-wider mb-3">Bengali Date Result</p>

                      {/* Bengali script */}
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

                      {/* Romanized */}
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
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Quick shortcuts */}
            <Card>
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

        {/* ═══════════════ EVENTS TAB ═══════════════ */}
        {activeTab === 'events' && (
          <div className="animate-fade-in">
            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              <select value={city} onChange={(e) => setCity(e.target.value)} className="px-4 py-2.5 rounded-xl border border-border text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="">All Cities</option>
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-4 py-2.5 rounded-xl border border-border text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="">All Categories</option>
                <option value="festival">Festival</option>
                <option value="cultural">Cultural</option>
                <option value="social">Social</option>
                <option value="religious">Religious</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((event) => (
                <Card key={event.id} className="group overflow-hidden p-0">
                  <div className="h-40 bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center relative">
                    <span className="text-5xl opacity-30">🎉</span>
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${categoryColors[event.category || 'festival']}`}>{event.category}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors">{event.title}</h3>
                    <div className="space-y-2 mt-3 text-sm text-text-muted">
                      <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" />{event.event_date ? new Date(event.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'TBA'}</div>
                      <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" />{event.venue}, {event.city}</div>
                      <div className="flex items-center gap-2"><User className="w-4 h-4 text-primary" />{event.organizer}</div>
                    </div>
                    {event.description && <p className="mt-3 text-sm text-text-muted line-clamp-2">{event.description}</p>}
                    {event.contact && (
                      <a href={`tel:${event.contact}`} className="inline-flex items-center gap-1.5 mt-4 text-sm text-primary font-medium hover:underline">
                        <Phone className="w-3.5 h-3.5" /> Contact Organizer
                      </a>
                    )}
                  </div>
                </Card>
              ))}
            </div>
            {filtered.length === 0 && (<div className="text-center py-20"><p className="text-5xl mb-4">🎉</p><h3 className="text-xl font-bold mb-2">No events found</h3><p className="text-text-muted">Check back soon or try different filters.</p></div>)}
          </div>
        )}
      </div>
    </div>
  );
}
