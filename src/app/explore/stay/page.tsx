'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { MapPin, Phone, MessageSquare, Wifi, Wind, CheckCircle2, Search, SlidersHorizontal, ChevronDown, Home, Building, Building2, Download, GraduationCap, Train, Bus, Gift, Globe, User, Utensils, BedDouble, Star, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/Skeleton';
import { useFirestore } from '@/lib/hooks/useFirestore';
import { Listing } from '@/types';
import { CITIES, CITY_HOSPITALS, CITY_COLLEGES, CITY_AREAS, METRO_ROUTES } from '@/lib/constants';
import { formatPrice, getWhatsAppUrl } from '@/lib/utils';

const amenityIcons: Record<string, React.ReactNode> = {
  'WiFi': <Wifi className="w-3.5 h-3.5" />,
  'AC': <Wind className="w-3.5 h-3.5" />,
  'Bengali Food': <Utensils className="w-3.5 h-3.5" />,
  'Food': <Utensils className="w-3.5 h-3.5" />,
};

const STAY_TYPE_ICONS: Record<string, React.ReactNode> = {
  pg: <Home className="w-5 h-5" />,
  hotel: <Building className="w-5 h-5" />,
  rental: <Building2 className="w-5 h-5" />,
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
      <div className="absolute inset-0 bg-primary-light flex items-center justify-center">
        <div className="text-primary opacity-40 scale-[3]">
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

export default function StayPage() {
  const { data: firestoreListings, loading } = useFirestore<Listing>('listings');
  const [activeType, setActiveType] = useState<string>('all');
  const [city, setCity] = useState('');
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [area, setArea] = useState('');
  const [isAreaOpen, setIsAreaOpen] = useState(false);
  const [isSubcatOpen, setIsSubcatOpen] = useState(false);
  const [bengaliOnly, setBengaliOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [selectedHospital, setSelectedHospital] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('');
  const [selectedMetroRoute, setSelectedMetroRoute] = useState('');

  const combinedListings = firestoreListings;

  const sortedCities = useMemo(() => {
    return Array.from(new Set(combinedListings.map((l) => l.city).filter(Boolean).map(c => {
      const trimmed = c!.trim();
      return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
    }))).sort();
  }, [combinedListings]);

  const availableAreas = useMemo(() => {
    if (!city) return [];
    return CITY_AREAS[city] || [];
  }, [city]);

  const cityHospitals = useMemo(() => (city ? CITY_HOSPITALS[city] || [] : []), [city]);
  const cityColleges = useMemo(() => (city ? CITY_COLLEGES[city] || [] : []), [city]);

  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    setArea('');
    setSubcategory('');
    setSelectedHospital('');
    setSelectedCollege('');
    setSelectedMetroRoute('');
    setIsCityOpen(false);
  };



  const filtered = useMemo(() => {
    return combinedListings.filter((l) => {
      const type = l.type || (l.accommodation_type === 'PG' ? 'pg' : l.accommodation_type === 'Hotel' ? 'hotel' : l.accommodation_type === 'Service Apartment' ? 'rental' : l.accommodation_type === 'Rental House' ? 'rental-house' : '');
      const name = l.name || '';
      const area = l.area || '';
      const amenities = l.amenities || [];
      const description = l.description || '';
      const address = l.address || '';
      const price = l.price_per_month || 0;

      if (activeType !== 'all' && type !== activeType) return false;
      if (city && l.city?.toLowerCase() !== city.toLowerCase()) return false;
      if (area && l.area !== area) return false;
      if (bengaliOnly && !l.bengali_friendly) return false;
      if (searchQuery && !name.toLowerCase().includes(searchQuery.toLowerCase()) && !area.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (minPrice && price && price < parseInt(minPrice)) return false;
      if (maxPrice && price && price > parseInt(maxPrice)) return false;

      if (subcategory === 'hospital' && selectedHospital) {
        const searchTarget = (description + ' ' + name + ' ' + area + ' ' + address).toLowerCase();
        const hospitalData = cityHospitals.find(h => h.name === selectedHospital);
        if (hospitalData) {
          const hospitalArea = hospitalData.area.toLowerCase();
          if (!searchTarget.includes(hospitalArea) && !searchTarget.includes('hospital')) return false;
        }
      } else if (subcategory === 'hospital') {
        const searchTarget = (description + ' ' + name + ' ' + amenities.join(' ')).toLowerCase();
        if (!searchTarget.includes('hospital')) return false;
      }

      if (subcategory === 'college' && selectedCollege) {
        const searchTarget = (description + ' ' + name + ' ' + area + ' ' + address).toLowerCase();
        const collegeData = cityColleges.find(c => c.name === selectedCollege);
        if (collegeData) {
          const collegeArea = collegeData.area.toLowerCase();
          if (!searchTarget.includes(collegeArea) && !searchTarget.includes('college') && !searchTarget.includes('university') && !searchTarget.includes('campus')) return false;
        }
      } else if (subcategory === 'college') {
        const searchTarget = (description + ' ' + name + ' ' + amenities.join(' ')).toLowerCase();
        if (!searchTarget.includes('college') && !searchTarget.includes('university') && !searchTarget.includes('campus')) return false;
      }

      if (subcategory === 'metro' && selectedMetroRoute) {
        const searchTarget = (description + ' ' + name + ' ' + area + ' ' + address).toLowerCase();
        const route = METRO_ROUTES.find(r => r.id === selectedMetroRoute);
        if (route) {
          const routeName = route.name.toLowerCase();
          if (!searchTarget.includes(routeName) && !searchTarget.includes('station') && !searchTarget.includes('bus') && !searchTarget.includes('metro')) return false;
        }
      } else if (subcategory === 'metro') {
        const searchTarget = (description + ' ' + name + ' ' + amenities.join(' ')).toLowerCase();
        if (!searchTarget.includes('metro') && !searchTarget.includes('station') && !searchTarget.includes('bus') && !searchTarget.includes('terminus')) return false;
      }

      return true;
    });
  }, [combinedListings, activeType, city, area, bengaliOnly, searchQuery, minPrice, maxPrice, subcategory, selectedHospital, selectedCollege, selectedMetroRoute, cityHospitals, cityColleges]);

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <p className="mt-2 text-text-muted">Find Bengali-friendly PGs, hotels, and service apartments in Tamil Nadu.</p>

          {/* Type Tabs */}
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'All', icon: <Search className="w-4 h-4" /> },
              { value: 'pg', label: 'PG', icon: <Home className="w-4 h-4" /> },
              { value: 'hotel', label: 'Hotels', icon: <Building className="w-4 h-4" /> },
              { value: 'rental', label: 'Service Apartment', icon: <Building2 className="w-4 h-4" /> },
              { value: 'rental-house', label: 'Rental House', icon: <Home className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveType(tab.value)}
                suppressHydrationWarning
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                  activeType === tab.value
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-text-primary border border-border hover:border-primary'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}

          </div>

          {/* Unified Filter Bar */}
          <div className="mt-6 flex flex-col md:flex-row md:flex-wrap items-stretch md:items-center gap-3 relative z-30">
            {/* Search */}
            <div className="relative w-full md:flex-1 md:min-w-[200px] md:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input value={searchQuery} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)} placeholder="Search by name or area..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>

            {/* City Dropdown */}
            <div className={`relative w-full md:w-auto md:min-w-[160px] ${isCityOpen ? 'z-50' : ''}`}>
              <button onClick={() => setIsCityOpen(!isCityOpen)} className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                <span className="truncate">{city || 'All Cities'}</span>
                <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${isCityOpen ? 'rotate-180' : ''}`} />
              </button>
              {isCityOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsCityOpen(false)} />
                  <div className="absolute top-full left-0 w-full mt-1 bg-white border border-border rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                    <button onClick={() => handleCityChange('')} className={`w-full text-left px-4 py-2 text-sm hover:bg-surface transition-colors ${!city ? 'bg-primary/5 font-medium text-primary' : 'text-text-primary'}`}>All Cities</button>
                    {sortedCities.map((c) => (
                      <button key={c} onClick={() => handleCityChange(c)} className={`w-full text-left px-4 py-2 text-sm hover:bg-surface transition-colors ${city === c ? 'bg-primary/5 font-medium text-primary' : 'text-text-primary'}`}>{c}</button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Area Dropdown */}
            {city && (
              <div className={`relative w-full md:w-auto md:min-w-[160px] ${isAreaOpen ? 'z-50' : ''}`}>
                <button onClick={() => setIsAreaOpen(!isAreaOpen)} className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 animate-fade-in">
                  <span className="truncate">{area || 'All Areas'}</span>
                  <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${isAreaOpen ? 'rotate-180' : ''}`} />
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

            {/* Subcategory Dropdown */}
            {city && (
              <div className={`relative w-full md:w-auto md:min-w-[180px] ${isSubcatOpen ? 'z-50' : ''}`}>
                <button onClick={() => setIsSubcatOpen(!isSubcatOpen)} className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 animate-fade-in">
                  <span className="truncate flex items-center gap-2">
                    {subcategory === 'hospital' ? <><Activity className="w-4 h-4 text-primary" /> Hospital Nearby</> :
                     subcategory === 'college' ? <><GraduationCap className="w-4 h-4 text-primary" /> College/Uni Nearby</> :
                     subcategory === 'metro' ? <><Train className="w-4 h-4 text-primary" /> Metro/Transport</> :
                     'All Categories'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${isSubcatOpen ? 'rotate-180' : ''}`} />
                </button>
                {isSubcatOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsSubcatOpen(false)} />
                    <div className="absolute top-full left-0 w-full mt-1 bg-white border border-border rounded-xl shadow-lg z-50">
                      {[
                        { value: '', label: 'All Categories', icon: null },
                        { value: 'hospital', label: 'Hospital Nearby', icon: <Activity className="w-4 h-4 text-primary" /> },
                        { value: 'college', label: 'College/Uni Nearby', icon: <GraduationCap className="w-4 h-4 text-primary" /> },
                        { value: 'metro', label: 'Metro/Transport', icon: <Train className="w-4 h-4 text-primary" /> },
                      ].map((opt) => (
                        <button key={opt.value} onClick={() => { 
                          if (opt.value === 'metro') {
                            window.open('https://chennai.metroroute.co.in/', '_blank');
                          }
                          setSubcategory(opt.value); setSelectedHospital(''); setSelectedCollege(''); setSelectedMetroRoute(''); setIsSubcatOpen(false); 
                        }}
                          className={`w-full flex items-center gap-2 text-left px-4 py-2 text-sm hover:bg-surface transition-colors ${subcategory === opt.value ? 'bg-primary/5 font-medium text-primary' : 'text-text-primary'}`}>
                            {opt.icon}
                            {opt.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Bengali-friendly toggle */}
            {city && (
              <button onClick={() => setBengaliOnly(!bengaliOnly)}
                className={`flex items-center justify-center w-full md:w-auto gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer animate-fade-in ${bengaliOnly ? 'bg-primary text-white shadow-md' : 'bg-white border border-border text-text-primary hover:border-primary'}`}>
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Bengali-friendly
              </button>
            )}

            <div className="flex items-center gap-2 w-full md:w-auto">
              <input type="number" placeholder="Min ₹" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="flex-1 min-w-0 md:w-24 px-3 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <span className="text-text-muted shrink-0">-</span>
              <input type="number" placeholder="Max ₹" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="flex-1 min-w-0 md:w-24 px-3 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>

          {/* Sub-Filters (Hospitals, Colleges, Metro) */}
          {(subcategory === 'hospital' || subcategory === 'college' || subcategory === 'metro') && city && (
            <div className="mt-4 p-4 bg-white rounded-2xl border border-border animate-fade-in relative z-20">
              {/* Hospital Names */}
              {subcategory === 'hospital' && cityHospitals.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-text-muted mb-2 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Hospitals in {city}</p>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setSelectedHospital('')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${!selectedHospital ? 'bg-red-500 text-white shadow-sm' : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'}`}>All Hospitals</button>
                    {cityHospitals.map((h) => (
                      <button key={h.name} onClick={() => setSelectedHospital(h.name)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${selectedHospital === h.name ? 'bg-red-500 text-white shadow-sm' : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'}`}>
                        <Activity className="w-4 h-4 text-rose-500 shrink-0" /> <span className="truncate">{h.name}</span><span className="ml-1 opacity-60">({h.area})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* College Names */}
              {subcategory === 'college' && cityColleges.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-text-muted mb-2 flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5" /> Colleges in {city}</p>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setSelectedCollege('')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${!selectedCollege ? 'bg-blue-500 text-white shadow-sm' : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'}`}>All Colleges</button>
                    {cityColleges.map((c) => (
                      <button key={c.name} onClick={() => setSelectedCollege(c.name)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${selectedCollege === c.name ? 'bg-blue-500 text-white shadow-sm' : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'}`}>
                        <GraduationCap className="w-4 h-4 text-blue-500 shrink-0" /> <span className="truncate">{c.name}</span><span className="ml-1 opacity-60">({c.area})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Metro Routes */}
              {subcategory === 'metro' && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-text-muted flex items-center gap-1.5"><Train className="w-3.5 h-3.5" /> Metro / Transport Routes</p>
                    <a href="https://chennai.metroroute.co.in/" target="_blank" rel="noopener noreferrer" className="text-[10px] bg-primary/5 text-primary px-2 py-1 rounded border border-primary/20 hover:bg-primary/10 transition-colors flex items-center gap-1">
                      View Metro Map
                    </a>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setSelectedMetroRoute('')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${!selectedMetroRoute ? 'bg-green-600 text-white shadow-sm' : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'}`}>All Routes</button>
                    {METRO_ROUTES.map((route) => (
                      <button key={route.id} onClick={() => setSelectedMetroRoute(route.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${selectedMetroRoute === route.id ? 'bg-green-600 text-white shadow-sm' : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'}`}>
                        {route.type === 'railway' ? <Train className="w-3 h-3" /> : <Bus className="w-3 h-3" />}
                        {route.name}
                      </button>
                    ))}
                  </div>
                  {selectedMetroRoute && (
                    <div className="mt-2 px-3 py-2 bg-green-50 rounded-lg text-xs text-green-800">
                      {METRO_ROUTES.find(r => r.id === selectedMetroRoute)?.description}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-sm text-text-muted mb-6">
          <span className="font-semibold text-text-primary">{filtered.length}</span> listings found
          {city && <> in <span className="font-semibold text-primary">{city}</span></>}
          {area && <> · <span className="font-medium">{area}</span></>}
          {subcategory && <> · <span className="capitalize">{subcategory}</span> nearby</>}
           · Verified first
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((listing) => {
            const typeLabel = listing.accommodation_type || (listing.type ? listing.type.toUpperCase() : 'STAY');
            const contactName = listing.contact_person_name || listing.owner_name || 'Contact Person';
            const whatsappNum = listing.contact_whatsapp || listing.owner_whatsapp;
            const phoneNum = listing.contact_phone || listing.owner_phone;
            const priceVal = listing.accommodation_type === 'Hotel' ? (listing.price_daily || 0) : (listing.price_monthly || listing.price_per_month || 0);
            const pricePeriod = listing.accommodation_type === 'Hotel' ? 'per day' : 'per month';
            
            return (
              <Card key={listing.id} padding="none" className="rounded-[24px] overflow-hidden group border border-gray-100 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] bg-white">
                <div className="relative h-60 bg-primary-light overflow-hidden">
                  <ListingCoverImage
                    name={listing.name}
                    city={listing.city}
                    mapsUrl={listing.google_maps_url}
                    imageUrl={listing.image_url}
                    type={listing.accommodation_type}
                    mapEmbedCode={listing.map_embed_code}
                    fallbackIcon={<BedDouble className="w-16 h-16" />}
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-white text-[#D35400] text-[11px] font-bold px-3.5 py-1.5 rounded-full shadow-sm tracking-wide">
                      {typeLabel}
                    </span>
                    {listing.rating && (
                      <span className="bg-white text-gray-900 text-[11px] font-bold px-2.5 py-1.5 rounded-full shadow-sm flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-[#B06000] text-[#B06000]" />
                        <span>{listing.rating}</span>
                      </span>
                    )}
                    {listing.verified && (
                      <span className="bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-full shadow-sm flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>
                  {listing.bengali_food && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="bengali" className="flex items-center gap-1.5"><Utensils className="w-3.5 h-3.5" /> Bengali Food</Badge>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start gap-3">
                    <Link href={`/explore/stay/${listing.id}`}>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#D35400] transition-colors leading-tight font-display">
                        {listing.name}
                      </h3>
                    </Link>
                    {listing.gender && (
                      <div className="flex items-center gap-1 text-[#8F9BB3] text-sm font-semibold shrink-0 mt-0.5">
                        <User className="w-4 h-4" />
                        <span className="capitalize">{listing.gender}</span>
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-[14px] text-[#8F9BB3] leading-snug">
                    {listing.area}{listing.landmark ? `, ${listing.landmark}` : ''}, {listing.city}
                  </p>
                  
                  {listing.nearby_hospital && (
                    <p className="text-xs text-text-muted mt-2 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-rose-500 shrink-0" /> <span className="font-medium text-text-muted">Nearby Hospital:</span> <span className="font-semibold text-text-primary truncate">{listing.nearby_hospital}</span>
                    </p>
                  )}
                  
                  {/* Styled Amenities Row */}
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4">
                    {listing.amenities?.includes('WiFi') && (
                      <div className="flex items-center gap-1.5 text-[13px] text-[#8F9BB3] font-medium">
                        <Wifi className="w-4 h-4 text-[#8F9BB3]" />
                        <span>WiFi</span>
                      </div>
                    )}
                    {(listing.bengali_food || listing.amenities?.includes('Food') || listing.amenities?.includes('Bengali Food')) && (
                      <div className="flex items-center gap-1.5 text-[13px] text-[#8F9BB3] font-medium">
                        <Utensils className="w-4 h-4 text-[#8F9BB3]" />
                        <span>Food</span>
                      </div>
                    )}
                    {listing.amenities?.includes('AC') && (
                      <div className="flex items-center gap-1.5 text-[13px] text-[#8F9BB3] font-medium">
                        <Wind className="w-4 h-4 text-[#8F9BB3]" />
                        <span>AC</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between mt-6 pt-5 border-t border-gray-100 gap-4">
                    <div className="flex items-center gap-2 w-full sm:w-auto sm:flex-1">
                      <Link href={`/explore/stay/${listing.id}`} className="flex-1">
                        <button className="w-full bg-[#d85a30] hover:bg-[#b84a00] text-white font-bold px-3 py-2.5 rounded-[12px] transition-colors text-sm shadow-sm whitespace-nowrap">
                          Book Visit
                        </button>
                      </Link>
                      {whatsappNum && (
                        <a
                          href={getWhatsAppUrl(whatsappNum, `Hi, I found your listing "${listing.name}" on ProbasiBangali.in`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1"
                        >
                          <button className="w-full bg-white hover:bg-slate-50 border border-[#E4E9F2] text-slate-700 font-bold px-3 py-2.5 rounded-[12px] transition-all text-sm flex items-center justify-center gap-1.5 whitespace-nowrap">
                            <MessageSquare className="w-4 h-4 text-slate-500" />
                            Chat
                          </button>
                        </a>
                      )}
                    </div>
                    <div className="text-left sm:text-right shrink-0">
                      <p className="text-[20px] font-black text-gray-900 leading-none">
                        {formatPrice(priceVal)}
                      </p>
                      <p className="text-[12px] text-[#8F9BB3] mt-1">
                        {pricePeriod}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {filtered.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="flex justify-center mb-4 text-primary/40"><Search className="w-16 h-16" /></div>
            <h3 className="text-xl font-bold text-text-primary mb-2">No listings found</h3>
            <p className="text-text-muted">Try adjusting your filters or search query.</p>
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
