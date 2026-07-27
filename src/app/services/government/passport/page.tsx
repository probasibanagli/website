'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, MapPin, Phone, Search, FileText, RefreshCw, Edit, FilePlus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { PASSPORT_SEVA_KENDRAS } from '@/lib/constants';

function CentreCard({ centre }: { centre: { name: string; address: string; type: string; phone?: string; timings?: string } }) {
  return (
    <div className="p-4 bg-surface/50 border border-border rounded-xl">
      <div className="flex justify-between items-start gap-2">
        <h5 className="font-bold text-sm text-text-primary leading-tight">{centre.name}</h5>
        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">{centre.type}</span>
      </div>
      <p className="text-xs text-text-muted mt-2 flex items-start gap-1.5">
        <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
        {centre.address}
      </p>
      {centre.phone && (
        <p className="text-xs text-text-muted mt-1.5 flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5 shrink-0" />
          <a href={`tel:${centre.phone}`} className="text-primary hover:underline">{centre.phone}</a>
        </p>
      )}
    </div>
  );
}

export default function PassportPage() {
  const [city, setCity] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [searched, setSearched] = useState(false);

  const filteredCentres = useMemo(() => {
    if (!searchCity) return PASSPORT_SEVA_KENDRAS;
    return PASSPORT_SEVA_KENDRAS.filter(c => c.district.toLowerCase().includes(searchCity.toLowerCase()) || c.address.toLowerCase().includes(searchCity.toLowerCase()));
  }, [searchCity]);

  const handleSearch = () => {
    setSearchCity(city);
    setSearched(true);
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary-dark to-[#7a2d14] py-8">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* New Application */}
          <Card className="flex flex-col border-border hover:border-primary/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
              <FilePlus className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">New Application</h3>
            <p className="text-sm text-text-muted flex-1 mb-6">Apply for a fresh passport if you have never held one before.</p>
            <a href="https://www.passportindia.gov.in/AppOnlineProject/user/RegistrationBaseAction?requestFor=O" target="_blank" rel="noopener noreferrer">
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
            <a href="https://www.passportindia.gov.in/AppOnlineProject/user/userLogin" target="_blank" rel="noopener noreferrer">
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
            <a href="https://www.passportindia.gov.in/AppOnlineProject/user/userLogin" target="_blank" rel="noopener noreferrer">
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
                className="w-full pl-10 pr-4 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <Button variant="primary" onClick={handleSearch} className="shrink-0">Search</Button>
          </div>

          {searched && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="text-sm font-bold text-text-primary">
                {filteredCentres.length > 0 ? `Passport Centres${searchCity ? ` for "${searchCity}"` : ''}` : 'No centres found'}
              </h4>
              {filteredCentres.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredCentres.map(c => <CentreCard key={c.id} centre={c} />)}
                </div>
              ) : (
                <p className="text-sm text-text-muted italic">No centres found. Please try a different search term.</p>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
