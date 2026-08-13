'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, MapPin, Phone, Search, FileText, RefreshCw, Edit, FilePlus, Navigation } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { PASSPORT_SEVA_KENDRAS } from '@/lib/constants';

function CentreCard({ centre }: { centre: { name: string; address: string; type: string; phone?: string; timings?: string; google_maps_url?: string } }) {
  const queryText = centre.address ? `${centre.name}, ${centre.address}` : centre.name;
  const mapUrl = centre.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryText)}`;

  return (
    <div className="p-4 bg-surface/50 border border-border rounded-xl hover:border-primary/40 transition-all flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start gap-2">
          <h5 className="font-bold text-sm text-text-primary leading-tight flex-1">{centre.name}</h5>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full whitespace-nowrap">{centre.type}</span>
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open in Google Maps"
              className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-sm flex items-center justify-center shrink-0"
            >
              <Navigation className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
        <p className="text-xs text-text-muted mt-2 flex items-start gap-1.5">
          <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary/70" />
          <span className="flex-1">{centre.address}</span>
        </p>
        {centre.phone && (
          <p className="text-xs text-text-muted mt-1.5 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 shrink-0 text-primary/70" />
            <a href={`tel:${centre.phone}`} className="text-primary hover:underline">{centre.phone}</a>
          </p>
        )}
      </div>

      <div className="mt-3 pt-2 border-t border-border/50 flex items-center justify-between">
        <span className="text-[10px] text-text-muted">Offline Centre</span>
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
        >
          <Navigation className="w-3 h-3 text-primary" /> View on Google Maps <ExternalLink className="w-3 h-3 ml-0.5" />
        </a>
      </div>
    </div>
  );
}

export default function PassportPage() {
  const [city, setCity] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [searched, setSearched] = useState(false);
  const [mapResults, setMapResults] = useState<any[]>([]);
  const [isMapLoading, setIsMapLoading] = useState(false);
  const [mapError, setMapError] = useState('');

  const filteredCentres = useMemo(() => {
    if (!searchCity) return PASSPORT_SEVA_KENDRAS;
    return PASSPORT_SEVA_KENDRAS.filter(c => c.district.toLowerCase().includes(searchCity.toLowerCase()) || c.address.toLowerCase().includes(searchCity.toLowerCase()));
  }, [searchCity]);

  const handleSearch = async () => {
    setSearchCity(city);
    setSearched(true);
    if (!city) {
      setMapResults([]);
      return;
    }

    setIsMapLoading(true);
    setMapError('');
    try {
      const q = `Passport Seva Kendra in ${city}`;
      const res = await fetch(`/api/maps/places?query=${encodeURIComponent(q)}`);
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);

      const parsedResults = (data.results || []).map((r: any) => ({
        id: `map-${r.place_id || Math.random()}`,
        name: r.name,
        address: r.formatted_address,
        type: 'Google Maps Result',
        google_maps_url: r.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${r.name}, ${r.formatted_address}`)}`
      }));
      setMapResults(parsedResults);
    } catch (err: any) {
      setMapError(err.message || 'Failed to fetch Google Maps data');
    } finally {
      setIsMapLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-primary py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link href="/services/government" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Government Services
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">Passport Seva</h1>
          <p className="text-white/80 mt-2">Apply for a new passport, renew your old one, or update your personal details.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Service Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* New Application */}
          <Card className="flex flex-col border-border hover:border-primary/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
              <FilePlus className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">New Application</h3>
            <p className="text-sm text-text-muted flex-1 mb-6">Apply for a fresh passport if you have never held one before.</p>
            <a href="https://www.passportindia.gov.in/psp/Apply" target="_blank" rel="noopener noreferrer">
              <Button variant="primary" className="w-full">
                Register & Apply <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </Card>

          {/* Renewal */}
          <Card className="flex flex-col border-border hover:border-primary/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">Passport Renewal</h3>
            <p className="text-sm text-text-muted flex-1 mb-6">Re-issue of passport due to validity expiration within 3 years/1 year.</p>
            <a href="https://www.passportindia.gov.in/psp/Apply" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full">
                Login to Renew <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </Card>

          {/* Update */}
          <Card className="flex flex-col border-border hover:border-primary/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
              <Edit className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">Passport Update</h3>
            <p className="text-sm text-text-muted flex-1 mb-6">Change personal particulars (name, address, spouse details) in passport.</p>
            <a href="https://www.passportindia.gov.in/psp/Apply" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full">
                Login to Update <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </Card>
        </div>

        {/* Documents Required */}
        <Card>
          <h2 className="text-xl font-bold font-display text-text-primary mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" /> Important Documents Needed
          </h2>
          <ul className="space-y-3 text-sm text-text-muted list-disc list-inside ml-2">
            <li><strong>Proof of Address:</strong> Aadhaar Card, Utility Bills (Electricity, Water), Rent Agreement, or Bank Passbook.</li>
            <li><strong>Proof of Date of Birth:</strong> Birth Certificate, Aadhaar Card, PAN Card, or 10th/12th Marks Card.</li>
            <li><strong>For Renewal/Update:</strong> Original old passport along with self-attested copies of the first and last two pages.</li>
            <li><strong>For Name Change/Address Change:</strong> Specific marriage certificate, gazette notification, or relevant address proof required.</li>
          </ul>
        </Card>

        {/* Nearby Centres */}
        <Card>
          <h2 className="text-xl font-bold font-display text-text-primary mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" /> Find Passport Seva Kendras (PSK/POPSK)
          </h2>
          <div className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search district or area (e.g. Chennai, Madurai)"
                value={city}
                onChange={e => setCity(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <Button variant="primary" onClick={handleSearch} disabled={isMapLoading} className="shrink-0 rounded-xl px-4">
              {isMapLoading ? 'Searching Maps...' : 'Search Centres'}
            </Button>
          </div>

          {searched && (
            <div className="space-y-6 animate-fade-in">
              <h4 className="text-sm font-bold text-text-primary">
                {filteredCentres.length > 0 ? `Database Passport Centres${searchCity ? ` for "${searchCity}"` : ''}` : 'No local database centres found'}
              </h4>
              {filteredCentres.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredCentres.map(c => <CentreCard key={c.id} centre={c} />)}
                </div>
              )}

              {/* Google Maps Live Results */}
              {mapResults.length > 0 && (
                <div className="pt-6 border-t border-border">
                  <h4 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-primary" /> Live Google Maps Results
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {mapResults.map((c, i) => <CentreCard key={`map-${i}`} centre={c} />)}
                  </div>
                </div>
              )}

              {mapError && (
                <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">{mapError}</p>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
