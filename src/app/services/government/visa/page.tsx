'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Globe, Plane, ChevronDown, ChevronUp, MapPin, Phone, CheckCircle2, Navigation } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { VISA_COUNTRIES } from '@/lib/constants';

export default function VisaPage() {
  const [selectedCode, setSelectedCode] = useState('US');
  const [showApplicationSteps, setShowApplicationSteps] = useState(true);
  const [showBiometricSteps, setShowBiometricSteps] = useState(true);

  const country = useMemo(() => {
    return VISA_COUNTRIES.find(c => c.code === selectedCode) || VISA_COUNTRIES[0];
  }, [selectedCode]);

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-800 via-indigo-900 to-slate-950 py-8 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link href="/services/government" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Government Services
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">Visa & Embassy Services</h1>
            <Badge variant="amber" className="text-xs border-white/20 bg-white/10 text-white">International Travel</Badge>
          </div>
          <p className="text-white/80 mt-2">Official visa application portals, biometric submission requirements, and nearest Visa Application Centres (VAC) in Chennai.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Destination Country Selection Card */}
        <Card className="border-border p-6 bg-gradient-to-br from-indigo-50/50 to-white">
          <label className="block text-sm font-bold text-text-primary mb-2 uppercase tracking-wider">
            Select Destination Country / Region
          </label>
          <select
            value={selectedCode}
            onChange={e => setSelectedCode(e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-xl text-base font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white cursor-pointer shadow-sm"
          >
            {VISA_COUNTRIES.map(c => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </Card>

        {/* Selected Country Details */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
              <Plane className="w-6 h-6 text-indigo-600" /> Visa for {country.name}
            </h2>
            <a href={country.visaPortalUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="primary" className="bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-md">
                Official {country.name} Visa Portal <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>

          {/* 1. Application Process */}
          <Card className="border-border p-6">
            <button
              onClick={() => setShowApplicationSteps(!showApplicationSteps)}
              className="w-full flex items-center justify-between text-left cursor-pointer"
            >
              <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-indigo-600" /> Step-by-Step Application Process
              </h3>
              {showApplicationSteps ? <ChevronUp className="w-5 h-5 text-text-muted" /> : <ChevronDown className="w-5 h-5 text-text-muted" />}
            </button>
            {showApplicationSteps && (
              <ol className="mt-4 space-y-3 pt-3 border-t border-border">
                {country.applicationProcess.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-text-muted">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{idx + 1}</span>
                    <span className="flex-1 leading-relaxed text-text-primary">{step}</span>
                  </li>
                ))}
              </ol>
            )}
          </Card>

          {/* 2. Biometrics Process */}
          <Card className="border-border p-6">
            <button
              onClick={() => setShowBiometricSteps(!showBiometricSteps)}
              className="w-full flex items-center justify-between text-left cursor-pointer"
            >
              <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-600" /> Biometric Appointment & Requirements
              </h3>
              {showBiometricSteps ? <ChevronUp className="w-5 h-5 text-text-muted" /> : <ChevronDown className="w-5 h-5 text-text-muted" />}
            </button>
            {showBiometricSteps && (
              <ul className="mt-4 space-y-3 pt-3 border-t border-border">
                {country.biometricProcess.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-text-muted">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
                    <span className="flex-1 leading-relaxed text-text-primary">{step}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* 3. VAC Location Card */}
          <Card className="border-border p-6 bg-surface/50">
            <h3 className="text-base font-bold text-text-primary mb-3">Nearest Embassy / Consulate / Visa Application Centre (VAC)</h3>
            <div className="p-4 bg-white border border-border rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-sm text-text-primary">{country.name} Consulate / VAC</h4>
                <p className="text-xs text-text-muted mt-1.5 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-indigo-600" />
                  {country.vacAddress}
                </p>
                {country.vacPhone && (
                  <p className="text-xs text-text-muted mt-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 shrink-0 text-indigo-600" />
                    <a href={`tel:${country.vacPhone}`} className="text-indigo-600 font-medium hover:underline">{country.vacPhone}</a>
                  </p>
                )}
              </div>
              <a
                href={country.vacGoogleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(country.vacAddress)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0"
              >
                <Button variant="outline" size="sm" className="cursor-pointer border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                  <Navigation className="w-3.5 h-3.5 mr-1.5" /> View on Google Maps
                </Button>
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
