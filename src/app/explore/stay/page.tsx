'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { MapPin, Phone, MessageCircle, Wifi, Wind, UtensilsCrossed, CheckCircle2, Search, SlidersHorizontal, ChevronDown, Train, Bus, Building2, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/card';
import { sampleListings } from '@/data/sample-data';
import { CITIES, CITY_HOSPITALS, CITY_COLLEGES, CITY_AREAS, METRO_ROUTES } from '@/lib/constants';
import { formatPrice, getWhatsAppUrl } from '@/lib/utils';

const amenityIcons: Record<string, React.ReactNode> = {
  'WiFi': <Wifi className="w-3 h-3" />,
  'AC': <Wind className="w-3 h-3" />,
  'Bengali Food': <UtensilsCrossed className="w-3 h-3" />,
};

export default function StayPage() {
  const [activeType, setActiveType] = useState<string>('all');
  const [city, setCity] = useState('');
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [area, setArea] = useState('');
  const [isAreaOpen, setIsAreaOpen] = useState(false);
  const [bengaliOnly, setBengaliOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [isSubcatOpen, setIsSubcatOpen] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('');
  const [selectedMetroRoute, setSelectedMetroRoute] = useState('');

  // Get areas for the selected city
  const availableAreas = useMemo(() => {
    if (!city) return [];
    return CITY_AREAS[city] || [];
  }, [city]);

  // Get hospitals for the selected city
  const cityHospitals = useMemo(() => {
    if (!city) return [];
    return CITY_HOSPITALS[city] || [];
  }, [city]);

  // Get colleges for the selected city
  const cityColleges = useMemo(() => {
    if (!city) return [];
    return CITY_COLLEGES[city] || [];
  }, [city]);

  // Reset dependent filters when city changes
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
    return sampleListings.filter((l) => {
      if (activeType !== 'all' && l.type !== activeType) return false;
      if (city && l.city !== city) return false;
      if (area && l.area !== area) return false;
      if (bengaliOnly && !l.bengali_friendly) return false;
      if (searchQuery && !l.name.toLowerCase().includes(searchQuery.toLowerCase()) && !l.area.toLowerCase().includes(searchQuery.toLowerCase())) return false;

      if (minPrice && l.price_per_month && l.price_per_month < parseInt(minPrice)) return false;
      if (maxPrice && l.price_per_month && l.price_per_month > parseInt(maxPrice)) return false;

      if (subcategory === 'hospital' && selectedHospital) {
        const searchTarget = (l.description + ' ' + l.name + ' ' + l.area + ' ' + l.address).toLowerCase();
        const hospitalData = cityHospitals.find(h => h.name === selectedHospital);
        if (hospitalData) {
          const hospitalArea = hospitalData.area.toLowerCase();
          if (!searchTarget.includes(hospitalArea) && !searchTarget.includes('hospital')) return false;
        }
      } else if (subcategory === 'hospital') {
        const searchTarget = (l.description + ' ' + l.name + ' ' + l.amenities.join(' ')).toLowerCase();
        if (!searchTarget.includes('hospital')) return false;
      }

      if (subcategory === 'college' && selectedCollege) {
        const searchTarget = (l.description + ' ' + l.name + ' ' + l.area + ' ' + l.address).toLowerCase();
        const collegeData = cityColleges.find(c => c.name === selectedCollege);
        if (collegeData) {
          const collegeArea = collegeData.area.toLowerCase();
          if (!searchTarget.includes(collegeArea) && !searchTarget.includes('college') && !searchTarget.includes('university') && !searchTarget.includes('campus')) return false;
        }
      } else if (subcategory === 'college') {
        const searchTarget = (l.description + ' ' + l.name + ' ' + l.amenities.join(' ')).toLowerCase();
        if (!searchTarget.includes('college') && !searchTarget.includes('university') && !searchTarget.includes('campus')) return false;
      }

      if (subcategory === 'metro' && selectedMetroRoute) {
        const searchTarget = (l.description + ' ' + l.name + ' ' + l.area + ' ' + (l.address || '')).toLowerCase();
        const route = METRO_ROUTES.find(r => r.id === selectedMetroRoute);
        if (route) {
          const routeName = route.name.toLowerCase();
          if (!searchTarget.includes(routeName) && !searchTarget.includes('station') && !searchTarget.includes('bus') && !searchTarget.includes('metro')) return false;
        }
      } else if (subcategory === 'metro') {
        const searchTarget = (l.description + ' ' + l.name + ' ' + l.amenities.join(' ')).toLowerCase();
        if (!searchTarget.includes('metro') && !searchTarget.includes('station') && !searchTarget.includes('bus') && !searchTarget.includes('terminus')) return false;
      }

      return true;
    });
  }, [activeType, city, area, bengaliOnly, searchQuery, minPrice, maxPrice, subcategory, selectedHospital, selectedCollege, selectedMetroRoute, cityHospitals, cityColleges]);

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

          {/* ── STEP 1: City Selection (Primary) ── */}
          <div className="mt-5 p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl border border-primary/10">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Step 1 — Select City
            </p>
            <div className="relative w-full sm:max-w-xs">
              <button
                onClick={() => setIsCityOpen(!isCityOpen)}
                className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
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
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-surface transition-colors ${!city ? 'bg-primary/5 font-medium text-primary' : 'text-text-primary'}`}
                    >
                      All Cities
                    </button>
                    {CITIES.map((c) => (
                      <button
                        key={c}
                        onClick={() => handleCityChange(c)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-surface transition-colors ${city === c ? 'bg-primary/5 font-medium text-primary' : 'text-text-primary'}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── STEP 2: Area + Subcategory (visible after city selected) ── */}
          {city && (
            <div className="mt-3 p-4 bg-white rounded-2xl border border-border space-y-4 animate-fade-in">
              <div className="flex flex-col md:flex-row md:flex-wrap items-start md:items-center gap-3">
                {/* Area Dropdown */}
                <div className="relative min-w-[180px]">
                  <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">Area</p>
                  <button
                    onClick={() => setIsAreaOpen(!isAreaOpen)}
                    className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
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
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-surface transition-colors ${!area ? 'bg-primary/5 font-medium text-primary' : 'text-text-primary'}`}
                        >
                          All Areas
                        </button>
                        {availableAreas.map((a) => (
                          <button
                            key={a}
                            onClick={() => { setArea(a); setIsAreaOpen(false); }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-surface transition-colors ${area === a ? 'bg-primary/5 font-medium text-primary' : 'text-text-primary'}`}
                          >
                            {a}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Subcategory Dropdown */}
                <div className="relative min-w-[200px]">
                  <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">Nearby</p>
                  <button
                    onClick={() => setIsSubcatOpen(!isSubcatOpen)}
                    className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <span className="truncate">
                      {subcategory === 'hospital' ? '🏥 Hospital Nearby' :
                       subcategory === 'college' ? '🎓 College/Uni Nearby' :
                       subcategory === 'metro' ? '🚆 Metro/Transport' :
                       'All Categories'}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${isSubcatOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isSubcatOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsSubcatOpen(false)} />
                      <div className="absolute top-full left-0 w-full mt-1 bg-white border border-border rounded-xl shadow-lg z-20">
                        {[
                          { value: '', label: 'All Categories' },
                          { value: 'hospital', label: '🏥 Hospital Nearby' },
                          { value: 'college', label: '🎓 College/Uni Nearby' },
                          { value: 'metro', label: '🚆 Metro/Transport' },
                        ].map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => {
                              setSubcategory(opt.value);
                              setSelectedHospital('');
                              setSelectedCollege('');
                              setSelectedMetroRoute('');
                              setIsSubcatOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-surface transition-colors ${subcategory === opt.value ? 'bg-primary/5 font-medium text-primary' : 'text-text-primary'}`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Bengali-friendly toggle */}
                <div>
                  <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1 opacity-0">Filter</p>
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

              {/* ── City-Specific Sub-filters ── */}

              {/* Hospital Names for selected city */}
              {subcategory === 'hospital' && cityHospitals.length > 0 && (
                <div className="pt-3 border-t border-border">
                  <p className="text-xs font-semibold text-text-muted mb-2 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" /> Hospitals in {city}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedHospital('')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        !selectedHospital ? 'bg-red-500 text-white shadow-sm' : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                      }`}
                    >
                      All Hospitals
                    </button>
                    {cityHospitals.map((h) => (
                      <button
                        key={h.name}
                        onClick={() => setSelectedHospital(h.name)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          selectedHospital === h.name
                            ? 'bg-red-500 text-white shadow-sm'
                            : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                        }`}
                      >
                        🏥 {h.name}
                        <span className="ml-1 opacity-60">({h.area})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* College Names for selected city */}
              {subcategory === 'college' && cityColleges.length > 0 && (
                <div className="pt-3 border-t border-border">
                  <p className="text-xs font-semibold text-text-muted mb-2 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5" /> Colleges in {city}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedCollege('')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        !selectedCollege ? 'bg-blue-500 text-white shadow-sm' : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                      }`}
                    >
                      All Colleges
                    </button>
                    {cityColleges.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedCollege(c.name)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          selectedCollege === c.name
                            ? 'bg-blue-500 text-white shadow-sm'
                            : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                        }`}
                      >
                        🎓 {c.name}
                        <span className="ml-1 opacity-60">({c.area})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Metro Routes (only Egmore, Tambaram, Beach, Kilambakkam) */}
              {subcategory === 'metro' && (
                <div className="pt-3 border-t border-border">
                  <p className="text-xs font-semibold text-text-muted mb-2 flex items-center gap-1.5">
                    <Train className="w-3.5 h-3.5" /> Metro / Transport Routes
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedMetroRoute('')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        !selectedMetroRoute ? 'bg-green-600 text-white shadow-sm' : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                      }`}
                    >
                      All Routes
                    </button>
                    {METRO_ROUTES.map((route) => (
                      <button
                        key={route.id}
                        onClick={() => setSelectedMetroRoute(route.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                          selectedMetroRoute === route.id
                            ? 'bg-green-600 text-white shadow-sm'
                            : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                        }`}
                      >
                        {route.type === 'railway' ? <Train className="w-3 h-3" /> : <Bus className="w-3 h-3" />}
                        {route.name}
                      </button>
                    ))}
                  </div>
                  {/* Route descriptions */}
                  {selectedMetroRoute && (
                    <div className="mt-2 px-3 py-2 bg-green-50 rounded-lg text-xs text-green-800">
                      {METRO_ROUTES.find(r => r.id === selectedMetroRoute)?.description}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Search + Price Filters */}
          <div className="mt-4 flex flex-col md:flex-row md:flex-wrap items-start md:items-center gap-3">
            <div className="relative flex-1 w-full md:min-w-[200px] md:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or area..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <input
                type="number"
                placeholder="Min ₹"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-24 px-3 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <span className="text-text-muted">-</span>
              <input
                type="number"
                placeholder="Max ₹"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-24 px-3 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-sm text-text-muted mb-6">
          <span className="font-semibold text-text-primary">{filtered.length}</span> listings found
          {city && <> in <span className="font-semibold text-primary">{city}</span></>}
          {area && <> · <span className="font-medium">{area}</span></>}
          {subcategory && <> · <span className="capitalize">{subcategory}</span> nearby</>}
           · Verified first
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
                
                {listing.owner_phone && (
                  <div className="flex items-center gap-1.5 mt-1 text-sm font-medium text-text-primary">
                    <Phone className="w-3.5 h-3.5 text-primary" />
                    +91 {listing.owner_phone}
                    {listing.verified && <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />}
                  </div>
                )}

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
                        <Button variant="ghost" size="sm"><MapPin className="w-4 h-4" /> Google Page</Button>
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
