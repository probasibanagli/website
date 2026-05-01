'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, User, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/card';
import { sampleEvents } from '@/data/sample-data';
import { CITIES } from '@/lib/constants';

const categoryColors: Record<string, string> = { festival: 'bg-amber-100 text-amber-700', cultural: 'bg-purple-100 text-purple-700', social: 'bg-blue-100 text-blue-700', religious: 'bg-emerald-100 text-emerald-700' };

export default function EventsPage() {
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');

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
          <p className="mt-2 text-text-muted">Celebrate Bengali culture in Tamil Nadu.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <select value={city} onChange={(e) => setCity(e.target.value)} className="px-4 py-2.5 rounded-xl border border-border text-sm">
              <option value="">All Cities</option>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-4 py-2.5 rounded-xl border border-border text-sm">
              <option value="">All Categories</option>
              <option value="festival">Festival</option>
              <option value="cultural">Cultural</option>
              <option value="social">Social</option>
              <option value="religious">Religious</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
    </div>
  );
}
