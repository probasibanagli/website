'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, MapPin, Phone, Search, FileText, UserPlus, Edit, Download, Navigation } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { ELECTION_OFFICES, ESEVA_CENTRES, MAJOR_DISTRICTS } from '@/lib/constants';

function CentreCard({ centre }: { centre: { name: string; address: string; type: string; phone?: string; zone?: string; city?: string; google_maps_url?: string } }) {
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
        {centre.zone && <p className="text-[10px] font-bold text-amber-700 bg-amber-50 inline-block px-2 py-0.5 rounded-full mt-1.5">{centre.zone}</p>}
        <p className="text-xs text-text-muted mt-2 flex items-start gap-1.5">
          <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary/70" />
          <span className="flex-1">{centre.address}</span>
        </p>
        {centre.phone && (
          <p className="text-xs text-text-muted mt-1.5 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 shrink-0 text-primary/70" />
            <a href={centre.phone.includes('1100') ? 'tel:1100' : `tel:${centre.phone}`} className="text-primary hover:underline">{centre.phone}</a>
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

export default function VoterIdPage() {
  const [selectedDistrict, setSelectedDistrict] = useState('Chennai');
  const [searchQuery, setSearchQuery] = useState('');
  const [mapResults, setMapResults] = useState<any[]>([]);
  const [isMapLoading, setIsMapLoading] = useState(false);
  const [mapError, setMapError] = useState('');

  const filteredCentres = useMemo(() => {
    const districtElectionOffices = ELECTION_OFFICES.filter(o => o.city.toLowerCase() === selectedDistrict.toLowerCase());
    const districtEsevaCentres = ESEVA_CENTRES.filter(e => e.city.toLowerCase() === selectedDistrict.toLowerCase());
    const allCentres = [...districtElectionOffices, ...districtEsevaCentres];
    
    if (!searchQuery) return allCentres;
    
    return allCentres.filter(c => {
      return c.address.toLowerCase().includes(searchQuery.toLowerCase()) || 
             c.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [selectedDistrict, searchQuery]);

  const searchMaps = async () => {
    setIsMapLoading(true);
    setMapError('');
    try {
      const q = searchQuery ? `e-Seva centre in ${searchQuery}, ${selectedDistrict}` : `e-Seva centre in ${selectedDistrict}`;
      const res = await fetch(`/api/maps/places?query=${encodeURIComponent(q)}`);
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);
      
      if (data.status && data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        throw new Error(data.error_message || `Google Maps API Error: ${data.status}`);
      }
      
      const parsedResults = (data.results || []).map((r: any) => ({
        name: r.name,
        address: r.formatted_address,
        type: 'Google Maps Result',
        city: selectedDistrict,
        zone: r.rating ? `${r.rating} ⭐` : undefined,
        google_maps_url: r.google_maps_url
      }));
      setMapResults(parsedResults);
    } catch (err: any) {
      setMapError(err.message || 'Failed to fetch maps data');
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
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">Voter ID (EPIC)</h1>
            <Badge variant="amber" className="text-xs mt-1 border-white/20 bg-white/10 text-white">Major Districts Available</Badge>
          </div>
          <p className="text-white/80 mt-2">Register as a new voter, update your details, or download your e-EPIC card.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Service Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* New Application */}
          <Card className="flex flex-col border-border hover:border-primary/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
              <UserPlus className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">New Voter Registration</h3>
            <p className="text-sm text-text-muted flex-1 mb-6">Fill Form 6 if you are 18+ years old and applying for the first time.</p>
            <a href="https://voters.eci.gov.in/signup" target="_blank" rel="noopener noreferrer">
              <Button variant="primary" className="w-full">
                Apply (Form 6) <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </Card>

          {/* Update / Correction */}
          <Card className="flex flex-col border-border hover:border-primary/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
              <Edit className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">Update / Correction</h3>
            <p className="text-sm text-text-muted flex-1 mb-6">Fill Form 8 for shifting residence, correction of entries, or replacement EPIC.</p>
            <a href="https://voters.eci.gov.in/login" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full">
                Apply (Form 8) <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </Card>

          {/* Download */}
          <Card className="flex flex-col border-border hover:border-primary/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">Download e-EPIC</h3>
            <p className="text-sm text-text-muted flex-1 mb-6">Download a digital copy of your Voter ID card instantly.</p>
            <a href="https://voters.eci.gov.in/login" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full">
                Download PDF <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </Card>
        </div>

        {/* Nearby Centres */}
        <Card>
          <h2 className="text-xl font-bold font-display text-text-primary mb-2 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" /> Nearby e-Seva & Election Offices
          </h2>
          <p className="text-sm text-text-muted mb-6">You can visit these centres in person for Voter ID registration and corrections.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wider">Select District</label>
              <select
                value={selectedDistrict}
                onChange={e => setSelectedDistrict(e.target.value)}
                className="w-full px-3 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
              >
                {MAJOR_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wider">Search Location</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Search area or locality..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <Button onClick={searchMaps} disabled={isMapLoading} className="shrink-0 rounded-xl px-4">
                  {isMapLoading ? 'Searching...' : 'Search Maps'}
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-text-primary">
              {filteredCentres.length > 0 ? `Local Database Centres in ${selectedDistrict}` : 'No local database centres found'}
            </h4>
            {filteredCentres.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredCentres.map((c, i) => <CentreCard key={`local-${i}`} centre={c} />)}
              </div>
            )}

            {mapResults.length > 0 && (
              <div className="mt-8 pt-6 border-t border-border">
                <h4 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" /> Live Google Maps Results
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {mapResults.map((c, i) => <CentreCard key={`map-${i}`} centre={c} />)}
                </div>
              </div>
            )}

            {mapError && (
              <p className="text-sm text-red-500 mt-2 bg-red-50 p-3 rounded-lg border border-red-100">{mapError}</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
