'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, MapPin, Phone, GraduationCap, Globe, ExternalLink, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { sampleColleges } from '@/data/sample-data';
import { CITIES, COLLEGE_TYPES } from '@/lib/constants';

export default function CollegePage() {
  const [type, setType] = useState('');
  const [city, setCity] = useState('');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return sampleColleges.filter((c) => {
      if (type && c.type !== type) return false;
      if (city && c.city !== city) return false;
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [type, city, search]);

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
            <Link href="/" className="hover:text-primary">Home</Link><span>/</span>
            <span className="text-text-primary font-medium">College Finder</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-text-primary">College Finder</h1>
          <p className="mt-2 text-text-muted">Find engineering, medical, arts, and management colleges in Tamil Nadu.</p>

          <div className="mt-6 flex flex-wrap gap-2">
            <button onClick={() => setType('')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${!type ? 'bg-primary text-white shadow-md' : 'bg-white border border-border hover:border-primary'}`}>All</button>
            {COLLEGE_TYPES.map((ct) => (
              <button key={ct} onClick={() => setType(ct)} className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all cursor-pointer ${type === ct ? 'bg-primary text-white shadow-md' : 'bg-white border border-border hover:border-primary'}`}>{ct}</button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search colleges..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
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
          {filtered.map((college) => (
            <Card key={college.id} className="group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors">{college.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="default" className="capitalize">{college.type}</Badge>
                    <span className="text-xs text-text-muted">{college.area}, {college.city}</span>
                  </div>
                </div>
              </div>
              {college.address && <p className="mt-3 text-sm text-text-muted">{college.address}</p>}
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border">
                {college.phone && <a href={`tel:${college.phone}`}><Button variant="ghost" size="sm"><Phone className="w-3.5 h-3.5" /></Button></a>}
                {college.website && <a href={college.website} target="_blank" rel="noopener noreferrer"><Button variant="ghost" size="sm"><Globe className="w-3.5 h-3.5" /></Button></a>}
                {college.google_maps_url && <a href={college.google_maps_url} target="_blank" rel="noopener noreferrer"><Button variant="ghost" size="sm"><MapPin className="w-3.5 h-3.5" /></Button></a>}
                <Link href={`/explore/travel`} className="ml-auto">
                  <Button variant="outline" size="sm"><Navigation className="w-3.5 h-3.5" /> How to reach</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
        {filtered.length === 0 && (<div className="text-center py-20"><p className="text-5xl mb-4">🎓</p><h3 className="text-xl font-bold mb-2">No colleges found</h3><p className="text-text-muted">Try different filters.</p></div>)}
      </div>
    </div>
  );
}
