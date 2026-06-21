'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, MapPin, Phone, Clock, CheckCircle2, Stethoscope, ChevronDown, MessageCircle, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/card';
import { PlaceImage } from '@/components/ui/PlaceImage';
import { sampleHospitals } from '@/data/sample-data';
import { CITIES, TREATMENT_TYPES } from '@/lib/constants';

export default function HospitalsPage() {
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
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-3">
            <Link href="/" className="hover:text-primary">Home</Link><span>/</span>
            <span className="text-text-primary font-medium">Hospitals</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-text-primary">Hospital Finder</h1>
          <p className="mt-1 text-text-muted text-sm">Find hospitals and emergency services in Tamil Nadu.</p>

          {/* Inline filter bar */}
          <div className="mt-5 flex flex-col gap-3">
            {/* Treatment Type Tabs */}
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setTreatment('')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${!treatment ? 'bg-red-600 text-white shadow-md' : 'bg-surface text-text-primary hover:bg-red-50'}`}>All</button>
              {TREATMENT_TYPES.map((t) => (
                <button key={t} onClick={() => setTreatment(t)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${treatment === t ? 'bg-red-600 text-white shadow-md' : 'bg-surface text-text-primary hover:bg-red-50'}`}>{t}</button>
              ))}
            </div>

            {/* Search + City */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[180px] max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search hospitals..." className="w-full pl-9 pr-3 py-2 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
              </div>
              <select value={city} onChange={(e) => setCity(e.target.value)} className="px-3 py-2 rounded-xl border border-border text-sm bg-white">
                <option value="">All Cities</option>
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-sm text-text-muted mb-6"><span className="font-semibold text-text-primary">{filtered.length}</span> hospitals found</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((hospital) => (
            <Card key={hospital.id} padding="none" className="overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative">
                <PlaceImage
                  name={hospital.name}
                  city={hospital.city}
                  type="hospital"
                  mapsUrl={hospital.google_maps_url}
                  className="h-36"
                />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  {hospital.is_24_7 && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/90 backdrop-blur-sm rounded-lg text-[10px] font-bold text-white shadow-sm">
                      <Clock className="w-3 h-3" /> 24/7
                    </span>
                  )}
                </div>
                {hospital.has_bengali_doctor && (
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent/90 backdrop-blur-sm rounded-lg text-[10px] font-bold text-white shadow-sm">
                      <MessageCircle className="w-3 h-3" /> Bengali Doctor
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <Link href={`/emergency/hospitals/${hospital.id}`}>
                  <h3 className="font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-1">{hospital.name}</h3>
                </Link>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-text-muted">
                  <MapPin className="w-3 h-3" />{hospital.area}, {hospital.city}
                </div>

                <div className="flex flex-wrap gap-1 mt-3">
                  {hospital.specializations.slice(0, 4).map((s) => (
                    <span key={s} className="px-2 py-0.5 bg-surface rounded-md text-[11px] text-text-muted">{s}</span>
                  ))}
                </div>

                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
                  {hospital.emergency_phone && (
                    <a href={`tel:${hospital.emergency_phone}`} className="flex-1">
                      <Button variant="danger" size="sm" className="w-full"><Phone className="w-3.5 h-3.5" /> Emergency</Button>
                    </a>
                  )}
                  {hospital.google_maps_url && (
                    <a href={hospital.google_maps_url} target="_blank" rel="noopener noreferrer">
                      <button className="w-9 h-9 rounded-lg bg-surface hover:bg-primary/10 flex items-center justify-center transition-colors cursor-pointer">
                        <MapPin className="w-4 h-4 text-text-muted" />
                      </button>
                    </a>
                  )}
                  <Link href={`/emergency/hospitals/${hospital.id}`}>
                    <Button variant="outline" size="sm" className="h-9 px-3">Details</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="w-8 h-8 text-text-muted/40" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">No hospitals found</h3>
            <p className="text-text-muted text-sm">Try different filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
