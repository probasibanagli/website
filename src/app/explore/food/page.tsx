'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { MapPin, Phone, MessageCircle, Search, CheckCircle2, ExternalLink, UtensilsCrossed, Gift, ShoppingBag, Truck, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/card';
import { PlaceImage } from '@/components/ui/PlaceImage';
import { sampleFoodListings } from '@/data/sample-data';
import { CITIES, FOOD_AREAS } from '@/lib/constants';
import { getWhatsAppUrl } from '@/lib/utils';
import { useFirestore } from '@/lib/hooks/useFirestore';
import { FoodListing } from '@/types';

const FOOD_TYPE_LABELS: Record<string, string> = {
  restaurant: 'Restaurant',
  sweets: 'Sweets',
  tiffin: 'Tiffin',
  'delivery partner': 'Delivery',
};

const FOOD_TYPE_ICONS: Record<string, React.ReactNode> = {
  restaurant: <UtensilsCrossed className="w-3.5 h-3.5" />,
  sweets: <Gift className="w-3.5 h-3.5" />,
  tiffin: <ShoppingBag className="w-3.5 h-3.5" />,
  'delivery partner': <Truck className="w-3.5 h-3.5" />,
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-3">
            <Link href="/" className="hover:text-primary">Home</Link><span>/</span>
            <span className="text-text-primary font-medium">Bengali Food & Sweets</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-text-primary">Bengali Food & Sweets</h1>
          <p className="mt-1 text-text-muted text-sm">Discover restaurants, sweet shops, tiffin services, and delivery partners.</p>

          {/* ── Inline Filter Bar ── */}
          <div className="mt-5 flex flex-col gap-3">
            {/* Row 1: Type tabs + Bengali toggle */}
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'All', icon: <Search className="w-3.5 h-3.5" /> },
                { value: 'restaurant', label: 'Restaurants', icon: <UtensilsCrossed className="w-3.5 h-3.5" /> },
                { value: 'sweets', label: 'Sweets', icon: <Gift className="w-3.5 h-3.5" /> },
                { value: 'tiffin', label: 'Tiffin', icon: <ShoppingBag className="w-3.5 h-3.5" /> },
              ].map((tab) => (
                <button key={tab.value} onClick={() => setActiveType(tab.value as string)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${activeType === tab.value ? 'bg-primary text-white shadow-md' : 'bg-surface text-text-primary hover:bg-primary/5'}`}>
                  {tab.icon}
                  {tab.label}
                </button>
              ))}

              <button
                onClick={() => setBengaliOnly(!bengaliOnly)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ml-auto ${
                  bengaliOnly ? 'bg-accent text-white shadow-md' : 'bg-surface text-text-primary hover:bg-accent/5'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Bengali-friendly
              </button>
            </div>

            {/* Row 2: City + Area + Search */}
            <div className="flex flex-col md:flex-row md:flex-wrap items-start md:items-center gap-2">
              {/* City Dropdown */}
              <div className={`relative min-w-[160px] ${isCityOpen ? 'z-50' : 'z-30'}`}>
                <button onClick={() => { setIsCityOpen(!isCityOpen); setIsAreaOpen(false); }} className="flex items-center justify-between w-full px-3 py-2 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <span className="flex items-center gap-1.5 truncate"><MapPin className="w-3.5 h-3.5 text-text-muted" />{city || 'All Cities'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform ${isCityOpen ? 'rotate-180' : ''}`} />
                </button>
                {isCityOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsCityOpen(false)} />
                    <div className="absolute top-full left-0 w-full mt-1 bg-white border border-border rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                      <button onClick={() => handleCityChange('')} className={`w-full text-left px-4 py-2 text-sm hover:bg-surface transition-colors ${!city ? 'bg-primary/5 font-medium text-primary' : 'text-text-primary'}`}>All Cities</button>
                      {CITIES.map((c) => (
                        <button key={c} onClick={() => handleCityChange(c)} className={`w-full text-left px-4 py-2 text-sm hover:bg-surface transition-colors ${city === c ? 'bg-primary/5 font-medium text-primary' : 'text-text-primary'}`}>{c}</button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Area Dropdown */}
              {city && availableAreas.length > 0 && (
                <div className={`relative min-w-[160px] ${isAreaOpen ? 'z-50' : 'z-20'}`}>
                  <button onClick={() => { setIsAreaOpen(!isAreaOpen); setIsCityOpen(false); }} className="flex items-center justify-between w-full px-3 py-2 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <span className="truncate">{area || 'All Areas'}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform ${isAreaOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isAreaOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsAreaOpen(false)} />
                      <div className="absolute top-full left-0 w-full mt-1 bg-white border border-border rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto">
                        <button onClick={() => { setArea(''); setIsAreaOpen(false); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-surface transition-colors ${!area ? 'bg-primary/5 font-medium text-primary' : 'text-text-primary'}`}>All Areas</button>
                        {availableAreas.map((a) => (
                          <button key={a} onClick={() => { setArea(a); setIsAreaOpen(false); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-surface transition-colors ${area === a ? 'bg-primary/5 font-medium text-primary' : 'text-text-primary'}`}>{a}</button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Search */}
              <div className="relative flex-1 w-full md:min-w-[180px] md:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search restaurants..." className="w-full pl-9 pr-3 py-2 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-sm text-text-muted mb-6"><span className="font-semibold text-text-primary">{filtered.length}</span> places found</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((food) => (
            <Card key={food.id} padding="none" className="overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative">
                <PlaceImage
                  name={food.name}
                  city={food.city}
                  type={(food.type as 'restaurant' | 'sweets' | 'tiffin') || 'restaurant'}
                  mapsUrl={food.google_maps_url}
                  className="h-40"
                />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[11px] font-bold text-text-primary shadow-sm">
                    {FOOD_TYPE_ICONS[food.type as string] || <UtensilsCrossed className="w-3.5 h-3.5" />}
                    {FOOD_TYPE_LABELS[food.type as string] || food.type}
                  </span>
                </div>
                {food.verified && (
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-0.5 px-2 py-1 bg-green-500/90 backdrop-blur-sm rounded-lg text-[10px] font-bold text-white shadow-sm">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <Link href={`/explore/food/${food.id}`}><h3 className="font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-1">{food.name}</h3></Link>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-text-muted"><MapPin className="w-3 h-3" />{food.area}, {food.city}</div>
                <div className="flex flex-wrap gap-1 mt-3">
                  {(food.specialties || []).slice(0, 4).map((s) => (<span key={s} className="px-2 py-0.5 bg-surface rounded-md text-[11px] text-text-muted">{s}</span>))}
                </div>

                <div className="flex flex-col gap-3 mt-4 pt-3 border-t border-border">
                  {/* Delivery Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {DELIVERY_PARTNERS.map((partner) => {
                      const url = (food as unknown as Record<string, unknown>)[partner.key] as string | undefined;
                      return url ? (
                        <a key={partner.key} href={url} target="_blank" rel="noopener noreferrer">
                          <Badge variant={partner.variant as 'red' | 'amber' | 'default' | 'teal'} className="hover:scale-105 transition-transform text-[10px]">
                            {partner.label} <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                          </Badge>
                        </a>
                      ) : null;
                    })}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1.5">
                      {food.phone && (
                        <a href={`tel:${food.phone}`}>
                          <button className="w-8 h-8 rounded-lg bg-surface hover:bg-primary/10 flex items-center justify-center transition-colors cursor-pointer">
                            <Phone className="w-3.5 h-3.5 text-text-muted" />
                          </button>
                        </a>
                      )}
                      {food.whatsapp && (
                        <a href={getWhatsAppUrl(food.whatsapp, `Hi, I found "${food.name}" on ProbasiBangali.in`)} target="_blank" rel="noopener noreferrer">
                          <button className="w-8 h-8 rounded-lg bg-green-50 hover:bg-green-100 flex items-center justify-center transition-colors cursor-pointer">
                            <MessageCircle className="w-3.5 h-3.5 text-green-600" />
                          </button>
                        </a>
                      )}
                    </div>
                    <Link href={`/explore/food/${food.id}`}>
                      <Button variant="outline" size="sm" className="h-8 px-3 rounded-lg text-xs">
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
            <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-text-muted/40" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">No food listings found</h3>
            <p className="text-text-muted text-sm">Try adjusting your filters.</p>
          </div>
        )}
        {loading && (
          <div className="text-center py-20 flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-text-muted text-sm font-medium">Loading listings...</p>
          </div>
        )}
      </div>
    </div>
  );
}
