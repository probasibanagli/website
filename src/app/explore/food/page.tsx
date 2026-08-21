'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { MapPin, Phone, MessageCircle, Search, CheckCircle2, ExternalLink, Home, Gift, ShoppingBag, Truck, Download, ChevronDown, SlidersHorizontal, Heart, Star, Utensils, Candy, Soup, Sparkles, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/Skeleton';
import { CITIES, FOOD_AREAS, FOOD_TAMIL_WORDS } from '@/lib/constants';
import { WordHelper } from '@/components/ui/WordHelper';
import { getWhatsAppUrl } from '@/lib/utils';
import { useFirestore } from '@/lib/hooks/useFirestore';
import { FoodListing } from '@/types';

const FOOD_TYPE_LABELS: Record<string, string> = {
  restaurant: 'Restaurants',
  sweets: 'Sweets',
  tiffin: 'Tiffin',
  'delivery partner': 'Delivery Partner',
  'cloud kitchen': 'Cloud Kitchen',
};

const FOOD_TYPE_ICONS: Record<string, React.ReactNode> = {
  restaurant: <Home className="w-5 h-5 text-black" />,
  sweets: <Gift className="w-5 h-5 text-black" />,
  tiffin: <ShoppingBag className="w-5 h-5 text-black" />,
  delivery: <Truck className="w-5 h-5 text-black" />,
  'cloud kitchen': <ChefHat className="w-5 h-5 text-black" />,
};

function ListingCoverImage({ name, city, mapsUrl, imageUrl, type, mapEmbedCode, fallbackIcon }: { 
  name: string; 
  city?: string; 
  mapsUrl?: string; 
  imageUrl?: string;
  type?: string;
  mapEmbedCode?: string;
  fallbackIcon: React.ReactNode;
}) {
  let extractUrl = mapsUrl || '';
  if (!extractUrl && mapEmbedCode) {
    const match = mapEmbedCode.match(/src="([^"]+)"/);
    if (match) extractUrl = match[1];
  }
  
  // Always try to fetch if we have name and city, even if URL is missing
  const imgSrc = imageUrl || (name && city ? `/api/public/place-photo?name=${encodeURIComponent(name)}&city=${encodeURIComponent(city || '')}&mapsUrl=${encodeURIComponent(extractUrl)}&v=4` : null);
  const [error, setError] = useState(false);

  React.useEffect(() => {
    setError(false);
  }, [imgSrc]);

  if (error || !imgSrc) {
    return (
      <div className="absolute inset-0 bg-orange-50 flex items-center justify-center">
        <div className="text-black opacity-45">
          {fallbackIcon}
        </div>
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={name}
      onError={() => setError(true)}
      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      loading="lazy"
    />
  );
}

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

  const combinedListings = firestoreListings;

  const sortedCities = useMemo(() => {
    return Array.from(new Set(combinedListings.map((l) => l.city).filter(Boolean).map(c => {
      const trimmed = c!.trim();
      return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
    }))).sort();
  }, [combinedListings]);

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
      if (city && f.city?.toLowerCase() !== city.toLowerCase() && f.type !== 'delivery partner') return false;
      if (area && f.area !== area) return false;
      if (bengaliOnly && !f.bengali_friendly) return false;
      if (searchQuery && !f.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [combinedListings, activeType, city, area, bengaliOnly, searchQuery]);

  return (
    <div className="min-h-screen bg-surface">      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-[1536px] mx-auto px-3 sm:px-6 lg:px-8 py-3 md:py-4 lg:py-5">
          <div className="hidden md:flex items-center gap-2 text-xs md:text-sm text-text-muted mb-2">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/explore/food" className="hover:text-primary">Explore</Link>
            <span>/</span>
            <span className="text-text-primary font-medium">Food</span>
          </div>
          <h1 className="text-lg sm:text-2xl md:text-3xl font-bold font-display text-text-primary leading-tight">
            Bengali Food & Sweets
          </h1>
          <p className="hidden md:block mt-1 text-xs md:text-sm text-text-muted">Authentic Bengali restaurants, sweet shops, and tiffin services in Tamil Nadu.</p>

          {/* Type Tabs */}
          <div className="mt-2.5 md:mt-3.5 flex flex-wrap items-center gap-1 sm:gap-2 justify-between sm:justify-start w-full">
            {[
              { value: 'all', label: 'All', icon: (active: boolean) => <Utensils className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-primary'}`} /> },
              { value: 'restaurant', label: 'Restaurants', icon: (active: boolean) => <Utensils className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-primary'}`} /> },
              { value: 'sweets', label: 'Sweets', icon: (active: boolean) => <Candy className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-primary'}`} /> },
              { value: 'tiffin', label: 'Tiffin Service', icon: (active: boolean) => <Soup className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-primary'}`} /> },
              { value: 'delivery partner', label: 'Delivery', icon: (active: boolean) => <Truck className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-primary'}`} /> },
            ].map((tab) => {
              const active = activeType === tab.value;
              return (
                <button key={tab.value} onClick={() => setActiveType(tab.value as string)}
                  className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1 md:px-3.5 md:py-1.5 rounded-full text-[11px] sm:text-xs md:text-sm font-semibold transition-all cursor-pointer flex-1 sm:flex-initial text-center ${active ? 'bg-primary text-white shadow-sm' : 'bg-white text-text-primary border border-border hover:border-primary'}`}>
                  {tab.icon ? tab.icon(active) : null}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Unified Filter Bar */}
          <div className="mt-2.5 md:mt-3.5 flex flex-col md:flex-row md:flex-wrap items-stretch md:items-center gap-2 md:gap-3 relative z-30">
            {/* Search */}
            <div className="relative w-full md:flex-1 md:min-w-[200px] md:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-text-muted" />
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search restaurants..." className="w-full pl-9 pr-3 py-1.5 md:pl-10 md:pr-4 md:py-2 rounded-lg md:rounded-xl border border-border text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-sm" />
            </div>

            {/* Dropdowns container */}
            <div className="flex flex-wrap items-center gap-1.5 md:gap-2 w-full md:w-auto">
              {/* City Dropdown */}
              <div className={`relative flex-1 sm:flex-none md:min-w-[160px] ${isCityOpen ? 'z-50' : ''}`}>
                <button
                  onClick={() => setIsCityOpen(!isCityOpen)}
                  className="flex items-center justify-between gap-1.5 w-full px-2.5 py-1.5 md:px-3.5 md:py-2 rounded-lg md:rounded-xl border border-border bg-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                >
                  <span className="truncate max-w-[100px] md:max-w-none">{city || 'All Cities'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 md:w-4 md:h-4 text-text-muted transition-transform ${isCityOpen ? 'rotate-180' : ''}`} />
                </button>

                {isCityOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsCityOpen(false)} />
                    <div className="absolute top-full left-0 w-44 md:w-full mt-1 bg-white border border-border rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                      <button
                        onClick={() => handleCityChange('')}
                        className={`w-full text-left px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm hover:bg-surface transition-colors ${!city ? 'bg-orange-50 font-medium text-orange-600' : 'text-text-primary'}`}
                      >
                        All Cities
                      </button>
                      {sortedCities.map((c) => (
                        <button
                          key={c}
                          onClick={() => handleCityChange(c)}
                          className={`w-full text-left px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm hover:bg-surface transition-colors ${city === c ? 'bg-orange-50 font-medium text-orange-600' : 'text-text-primary'}`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Area Dropdown */}
              {city && (
                <div className={`relative flex-1 sm:flex-none md:min-w-[160px] ${isAreaOpen ? 'z-50' : ''}`}>
                  <button
                    onClick={() => setIsAreaOpen(!isAreaOpen)}
                    className="flex items-center justify-between gap-1.5 w-full px-2.5 py-1.5 md:px-3.5 md:py-2 rounded-lg md:rounded-xl border border-border bg-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 animate-fade-in"
                  >
                    <span className="truncate max-w-[100px] md:max-w-none">{area || 'All Areas'}</span>
                    <ChevronDown className={`w-3.5 h-3.5 md:w-4 md:h-4 text-text-muted transition-transform ${isAreaOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isAreaOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsAreaOpen(false)} />
                      <div className="absolute top-full left-0 w-44 md:w-full mt-1 bg-white border border-border rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto">
                        <button
                          onClick={() => { setArea(''); setIsAreaOpen(false); }}
                          className={`w-full text-left px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm hover:bg-surface transition-colors ${!area ? 'bg-orange-50 font-medium text-orange-600' : 'text-text-primary'}`}
                        >
                          All Areas
                        </button>
                        {availableAreas.map((a) => (
                          <button
                            key={a}
                            onClick={() => { setArea(a); setIsAreaOpen(false); }}
                            className={`w-full text-left px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm hover:bg-surface transition-colors ${area === a ? 'bg-orange-50 font-medium text-orange-600' : 'text-text-primary'}`}
                          >
                            {a}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Bengali Friendly Toggle */}
              {city && (
                <button
                  onClick={() => setBengaliOnly(!bengaliOnly)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 md:px-3.5 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all cursor-pointer animate-fade-in shrink-0 ${
                    bengaliOnly ? 'bg-orange-500 text-white shadow-md' : 'bg-white border border-border text-text-primary hover:border-orange-400'
                  }`}
                >
                  <Sparkles className={`w-3 h-3 md:w-3.5 md:h-3.5 ${bengaliOnly ? 'text-white' : 'text-black'}`} />
                  <span>Bengali Friendly</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <p className="text-sm text-text-muted mb-6"><span className="font-semibold text-text-primary">{filtered.length}</span> places found</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((food) => {
            const tagsToShow = [];
            if (food.type === 'restaurant') tagsToShow.push({ name: 'Restaurant', icon: null });
            if (food.type === 'sweets') tagsToShow.push({ name: 'Sweets', icon: null });
            if (food.type === 'tiffin') tagsToShow.push({ name: 'Tiffin Service', icon: null });
            
            const rawSpecialties = food.specialties as any;
            const specialtiesArray = Array.isArray(rawSpecialties) 
              ? rawSpecialties 
              : (typeof rawSpecialties === 'string' ? rawSpecialties.split(',').map((s: string) => s.trim()) : []);
              
            specialtiesArray.slice(0, 2).forEach((s) => {
              tagsToShow.push({ name: s, icon: null });
            });
            
            if (food.zomato_url || food.swiggy_url || food.type === 'delivery partner') {
              tagsToShow.push({ name: 'Home Delivery', icon: <Truck className="w-3 h-3 text-[#0A6C4A]" /> });
            }

            const orderUrl = food.zomato_url || food.swiggy_url || (food.whatsapp ? getWhatsAppUrl(food.whatsapp, `Hi, I'd like to order from "${food.name}" via ProbasiBangali.in`) : `/explore/food/${food.id}`);
            const tagColors = [
              'bg-[#E6F4EA] text-[#137333]',
              'bg-[#FCE8E6] text-[#C5221F]',
              'bg-[#FEF7E0] text-[#B06000]',
            ];

            return (
              <Card key={food.id} padding="none" className="rounded-2xl lg:rounded-[24px] overflow-hidden group border border-gray-100 shadow-[0_2px_15px_-4px_rgba(0,0,0,0.06)] bg-white p-3 sm:p-4 flex flex-col justify-between h-full">
                <div className="flex flex-col flex-grow">
                  {/* Image Cover */}
                  <div className="relative w-full h-40 sm:h-44 rounded-xl lg:rounded-2xl overflow-hidden shrink-0 bg-slate-100 mb-3 sm:mb-4">
                    <ListingCoverImage
                      name={food.name}
                      city={food.city}
                      mapsUrl={food.google_maps_url}
                      imageUrl={food.image_url}
                      type={food.type}
                      mapEmbedCode={food.map_embed_code}
                      fallbackIcon={
                        <div className="text-black opacity-45 scale-[1.2] lg:scale-[1.5]">
                          {food.type === 'restaurant' ? <Utensils className="w-10 h-10 lg:w-12 lg:h-12" /> : food.type === 'sweets' ? <Candy className="w-10 h-10 lg:w-12 lg:h-12" /> : food.type === 'tiffin' ? <Soup className="w-10 h-10 lg:w-12 lg:h-12" /> : <Truck className="w-10 h-10 lg:w-12 lg:h-12" />}
                        </div>
                      }
                    />
                    {food.rating && (
                      <div className="absolute top-2 left-2 lg:top-3 lg:left-3 bg-white text-gray-900 text-[10px] lg:text-[11px] font-bold px-2 py-0.5 lg:px-2.5 lg:py-1 rounded-full shadow-sm flex items-center gap-1">
                        <Star className="w-3 h-3 lg:w-3.5 lg:h-3.5 fill-[#B06000] text-[#B06000]" />
                        <span>{food.rating}</span>
                      </div>
                    )}
                  </div>

                  {/* Title & Address */}
                  <div className="px-0.5">
                    <Link href={`/explore/food/${food.id}`}>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 hover:text-[#d85a30] transition-colors leading-tight font-display">
                        {food.name}
                      </h3>
                    </Link>

                    <p className="mt-1 text-xs text-[#8F9BB3] line-clamp-1 leading-relaxed">
                      {food.address || `${food.area}, ${food.city}`}
                    </p>

                    {/* Specialty Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-3">
                      {tagsToShow.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className={`${tagColors[idx % 3]} text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wide`}>
                          {tag.name}
                        </span>
                      ))}
                    </div>

                    {/* Quick Partner Links (Call, Zomato, Swiggy, etc.) */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-3">
                      {food.phone && (
                        <a href={`tel:${food.phone}`} className="inline-flex items-center gap-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2.5 py-1 rounded-full transition-colors shadow-xs">
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span>Call</span>
                        </a>
                      )}
                      {DELIVERY_PARTNERS.map((partner) => {
                        const url = (food as unknown as Record<string, unknown>)[partner.key] as string | undefined;
                        return url ? (
                          <a key={partner.key} href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2.5 py-1 rounded-full transition-colors shadow-xs">
                            <Truck className="w-3 h-3 text-slate-500" />
                            <span>{partner.label}</span>
                          </a>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>

                {/* Bottom Order Now Button */}
                <div className="w-full mt-4">
                  <a href={orderUrl} target={orderUrl.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="block w-full">
                    <button className="w-full bg-[#d85a30] hover:bg-[#b84a00] text-white font-bold py-2.5 px-4 rounded-[12px] flex items-center justify-center gap-2 text-sm transition-all shadow-sm active:scale-[0.98]">
                      <Utensils className="w-4 h-4 text-white" />
                      Order Now
                    </button>
                  </a>
                </div>
              </Card>
            );
          })}
        </div>
        {filtered.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="flex justify-center mb-4 text-primary/40"><Search className="w-16 h-16" /></div>
            <h3 className="text-xl font-bold text-text-primary mb-2">No food listings found</h3>
            <p className="text-text-muted">Try adjusting your filters.</p>
          </div>
        )}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
                <Skeleton className="w-full h-48" />
                <div className="p-4 space-y-3">
                  <Skeleton className="w-3/4 h-6" />
                  <Skeleton className="w-1/2 h-4" />
                  <div className="flex gap-2 pt-2">
                     <Skeleton className="w-16 h-6 rounded-full" />
                     <Skeleton className="w-16 h-6 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

