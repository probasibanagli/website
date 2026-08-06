'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, MapPin, Phone, Search, User, Fingerprint, FileText, Navigation, ShieldCheck, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { AADHAAR_CENTRES } from '@/lib/constants';

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
        <span className="text-[10px] text-text-muted">Aadhaar Offline Centre</span>
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

export default function AadhaarPage() {
  const [city, setCity] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [mapResults, setMapResults] = useState<any[]>([]);

  const filteredCentres = useMemo(() => {
    if (!searchCity) return AADHAAR_CENTRES;
    return AADHAAR_CENTRES.filter(c => c.city.toLowerCase().includes(searchCity.toLowerCase()) || c.address.toLowerCase().includes(searchCity.toLowerCase()));
  }, [searchCity]);

  const handleSearch = async () => {
    setSearchCity(city);
    setSearched(true);
    if (!city) {
      setMapResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/maps/places?query=${encodeURIComponent(`Aadhaar Centre in ${city}`)}`);
      const data = await res.json();
      const parsed = (data.results || []).map((r: any, idx: number) => ({
        id: `map-${idx}`,
        name: r.name,
        address: r.formatted_address,
        type: 'Google Maps Result',
        google_maps_url: r.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${r.name}, ${r.formatted_address}`)}`
      }));
      setMapResults(parsed);
    } catch {
      setMapResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-700 via-amber-800 to-amber-950 py-8 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link href="/services/government" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Government Services
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">Aadhaar Services (UIDAI)</h1>
            <Badge variant="amber" className="text-xs border-white/20 bg-white/10 text-white">Official UIDAI Portal</Badge>
          </div>
          <p className="text-white/80 mt-2">Update address, download e-Aadhaar, check update status, and find nearest enrolment centres in Tamil Nadu.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Service Options Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Online Address Update */}
          <Card className="flex flex-col border-border hover:border-amber-400 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-4 text-amber-800">
              <User className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">Address Update</h3>
            <p className="text-sm text-text-muted flex-1 mb-6">Update your address online with valid proof of address (POA) or Head of Family (HOF).</p>
            <a href="https://myaadhaar.uidai.gov.in/address-update" target="_blank" rel="noopener noreferrer">
              <Button variant="primary" className="w-full bg-amber-700 hover:bg-amber-800 text-white border-none cursor-pointer">
                Update Address <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </Card>

          {/* Download e-Aadhaar */}
          <Card className="flex flex-col border-border hover:border-amber-400 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-4 text-amber-800">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">Download e-Aadhaar</h3>
            <p className="text-sm text-text-muted flex-1 mb-6">Download digital password-protected copy of your Aadhaar card anytime.</p>
            <a href="https://myaadhaar.uidai.gov.in/gen-aadhaar" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full border-amber-300 text-amber-800 hover:bg-amber-50 cursor-pointer">
                Download PDF <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </Card>

          {/* Check Status */}
          <Card className="flex flex-col border-border hover:border-amber-400 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-4 text-amber-800">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">Check Update Status</h3>
            <p className="text-sm text-text-muted flex-1 mb-6">Track the status of your online update request using your Service Request Number (SRN).</p>
            <a href="https://myaadhaar.uidai.gov.in/CheckAadharStatus" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full border-amber-300 text-amber-800 hover:bg-amber-50 cursor-pointer">
                Check Status <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </Card>
        </div>

        {/* Offline Centre Locator Section */}
        <Card className="border-border p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-700" /> Find Offline Aadhaar Enrolment & Update Centres
            </h2>
            <p className="text-sm text-text-muted mt-1">
              Search by city or district to locate Post Offices, Banks, and CSC centres for biometric updates, photo change, and new enrolment.
            </p>
          </div>

          <div className="flex gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Enter city or area (e.g. Chennai, Madurai, T Nagar)"
                value={city}
                onChange={e => setCity(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
              />
            </div>
            <Button variant="primary" onClick={handleSearch} disabled={loading} className="bg-amber-700 hover:bg-amber-800 text-white cursor-pointer shrink-0">
              {loading ? 'Searching...' : 'Search Centres'}
            </Button>
          </div>

          {/* Results Grid */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
              {searched ? `Centres for "${searchCity}"` : 'Recommended Enrolment & Update Centres'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCentres.map(c => (
                <CentreCard key={c.id} centre={c} />
              ))}
            </div>

            {mapResults.length > 0 && (
              <div className="pt-4 border-t border-border space-y-3">
                <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-amber-700" /> Live Google Maps Location Results
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mapResults.map(c => (
                    <CentreCard key={c.id} centre={c} />
                  ))}
                </div>
              </div>
            )}

            {filteredCentres.length === 0 && mapResults.length === 0 && (
              <p className="text-sm text-text-muted italic text-center py-6">No centres found for &quot;{searchCity}&quot;. Try searching major cities like Chennai, Coimbatore, Madurai, or Salem.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
