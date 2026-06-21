'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firestore/collections';
import type { BengaliDoctor, Hospital } from '@/types';
import { Search, Phone, ChevronRight, UserRound, Award, Languages, Building2, Stethoscope, Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const SAMPLE_HOSPITALS: Record<string, Hospital> = {
  'h1': { id: 'h1', name: 'Apollo Hospital Chennai', city: 'Chennai', area: 'Greams Road', specializations: [], is_24_7: true, has_bengali_doctor: true, images: ['/images/hospitals/apollo-chennai.jpg'], created_at: '' },
  'h2': { id: 'h2', name: 'MGM Healthcare Chennai', city: 'Chennai', area: 'Aminjikarai', specializations: [], is_24_7: true, has_bengali_doctor: true, images: ['/images/hospitals/mgm-healthcare.jpg'], created_at: '' },
  'h3': { id: 'h3', name: 'MIOT International Chennai', city: 'Chennai', area: 'Manapakkam', specializations: [], is_24_7: true, has_bengali_doctor: true, images: ['/images/hospitals/miot-international.jpg'], created_at: '' },
  'h4': { id: 'h4', name: 'Fortis Malar Hospital Chennai', city: 'Chennai', area: 'Adyar', specializations: [], is_24_7: true, has_bengali_doctor: true, images: ['/images/hospitals/fortis-malar.jpg'], created_at: '' },
  'h5': { id: 'h5', name: 'SIMS Hospital Chennai', city: 'Chennai', area: 'Vadapalani', specializations: [], is_24_7: true, has_bengali_doctor: true, images: ['/images/hospitals/sims-hospital.jpg'], created_at: '' }
};

const SAMPLE_DOCTORS: BengaliDoctor[] = [
  { id: 'd1', doctor_name: 'Dr. Anirban Roy', specialization: 'Cardiologist', hospital_id: 'h1', experience: '15 years', languages: ['Bengali', 'English', 'Tamil'], photo: '', phone: '', email: '' },
  { id: 'd2', doctor_name: 'Dr. Saptarshi Chatterjee', specialization: 'Neurologist', hospital_id: 'h2', experience: '12 years', languages: ['Bengali', 'English'], photo: '', phone: '', email: '' },
  { id: 'd3', doctor_name: 'Dr. Debasish Banerjee', specialization: 'Orthopedic Surgeon', hospital_id: 'h3', experience: '20 years', languages: ['Bengali', 'English', 'Hindi'], photo: '', phone: '', email: '' },
  { id: 'd4', doctor_name: 'Dr. Soumya Mukherjee', specialization: 'General Physician', hospital_id: 'h4', experience: '8 years', languages: ['Bengali', 'English', 'Tamil'], photo: '', phone: '', email: '' },
  { id: 'd5', doctor_name: 'Dr. Priyanka Ghosh', specialization: 'Gynecologist', hospital_id: 'h5', experience: '10 years', languages: ['Bengali', 'English'], photo: '', phone: '', email: '' }
];

export default function BengaliDoctorsPage() {
  const [doctors, setDoctors] = useState<BengaliDoctor[]>([]);
  const [hospitals, setHospitals] = useState<Record<string, Hospital>>({});
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [langFilter, setLangFilter] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setDoctors(SAMPLE_DOCTORS);
    setHospitals(SAMPLE_HOSPITALS);
    setLoading(false);
  }

  const specialties = useMemo(() => Array.from(new Set(doctors.map(d => d.specialization).filter(Boolean))), [doctors]);
  const allLangs = useMemo(() => {
    const langs = new Set<string>();
    doctors.forEach(d => d.languages?.forEach(l => langs.add(l)));
    return Array.from(langs);
  }, [doctors]);

  const filtered = useMemo(() => {
    return doctors.filter(d => {
      if (specialtyFilter && d.specialization !== specialtyFilter) return false;
      if (langFilter && (!d.languages || !d.languages.includes(langFilter))) return false;
      if (search && !d.doctor_name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [doctors, specialtyFilter, langFilter, search]);

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
            <Link href="/" className="hover:text-primary">Home</Link><span>/</span>
            <Link href="/emergency/hospitals" className="hover:text-primary">Hospitals</Link><span>/</span>
            <span className="text-text-primary font-medium">Bengali Doctors</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <Link href="/emergency/hospitals" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark mb-4">
                 <ArrowLeft className="w-4 h-4" /> Back to Emergency
              </Link>
              <h1 className="text-3xl sm:text-4xl font-bold font-display text-text-primary flex items-center gap-3">
                <UserRound className="w-8 h-8 text-primary" />
                Bengali Doctors Directory
              </h1>
              <p className="mt-2 text-text-muted">Find and connect with highly experienced Bengali-speaking doctors.</p>
            </div>
            
            <div className="flex gap-2">
               <Link href="/emergency/hospitals/bengali-hospitals">
                 <Button variant="outline" className="shadow-sm">View Hospitals Directory <ChevronRight className="w-4 h-4 ml-1"/></Button>
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
                placeholder="Search doctor name..." 
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-surface/50" 
              />
            </div>
            <select 
              value={specialtyFilter} 
              onChange={(e) => setSpecialtyFilter(e.target.value)} 
              className="px-4 py-2.5 rounded-xl border border-border text-sm bg-surface/50 min-w-[150px] cursor-pointer"
            >
              <option value="">All Specialties</option>
              {specialties.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select 
              value={langFilter} 
              onChange={(e) => setLangFilter(e.target.value)} 
              className="px-4 py-2.5 rounded-xl border border-border text-sm bg-surface/50 min-w-[150px] cursor-pointer"
            >
              <option value="">All Languages</option>
              {allLangs.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {[1, 2, 3, 4, 5, 6].map(i => (
               <Card key={i} className="animate-pulse p-6">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-border/50" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-border/50 rounded w-3/4" />
                      <div className="h-4 bg-border/50 rounded w-1/2" />
                    </div>
                 </div>
                 <div className="space-y-3 mt-6">
                   <div className="h-4 bg-border/50 rounded w-full" />
                   <div className="h-4 bg-border/50 rounded w-full" />
                 </div>
               </Card>
             ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((doctor) => {
              const hospital = hospitals[doctor.hospital_id];
              return (
                <Card key={doctor.id} className="group hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 transition-transform group-hover:scale-110 duration-500" />
                  
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-surface border-2 border-white shadow-md overflow-hidden shrink-0 relative">
                      {doctor.photo ? (
                        <img src={doctor.photo} alt={doctor.doctor_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                          <Stethoscope className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className="text-lg font-bold text-text-primary leading-tight group-hover:text-primary transition-colors">
                        {doctor.doctor_name}
                      </h3>
                      <p className="text-primary font-medium text-sm mt-1">{doctor.specialization}</p>
                      
                      {doctor.experience && (
                        <div className="flex items-center gap-1 mt-1.5 text-xs text-text-muted font-medium">
                          <Award className="w-3.5 h-3.5 text-amber-500" />
                          {doctor.experience} Experience
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 space-y-2.5">
                    {hospital && (
                      <div className="flex items-start gap-2.5 text-sm text-text-primary p-3 bg-surface/50 rounded-xl border border-border/50">
                        <Building2 className="w-4 h-4 text-text-muted shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">{hospital.name}</p>
                          <p className="text-text-muted text-xs mt-0.5">{hospital.city}</p>
                        </div>
                      </div>
                    )}
                    
                    {doctor.languages && doctor.languages.length > 0 && (
                      <div className="flex items-start gap-2.5 text-sm text-text-primary px-1">
                        <Languages className="w-4 h-4 text-text-muted shrink-0 mt-0.5" />
                        <div className="flex flex-wrap gap-1">
                          {doctor.languages.map(l => (
                            <span key={l} className="px-2 py-0.5 bg-surface rounded-md text-xs text-text-muted border border-border/50">
                              {l}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-border flex items-center gap-2">
                    {doctor.phone && (
                      <a href={`tel:${doctor.phone}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full"><Phone className="w-3.5 h-3.5 mr-1.5" /> Call</Button>
                      </a>
                    )}
                    {doctor.email && (
                      <a href={`mailto:${doctor.email}`} className="flex-1">
                        <Button variant="ghost" size="sm" className="w-full bg-surface"><Mail className="w-3.5 h-3.5 mr-1.5" /> Email</Button>
                      </a>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-border mt-8">
            <p className="text-5xl mb-4">👨‍⚕️</p>
            <h3 className="text-xl font-bold mb-2">No doctors found</h3>
            <p className="text-text-muted">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
