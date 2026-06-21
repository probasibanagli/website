'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, MapPin, Phone, Clock, CheckCircle2, Stethoscope, Ambulance, LifeBuoy, Building2, UserRound, ArrowRight, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/card';
import { sampleHospitals } from '@/data/sample-data';
import { CITIES, TREATMENT_TYPES } from '@/lib/constants';

export default function EmergencyHospitalsPage() {
  const [city, setCity] = useState('');
  const [treatment, setTreatment] = useState('');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return sampleHospitals.filter((h) => {
      if (city && h.city !== city) return false;
      if (treatment && !h.specializations.includes(treatment)) return false;
      if (search && !h.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [city, treatment, search]);

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Section with Emergency Enhancements */}
      <div className="bg-red-50/50 border-b border-red-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-red-600/70 mb-4 font-medium">
            <Link href="/" className="hover:text-red-600">Home</Link><span>/</span>
            <Link href="/emergency" className="hover:text-red-600">Emergency</Link><span>/</span>
            <span className="text-red-700">Hospitals</span>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8 justify-between lg:items-center">
            <div className="max-w-2xl">
              <h1 className="text-3xl sm:text-4xl font-bold font-display text-text-primary flex items-center gap-3">
                <ShieldAlert className="w-8 h-8 text-red-500" />
                Emergency Medical Services
              </h1>
              <p className="mt-3 text-text-muted text-lg">
                Immediate access to hospitals, ambulance services, and Bengali-speaking healthcare professionals across Tamil Nadu.
              </p>
              
              {/* Emergency Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="tel:108">
                  <Button variant="danger" size="lg" className="shadow-lg shadow-red-500/20 animate-pulse-glow">
                    <Phone className="w-5 h-5 mr-2" /> Quick Call (108)
                  </Button>
                </a>
                <Link href="/emergency/ambulance">
                  <Button variant="outline" size="lg" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                    <Ambulance className="w-5 h-5 mr-2" /> Ambulance Contact
                  </Button>
                </Link>
                <Button variant="ghost" size="lg" className="text-text-muted hover:text-primary">
                  <LifeBuoy className="w-5 h-5 mr-2" /> Support Section
                </Button>
              </div>
            </div>

            {/* New Subsections Highlight */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/emergency/hospitals/bengali-hospitals" className="group">
                <div className="bg-white p-5 rounded-2xl border border-red-100 shadow-sm hover:shadow-md transition-all h-full max-w-[250px]">
                   <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                     <Building2 className="w-6 h-6 text-primary" />
                   </div>
                   <h3 className="font-bold text-text-primary mb-1">Bengali Hospitals</h3>
                   <p className="text-sm text-text-muted mb-4">Dedicated directory of Bengali friendly hospitals.</p>
                   <span className="text-primary text-sm font-semibold flex items-center">Explore <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" /></span>
                </div>
              </Link>
              
              <Link href="/emergency/hospitals/bengali-doctors" className="group">
                <div className="bg-white p-5 rounded-2xl border border-red-100 shadow-sm hover:shadow-md transition-all h-full max-w-[250px]">
                   <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                     <UserRound className="w-6 h-6 text-primary" />
                   </div>
                   <h3 className="font-bold text-text-primary mb-1">Bengali Doctors</h3>
                   <p className="text-sm text-text-muted mb-4">Connect with experienced Bengali-speaking doctors.</p>
                   <span className="text-primary text-sm font-semibold flex items-center">View Doctors <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" /></span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Legacy Hospital Finder (Intact) */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold font-display text-text-primary">General Hospital Finder</h2>
            <Button variant="ghost" size="sm" className="text-primary"><MapPin className="w-4 h-4 mr-1.5"/> Nearby Hospitals</Button>
          </div>
          
          {/* Treatment Type Buttons */}
          <div className="mt-6 flex flex-wrap gap-2">
            <button onClick={() => setTreatment('')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${!treatment ? 'bg-primary text-white shadow-md' : 'bg-white border border-border hover:border-primary'}`}>All</button>
            {TREATMENT_TYPES.map((t) => (
              <button key={t} onClick={() => setTreatment(t)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${treatment === t ? 'bg-primary text-white shadow-md' : 'bg-white border border-border hover:border-primary'}`}>{t}</button>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search general hospitals..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <select value={city} onChange={(e) => setCity(e.target.value)} className="px-4 py-2.5 rounded-xl border border-border text-sm">
              <option value="">All Cities</option>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((hospital) => (
            <Card key={hospital.id} className="group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center shrink-0">
                  <Stethoscope className="w-6 h-6 text-red-500" />
                </div>
                <div className="flex-1">
                  <Link href={`/emergency/hospitals/${hospital.id}`}>
                    <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors">{hospital.name}</h3>
                  </Link>
                  <div className="flex items-center gap-1.5 mt-1 text-sm text-text-muted">
                    <MapPin className="w-3.5 h-3.5" />{hospital.area}, {hospital.city}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {hospital.is_24_7 && <Badge variant="red"><Clock className="w-3 h-3 mr-1" />24/7</Badge>}
                {hospital.has_bengali_doctor && <Badge variant="bengali">🗣️ Bengali Doctor</Badge>}
              </div>

              <div className="flex flex-wrap gap-1.5 mt-2">
                {hospital.specializations.slice(0, 4).map((s) => (
                  <span key={s} className="px-2 py-0.5 bg-surface rounded-md text-xs text-text-muted">{s}</span>
                ))}
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                {hospital.emergency_phone && (
                  <a href={`tel:${hospital.emergency_phone}`} className="flex-1">
                    <Button variant="danger" size="sm" className="w-full"><Phone className="w-3.5 h-3.5 mr-1.5" /> Emergency</Button>
                  </a>
                )}
                {hospital.google_maps_url && (
                  <a href={hospital.google_maps_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="sm"><MapPin className="w-4 h-4" /></Button>
                  </a>
                )}
                <Link href={`/emergency/hospitals/${hospital.id}`}>
                  <Button variant="outline" size="sm">Details</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
        {filtered.length === 0 && (<div className="text-center py-20"><p className="text-5xl mb-4">🏥</p><h3 className="text-xl font-bold mb-2">No hospitals found</h3><p className="text-text-muted">Try different filters.</p></div>)}
      </div>
    </div>
  );
}
