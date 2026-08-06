'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firestore/collections';
import type { BengaliStaff, Hospital } from '@/types';
import { Search, Phone, ChevronRight, Users, Award, Languages, Building2, Stethoscope, Mail, ArrowLeft, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { OtpVerificationModal } from '@/components/auth/OtpVerificationModal';

const SAMPLE_HOSPITALS: Record<string, Hospital> = {
  'h1': { id: 'h1', name: 'Apollo Hospital Chennai', city: 'Chennai', area: 'Greams Road', specializations: [], is_24_7: true, has_bengali_doctor: true, images: ['/images/hospitals/apollo-chennai.jpg'], created_at: '' },
  'h2': { id: 'h2', name: 'MGM Healthcare Chennai', city: 'Chennai', area: 'Aminjikarai', specializations: [], is_24_7: true, has_bengali_doctor: true, images: ['/images/hospitals/mgm-healthcare.jpg'], created_at: '' },
  'h3': { id: 'h3', name: 'MIOT International Chennai', city: 'Chennai', area: 'Manapakkam', specializations: [], is_24_7: true, has_bengali_doctor: true, images: ['/images/hospitals/miot-international.jpg'], created_at: '' },
  'h4': { id: 'h4', name: 'Fortis Malar Hospital Chennai', city: 'Chennai', area: 'Adyar', specializations: [], is_24_7: true, has_bengali_doctor: true, images: ['/images/hospitals/fortis-malar.jpg'], created_at: '' },
  'h5': { id: 'h5', name: 'SIMS Hospital Chennai', city: 'Chennai', area: 'Vadapalani', specializations: [], is_24_7: true, has_bengali_doctor: true, images: ['/images/hospitals/sims-hospital.jpg'], created_at: '' }
};

const SAMPLE_STAFF: BengaliStaff[] = [
  { id: 's1', name: 'Amit Roy', role: 'Nursing Staff', department: 'Cardiology', hospital_id: 'h1', experience: '5 years', languages: ['Bengali', 'Tamil', 'English'], photo: '', phone: '', email: '', availability: 'Day Shift', description: '' },
  { id: 's2', name: 'Riya Das', role: 'Patient Coordinator', department: 'General', hospital_id: 'h2', experience: '3 years', languages: ['Bengali', 'English'], photo: '', phone: '', email: '', availability: '24/7 on call', description: '' },
  { id: 's3', name: 'Sanjay Sen', role: 'Technician', department: 'Radiology', hospital_id: 'h3', experience: '8 years', languages: ['Bengali', 'Tamil', 'Hindi'], photo: '', phone: '', email: '', availability: 'Night Shift', description: '' }
];

export default function BengaliStaffPage() {
  const [staffList, setStaffList] = useState<BengaliStaff[]>([]);
  const [hospitals, setHospitals] = useState<Record<string, Hospital>>({});
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const router = useRouter();
  
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [langFilter, setLangFilter] = useState('');

  useEffect(() => {
    setIsVerified(false);

    async function loadData() {
      try {
        let docsData: BengaliStaff[] = [];
        let hospList: Hospital[] = [];

        try {
          const [staffRes, hospRes] = await Promise.all([
            fetch(`/api/public/firestore?collection=bengali_staff`),
            fetch(`/api/public/firestore?collection=hospitals`)
          ]);

          if (staffRes.ok) {
            const staffJson = await staffRes.json();
            if (!staffJson.fallback && Array.isArray(staffJson.items) && staffJson.items.length > 0) {
              docsData = staffJson.items;
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
          const docSnap = await getDocs(collection(db, COLLECTIONS.bengali_staff || 'bengali_staff'));
          docsData = docSnap.docs.map(d => ({ id: d.id, ...d.data() } as BengaliStaff));
        }
        if (hospList.length === 0) {
          const hospSnap = await getDocs(collection(db, COLLECTIONS.hospitals));
          hospList = hospSnap.docs.map(d => ({ id: d.id, ...d.data() } as Hospital));
        }

        setStaffList(docsData.length > 0 ? docsData : SAMPLE_STAFF);
        
        const hospData: Record<string, Hospital> = {};
        hospList.forEach((d: Hospital) => {
          hospData[d.id] = d;
        });
        
        let finalHospitals = { ...hospData };
        if (docsData.length === 0) {
           finalHospitals = { ...SAMPLE_HOSPITALS, ...finalHospitals };
        }
        
        if (Object.keys(finalHospitals).length > 0) {
          setHospitals(finalHospitals);
        } else {
          setHospitals(SAMPLE_HOSPITALS);
        }
      } catch (err) {
        console.error(err);
        setStaffList(SAMPLE_STAFF);
        setHospitals(SAMPLE_HOSPITALS);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  const roles = useMemo(() => Array.from(new Set(staffList.map(s => s.role).filter(Boolean))), [staffList]);
  const allLangs = useMemo(() => {
    const langs = new Set<string>();
    staffList.forEach(s => s.languages?.forEach(l => langs.add(l)));
    return Array.from(langs);
  }, [staffList]);

  const filtered = useMemo(() => {
    return staffList.filter(s => {
      if (roleFilter && s.role !== roleFilter) return false;
      if (langFilter && (!s.languages || !s.languages.includes(langFilter))) return false;
      if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [staffList, roleFilter, langFilter, search]);

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
            <Link href="/" className="hover:text-primary">Home</Link><span>/</span>
            <Link href="/emergency/hospitals" className="hover:text-primary">Hospitals</Link><span>/</span>
            <span className="text-text-primary font-medium">Bengali Staff</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <Link href="/emergency/hospitals" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark mb-4">
                 <ArrowLeft className="w-4 h-4" /> Back to Emergency
              </Link>
              <h1 className="text-3xl sm:text-4xl font-bold font-display text-text-primary flex items-center gap-3">
                <Users className="w-8 h-8 text-primary" />
                Bengali Staff Directory
              </h1>
              <p className="mt-2 text-text-muted">Find and connect with Bengali-speaking support and administrative staff.</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
               <Link href="/emergency/hospitals/bengali-hospitals">
                 <Button variant="outline" className="shadow-sm">View Hospitals <ChevronRight className="w-4 h-4 ml-1"/></Button>
               </Link>
               <Link href="/emergency/hospitals/bengali-doctors">
                 <Button variant="primary" className="shadow-sm bg-primary hover:bg-primary-dark text-white border-none">View Bengali Doctors <ChevronRight className="w-4 h-4 ml-1"/></Button>
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
                placeholder="Search staff name..." 
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-surface/50" 
              />
            </div>
            <select 
              value={roleFilter} 
              onChange={(e) => setRoleFilter(e.target.value)} 
              className="px-4 py-2.5 rounded-xl border border-border text-sm bg-surface/50 min-w-[150px] cursor-pointer"
            >
              <option value="">All Roles</option>
              {roles.map((r) => <option key={r} value={r}>{r}</option>)}
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
        ) : !isVerified ? (
          <div className="max-w-xl mx-auto py-12 text-center">
            <Card className="p-8 rounded-3xl border-border shadow-md bg-white">
              <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5 text-amber-600">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">Staff Directory Locked</h2>
              <p className="text-sm text-text-muted mb-6">
                To protect staff privacy and maintain security, complete a quick OTP verification to unlock hospital staff profiles and contact details.
              </p>
              <Button onClick={() => setShowOtpModal(true)} variant="primary" size="lg" className="w-full font-semibold">
                Verify via OTP to Access Directory
              </Button>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((staff) => {
              const hospital = hospitals[staff.hospital_id];
              return (
                <Card key={staff.id} className="group hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 transition-transform group-hover:scale-110 duration-500" />
                  
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-surface border-2 border-white shadow-md overflow-hidden shrink-0 relative">
                      {staff.photo ? (
                        <img src={staff.photo} alt={staff.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                          <Users className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className="text-lg font-bold text-text-primary leading-tight group-hover:text-primary transition-colors">
                        {staff.name}
                      </h3>
                      <p className="text-primary font-medium text-sm mt-1">{staff.role}</p>
                      
                      {staff.experience && (
                        <div className="flex items-center gap-1 mt-1.5 text-xs text-text-muted font-medium">
                          <Award className="w-3.5 h-3.5 text-amber-500" />
                          {staff.experience} Experience
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
                    
                    {staff.languages && staff.languages.length > 0 && (
                      <div className="flex items-start gap-2.5 text-sm text-text-primary px-1">
                        <Languages className="w-4 h-4 text-text-muted shrink-0 mt-0.5" />
                        <div className="flex flex-wrap gap-1">
                          {staff.languages.map(l => (
                            <span key={l} className="px-2 py-0.5 bg-surface rounded-md text-xs text-text-muted border border-border/50">
                              {l}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-border flex items-center gap-2">
                    <Link href={`/emergency/hospitals/bengali-staff/${staff.id}`} className="flex-1">
                      <Button variant="primary" size="sm" className="w-full">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
        {isVerified && !loading && filtered.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-border mt-8">
            <p className="text-5xl mb-4">👥</p>
            <h3 className="text-xl font-bold mb-2">No staff found</h3>
            <p className="text-text-muted">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      <OtpVerificationModal 
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onSuccess={() => {
          setIsVerified(true);
          setShowOtpModal(false);
          if (typeof window !== 'undefined') {
            localStorage.setItem('directory_verified', 'true');
          }
        }}
      />
    </div>
  );
}
