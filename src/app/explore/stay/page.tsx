'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { MapPin, Phone, MessageCircle, Wifi, Wind, UtensilsCrossed, CheckCircle2, Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/card';
import { sampleListings } from '@/data/sample-data';
import { CITIES } from '@/lib/constants';
import { formatPrice, getWhatsAppUrl } from '@/lib/utils';

const amenityIcons: Record<string, React.ReactNode> = {
  'WiFi': <Wifi className="w-3 h-3" />,
  'AC': <Wind className="w-3 h-3" />,
  'Bengali Food': <UtensilsCrossed className="w-3 h-3" />,
};

export default function StayPage() {
  const [activeType, setActiveType] = useState<string>('all');
  const [city, setCity] = useState('');
  const [bengaliOnly, setBengaliOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    return sampleListings.filter((l) => {
      if (activeType !== 'all' && l.type !== activeType) return false;
      if (city && l.city !== city) return false;
      if (bengaliOnly && !l.bengali_friendly) return false;
      if (searchQuery && !l.name.toLowerCase().includes(searchQuery.toLowerCase()) && !l.area.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [activeType, city, bengaliOnly, searchQuery]);

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/explore/stay" className="hover:text-primary">Explore</Link>
            <span>/</span>
            <span className="text-text-primary font-medium">Stay</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-text-primary">
            Stay & Accommodation
          </h1>
          <p className="mt-2 text-text-muted">Find Bengali-friendly PGs, hotels, and rental houses in Tamil Nadu.</p>

          {/* Type Tabs */}
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'All' },
              { value: 'pg', label: '🏠 PG' },
              { value: 'hotel', label: '🏨 Hotels' },
              { value: 'rental', label: '🏘️ Rental House' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveType(tab.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                  activeType === tab.value
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-text-primary border border-border hover:border-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or area..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-border text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">All Cities</option>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <button
              onClick={() => setBengaliOnly(!bengaliOnly)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                bengaliOnly ? 'bg-primary text-white' : 'bg-white border border-border text-text-primary hover:border-primary'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Bengali-friendly
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-sm text-text-muted mb-6">
          <span className="font-semibold text-text-primary">{filtered.length}</span> listings found · Verified first
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((listing) => (
            <Card key={listing.id} className="p-0 overflow-hidden group">
              {/* Image placeholder */}
              <div className="relative h-48 bg-gradient-to-br from-primary-light to-accent-light flex items-center justify-center">
                <span className="text-6xl opacity-30">
                  {listing.type === 'pg' ? '🏠' : listing.type === 'hotel' ? '🏨' : '🏘️'}
                </span>
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge variant={listing.type as 'pg' | 'hotel' | 'rental'}>
                    {listing.type.toUpperCase()}
                  </Badge>
                  {listing.verified && <Badge variant="verified"><CheckCircle2 className="w-3 h-3 mr-1" /> Verified</Badge>}
                </div>
                {listing.bengali_food && (
                  <div className="absolute top-3 right-3">
                    <Badge variant="bengali">🍛 Bengali Food</Badge>
                  </div>
                )}
              </div>

              <div className="p-5">
                <Link href={`/explore/stay/${listing.id}`}>
                  <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors">
                    {listing.name}
                  </h3>
                </Link>
                <div className="flex items-center gap-1.5 mt-1 text-sm text-text-muted">
                  <MapPin className="w-3.5 h-3.5" />
                  {listing.area}, {listing.city}
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {listing.amenities.slice(0, 4).map((a) => (
                    <span key={a} className="inline-flex items-center gap-1 px-2 py-0.5 bg-surface rounded-md text-xs text-text-muted">
                      {amenityIcons[a] || null} {a}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <div>
                    <p className="text-xl font-bold text-primary">{formatPrice(listing.price_per_month || 0)}</p>
                    <p className="text-xs text-text-muted">per month</p>
                  </div>
                  <div className="flex gap-2">
                    {listing.google_maps_url && (
                      <a href={listing.google_maps_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm"><MapPin className="w-4 h-4" /> Maps</Button>
                      </a>
                    )}
                    {listing.owner_whatsapp && (
                      <a href={getWhatsAppUrl(listing.owner_whatsapp, `Hi, I found your listing "${listing.name}" on ProbasiBangali.in`)} target="_blank" rel="noopener noreferrer">
                        <Button variant="secondary" size="sm"><MessageCircle className="w-4 h-4" /> Chat</Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🏠</p>
            <h3 className="text-xl font-bold text-text-primary mb-2">No listings found</h3>
            <p className="text-text-muted">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>
    </div>
  );
}
