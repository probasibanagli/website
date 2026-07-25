'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, MapPin, Phone, Search, FileText, UserPlus, Edit, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { ELECTION_OFFICES, ESEVA_CENTRES_CHENNAI, CHENNAI_ZONES } from '@/lib/constants';

function CentreCard({ centre }: { centre: { name: string; address: string; type: string; phone?: string; zone?: string; city?: string } }) {
  return (
    <div className="p-4 bg-surface/50 border border-border rounded-xl">
      <div className="flex justify-between items-start gap-2">
        <h5 className="font-bold text-sm text-text-primary leading-tight">{centre.name}</h5>
        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">{centre.type}</span>
      </div>
      {centre.zone && <p className="text-[10px] font-bold text-amber-700 bg-amber-50 inline-block px-2 py-0.5 rounded-full mt-1.5">{centre.zone}</p>}
      <p className="text-xs text-text-muted mt-2 flex items-start gap-1.5">
        <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
        {centre.address}
      </p>
      {centre.phone && (
        <p className="text-xs text-text-muted mt-1.5 flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5 shrink-0" />
          <a href={centre.phone.includes('1100') ? 'tel:1100' : `tel:${centre.phone}`} className="text-primary hover:underline">{centre.phone}</a>
        </p>
      )}
    </div>
  );
}

export default function VoterIdPage() {
  const [selectedZone, setSelectedZone] = useState('');

  const filteredCentres = useMemo(() => {
    // Show Chennai Election Offices and Chennai e-Seva centres
    const chennaiElectionOffices = ELECTION_OFFICES.filter(o => o.city.toLowerCase() === 'chennai');
    const allCentres = [...chennaiElectionOffices, ...ESEVA_CENTRES_CHENNAI];
    
    if (!selectedZone) return allCentres;
    
    // Filter by zone if selected
    return allCentres.filter(c => {
      if ('zone' in c && c.zone) return c.zone === selectedZone;
      // If it's an election office without a specific zone, just include it or try to match address
      return c.address.toLowerCase().includes(selectedZone.toLowerCase().split(' ')[0]);
    });
  }, [selectedZone]);

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary-dark to-[#7a2d14] py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link href="/services/government" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Government Services
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">Voter ID (EPIC)</h1>
            <Badge variant="amber" className="text-xs mt-1 border-white/20 bg-white/10 text-white">Chennai Region Only</Badge>
          </div>
          <p className="text-white/80 mt-2">Register as a new voter, update your details, or download your e-EPIC card.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Service Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        {/* Nearby Centres (Chennai focused) */}
        <Card>
          <h2 className="text-xl font-bold font-display text-text-primary mb-2 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" /> Nearby e-Seva & Election Offices in Chennai
          </h2>
          <p className="text-sm text-text-muted mb-6">You can visit these centres in person for Voter ID registration and corrections.</p>
          
          <div className="mb-6">
            <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wider">Filter by Chennai Zone</label>
            <select
              value={selectedZone}
              onChange={e => setSelectedZone(e.target.value)}
              className="w-full md:w-1/2 px-3 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
            >
              <option value="">All Chennai Zones</option>
              {CHENNAI_ZONES.map(z => <option key={z} value={z}>{z}</option>)}
            </select>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-text-primary">
              {filteredCentres.length > 0 ? `Centres ${selectedZone ? `in ${selectedZone}` : 'Available'}` : 'No centres found'}
            </h4>
            {filteredCentres.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredCentres.map((c, i) => <CentreCard key={`${c.name}-${i}`} centre={c} />)}
              </div>
            ) : (
              <p className="text-sm text-text-muted italic">No centres found for the selected zone.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
