'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { MapPin, Phone, MessageCircle, Search, CheckCircle2, ExternalLink, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/card';
import { sampleFoodListings } from '@/data/sample-data';
import { CITIES, FOOD_AREAS } from '@/lib/constants';
import { getWhatsAppUrl, getZomatoSearchUrl, getSwiggySearchUrl, getMagicpinSearchUrl, getEatsureSearchUrl, getUberEatsSearchUrl } from '@/lib/utils';

const FOOD_TYPE_LABELS: Record<string, string> = {
  restaurant: 'Restaurant',
  sweets: 'Sweets',
  tiffin: 'Tiffin',
  delivery: 'Delivery Partner',
};

export default function FoodPage() {
  const [activeType, setActiveType] = useState<string>('all');
  const [city, setCity] = useState('');
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [area, setArea] = useState('');
  const [isAreaOpen, setIsAreaOpen] = useState(false);
  const [bengaliOnly, setBengaliOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Get areas for the selected city
  const availableAreas = useMemo(() => {
    if (!city) return [];
    return FOOD_AREAS[city] || [];
  }, [city]);

  // Reset dependent filters when city changes
  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    setArea('');
    setIsCityOpen(false);
  };

  const filtered = useMemo(() => {
    return sampleFoodListings.filter((f) => {
      if (activeType !== 'all' && f.type !== activeType) return false;
      if (city && f.city !== city) return false;
      if (area && f.area !== area) return false;
      if (bengaliOnly && !f.bengali_friendly) return false;
      if (searchQuery && !f.name.toLowerCase().includes(searchQuery.toLowerCase()) && !(f.area || '').toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [activeType, city, area, bengaliOnly, searchQuery]);

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

          {/* Type Tabs */}
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'All' },
              { value: 'restaurant', label: '🍽️ Restaurants' },
              { value: 'sweets', label: '🍬 Sweets' },
              { value: 'tiffin', label: '🍱 Tiffin' },
              { value: 'delivery', label: '🛵 Delivery' },
            ].map((tab) => (
              <button key={tab.value} onClick={() => setActiveType(tab.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${activeType === tab.value ? 'bg-primary text-white shadow-md' : 'bg-white text-text-primary border border-border hover:border-primary'}`}>
                {tab.label}
              </button>
            ))}
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
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search restaurants, areas..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-sm text-text-muted mb-6">
          <span className="font-semibold text-text-primary">{filtered.length}</span> places found
          {city && <> in <span className="font-semibold text-orange-600">{city}</span></>}
          {area && <> · <span className="font-medium">{area}</span></>}
          {bengaliOnly && <> · <span className="text-orange-600 font-medium">Bengali Friendly</span></>}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((food) => (
            <Card key={food.id} className="p-0 overflow-hidden group">
              <div className="relative h-40 bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
                <span className="text-5xl opacity-30">{food.type === 'restaurant' ? '🍽️' : food.type === 'sweets' ? '🍬' : food.type === 'tiffin' ? '🍱' : '🛵'}</span>
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge variant="amber">{FOOD_TYPE_LABELS[food.type as string] || food.type}</Badge>
                  {food.bengali_friendly && <Badge variant="bengali">🍛 Bengali</Badge>}
                </div>
                {food.verified && <div className="absolute top-3 right-3"><Badge variant="verified"><CheckCircle2 className="w-3 h-3 mr-1" />Verified</Badge></div>}
              </div>
              <div className="p-5">
                <Link href={`/explore/food/${food.id}`}><h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors">{food.name}</h3></Link>
                <div className="flex items-center gap-1.5 mt-1 text-sm text-text-muted"><MapPin className="w-3.5 h-3.5" />{food.area}, {food.city}</div>
                {food.pincode && (
                  <div className="mt-1 text-xs text-text-muted">📮 Pincode: {food.pincode}</div>
                )}
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
        {filtered.length === 0 && (<div className="text-center py-20"><p className="text-5xl mb-4">🍛</p><h3 className="text-xl font-bold text-text-primary mb-2">No food listings found</h3><p className="text-text-muted">Try adjusting your filters.</p></div>)}
      </div>
    </div>
  );
}
