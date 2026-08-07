'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firestore/collections';
import type { Hospital, BengaliDoctor, BengaliStaff } from '@/types';
import { MapPin, Phone, Globe, Star, Mail, ArrowLeft, Building2, UserRound, CheckCircle2, ChevronRight, AlertTriangle, Users, Clock, PlusSquare, MessageSquare, Ambulance, Search, ShieldAlert, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/lib/auth/AuthContext';
import { OtpVerificationModal } from '@/components/auth/OtpVerificationModal';

const SAMPLE_HOSPITALS: Hospital[] = [
  { id: 'h1', name: 'Apollo Hospital Chennai', city: 'Chennai', area: 'Greams Road', emergency_phone: '1066', phone: '044-28293333', is_24_7: true, has_bengali_doctor: true, main_branch: true, specializations: ['Cardiology', 'Neurology', 'Oncology'], description: 'Leading multi-specialty hospital.', images: ['/images/hospitals/apollo-chennai.jpg'], created_at: '' },
  { id: 'h2', name: 'MGM Healthcare Chennai', city: 'Chennai', area: 'Aminjikarai', emergency_phone: '044-45688888', phone: '044-45688888', is_24_7: true, has_bengali_doctor: true, main_branch: false, specializations: ['Heart Transplant', 'Orthopedics'], description: 'State of the art healthcare.', images: ['/images/hospitals/mgm-healthcare.jpg'], created_at: '' },
  { id: 'h3', name: 'MIOT International Chennai', city: 'Chennai', area: 'Manapakkam', emergency_phone: '105710', phone: '044-22492288', is_24_7: true, has_bengali_doctor: true, main_branch: true, specializations: ['Orthopedics', 'Trauma'], description: 'Pioneers in orthopedic care.', images: ['/images/hospitals/miot-international.jpg'], created_at: '' },
  { id: 'h4', name: 'Fortis Malar Hospital Chennai', city: 'Chennai', area: 'Adyar', emergency_phone: '044-42892222', phone: '044-42892222', is_24_7: true, has_bengali_doctor: true, main_branch: false, specializations: ['Cardiology', 'Gynecology'], description: 'Comprehensive medical care.', images: ['/images/hospitals/fortis-malar.jpg'], created_at: '' },
  { id: 'h5', name: 'SIMS Hospital Chennai', city: 'Chennai', area: 'Vadapalani', emergency_phone: '044-20002001', phone: '044-20002001', is_24_7: true, has_bengali_doctor: true, main_branch: false, specializations: ['Gastroenterology', 'Neurology'], description: 'Expert medical professionals.', images: ['/images/hospitals/sims-hospital.jpg'], created_at: '' }
];

const SAMPLE_DOCTORS: BengaliDoctor[] = [
  { id: 'd1', doctor_name: 'Dr. Anirban Roy', specialization: 'Cardiologist', hospital_id: 'h1', experience: '15 years', languages: ['Bengali', 'English', 'Tamil'], photo: '', phone: '', email: '' },
  { id: 'd2', doctor_name: 'Dr. Saptarshi Chatterjee', specialization: 'Neurologist', hospital_id: 'h2', experience: '12 years', languages: ['Bengali', 'English'], photo: '', phone: '', email: '' },
  { id: 'd3', doctor_name: 'Dr. Debasish Banerjee', specialization: 'Orthopedic Surgeon', hospital_id: 'h3', experience: '20 years', languages: ['Bengali', 'English', 'Hindi'], photo: '', phone: '', email: '' },
  { id: 'd4', doctor_name: 'Dr. Soumya Mukherjee', specialization: 'General Physician', hospital_id: 'h4', experience: '8 years', languages: ['Bengali', 'English', 'Tamil'], photo: '', phone: '', email: '' },
  { id: 'd5', doctor_name: 'Dr. Priyanka Ghosh', specialization: 'Gynecologist', hospital_id: 'h5', experience: '10 years', languages: ['Bengali', 'English'], photo: '', phone: '', email: '' }
];

export default function HospitalDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [doctors, setDoctors] = useState<BengaliDoctor[]>([]);
  const [staff, setStaff] = useState<BengaliStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'doctors' | 'staff'>('doctors');
  const [isVerified, setIsVerified] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [doctorSearch, setDoctorSearch] = useState('');
  const [staffSearch, setStaffSearch] = useState('');

  useEffect(() => {
    setIsVerified(false);
  }, []);

  const canViewDoctors = isVerified;

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      let currentHospital: Hospital | null = null;
      
      try {
        const hRes = await fetch(`/api/public/firestore?collection=hospitals&docId=${id}`);
        if (hRes.ok) {
          const hJson = await hRes.json();
          if (hJson && !hJson.fallback && hJson.id && hJson.name) {
            currentHospital = hJson as Hospital;
          }
        }
      } catch (apiErr) {
        console.warn('Hospital API fetch failed, querying client-side Firestore:', apiErr);
      }

      if (!currentHospital) {
        const docSnap = await getDoc(doc(db, COLLECTIONS.hospitals, id));
        if (docSnap.exists()) {
          currentHospital = { id: docSnap.id, ...docSnap.data() } as Hospital;
        } else {
          currentHospital = SAMPLE_HOSPITALS.find(h => h.id === id) || null;
        }
      }
      setHospital(currentHospital);

      // Load Doctors & Staff
      let dList: BengaliDoctor[] = [];
      let sList: BengaliStaff[] = [];

      try {
        const [dRes, sRes] = await Promise.all([
          fetch(`/api/public/firestore?collection=bengali_doctors&whereField=hospital_id&whereValue=${id}`),
          fetch(`/api/public/firestore?collection=bengali_staff&whereField=hospital_id&whereValue=${id}`)
        ]);

        if (dRes.ok) {
          const dJson = await dRes.json();
          if (!dJson.fallback && Array.isArray(dJson.items)) dList = dJson.items;
        }
        if (sRes.ok) {
          const sJson = await sRes.json();
          if (!sJson.fallback && Array.isArray(sJson.items)) sList = sJson.items;
        }
      } catch (apiErr) {
        console.warn('Doctors/Staff API fetch failed:', apiErr);
      }

      if (dList.length === 0) {
        const dSnap = await getDocs(query(collection(db, COLLECTIONS.bengali_doctors), where('hospital_id', '==', id)));
        dList = dSnap.docs.map(d => ({ id: d.id, ...d.data() } as BengaliDoctor));
        if (dList.length === 0) {
          const dSnapAll = await getDocs(collection(db, COLLECTIONS.bengali_doctors));
          dList = dSnapAll.docs.map(d => ({ id: d.id, ...d.data() } as BengaliDoctor)).filter(d => d.hospital_ids?.includes(id) || d.hospital_id === id);
        }
      }

      if (sList.length === 0) {
        const sSnap = await getDocs(query(collection(db, COLLECTIONS.bengali_staff || 'bengali_staff'), where('hospital_id', '==', id)));
        sList = sSnap.docs.map(d => ({ id: d.id, ...d.data() } as BengaliStaff));
      }

      setDoctors(dList);
      setStaff(sList);
    } catch (e) {
      console.error(e);
      const foundHospital = SAMPLE_HOSPITALS.find(h => h.id === id);
      setHospital(foundHospital || null);
    }
    
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
         <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4 text-center">
         <Building2 className="w-16 h-16 text-text-muted mb-4 opacity-50" />
         <h1 className="text-2xl font-bold text-text-primary mb-2">Hospital Not Found</h1>
         <p className="text-text-muted mb-6">The hospital you are looking for does not exist or has been removed.</p>
         <Link href="/emergency/hospitals">
           <Button variant="primary">Back to Directory</Button>
         </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pb-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-text-muted overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-primary shrink-0">Home</Link><span>/</span>
            <Link href="/emergency" className="hover:text-primary shrink-0">Emergency</Link><span>/</span>
            <Link href="/emergency/hospitals" className="hover:text-primary shrink-0">Hospital Directory</Link><span>/</span>
            <span className="text-text-primary font-medium truncate">{hospital.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/emergency/hospitals" className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-primary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Directory
        </Link>

        {/* 1. Cover Image */}
        <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm mb-8">
          {hospital.images && hospital.images.length > 0 ? (
            <div className="relative">
              <div className="aspect-[21/9] md:aspect-[3/1] w-full bg-black relative">
                <img src={hospital.images[activeImage]} alt={hospital.name} className="w-full h-full object-cover opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>
              <div className="absolute bottom-6 left-6 flex items-end gap-4">
                <div className="w-20 h-20 bg-white p-2 rounded-xl shadow-lg border border-border/50 shrink-0">
                  <Building2 className="w-full h-full text-primary/30" />
                </div>
                <div className="pb-1 text-white">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {hospital.is_24_7 && <Badge variant="red" className="shadow-sm">24/7 Service</Badge>}
                    {hospital.has_bengali_doctor ? (
                      <Badge variant="bengali" className="shadow-sm bg-emerald-100/90 text-emerald-900 border-emerald-200">🗣️ Bengali Doctors: Yes</Badge>
                    ) : (
                      <Badge variant="default" className="shadow-sm bg-black/30 text-white border-white/20">Bengali Doctors: No</Badge>
                    )}
                    {hospital.has_bengali_staff ? (
                      <Badge variant="bengali" className="shadow-sm bg-blue-100/90 text-blue-900 border-blue-200">👥 Bengali Staff: Yes</Badge>
                    ) : (
                      <Badge variant="default" className="shadow-sm bg-black/30 text-white border-white/20">Bengali Staff: No</Badge>
                    )}
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-bold font-display tracking-tight drop-shadow-md">
                    {hospital.name}
                  </h1>
                  <p className="mt-3 text-lg opacity-90 drop-shadow flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="flex items-center gap-1.5"><MapPin className="w-5 h-5"/> {hospital.area}, {hospital.city}</span>
                  </p>
                  
                  {/* SEGREGATED EMERGENCY NUMBER */}
                  {hospital.emergency_phone && (
                    <div className="mt-6 inline-flex items-center gap-3 bg-red-600/90 hover:bg-red-600 backdrop-blur-md px-6 py-3 rounded-2xl border border-red-500 shadow-xl transition-colors cursor-pointer group">
                      <div className="bg-white/20 p-2 rounded-full group-hover:scale-110 transition-transform">
                        <Phone className="w-5 h-5 text-white animate-pulse" />
                      </div>
                      <div>
                        <p className="text-xs text-red-100 font-bold uppercase tracking-wider">Emergency Number</p>
                        <a href={`tel:${hospital.emergency_phone}`} className="text-2xl font-black text-white font-mono tracking-tight">{hospital.emergency_phone}</a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {hospital.main_branch && (
                <div className="absolute top-4 right-4">
                  <Badge variant="verified" className="shadow-lg backdrop-blur-md bg-emerald-100/95 px-3 py-1 text-sm"><Star className="w-4 h-4 mr-1.5 fill-emerald-600"/> Main Branch</Badge>
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-[21/9] md:aspect-[3/1] w-full bg-primary/5 flex flex-col items-center justify-center text-text-muted border-b border-border relative">
              <Building2 className="w-16 h-16 opacity-20 mb-4" />
              <p className="font-medium">No Images Available</p>
              <div className="absolute bottom-6 left-6 text-text-primary">
                <h1 className="text-3xl sm:text-5xl font-bold font-display tracking-tight">{hospital.name}</h1>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            
            <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-bold text-text-primary mb-3">Location & Maps</h2>
                  <div className="flex items-start gap-2 text-text-muted mb-4">
                    <MapPin className="w-5 h-5 shrink-0 mt-0.5 text-primary" />
                    <span>{hospital.address || hospital.area}, {hospital.city}</span>
                  </div>
                  {hospital.google_maps_url && (
                    <a href={hospital.google_maps_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full bg-surface shadow-sm"><MapPin className="w-4 h-4 mr-2" /> Open in Google Maps</Button>
                    </a>
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-text-primary mb-3">Quick Contacts</h2>
                  <div className="space-y-3">
                    {hospital.emergency_phone && (
                      <a href={`tel:${hospital.emergency_phone}`} className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100 hover:bg-red-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="w-5 h-5 text-red-500" />
                          <span className="font-bold text-red-700">Emergency</span>
                        </div>
                        <span className="font-bold text-red-600">{hospital.emergency_phone}</span>
                      </a>
                    )}
                    {hospital.phone && (
                      <a href={`tel:${hospital.phone}`} className="flex items-center justify-between p-3 bg-surface rounded-xl border border-border hover:bg-border/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-text-muted" />
                          <span className="font-semibold text-text-primary">Reception</span>
                        </div>
                        <span className="font-medium text-text-primary">{hospital.phone}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 7. Working Hours & 8. Facilities */}
            <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-primary" /> Working Hours</h2>
                <div className="p-4 bg-surface rounded-xl border border-border">
                  {hospital.is_24_7 ? (
                    <p className="font-bold text-emerald-600 flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Open 24/7 for Emergencies</p>
                  ) : (
                    <p className="font-medium text-text-muted">Standard Working Hours Apply. Contact reception for details.</p>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2"><PlusSquare className="w-5 h-5 text-primary" /> Facilities</h2>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default" className="bg-surface">Blood Bank</Badge>
                  <Badge variant="default" className="bg-surface">ICU</Badge>
                  <Badge variant="default" className="bg-surface">Pharmacy</Badge>
                  <Badge variant="default" className="bg-surface">Ambulance</Badge>
                  <Badge variant="default" className="bg-surface">Cafeteria</Badge>
                </div>
              </div>
            </div>

            {/* 9. Specializations */}
            {(hospital.description || (hospital.specializations && hospital.specializations.length > 0)) && (
              <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm">
                {hospital.description && (
                  <>
                    <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
                      <Building2 className="w-6 h-6 text-primary" /> About Hospital
                    </h2>
                    <div className="prose prose-sm sm:prose-base text-text-muted max-w-none">
                      {hospital.description.split('\\n').map((para, i) => (
                        <p key={i} className="mb-4">{para}</p>
                      ))}
                    </div>
                  </>
                )}
                
                {hospital.specializations && hospital.specializations.length > 0 && (
                  <>
                    <h3 className="text-lg font-bold text-text-primary mt-8 mb-4">Specializations & Services</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {hospital.specializations.map(s => (
                        <div key={s} className="flex items-center gap-2 text-sm text-text-muted bg-surface px-4 py-2.5 rounded-xl border border-border/50">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {s}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* 10. Gallery */}
            {hospital.images && hospital.images.length > 1 && (
              <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm">
                <h2 className="text-xl font-bold text-text-primary mb-4">Gallery</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {hospital.images.map((img, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setActiveImage(idx)}
                      className={`aspect-square rounded-xl border-2 overflow-hidden transition-all ${activeImage === idx ? 'border-primary ring-2 ring-primary/30' : 'border-transparent hover:opacity-80'}`}
                    >
                      <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 11. Doctors & 12. Bengali Staff */}
            <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm">
              <div className="flex border-b border-border bg-surface/50">
                <button
                  onClick={() => setActiveTab('doctors')}
                  className={`flex-1 py-4 text-center font-bold text-sm sm:text-base border-b-2 transition-colors ${activeTab === 'doctors' ? 'border-primary text-primary bg-white' : 'border-transparent text-text-muted hover:text-text-primary hover:bg-white/50'}`}
                >
                  <UserRound className="w-5 h-5 inline-block mr-2" /> Bengali Doctors ({doctors.length})
                </button>
                <button
                  onClick={() => setActiveTab('staff')}
                  className={`flex-1 py-4 text-center font-bold text-sm sm:text-base border-b-2 transition-colors ${activeTab === 'staff' ? 'border-primary text-primary bg-white' : 'border-transparent text-text-muted hover:text-text-primary hover:bg-white/50'}`}
                >
                  <Users className="w-5 h-5 inline-block mr-2" /> Bengali Staff ({staff.length})
                </button>
              </div>

              <div className="p-6 sm:p-8">
                {!isVerified ? (
                  <div className="text-center py-12 px-4 bg-surface rounded-2xl border border-border">
                    <ShieldAlert className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-text-primary mb-2">Verification Required</h3>
                    <p className="text-text-muted mb-6 max-w-md mx-auto">
                      For privacy reasons, doctor and staff details are only visible to verified users. Please verify your phone number and email.
                    </p>
                    <Button onClick={() => setShowOtpModal(true)} variant="primary" className="shadow-md cursor-pointer">
                      Verify Now to View {activeTab === 'doctors' ? 'Doctors' : 'Staff'}
                    </Button>
                  </div>
                ) : (
                  <>
                    {activeTab === 'doctors' ? (
                      <>
                        <div className="mb-6 relative">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                          <input
                            type="text"
                            placeholder="Search doctors by name or specialization..."
                            value={doctorSearch}
                            onChange={e => setDoctorSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-surface border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {doctors.filter(d => 
                             d.doctor_name.toLowerCase().includes(doctorSearch.toLowerCase()) || 
                             d.specialization.toLowerCase().includes(doctorSearch.toLowerCase())
                          ).map(doc => (
                            <Card key={doc.id} className="p-4 hover:shadow-md transition-all">
                              <div className="flex items-start justify-between gap-3">
                                <Link href={`/emergency/hospitals/bengali-doctors/${doc.id}`} className="flex items-start gap-3 flex-1">
                                  <div className="w-14 h-14 rounded-full bg-surface border border-border overflow-hidden shrink-0">
                                    {doc.photo ? <img src={doc.photo} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-primary/30"><UserRound className="w-6 h-6"/></div>}
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-text-primary hover:text-primary transition-colors">{doc.doctor_name}</h4>
                                    <p className="text-sm font-medium text-primary">{doc.specialization}</p>
                                    <p className="text-xs text-text-muted mt-1">{doc.experience || 'Experience N/A'}</p>
                                  </div>
                                </Link>
                                <button onClick={() => {
                                  if (navigator.share) {
                                    navigator.share({
                                      title: `${doc.doctor_name} at ${hospital.name}`,
                                      text: `Check out ${doc.doctor_name} (${doc.specialization}) at ${hospital.name}.`,
                                      url: `${window.location.origin}/emergency/hospitals/bengali-doctors/${doc.id}`,
                                    });
                                  } else {
                                    alert('Sharing not supported on this browser.');
                                  }
                                }} className="p-2 text-text-muted hover:text-primary transition-colors cursor-pointer" title="Share Doctor">
                                  <Share2 className="w-4 h-4" />
                                </button>
                              </div>
                            </Card>
                          ))}
                          {doctors.length === 0 && <p className="text-text-muted col-span-2 py-4">No Bengali doctors listed yet.</p>}
                          {doctors.length > 0 && doctors.filter(d => 
                             d.doctor_name.toLowerCase().includes(doctorSearch.toLowerCase()) || 
                             d.specialization.toLowerCase().includes(doctorSearch.toLowerCase())
                          ).length === 0 && <p className="text-text-muted col-span-2 py-4">No doctors match your search.</p>}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="mb-6 relative">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                          <input
                            type="text"
                            placeholder="Search staff by name or role..."
                            value={staffSearch}
                            onChange={e => setStaffSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-surface border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {staff.filter(member => 
                            member.name.toLowerCase().includes(staffSearch.toLowerCase()) || 
                            (member.role && member.role.toLowerCase().includes(staffSearch.toLowerCase()))
                          ).map(member => (
                            <Card key={member.id} className="p-4 hover:shadow-md transition-all">
                              <div className="flex items-start justify-between gap-3">
                                <Link href={`/emergency/hospitals/bengali-staff/${member.id}`} className="flex items-start gap-3 flex-1">
                                  <div className="w-14 h-14 rounded-xl bg-surface border border-border overflow-hidden shrink-0">
                                    {member.photo ? <img src={member.photo} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-primary/30"><Users className="w-6 h-6"/></div>}
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-text-primary hover:text-primary transition-colors">{member.name}</h4>
                                    <p className="text-sm font-medium text-primary">{member.role}</p>
                                    <p className="text-xs text-text-muted mt-1">{member.department || 'Department N/A'}</p>
                                  </div>
                                </Link>
                                <button onClick={() => {
                                  if (navigator.share) {
                                    navigator.share({
                                      title: `${member.name} at ${hospital.name}`,
                                      text: `Check out ${member.name} (${member.role}) at ${hospital.name}.`,
                                      url: `${window.location.origin}/emergency/hospitals/bengali-staff/${member.id}`,
                                    });
                                  } else {
                                    alert('Sharing not supported on this browser.');
                                  }
                                }} className="p-2 text-text-muted hover:text-primary transition-colors cursor-pointer" title="Share Staff">
                                  <Share2 className="w-4 h-4" />
                                </button>
                              </div>
                            </Card>
                          ))}
                          {staff.length === 0 && <p className="text-text-muted col-span-2 py-4">No Bengali staff listed yet.</p>}
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

          </div>

          <div className="space-y-6">
            {/* Related Hospitals Placeholder */}
            <Card className="p-6 bg-surface/50 border-dashed">
              <h3 className="text-lg font-bold text-text-primary mb-2 flex items-center gap-2"><Building2 className="w-5 h-5 text-text-muted"/> Related Hospitals</h3>
              <p className="text-sm text-text-muted mb-4">Other hospitals in {hospital.city} you might consider.</p>
              <div className="space-y-3">
                {[1,2,3].map(i => (
                  <div key={i} className="h-16 bg-white border border-border rounded-xl opacity-50 flex items-center justify-center text-xs font-semibold text-text-muted">Hospital Placeholder</div>
                ))}
              </div>
            </Card>
            
            {/* Reviews Placeholder */}
            <Card className="p-6 bg-surface/50 border-dashed">
              <h3 className="text-lg font-bold text-text-primary mb-2 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-text-muted"/> Reviews</h3>
              <p className="text-sm text-text-muted mb-4">Patient feedback and ratings.</p>
              <div className="h-20 bg-white border border-border rounded-xl opacity-50 flex items-center justify-center text-xs font-semibold text-text-muted">Review Placeholder</div>
            </Card>
            
            {/* Nearby Pharmacies Placeholder */}
            <Card className="p-6 bg-surface/50 border-dashed">
              <h3 className="text-lg font-bold text-text-primary mb-2 flex items-center gap-2"><PlusSquare className="w-5 h-5 text-text-muted"/> Nearby Pharmacies</h3>
              <p className="text-sm text-text-muted mb-4">Pharmacies near this location.</p>
              <div className="h-16 bg-white border border-border rounded-xl opacity-50 flex items-center justify-center text-xs font-semibold text-text-muted">Pharmacy Placeholder</div>
            </Card>

            {/* Nearby Ambulance Services Placeholder */}
            <Card className="p-6 bg-surface/50 border-dashed">
              <h3 className="text-lg font-bold text-text-primary mb-2 flex items-center gap-2"><Ambulance className="w-5 h-5 text-text-muted"/> Nearby Ambulance</h3>
              <p className="text-sm text-text-muted mb-4">Emergency transport services.</p>
              <div className="h-16 bg-white border border-border rounded-xl opacity-50 flex items-center justify-center text-xs font-semibold text-text-muted">Ambulance Placeholder</div>
            </Card>
          </div>
        </div>
      </div>

      <OtpVerificationModal 
        isOpen={showOtpModal} 
        onClose={() => setShowOtpModal(false)} 
        onSuccess={() => {
          setIsVerified(true);
          setShowOtpModal(false);
        }} 
      />
    </div>
  );
}
