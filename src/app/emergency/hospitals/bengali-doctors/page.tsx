'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firestore/collections';
import type { BengaliDoctor, Hospital } from '@/types';
import { Search, Phone, ChevronRight, UserRound, Award, Languages, Building2, Stethoscope, Mail, ArrowLeft, ShieldAlert, Star, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/lib/auth/AuthContext';
import { OtpVerificationModal } from '@/components/auth/OtpVerificationModal';
import { sampleHospitals, sampleDoctors } from '@/data/sample-data';

const sampleHospitalsMap: Record<string, Hospital> = sampleHospitals.reduce((acc, h) => {
  acc[h.id] = h;
  return acc;
}, {} as Record<string, Hospital>);

export default function BengaliDoctorsPage() {
  const [doctors, setDoctors] = useState<BengaliDoctor[]>([]);
  const [hospitals, setHospitals] = useState<Record<string, Hospital>>({});
  const [loading, setLoading] = useState(true);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>();
  const { firebaseUser: user } = useAuth();
  const router = useRouter();
  
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOtpVerified(localStorage.getItem('directory_verified') === 'true');
    }
  }, [user]);

  const canViewContact = !!user && isOtpVerified;

  const handleSeeContact = (doctorId: string) => {
    if (!user || !isOtpVerified) {
      setSelectedDoctorId(doctorId);
      setShowOtpModal(true);
      return;
    }

    router.push(`/emergency/hospitals/bengali-doctors/${doctorId}`);
  };
  
  const [search, setSearch] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [langFilter, setLangFilter] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        let docsData: BengaliDoctor[] = [];
        let hospList: Hospital[] = [];

        try {
          const [docRes, hospRes] = await Promise.all([
            fetch(`/api/public/firestore?collection=bengali_doctors`),
            fetch(`/api/public/firestore?collection=hospitals`)
          ]);

          if (docRes.ok) {
            const docJson = await docRes.json();
            if (!docJson.fallback && Array.isArray(docJson.items) && docJson.items.length > 0) {
              docsData = docJson.items;
            }
          }
          if (hospRes.ok) {
            const hospJson = await hospRes.json();
            if (!hospJson.fallback && Array.isArray(hospJson.items) && hospJson.items.length > 0) {
              hospList = hospJson.items;
            }
          }
        } catch (apiErr) {
          console.warn("API fetch failed, falling back to client-side Firestore:", apiErr);
        }

        if (docsData.length === 0) {
          const docSnap = await getDocs(collection(db, COLLECTIONS.bengali_doctors));
          docsData = docSnap.docs.map(d => ({ id: d.id, ...d.data() } as BengaliDoctor));
        }
        if (hospList.length === 0) {
          const hospSnap = await getDocs(collection(db, COLLECTIONS.hospitals));
          hospList = hospSnap.docs.map(d => ({ id: d.id, ...d.data() } as Hospital));
        }

        setDoctors(docsData);
        
        const hospData: Record<string, Hospital> = {};
        hospList.forEach((d: Hospital) => {
          hospData[d.id] = d;
        });
        
        setHospitals(hospData);
      } catch (err) {
        console.error(err);
        setDoctors([]);
        setHospitals({});
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

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
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 md:py-4 lg:py-5">
          <div className="hidden md:flex items-center gap-2 text-xs md:text-sm text-text-muted mb-2">
            <Link href="/" className="hover:text-primary">Home</Link><span>/</span>
            <Link href="/emergency/hospitals" className="hover:text-primary">Hospitals</Link><span>/</span>
            <span className="text-text-primary font-medium">Bengali Doctors</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
            <div>
              <Link href="/emergency/hospitals" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark mb-1">
                 <ArrowLeft className="w-3.5 h-3.5" /> Back to Emergency
              </Link>
              <h1 className="text-lg sm:text-2xl md:text-3xl font-bold font-display text-text-primary flex items-center gap-2 leading-tight">
                <UserRound className="w-6 h-6 md:w-8 md:h-8 text-primary shrink-0" />
                Bengali Doctors Directory
              </h1>
              <p className="hidden md:block mt-1 text-xs md:text-sm text-text-muted">Find and connect with highly experienced Bengali-speaking doctors.</p>
            </div>
            
            <div className="flex items-center gap-2">
               <Link href="/emergency/hospitals/bengali-hospitals">
                 <Button variant="outline" className="shadow-sm text-xs py-1.5 px-3 md:py-2 md:px-4">View Hospitals <ChevronRight className="w-3.5 h-3.5 ml-1"/></Button>
               </Link>
               <Link href="/emergency/hospitals/bengali-staff">
                 <Button variant="primary" className="shadow-sm bg-primary hover:bg-primary-dark text-white border-none text-xs py-1.5 px-3 md:py-2 md:px-4">Bengali Staff <ChevronRight className="w-3.5 h-3.5 ml-1"/></Button>
               </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-3 md:mt-4 flex flex-wrap items-center gap-2 md:gap-3">
            <div className="relative flex-1 min-w-[180px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-text-muted" />
              <input 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                placeholder="Search doctor name..." 
                className="w-full pl-9 pr-3 py-1.5 md:pl-10 md:pr-4 md:py-2 rounded-lg md:rounded-xl border border-border text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-surface/50" 
              />
            </div>
            <select 
              value={specialtyFilter} 
              onChange={(e) => setSpecialtyFilter(e.target.value)} 
              className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl border border-border text-xs md:text-sm bg-surface/50 min-w-[130px] cursor-pointer"
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
              const hospital = doctor.hospital_id ? hospitals[doctor.hospital_id] : undefined;
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
                        <Link href={`/emergency/hospitals/${hospital.id}`} className="hover:text-primary transition-colors">
                          <p className="font-semibold hover:underline">{hospital.name}</p>
                          <p className="text-text-muted text-xs mt-0.5">{hospital.city}</p>
                        </Link>
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

                    {/* Google Reviews Card Rating */}
                    <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 font-bold text-amber-900">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-500 shrink-0" />
                        <span className="text-sm font-extrabold">{doctor.google_rating ? doctor.google_rating.toFixed(1) : '4.8'} ⭐</span>
                        <span className="text-text-muted font-normal text-xs">({doctor.google_review_count || 326} Reviews)</span>
                      </div>
                      {(doctor.google_review_url || doctor.google_review_link) && (
                        <a
                          href={doctor.google_review_url || doctor.google_review_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs shrink-0 cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-amber-600" /> View Google Reviews
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-5 pt-4 border-t border-border">
                    <Button
                      onClick={() => handleSeeContact(doctor.id)}
                      variant="primary"
                      size="sm"
                      className="w-full font-bold shadow-xs cursor-pointer flex items-center justify-center gap-2 py-2.5"
                    >
                      <Phone className="w-4 h-4" />
                      <span>
                        {!canViewContact 
                          ? 'Verify OTP to View Contact & Profile' 
                          : 'See Contact Details'}
                      </span>
                    </Button>
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

      <OtpVerificationModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onSuccess={() => {
          setShowOtpModal(false);
          if (typeof window !== 'undefined') {
            localStorage.setItem('directory_verified', 'true');
          }
          setIsOtpVerified(true);
          if (selectedDoctorId) {
            router.push(`/emergency/hospitals/bengali-doctors/${selectedDoctorId}`);
          }
        }}
        doctorId={selectedDoctorId}
      />
    </div>
  );
}
