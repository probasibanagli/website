'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { MapPin, Phone, MessageCircle, Search, CheckCircle2, ExternalLink, Home, Gift, ShoppingBag, Truck, Download, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/card';
import { sampleFoodListings } from '@/data/sample-data';
import { CITIES, FOOD_AREAS } from '@/lib/constants';
import { getWhatsAppUrl } from '@/lib/utils';
import { useFirestore } from '@/lib/hooks/useFirestore';
import { FoodListing } from '@/types';

const FOOD_TYPE_LABELS: Record<string, string> = {
  restaurant: 'Restaurants',
  sweets: 'Sweets',
  tiffin: 'Tiffin',
  'delivery partner': 'Delivery Partner',
};

const FOOD_TYPE_ICONS: Record<string, React.ReactNode> = {
  restaurant: <Home className="w-5 h-5" />,
  sweets: <Gift className="w-5 h-5" />,
  tiffin: <ShoppingBag className="w-5 h-5" />,
  delivery: <Truck className="w-5 h-5" />,
};

export default function FoodPage() {
  const { data: firestoreListings, loading } = useFirestore<FoodListing>('food_listings');
  const [activeType, setActiveType] = useState<string>('all');
  const [city, setCity] = useState('');
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [area, setArea] = useState('');
  const [isAreaOpen, setIsAreaOpen] = useState(false);
  const [bengaliOnly, setBengaliOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const DELIVERY_PARTNERS = [
    { key: 'zomato_url', label: 'Zomato', variant: 'red' },
    { key: 'swiggy_url', label: 'Swiggy', variant: 'amber' },
    { key: 'magicpin_url', label: 'Magicpin', variant: 'default' },
    { key: 'dunzo_url', label: 'Dunzo', variant: 'teal' },
    { key: 'eatsure_url', label: 'EatSure', variant: 'amber' },
    { key: 'uber_eats_url', label: 'Uber Eats', variant: 'red' },
  ] as const;

  const sortedCities = useMemo(() => [...CITIES].sort((a, b) => a.localeCompare(b)), []);

  const combinedListings = useMemo(() => {
    const firestoreIds = new Set(firestoreListings.map((l) => l.id));
    const dedupedSample = sampleFoodListings.filter((l) => !firestoreIds.has(l.id));
    return [...firestoreListings, ...dedupedSample];
  }, [firestoreListings]);

  const availableAreas = useMemo(() => {
    if (!city) return [];
    return FOOD_AREAS[city] || [];
  }, [city]);

  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    setArea('');
    setIsCityOpen(false);
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const filtered = useMemo(() => {
    return combinedListings.filter((f) => {
      if (activeType !== 'all' && f.type !== activeType) return false;
      if (city && f.city !== city && f.type !== 'delivery partner') return false;
      if (area && f.area !== area) return false;
      if (bengaliOnly && !f.bengali_friendly) return false;
      if (searchQuery && !f.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [combinedListings, activeType, city, area, bengaliOnly, searchQuery]);

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
            <Link href="/" className="hover:text-primary">Home</Link><span>/</span>
            <Link href="/explore/food" className="hover:text-primary">Explore</Link><span>/</span>
            <span className="text-text-primary font-medium">Food</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-text-primary">Bengali Food & Sweets</h1>
          <p className="mt-2 text-text-muted">Discover authentic Bengali restaurants, sweet shops, tiffin services, and delivery partners.</p>

          {/* Type Tabs */}
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'All' },
              { value: 'restaurant', label: '🍽️ Restaurants' },
              { value: 'sweets', label: '🍬 Sweets' },
              { value: 'tiffin', label: '🍱 Tiffin' },
            ].map((tab) => (
              <button key={tab.value} onClick={() => setActiveType(tab.value as string)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${activeType === tab.value ? 'bg-primary text-white shadow-md' : 'bg-white text-text-primary border border-border hover:border-primary'}`}>
                {tab.label}
              </button>
            ))}
            <button onClick={handleDownloadPDF} className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white text-text-primary border border-border hover:bg-surface transition-all cursor-pointer">
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>

          {/* ── STEP 1: City Selection (Primary) ── */}
          <div className="mt-5 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-100">
            <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Step 1 — Select City
            </p>
            <div className="relative w-full sm:max-w-xs">
              <button
                onClick={() => setIsCityOpen(!isCityOpen)}
                className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
              >
                <span className="truncate">{city || 'Choose a City...'}</span>
                <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${isCityOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCityOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsCityOpen(false)} />
                  <div className="absolute top-full left-0 w-full mt-1 bg-white border border-border rounded-xl shadow-lg z-20 max-h-60 overflow-y-auto">
                    <button
                      onClick={() => handleCityChange('')}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-surface transition-colors ${!city ? 'bg-orange-50 font-medium text-orange-600' : 'text-text-primary'}`}
                    >
                      All Cities
                    </button>
                    {CITIES.map((c) => (
                      <button
                        key={c}
                        onClick={() => handleCityChange(c)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-surface transition-colors ${city === c ? 'bg-orange-50 font-medium text-orange-600' : 'text-text-primary'}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── STEP 2: Area + Bengali Friendly (visible after city selected) ── */}
          {city && (
            <div className="mt-3 p-4 bg-white rounded-2xl border border-border space-y-4 animate-fade-in">
              <div className="flex flex-col md:flex-row md:flex-wrap items-start md:items-center gap-3">
                {/* Area Dropdown */}
                <div className="relative min-w-[180px]">
                  <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">Area</p>
                  <button
                    onClick={() => setIsAreaOpen(!isAreaOpen)}
                    className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                  >
                    <span className="truncate">{area || 'All Areas'}</span>
                    <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${isAreaOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isAreaOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsAreaOpen(false)} />
                      <div className="absolute top-full left-0 w-full mt-1 bg-white border border-border rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto">
                        <button
                          onClick={() => { setArea(''); setIsAreaOpen(false); }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-surface transition-colors ${!area ? 'bg-orange-50 font-medium text-orange-600' : 'text-text-primary'}`}
                        >
                          All Areas
                        </button>
                        {availableAreas.map((a) => (
                          <button
                            key={a}
                            onClick={() => { setArea(a); setIsAreaOpen(false); }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-surface transition-colors ${area === a ? 'bg-orange-50 font-medium text-orange-600' : 'text-text-primary'}`}
                          >
                            {a}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Bengali-Friendly Toggle */}
                <div>
                  <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1 opacity-0">Filter</p>
                  <button
                    onClick={() => setBengaliOnly(!bengaliOnly)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                      bengaliOnly ? 'bg-orange-500 text-white shadow-md' : 'bg-white border border-border text-text-primary hover:border-orange-400'
                    }`}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    🍛 Bengali Friendly
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search restaurants..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-sm text-text-muted mb-6"><span className="font-semibold text-text-primary">{filtered.length}</span> places found</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((food) => (
            <Card key={food.id} padding="none" className="overflow-hidden group">
              <div className="relative h-40 bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
                <span className="text-5xl opacity-30">{food.type === 'restaurant' ? '🍽️' : food.type === 'sweets' ? '🍬' : food.type === 'tiffin' ? '🍱' : '🛵'}</span>
                <div className="absolute top-3 left-3">
                  <Badge variant="amber">{FOOD_TYPE_LABELS[food.type as string] || food.type}</Badge>
                </div>
                {food.verified && <div className="absolute top-3 right-3"><Badge variant="verified"><CheckCircle2 className="w-3 h-3 mr-1" />Verified</Badge></div>}
              </div>
              <div className="p-5">
                <Link href={`/explore/food/${food.id}`}><h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors">{food.name}</h3></Link>
                <div className="flex items-center gap-1.5 mt-1 text-sm text-text-muted"><MapPin className="w-3.5 h-3.5" />{food.area}, {food.city}</div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {food.specialties.slice(0, 4).map((s) => (<span key={s} className="px-2 py-0.5 bg-surface rounded-md text-xs text-text-muted">{s}</span>))}
                </div>

                <div className="flex flex-col gap-4 mt-5 pt-4 border-t border-border">
                  {/* Delivery Badges */}
                  <div className="flex flex-wrap gap-2">
                    {DELIVERY_PARTNERS.map((partner) => {
                      const url = (food as unknown as Record<string, unknown>)[partner.key] as string | undefined;
                      return url ? (
                        <a key={partner.key} href={url} target="_blank" rel="noopener noreferrer">
                          <Badge variant={partner.variant as 'red' | 'amber' | 'default' | 'teal'} className="hover:scale-105 transition-transform">
                            {partner.label} <ExternalLink className="w-2.5 h-2.5 ml-1" />
                          </Badge>
                        </a>
                      ) : null;
                    })}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex gap-2">
                      {food.phone && (
                        <a href={`tel:${food.phone}`}>
                          <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-full hover:bg-primary/10 hover:text-primary shadow-sm border border-border">
                            <Phone className="w-4 h-4" />
                          </Button>
                        </a>
                      )}
                      {food.whatsapp && (
                        <a href={getWhatsAppUrl(food.whatsapp, `Hi, I found "${food.name}" on ProbasiBangali.in`)} target="_blank" rel="noopener noreferrer">
                          <Button variant="secondary" size="sm" className="h-10 px-4 rounded-full shadow-sm">
                            <MessageCircle className="w-4 h-4 mr-2" /> Chat
                          </Button>
                        </a>
                      )}
                    </div>
                    <Link href={`/explore/food/${food.id}`}>
                      <Button variant="outline" size="sm" className="h-10 px-4 rounded-full hover:bg-surface transition-all">
                        Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        {filtered.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="flex justify-center mb-4 text-primary/40"><Search className="w-16 h-16" /></div>
            <h3 className="text-xl font-bold text-text-primary mb-2">No food listings found</h3>
            <p className="text-text-muted">Try adjusting your filters.</p>
          </div>
        )}
        {loading && (
          <div className="text-center py-20 flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-text-muted text-sm font-medium animate-pulse">Fetching fresh listings...</p>
          </div>
        )}
      </div>
    </div>
  );
}
