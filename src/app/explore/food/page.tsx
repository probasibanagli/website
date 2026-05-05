'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { MapPin, Phone, MessageCircle, Search, CheckCircle2, ExternalLink, Download, Gift, Home, ShoppingBag, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/card';
import { sampleFoodListings, cityRestaurants } from '@/data/sample-data';
import { CITIES } from '@/lib/constants';
import { getWhatsAppUrl, getZomatoSearchUrl, getSwiggySearchUrl, getMagicpinSearchUrl, getEatsureSearchUrl, getUberEatsSearchUrl } from '@/lib/utils';
import { useFirestore } from '@/lib/hooks/useFirestore';
import { FoodListing } from '@/types';

const FOOD_TYPE_LABELS: Record<string, string> = {
  restaurant: 'Restaurant',
  sweets: 'Sweets',
  tiffin: 'Tiffin',
  delivery: 'Delivery Partner',
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
  const [area, setArea] = useState('');
  const [bengaliOnly, setBengaliOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const FOOD_TYPE_LABELS: Record<string, string> = {
    restaurant: 'Restaurants',
    sweets: 'Sweets',
    tiffin: 'Tiffin',
    'delivery partner': 'Delivery Partner',
  };

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
    // Merge Firestore data with sample data, prioritizing Firestore (or just showing both)
    const firestoreIds = new Set(firestoreListings.map(l => l.id));
    return [...firestoreListings, ...sampleFoodListings.filter(l => !firestoreIds.has(l.id))];
  }, [firestoreListings]);

  const filtered = useMemo(() => {
    return combinedListings.filter((f) => {
      if (activeType !== 'all' && f.type !== activeType) return false;
      if (city && f.city !== city) return false;
      if (area && area !== 'All Areas' && f.area !== area) return false;
      if (bengaliOnly && !f.bengali_friendly) return false;
      if (searchQuery && !f.name.toLowerCase().includes(searchQuery.toLowerCase()) && !f.area.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [combinedListings, activeType, city, area, bengaliOnly, searchQuery]);

  const areas = useMemo(() => {
    if (!city) return [];
    const uniqueAreas = Array.from(new Set(combinedListings.filter(f => f.city === city).map(f => f.area)));
    return ['All Areas', ...uniqueAreas.sort()];
  }, [combinedListings, city]);

  const handleDownloadPDF = () => {
    window.print();
  };

  const restaurantSuggestions = city ? cityRestaurants[city] ?? [] : [];


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

          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'All', icon: <Search className="w-4 h-4" /> },
              { value: 'restaurant', label: 'Restaurants', icon: <Home className="w-4 h-4" /> },
              { value: 'sweets', label: 'Sweets', icon: <Gift className="w-4 h-4" /> },
              { value: 'tiffin', label: 'Tiffin', icon: <ShoppingBag className="w-4 h-4" /> },
              { value: 'delivery partner', label: 'Delivery', icon: <Truck className="w-4 h-4" /> },
            ].map((tab) => (
              <button key={tab.value} onClick={() => setActiveType(tab.value as any)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${activeType === tab.value ? 'bg-primary text-white shadow-md' : 'bg-white text-text-primary border border-border hover:border-primary'}`}>
                {tab.icon}
                {tab.label}
              </button>
            ))}
            <button onClick={handleDownloadPDF} className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white text-text-primary border border-border hover:bg-surface transition-all cursor-pointer">
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input value={searchQuery} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)} placeholder="Search food listings..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <select value={city} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { setCity(e.target.value); setArea(''); }} className="px-4 py-2.5 rounded-xl border border-border text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value="">Select City</option>
              {sortedCities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {city && (
              <select value={area} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setArea(e.target.value)} className="px-4 py-2.5 rounded-xl border border-border text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30">
                {areas.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            )}
            <button
              onClick={() => setBengaliOnly(!bengaliOnly)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                bengaliOnly ? 'bg-primary text-white shadow-md' : 'bg-white border border-border text-text-primary hover:border-primary'
              }`}
            >
              Bengali-friendly ✅
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-sm text-text-muted mb-6"><span className="font-semibold text-text-primary">{filtered.length}</span> places found</p>
        
        {city && restaurantSuggestions.length > 0 && (
          <Card className="mb-6 p-5 bg-gradient-to-br from-white to-surface border-primary/10">
            <h2 className="text-lg font-semibold text-text-primary mb-3">Top restaurant picks in {city}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {restaurantSuggestions.map((name) => (
                <div key={name} className="rounded-2xl border border-border bg-white px-4 py-3 text-sm text-text-primary hover:border-primary/30 transition-colors shadow-sm">
                  {name}
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((food) => (
            <Card key={food.id} padding="none" className="overflow-hidden group">
              <div className="relative h-40 bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
                <div className="text-primary opacity-40 scale-[2.5]">
                  {FOOD_TYPE_ICONS[food.type as string] || <Home />}
                </div>
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  <Badge variant="amber">{food.type ? FOOD_TYPE_LABELS[food.type] ?? food.type : 'Food'}</Badge>
                  {food.bengali_friendly && <Badge variant="bengali">Bengali Friendly</Badge>}
                </div>
                {food.verified && <div className="absolute top-3 right-3"><Badge variant="verified"><CheckCircle2 className="w-3 h-3 mr-1" />Verified</Badge></div>}
              </div>
              <div className="p-5">
                <Link href={`/explore/food/${food.id}`}><h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors">{food.name}</h3></Link>
                <div className="flex flex-col gap-3 mt-4">
                  {/* Address Block - Clickable */}
                  {food.google_maps_url ? (
                    <a 
                      href={food.google_maps_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex flex-col gap-1 p-3 rounded-xl bg-surface hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all group/loc"
                    >
                      <div className="flex items-center gap-1.5 text-sm font-bold text-text-primary group-hover/loc:text-primary">
                        <MapPin className="w-4 h-4" />
                        {food.area}
                      </div>
                      <div className="text-xs text-text-muted leading-relaxed">
                        {food.address} {food.pincode ? `— ${food.pincode}` : ''}
                      </div>
                      <div className="text-xs font-semibold text-text-muted mt-1 uppercase tracking-wider">{food.city}</div>
                    </a>
                  ) : (
                    <div className="flex flex-col gap-1 p-3 rounded-xl bg-surface border border-transparent">
                      <div className="flex items-center gap-1.5 text-sm font-bold text-text-primary">
                        <MapPin className="w-4 h-4" />
                        {food.area}
                      </div>
                      <div className="text-xs text-text-muted leading-relaxed">
                        {food.address} {food.pincode ? `— ${food.pincode}` : ''}
                      </div>
                      <div className="text-xs font-semibold text-text-muted mt-1 uppercase tracking-wider">{food.city}</div>
                    </div>
                  )}

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-1.5">
                    {food.specialties.slice(0, 3).map((s) => (
                      <span key={s} className="px-2 py-1 bg-white border border-border rounded-lg text-[10px] font-medium text-text-muted uppercase tracking-tight">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-4 mt-5 pt-4 border-t border-border">
                  {/* Delivery Badges */}
                  <div className="flex flex-wrap gap-2">
                    {DELIVERY_PARTNERS.map((partner) => {
                      const url = (food as any)[partner.key] as string | undefined;
                      return url ? (
                        <a key={partner.key} href={url} target="_blank" rel="noopener noreferrer">
                          <Badge variant={partner.variant as any} className="hover:scale-105 transition-transform">
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

