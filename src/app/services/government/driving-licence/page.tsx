'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Car, FilePlus, RefreshCw, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';

export default function DrivingLicencePage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-800 via-blue-900 to-slate-950 py-8 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link href="/services/government" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Government Services
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">Driving Licence (Parivahan)</h1>
            <Badge variant="amber" className="text-xs border-white/20 bg-white/10 text-white">Transport Dept</Badge>
          </div>
          <p className="text-white/80 mt-2">Ministry of Road Transport & Highways (Parivahan Sewa). Apply for Learner Licence (LL), Permanent DL, or DL renewal in Tamil Nadu.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Service Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* New Learner / Driving Licence */}
          <Card className="flex flex-col border-border hover:border-blue-500 transition-all p-6">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4 text-blue-800">
              <FilePlus className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">New Learner Licence (LLR)</h3>
            <p className="text-sm text-text-muted flex-1 mb-6">Apply online for a new Learner Licence, upload documents, and take the online test.</p>
            <a href="https://sarathi.parivahan.gov.in/sarathiservice/stateSelection.do" target="_blank" rel="noopener noreferrer">
              <Button variant="primary" className="w-full bg-blue-700 hover:bg-blue-800 text-white border-none cursor-pointer">
                Apply LLR / DL <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </Card>

          {/* Renewal */}
          <Card className="flex flex-col border-border hover:border-blue-500 transition-all p-6">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4 text-blue-800">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">DL Renewal / Address Change</h3>
            <p className="text-sm text-text-muted flex-1 mb-6">Renew an expired driving licence or change your residential address on your existing licence.</p>
            <a href="https://sarathi.parivahan.gov.in/sarathiservice/stateSelection.do" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full border-blue-300 text-blue-800 hover:bg-blue-50 cursor-pointer">
                Renew DL <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </Card>

          {/* RTO Locator */}
          <Card className="flex flex-col border-border hover:border-blue-500 transition-all p-6">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4 text-blue-800">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">RTO Office Locator</h3>
            <p className="text-sm text-text-muted flex-1 mb-6">Locate your nearest Regional Transport Office (RTO) in Tamil Nadu for driving test appointments.</p>
            <a href="https://www.google.com/maps/search/?api=1&query=RTO+Office+in+Tamil+Nadu" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full border-blue-300 text-blue-800 hover:bg-blue-50 cursor-pointer">
                Locate RTO <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </Card>
        </div>
      </div>
    </div>
  );
}
