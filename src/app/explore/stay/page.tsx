'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { MapPin, Phone, MessageCircle, Wifi, Wind, UtensilsCrossed, CheckCircle2, Search, SlidersHorizontal, ChevronDown, Download } from 'lucide-react';
import { Home01, Building01, Home04, SearchLg, Wifi as WifiIcon, Wind01, Gift01 } from '@untitledui/icons';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/card';
import { sampleListings } from '@/data/sample-data';
import { CITIES } from '@/lib/constants';
import { formatPrice, getWhatsAppUrl } from '@/lib/utils';
import { useFirestore } from '@/lib/hooks/useFirestore';
import { Listing } from '@/types';

const amenityIcons: Record<string, React.ReactNode> = {
  'WiFi': <WifiIcon className="w-3 h-3" />,
  'AC': <Wind01 className="w-3 h-3" />,
  'Bengali Food': <Gift01 className="w-3 h-3" />,
};

const STAY_TYPE_ICONS: Record<string, React.ReactNode> = {
  pg: <Home01 className="w-5 h-5" />,
  hotel: <Building01 className="w-5 h-5" />,
  rental: <Home04 className="w-5 h-5" />,
};

export default function StayPage() {
  const { data: firestoreListings, loading } = useFirestore<Listing>('stay_listings');
  const [activeType, setActiveType] = useState<string>('all');
  const [city, setCity] = useState('');
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [bengaliOnly, setBengaliOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [subcategory, setSubcategory] = useState('');

  const combinedListings = useMemo(() => {
    const firestoreIds = new Set(firestoreListings.map(l => l.id));
    return [...firestoreListings, ...sampleListings.filter(l => !firestoreIds.has(l.id))];
  }, [firestoreListings]);

  const filtered = useMemo(() => {
    return combinedListings.filter((l) => {
      if (activeType !== 'all' && l.type !== activeType) return false;
      if (city && l.city !== city) return false;
      if (bengaliOnly && !l.bengali_friendly) return false;
      if (searchQuery && !l.name.toLowerCase().includes(searchQuery.toLowerCase()) && !l.area.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      
      if (minPrice && l.price_per_month && l.price_per_month < parseInt(minPrice)) return false;
      if (maxPrice && l.price_per_month && l.price_per_month > parseInt(maxPrice)) return false;
      
      if (subcategory) {
        const searchTarget = (l.description + ' ' + l.name + ' ' + l.amenities.join(' ')).toLowerCase();
        if (subcategory === 'hospital' && !searchTarget.includes('hospital')) return false;
        if (subcategory === 'college' && !searchTarget.includes('college') && !searchTarget.includes('university') && !searchTarget.includes('campus')) return false;
        if (subcategory === 'metro' && !searchTarget.includes('metro') && !searchTarget.includes('station') && !searchTarget.includes('bus')) return false;
      }
      return true;
    });
  }, [combinedListings, activeType, city, bengaliOnly, searchQuery, minPrice, maxPrice, subcategory]);

  const handleDownloadPDF = () => {
    window.print();
  };

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
              { value: 'all', label: 'All', icon: <SearchLg className="w-4 h-4" /> },
              { value: 'pg', label: 'PG', icon: <Home01 className="w-4 h-4" /> },
              { value: 'hotel', label: 'Hotels', icon: <Building01 className="w-4 h-4" /> },
              { value: 'rental', label: 'Rental House', icon: <Home04 className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveType(tab.value)}
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
            <button onClick={handleDownloadPDF} className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white text-text-primary border border-border hover:bg-surface transition-all cursor-pointer">
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>

          {/* Filters */}
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

            <select
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-border text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 w-full md:w-auto"
            >
              <option value="">All Areas</option>
              <option value="hospital">Hospital Nearby</option>
              <option value="college">College/Uni Nearby</option>
              <option value="metro">Metro/Transport Nearby</option>
            </select>
            <div className="relative min-w-[140px]">
              <button
                onClick={() => setIsCityOpen(!isCityOpen)}
                className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <span className="truncate">{city || 'All Cities'}</span>
                <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${isCityOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isCityOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsCityOpen(false)} />
                  <div className="absolute top-full left-0 w-full mt-1 bg-white border border-border rounded-xl shadow-lg z-20 max-h-60 overflow-y-auto">
                    <button
                      onClick={() => { setCity(''); setIsCityOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-surface transition-colors ${!city ? 'bg-primary/5 font-medium text-primary' : 'text-text-primary'}`}
                    >
                      All Cities
                    </button>
                    {CITIES.map((c) => (
                      <button
                        key={c}
                        onClick={() => { setCity(c); setIsCityOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-surface transition-colors ${city === c ? 'bg-primary/5 font-medium text-primary' : 'text-text-primary'}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
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
                <div className="text-primary opacity-40 scale-[3]">
                  {STAY_TYPE_ICONS[listing.type] || <Home01 />}
                </div>
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

        {filtered.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="flex justify-center mb-4 text-primary/40"><SearchLg className="w-16 h-16" /></div>
            <h3 className="text-xl font-bold text-text-primary mb-2">No listings found</h3>
            <p className="text-text-muted">Try adjusting your filters or search query.</p>
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
