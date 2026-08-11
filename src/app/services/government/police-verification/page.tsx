'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, MapPin, Phone, Search, ShieldCheck, ShieldAlert, FileCheck, Navigation } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { POLICE_STATIONS } from '@/lib/constants';

function CentreCard({ centre }: { centre: { name: string; address: string; type: string; phone?: string; google_maps_url?: string } }) {
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
        <span className="text-[10px] text-text-muted">Police Station</span>
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

export default function PoliceVerificationPage() {
  const [city, setCity] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [mapResults, setMapResults] = useState<any[]>([]);

  const filteredStations = useMemo(() => {
    if (!searchCity) return POLICE_STATIONS;
    return POLICE_STATIONS.filter(s => s.city.toLowerCase().includes(searchCity.toLowerCase()) || s.address.toLowerCase().includes(searchCity.toLowerCase()));
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
      const res = await fetch(`/api/maps/places?query=${encodeURIComponent(`Police Station in ${city}`)}`);
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
      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-black py-8 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link href="/services/government" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Government Services
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">File a Complaint & Police Services</h1>
            <Badge variant="amber" className="text-xs border-white/20 bg-white/10 text-white">TN Police & Cyber Crime</Badge>
          </div>
          <p className="text-white/80 mt-2">File online complaints for financial cyber fraud, request Police Verification Certificates (PVC), and locate your local police station in Tamil Nadu.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Primary Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cyber Crime Reporting */}
          <Card className="flex flex-col border-border hover:border-red-400 transition-all p-6">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center mb-4 text-red-700">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">File a Cyber Crime / Fraud Complaint</h3>
            <p className="text-sm text-text-muted mb-6 flex-1">
              National Cyber Crime Reporting Portal. Report online financial frauds, fake job offers, phishing, and online harassment directly to cyber law enforcement.
            </p>
            <div className="space-y-3">
              <a href="https://cybercrime.gov.in/Webform/Index.aspx" target="_blank" rel="noopener noreferrer">
                <Button variant="danger" className="w-full cursor-pointer shadow-md">
                  File Online Complaint <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </a>
              <p className="text-xs text-text-muted text-center">National Cyber Crime Helpline: <a href="tel:1930" className="font-bold text-red-600 underline">1930</a></p>
            </div>
          </Card>

          {/* Verification Certificate */}
          <Card className="flex flex-col border-border hover:border-primary/50 transition-all p-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Police Verification Certificate (TN)</h3>
            <p className="text-sm text-text-muted mb-6 flex-1">
              Apply for job verification, tenant verification, domestic help verification, or self-verification through Tamil Nadu Police e-Services.
            </p>
            <a href="https://eservices.tnpolice.gov.in/CCTNSENHANCED/serviceVerification.html" target="_blank" rel="noopener noreferrer">
              <Button variant="primary" className="w-full cursor-pointer">
                Apply for Verification Certificate <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </Card>
        </div>

        {/* Police Station Search */}
        <Card className="border-border p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" /> Locate Local Police Station
            </h2>
            <p className="text-sm text-text-muted mt-1">
              Search by city or area to locate your local police station for in-person complaint filing, document verification, and safety support.
            </p>
          </div>

          <div className="flex gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Enter city or locality (e.g. Chennai, T. Nagar, Coimbatore)"
                value={city}
                onChange={e => setCity(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <Button variant="primary" onClick={handleSearch} disabled={loading} className="cursor-pointer shrink-0">
              {loading ? 'Searching...' : 'Search Stations'}
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
              {searched ? `Police Stations for "${searchCity}"` : 'Recommended Police Stations'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredStations.map(s => (
                <CentreCard key={s.id} centre={s} />
              ))}
            </div>

            {mapResults.length > 0 && (
              <div className="pt-4 border-t border-border space-y-3">
                <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-primary" /> Live Google Maps Location Results
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mapResults.map(s => (
                    <CentreCard key={s.id} centre={s} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
