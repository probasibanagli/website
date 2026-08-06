'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firestore/collections';
import type { Hospital } from '@/types';
import { Search, MapPin, Phone, ChevronRight, Star, Globe, Building2, Building, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/card';

const SAMPLE_HOSPITALS: Hospital[] = [
  { id: 'h1', name: 'Apollo Hospital Chennai', city: 'Chennai', area: 'Greams Road', emergency_phone: '1066', phone: '044-28293333', is_24_7: true, has_bengali_doctor: true, main_branch: true, specializations: ['Cardiology', 'Neurology', 'Oncology'], description: 'Leading multi-specialty hospital.', images: ['/images/hospitals/apollo-chennai.jpg'], created_at: '' },
  { id: 'h2', name: 'MGM Healthcare Chennai', city: 'Chennai', area: 'Aminjikarai', emergency_phone: '044-45688888', phone: '044-45688888', is_24_7: true, has_bengali_doctor: true, main_branch: false, specializations: ['Heart Transplant', 'Orthopedics'], description: 'State of the art healthcare.', images: ['/images/hospitals/mgm-healthcare.jpg'], created_at: '' },
  { id: 'h3', name: 'MIOT International Chennai', city: 'Chennai', area: 'Manapakkam', emergency_phone: '105710', phone: '044-22492288', is_24_7: true, has_bengali_doctor: true, main_branch: true, specializations: ['Orthopedics', 'Trauma'], description: 'Pioneers in orthopedic care.', images: ['/images/hospitals/miot-international.jpg'], created_at: '' },
  { id: 'h4', name: 'Fortis Malar Hospital Chennai', city: 'Chennai', area: 'Adyar', emergency_phone: '044-42892222', phone: '044-42892222', is_24_7: true, has_bengali_doctor: true, main_branch: false, specializations: ['Cardiology', 'Gynecology'], description: 'Comprehensive medical care.', images: ['/images/hospitals/fortis-malar.jpg'], created_at: '' },
  { id: 'h5', name: 'SIMS Hospital Chennai', city: 'Chennai', area: 'Vadapalani', emergency_phone: '044-20002001', phone: '044-20002001', is_24_7: true, has_bengali_doctor: true, main_branch: false, specializations: ['Gastroenterology', 'Neurology'], description: 'Expert medical professionals.', images: ['/images/hospitals/sims-hospital.jpg'], created_at: '' }
];

export default function BengaliHospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('');

  useEffect(() => {
    async function loadHospitals() {
      setHospitals(SAMPLE_HOSPITALS);
      setLoading(false);
    }
    const handle = requestAnimationFrame(() => {
      loadHospitals();
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  const cities = useMemo(() => Array.from(new Set(hospitals.map(h => h.city).filter(Boolean))), [hospitals]);

  const filtered = useMemo(() => {
    return hospitals.filter(h => {
      if (cityFilter && h.city !== cityFilter) return false;
      if (search && !h.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [hospitals, cityFilter, search]);

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
            <Link href="/" className="hover:text-primary">Home</Link><span>/</span>
            <Link href="/emergency/hospitals" className="hover:text-primary">Hospitals</Link><span>/</span>
            <span className="text-text-primary font-medium">Bengali Hospitals</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <Link href="/emergency/hospitals" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark mb-4">
                 <ArrowLeft className="w-4 h-4" /> Back to Emergency
              </Link>
              <h1 className="text-3xl sm:text-4xl font-bold font-display text-text-primary flex items-center gap-3">
                <Building2 className="w-8 h-8 text-primary" />
                Bengali Hospitals Directory
              </h1>
              <p className="mt-2 text-text-muted">Find reliable hospitals with Bengali-speaking facilities and top-tier services.</p>
            </div>
            
            <div className="flex gap-2">
               <Link href="/emergency/hospitals/bengali-doctors">
                 <Button variant="outline" className="shadow-sm">View Bengali Doctors <ChevronRight className="w-4 h-4 ml-1"/></Button>
               </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                placeholder="Search hospital name..." 
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-surface/50" 
              />
            </div>
            <select 
              value={cityFilter} 
              onChange={(e) => setCityFilter(e.target.value)} 
              className="px-4 py-2.5 rounded-xl border border-border text-sm bg-surface/50 min-w-[150px] cursor-pointer"
            >
              <option value="">All Cities</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {[1, 2, 3, 4, 5, 6].map(i => (
               <Card key={i} className="animate-pulse flex flex-col h-[350px]">
                 <div className="h-40 bg-border/50" />
                 <div className="p-4 space-y-3">
                   <div className="h-5 bg-border/50 rounded w-3/4" />
                   <div className="h-4 bg-border/50 rounded w-1/2" />
                   <div className="h-4 bg-border/50 rounded w-full mt-4" />
                   <div className="h-4 bg-border/50 rounded w-full" />
                 </div>
               </Card>
             ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((hospital) => (
              <Card key={hospital.id} className="group flex flex-col h-full overflow-hidden hover:shadow-lg transition-all duration-300">
                {/* Image Section */}
                <div className="relative h-48 bg-border/30 overflow-hidden">
                  {hospital.images && hospital.images.length > 0 ? (
                    <img src={hospital.images[0]} alt={hospital.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-text-muted">
                      <Building className="w-12 h-12 opacity-50 mb-2" />
                      <span className="text-xs font-medium uppercase tracking-widest opacity-50">No Image</span>
                    </div>
                  )}
                  {hospital.main_branch && (
                    <div className="absolute top-3 left-3">
                      <Badge variant="verified" className="shadow-md backdrop-blur-md bg-emerald-100/90"><Star className="w-3 h-3 mr-1 fill-emerald-600"/> Main Branch</Badge>
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-1">
                      {hospital.name}
                    </h3>
                    
                    <div className="flex items-start gap-1.5 mt-2 text-sm text-text-muted">
                      <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-primary/70" />
                      <span className="line-clamp-2">{hospital.address || hospital.area}, {hospital.city}</span>
                    </div>

                    {(hospital.phone || hospital.email) && (
                      <div className="flex flex-col gap-1.5 mt-3 pt-3 border-t border-border/50">
                        {hospital.phone && (
                          <div className="flex items-center gap-2 text-sm text-text-primary">
                            <Phone className="w-3.5 h-3.5 text-text-muted" /> {hospital.phone}
                          </div>
                        )}
                        {hospital.email && (
                          <div className="flex items-center gap-2 text-sm text-text-primary">
                            <Globe className="w-3.5 h-3.5 text-text-muted" /> <span className="truncate">{hospital.email}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-5 pt-4 border-t border-border">
                    {hospital.google_maps_url && (
                      <a href={hospital.google_maps_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                        <Button variant="ghost" size="sm" className="w-full bg-surface hover:bg-border/50"><MapPin className="w-3.5 h-3.5 mr-1" /> Directions</Button>
                      </a>
                    )}
                    <Link href={`/emergency/hospitals/${hospital.id}`} className="flex-1">
                      <Button variant="primary" size="sm" className="w-full">View Details</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-border mt-8">
            <p className="text-5xl mb-4">🏥</p>
            <h3 className="text-xl font-bold mb-2">No hospitals found</h3>
            <p className="text-text-muted">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
