'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { MapPin, Phone, MessageCircle, Search, CheckCircle2, ExternalLink, Download } from 'lucide-react';
import { Gift01, Home01, ShoppingBag01, Bus, SearchLg } from '@untitledui/icons';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/card';
import { sampleFoodListings } from '@/data/sample-data';
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
  restaurant: <Home01 className="w-5 h-5" />,
  sweets: <Gift01 className="w-5 h-5" />,
  tiffin: <ShoppingBag01 className="w-5 h-5" />,
  delivery: <Bus className="w-5 h-5" />,
};

export default function FoodPage() {
  const { data: firestoreListings, loading } = useFirestore<FoodListing>('food_listings');
  const [activeType, setActiveType] = useState<string>('all');
  const [city, setCity] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const sortedCities = useMemo(() => [...CITIES].sort((a, b) => a.localeCompare(b)), []);

  const combinedListings = useMemo(() => {
    // Merge Firestore data with sample data, prioritizing Firestore (or just showing both)
    const firestoreIds = new Set(firestoreListings.map(l => l.id));
    return [...firestoreListings, ...sampleFoodListings.filter(l => !firestoreIds.has(l.id))];
  }, [firestoreListings]);

  const filtered = useMemo(() => {
    return combinedListings.filter((f) => {
      if (activeType !== 'all' && f.type !== activeType) return false;
      if (city && f.city !== city && f.type !== 'delivery') return false;
      if (searchQuery && !f.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [combinedListings, activeType, city, searchQuery]);

  const handleDownloadPDF = () => {
    window.print(); // Simple way to download as PDF (Print to PDF)
  };

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
          <p className="mt-2 text-text-muted">Discover authentic Bengali restaurants, sweet shops, and tiffin services.</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'All', icon: <SearchLg className="w-4 h-4" /> },
              { value: 'restaurant', label: 'Restaurants', icon: <Home01 className="w-4 h-4" /> },
              { value: 'sweets', label: 'Sweets', icon: <Gift01 className="w-4 h-4" /> },
              { value: 'tiffin', label: 'Tiffin', icon: <ShoppingBag01 className="w-4 h-4" /> },
            ].map((tab) => (
              <button key={tab.value} onClick={() => setActiveType(tab.value)}
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
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search restaurants..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <select value={city} onChange={(e) => setCity(e.target.value)} className="px-4 py-2.5 rounded-xl border border-border text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value="">All Cities</option>
              {sortedCities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-sm text-text-muted mb-6"><span className="font-semibold text-text-primary">{filtered.length}</span> places found</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((food) => (
            <Card key={food.id} className="p-0 overflow-hidden group">
              <div className="relative h-40 bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
                <div className="text-primary opacity-40 scale-[2.5]">
                  {FOOD_TYPE_ICONS[food.type as string] || <Home01 />}
                </div>
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
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <div className="flex flex-wrap gap-2">
                    {food.zomato_url && <a href={getZomatoSearchUrl(food.name, food.city)} target="_blank" rel="noopener noreferrer"><Badge variant="red">Zomato <ExternalLink className="w-2.5 h-2.5 ml-1" /></Badge></a>}
                    {food.swiggy_url && <a href={getSwiggySearchUrl(food.name, food.city)} target="_blank" rel="noopener noreferrer"><Badge variant="amber">Swiggy <ExternalLink className="w-2.5 h-2.5 ml-1" /></Badge></a>}
                    {food.magicpin_url && <a href={getMagicpinSearchUrl(food.name, food.city)} target="_blank" rel="noopener noreferrer"><Badge variant="teal">Magicpin <ExternalLink className="w-2.5 h-2.5 ml-1" /></Badge></a>}
                    {food.eatsure_url && <a href={getEatsureSearchUrl(food.name)} target="_blank" rel="noopener noreferrer"><Badge variant="red">EatSure <ExternalLink className="w-2.5 h-2.5 ml-1" /></Badge></a>}
                    {food.uber_eats_url && <a href={getUberEatsSearchUrl(food.name, food.city)} target="_blank" rel="noopener noreferrer"><Badge variant="amber">Uber Eats <ExternalLink className="w-2.5 h-2.5 ml-1" /></Badge></a>}
                  </div>
                  <div className="flex gap-2">
                    {food.google_maps_url && <a href={food.google_maps_url} target="_blank" rel="noopener noreferrer"><Button variant="ghost" size="sm"><MapPin className="w-4 h-4" /></Button></a>}
                    {food.whatsapp && <a href={getWhatsAppUrl(food.whatsapp)} target="_blank" rel="noopener noreferrer"><Button variant="secondary" size="sm"><MessageCircle className="w-4 h-4" /></Button></a>}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        {filtered.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="flex justify-center mb-4 text-primary/40"><SearchLg className="w-16 h-16" /></div>
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
