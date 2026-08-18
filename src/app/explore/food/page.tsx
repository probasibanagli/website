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
    <div className="min-h-screen bg-surface">
      <div className="bg-white border-b border-border">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8 justify-between">
            <div className="flex-1">
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
              { value: 'all', label: 'All', icon: null },
              { value: 'restaurant', label: 'Restaurants', icon: (active: boolean) => <Utensils className={`w-4 h-4 ${active ? 'text-white' : 'text-black'}`} /> },
              { value: 'sweets', label: 'Sweets', icon: (active: boolean) => <Candy className={`w-4 h-4 ${active ? 'text-white' : 'text-black'}`} /> },
              { value: 'tiffin', label: 'Tiffin', icon: (active: boolean) => <Soup className={`w-4 h-4 ${active ? 'text-white' : 'text-black'}`} /> },
              { value: 'cloud kitchen', label: 'Cloud Kitchen', icon: (active: boolean) => <ChefHat className={`w-4 h-4 ${active ? 'text-white' : 'text-black'}`} /> },
            ].map((tab) => {
              const active = activeType === tab.value;
              return (
                <button key={tab.value} onClick={() => setActiveType(tab.value as string)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${active ? 'bg-primary text-white shadow-md' : 'bg-white text-text-primary border border-border hover:border-primary'}`}>
                  {tab.icon ? tab.icon(active) : null}
                  <span>{tab.label}</span>
                </button>
              );
            })}

          </div>

          {/* Unified Filter Bar */}
          <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-3 relative z-30">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search restaurants..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>

            {/* City Dropdown */}
            <div className={`relative min-w-[180px] ${isCityOpen ? 'z-50' : ''}`}>
              <button
                onClick={() => setIsCityOpen(!isCityOpen)}
                className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
              >
                <span className="truncate">{city || 'All Cities'}</span>
                <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${isCityOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCityOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsCityOpen(false)} />
                  <div className="absolute top-full left-0 w-full mt-1 bg-white border border-border rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                    <button
                      onClick={() => handleCityChange('')}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-surface transition-colors ${!city ? 'bg-orange-50 font-medium text-orange-600' : 'text-text-primary'}`}
                    >
                      All Cities
                    </button>
                    {sortedCities.map((c) => (
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

            {/* Area Dropdown */}
            {city && (
              <div className={`relative min-w-[180px] ${isAreaOpen ? 'z-50' : ''}`}>
                <button
                  onClick={() => setIsAreaOpen(!isAreaOpen)}
                  className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 animate-fade-in"
                >
                  <span className="truncate">{area || 'All Areas'}</span>
                  <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${isAreaOpen ? 'rotate-180' : ''}`} />
                </button>
                {isAreaOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsAreaOpen(false)} />
                    <div className="absolute top-full left-0 w-full mt-1 bg-white border border-border rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto">
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
            )}

            {/* Bengali Friendly Toggle */}
            {city && (
              <button
                onClick={() => setBengaliOnly(!bengaliOnly)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer animate-fade-in ${
                  bengaliOnly ? 'bg-orange-500 text-white shadow-md' : 'bg-white border border-border text-text-primary hover:border-orange-400'
                }`}
              >
                <Sparkles className={`w-4 h-4 ${bengaliOnly ? 'text-white' : 'text-black'}`} />
                <span>Bengali Friendly</span>
              </button>
            )}
          </div>
            </div>
            
            {/* Right Sidebar for Word Helper */}
            {/*
            <div className="w-full lg:w-[450px] xl:w-[500px] shrink-0 flex items-center">
              <WordHelper 
                words={FOOD_TAMIL_WORDS} 
                title="Food Word Helper" 
                subtitle="Essential food and dining phrases in Tamil & Bengali"
                variant="horizontal"
              />
            </div>
            */}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-sm text-text-muted mb-6"><span className="font-semibold text-text-primary">{filtered.length}</span> places found</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((food) => {
                // Dynamic mock details matching mockup style
            const reviewsCount = 50 + (food.name.charCodeAt(1) % 150);
            
            // Build custom tags
            const tagsToShow = [];
            if (food.type === 'restaurant') tagsToShow.push({ name: 'Restaurant', icon: null });
            if (food.type === 'sweets') tagsToShow.push({ name: 'Sweets', icon: null });
            if (food.type === 'tiffin') tagsToShow.push({ name: 'Tiffin Service', icon: null });
            
            // Add specialties safely (handle case where it might be a string in DB)
            const rawSpecialties = food.specialties as any;
            const specialtiesArray = Array.isArray(rawSpecialties) 
              ? rawSpecialties 
              : (typeof rawSpecialties === 'string' ? rawSpecialties.split(',').map((s: string) => s.trim()) : []);
              
            specialtiesArray.slice(0, 2).forEach((s) => {
              tagsToShow.push({ name: s, icon: null });
            });
            
            if (food.zomato_url || food.swiggy_url || food.type === 'delivery partner') {
              tagsToShow.push({ name: 'Home Delivery', icon: <Truck className="w-3.5 h-3.5 text-[#0A6C4A]" /> });
            }

            const orderUrl = food.zomato_url || food.swiggy_url || (food.whatsapp ? getWhatsAppUrl(food.whatsapp, `Hi, I'd like to order from "${food.name}" via ProbasiBangali.in`) : `/explore/food/${food.id}`);
            const tagColors = [
              'bg-[#E6F4EA] text-[#137333]',
              'bg-[#FCE8E6] text-[#C5221F]',
              'bg-[#FEF7E0] text-[#B06000]',
            ];

            return (
              <Card key={food.id} padding="none" className="rounded-[24px] overflow-hidden group border border-gray-100 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] bg-white p-4 flex flex-col justify-between">
                <div className="flex flex-col flex-grow">
                  <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-4 bg-slate-100">
                    <ListingCoverImage
                      name={food.name}
                      city={food.city}
                      mapsUrl={food.google_maps_url}
                      imageUrl={food.image_url}
                      type={food.type}
                      mapEmbedCode={food.map_embed_code}
                      fallbackIcon={
                        <div className="text-black opacity-45 scale-[1.5]">
                          {food.type === 'restaurant' ? <Utensils className="w-12 h-12" /> : food.type === 'sweets' ? <Candy className="w-12 h-12" /> : food.type === 'tiffin' ? <Soup className="w-12 h-12" /> : <Truck className="w-12 h-12" />}
                        </div>
                      }
                    />
                    {food.rating && (
                      <div className="absolute top-3 left-3 bg-white text-gray-900 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-[#B06000] text-[#B06000]" />
                        <span>{food.rating}</span>
                      </div>
                    )}
                  </div>

                  <div className="px-1">
                    <Link href={`/explore/food/${food.id}`}>
                      <h3 className="text-lg font-bold text-gray-900 hover:text-[#A63A13] transition-colors leading-tight font-display">
                        {food.name}
                      </h3>
                    </Link>

                    <p className="mt-1 text-xs text-[#8F9BB3] line-clamp-2 leading-relaxed">
                      {food.address || `${food.area}, ${food.city}`}
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 mt-3">
                      {tagsToShow.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className={`${tagColors[idx % 3]} text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wide`}>
                          {tag.name}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-3.5">
                      {food.phone && (
                        <a href={`tel:${food.phone}`} className="flex items-center gap-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1 rounded-full transition-colors shadow-sm">
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span>Call</span>
                        </a>
                      )}
                      {DELIVERY_PARTNERS.map((partner) => {
                        const url = (food as unknown as Record<string, unknown>)[partner.key] as string | undefined;
                        return url ? (
                          <a key={partner.key} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[11px] bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold px-3 py-1 rounded-full transition-colors border border-orange-100 shadow-sm text-black">
                            <Truck className="w-3 h-3 text-black" />
                            <span>{partner.label}</span>
                          </a>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>

                <div className="w-full mt-5 px-1">
                  <a href={orderUrl} target={orderUrl.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="block w-full">
                    <button className="w-full bg-[#d85a30] hover:bg-[#c24f28] text-white font-bold py-3 px-4 rounded-[12px] flex items-center justify-center gap-2 text-sm transition-all shadow-sm active:scale-[0.98]">
                      <Utensils className="w-4 h-4" />
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

