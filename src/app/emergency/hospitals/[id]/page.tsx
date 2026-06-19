'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firestore/collections';
import type { Hospital, BengaliDoctor } from '@/types';
import { MapPin, Phone, Globe, Star, Mail, ArrowLeft, Building2, UserRound, CheckCircle2, ChevronRight, AlertTriangle } from 'lucide-react';
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

const SAMPLE_DOCTORS: BengaliDoctor[] = [
  { id: 'd1', doctor_name: 'Dr. Anirban Roy', specialization: 'Cardiologist', hospital_id: 'h1', experience: '15 years', languages: ['Bengali', 'English', 'Tamil'], photo: '', phone: '', email: '' },
  { id: 'd2', doctor_name: 'Dr. Saptarshi Chatterjee', specialization: 'Neurologist', hospital_id: 'h2', experience: '12 years', languages: ['Bengali', 'English'], photo: '', phone: '', email: '' },
  { id: 'd3', doctor_name: 'Dr. Debasish Banerjee', specialization: 'Orthopedic Surgeon', hospital_id: 'h3', experience: '20 years', languages: ['Bengali', 'English', 'Hindi'], photo: '', phone: '', email: '' },
  { id: 'd4', doctor_name: 'Dr. Soumya Mukherjee', specialization: 'General Physician', hospital_id: 'h4', experience: '8 years', languages: ['Bengali', 'English', 'Tamil'], photo: '', phone: '', email: '' },
  { id: 'd5', doctor_name: 'Dr. Priyanka Ghosh', specialization: 'Gynecologist', hospital_id: 'h5', experience: '10 years', languages: ['Bengali', 'English'], photo: '', phone: '', email: '' }
];

export default function HospitalDetailsPage({ params }: { params: { id: string } }) {
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [doctors, setDoctors] = useState<BengaliDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    loadData();
  }, [params.id]);

  async function loadData() {
    const foundHospital = SAMPLE_HOSPITALS.find(h => h.id === params.id) || sampleHospitals.find(h => h.id === params.id) as Hospital;
    setHospital(foundHospital || null);
    
    const foundDoctors = SAMPLE_DOCTORS.filter(d => d.hospital_id === params.id);
    setDoctors(foundDoctors);
    
    setLoading(false);
  }

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
            <Link href="/emergency/hospitals" className="hover:text-primary shrink-0">Hospitals</Link><span>/</span>
            <span className="text-text-primary font-medium truncate">{hospital.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/emergency/hospitals" className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-primary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Hospitals
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header & Gallery */}
            <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm">
              {hospital.images && hospital.images.length > 0 ? (
                <div className="relative">
                  <div className="aspect-video w-full bg-black relative">
                    <img src={hospital.images[activeImage]} alt={hospital.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                  {hospital.images.length > 1 && (
                    <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                      {hospital.images.map((img, idx) => (
                        <button 
                          key={idx} 
                          onClick={() => setActiveImage(idx)}
                          className={`w-16 h-12 rounded-lg border-2 overflow-hidden shrink-0 transition-all ${activeImage === idx ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'}`}
                        >
                          <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                  {hospital.main_branch && (
                    <div className="absolute top-4 left-4">
                      <Badge variant="verified" className="shadow-lg backdrop-blur-md bg-emerald-100/95 px-3 py-1 text-sm"><Star className="w-4 h-4 mr-1.5 fill-emerald-600"/> Main Branch</Badge>
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-video w-full bg-primary/5 flex flex-col items-center justify-center text-text-muted border-b border-border">
                  <Building2 className="w-16 h-16 opacity-20 mb-4" />
                  <p className="font-medium">No Images Available</p>
                </div>
              )}
              
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap gap-2 mb-3">
                  {hospital.is_24_7 && <Badge variant="red">24/7 Service</Badge>}
                  {hospital.has_bengali_doctor && <Badge variant="bengali">🗣️ Bengali Support</Badge>}
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold font-display text-text-primary mb-3">
                  {hospital.name}
                </h1>
                <div className="flex items-start gap-2 text-text-muted text-lg mb-6">
                  <MapPin className="w-5 h-5 shrink-0 mt-0.5 text-primary" />
                  <span>{hospital.address || hospital.area}, {hospital.city}</span>
                </div>

                <div className="flex flex-wrap gap-3">
                  {hospital.emergency_phone && (
                    <a href={`tel:${hospital.emergency_phone}`}>
                      <Button variant="danger" className="shadow-md animate-pulse-glow"><Phone className="w-4 h-4 mr-2" /> Emergency: {hospital.emergency_phone}</Button>
                    </a>
                  )}
                  {hospital.phone && !hospital.emergency_phone && (
                    <a href={`tel:${hospital.phone}`}>
                      <Button variant="primary" className="shadow-md"><Phone className="w-4 h-4 mr-2" /> Call Hospital</Button>
                    </a>
                  )}
                  {hospital.google_maps_url && (
                    <a href={hospital.google_maps_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="bg-surface"><MapPin className="w-4 h-4 mr-2" /> Get Directions</Button>
                    </a>
                  )}
                  {hospital.website && (
                    <a href={hospital.website} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost"><Globe className="w-4 h-4 mr-2" /> Visit Website</Button>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* About Section */}
            {(hospital.description || (hospital.specializations && hospital.specializations.length > 0)) && (
              <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm">
                {hospital.description && (
                  <>
                    <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
                      <Building2 className="w-6 h-6 text-primary" /> About Hospital
                    </h2>
                    <div className="prose prose-sm sm:prose-base text-text-muted max-w-none">
                      {hospital.description.split('\n').map((para, i) => (
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info Card */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-text-primary mb-4 border-b border-border pb-3">Contact Information</h3>
              <div className="space-y-4">
                {hospital.emergency_phone && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0 text-red-500">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-0.5">Emergency</p>
                      <p className="text-sm font-bold text-red-600">{hospital.emergency_phone}</p>
                    </div>
                  </div>
                )}
                {hospital.phone && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-0.5">Reception</p>
                      <p className="text-sm font-medium text-text-primary">{hospital.phone}</p>
                    </div>
                  </div>
                )}
                {hospital.email && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-0.5">Email</p>
                      <p className="text-sm font-medium text-text-primary truncate">{hospital.email}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-0.5">Location</p>
                    <p className="text-sm font-medium text-text-primary">{hospital.city}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Associated Doctors */}
            <Card className="p-6">
              <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <UserRound className="w-5 h-5 text-primary" /> Bengali Doctors
                </h3>
                <Badge variant="bengali" className="font-bold">{doctors.length}</Badge>
              </div>
              
              {doctors.length > 0 ? (
                <div className="space-y-4">
                  {doctors.map(doc => (
                    <div key={doc.id} className="flex items-start gap-3 p-3 bg-surface rounded-xl border border-border hover:border-primary/30 transition-colors">
                       <img src={doc.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.doctor_name)}&background=random`} alt={doc.doctor_name} className="w-12 h-12 rounded-full object-cover border border-border shadow-sm" />
                       <div className="flex-1 min-w-0">
                         <h4 className="text-sm font-bold text-text-primary truncate">{doc.doctor_name}</h4>
                         <p className="text-xs font-medium text-primary truncate mb-1">{doc.specialization}</p>
                         <div className="flex flex-wrap gap-1">
                           {doc.languages?.map(l => (
                             <span key={l} className="text-[10px] px-1.5 py-0.5 bg-white border border-border rounded text-text-muted">{l}</span>
                           ))}
                         </div>
                       </div>
                    </div>
                  ))}
                  <Link href="/emergency/hospitals/bengali-doctors" className="block text-center text-sm font-bold text-primary hover:text-primary-dark mt-2 transition-colors">
                    View all doctors <ChevronRight className="w-4 h-4 inline" />
                  </Link>
                </div>
              ) : (
                <div className="text-center py-6">
                  <UserRound className="w-8 h-8 text-text-muted opacity-50 mx-auto mb-2" />
                  <p className="text-sm text-text-muted">No Bengali doctors currently listed for this hospital.</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
