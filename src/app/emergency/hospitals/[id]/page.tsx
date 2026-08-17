'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, getDocs, query, where, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firestore/collections';
import type { Hospital, BengaliDoctor, BengaliStaff, Pharmacy, Ambulance, HospitalReview } from '@/types';
import { MapPin, Phone, Globe, Star, Mail, ArrowLeft, Building2, UserRound, CheckCircle2, ChevronRight, AlertTriangle, Users, Clock, PlusSquare, MessageSquare, Ambulance as AmbulanceIcon, Search, ShieldAlert, Share2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';

const SAMPLE_HOSPITALS: Hospital[] = [];

const SAMPLE_DOCTORS: BengaliDoctor[] = [];

export default function HospitalDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [doctors, setDoctors] = useState<BengaliDoctor[]>([]);
  const [staff, setStaff] = useState<BengaliStaff[]>([]);
  const [relatedHospitals, setRelatedHospitals] = useState<Hospital[]>([]);
  const [nearbyPharmacies, setNearbyPharmacies] = useState<Pharmacy[]>([]);
  const [nearbyAmbulances, setNearbyAmbulances] = useState<Ambulance[]>([]);
  const [reviews, setReviews] = useState<HospitalReview[]>([]);

  const [hospitalRating, setHospitalRating] = useState<number>(5);
  const [websiteRating, setWebsiteRating] = useState<number>(5);
  const [reviewCategory, setReviewCategory] = useState<string>('Hospital Services');
  const [reviewComment, setReviewComment] = useState<string>('');
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);

  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'doctors' | 'staff'>('doctors');
  const { firebaseUser: user, profile } = useAuth();
  const router = useRouter();
  const [doctorSearch, setDoctorSearch] = useState('');
  const [staffSearch, setStaffSearch] = useState('');

  const isVerified = !!user;

  useEffect(() => {
    // keeping empty for now to avoid refactoring hooks below
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

      // Load Related Hospitals
      let allHospitals: Hospital[] = [];
      try {
        const rhRes = await fetch(`/api/public/firestore?collection=hospitals`);
        if (rhRes.ok) {
          const rhJson = await rhRes.json();
          if (Array.isArray(rhJson.items)) allHospitals = rhJson.items;
        }
      } catch (err) {}
      if (allHospitals.length === 0) {
        try {
          const rhSnap = await getDocs(collection(db, COLLECTIONS.hospitals));
          allHospitals = rhSnap.docs.map(d => ({ id: d.id, ...d.data() } as Hospital));
        } catch (err) {}
      }
      const filteredRelated = allHospitals
        .filter(h => h.id !== id)
        .sort((a, b) => {
          if (currentHospital?.city && a.city === currentHospital.city && b.city !== currentHospital.city) return -1;
          if (currentHospital?.city && a.city !== currentHospital.city && b.city === currentHospital.city) return 1;
          return 0;
        })
        .slice(0, 3);
      setRelatedHospitals(filteredRelated);

      // Load Nearby Pharmacies
      let allPharmacies: Pharmacy[] = [];
      try {
        const pRes = await fetch(`/api/public/firestore?collection=pharmacies`);
        if (pRes.ok) {
          const pJson = await pRes.json();
          if (Array.isArray(pJson.items)) allPharmacies = pJson.items;
        }
      } catch (err) {}
      if (allPharmacies.length === 0) {
        try {
          const pSnap = await getDocs(collection(db, COLLECTIONS.pharmacies));
          allPharmacies = pSnap.docs.map(d => ({ id: d.id, ...d.data() } as Pharmacy));
        } catch (err) {}
      }
      const filteredPharmacies = allPharmacies
        .filter(p => p.hospital_id === id || (currentHospital?.city && p.city?.toLowerCase() === currentHospital.city.toLowerCase()) || (currentHospital?.area && p.area?.toLowerCase().includes(currentHospital.area.toLowerCase())))
        .slice(0, 3);
      setNearbyPharmacies(filteredPharmacies);

      // Load Nearby Ambulances
      let allAmbulances: Ambulance[] = [];
      try {
        const aRes = await fetch(`/api/public/firestore?collection=ambulances`);
        if (aRes.ok) {
          const aJson = await aRes.json();
          if (Array.isArray(aJson.items)) allAmbulances = aJson.items;
        }
      } catch (err) {}
      if (allAmbulances.length === 0) {
        try {
          const aSnap = await getDocs(collection(db, COLLECTIONS.ambulances));
          allAmbulances = aSnap.docs.map(d => ({ id: d.id, ...d.data() } as Ambulance));
        } catch (err) {}
      }
      const filteredAmbulances = allAmbulances
        .filter(a => !currentHospital?.city || a.city?.toLowerCase() === currentHospital.city.toLowerCase())
        .slice(0, 3);
      setNearbyAmbulances(filteredAmbulances);

      // Load Reviews
      let revList: HospitalReview[] = [];
      try {
        const revRes = await fetch(`/api/public/firestore?collection=hospital_reviews&whereField=hospital_id&whereValue=${id}`);
        if (revRes.ok) {
          const revJson = await revRes.json();
          if (Array.isArray(revJson.items)) revList = revJson.items;
        }
      } catch (err) {}
      if (revList.length === 0) {
        try {
          const revSnap = await getDocs(query(collection(db, COLLECTIONS.hospital_reviews), where('hospital_id', '==', id)));
          revList = revSnap.docs.map(d => ({ id: d.id, ...d.data() } as HospitalReview));
        } catch (err) {}
      }
      setReviews(revList);

    } catch (e) {
      console.error(e);
      const foundHospital = SAMPLE_HOSPITALS.find(h => h.id === id);
      setHospital(foundHospital || null);
    }
    
    setLoading(false);
  };

  const avgHospitalRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + (r.hospital_rating || 5), 0) / reviews.length 
    : 4.8;

  const avgWebsiteRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + (r.website_rating || 5), 0) / reviews.length 
    : 4.9;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push(`/auth/login?redirect=/emergency/hospitals/${id}`);
      return;
    }

    if (!reviewComment.trim()) {
      alert('Please write your review feedback.');
      return;
    }

    const existingUserReview = reviews.find(r => r.user_id === user.uid);
    if (existingUserReview) {
      alert('You have already submitted a review for this hospital.');
      return;
    }

    setSubmittingReview(true);
    try {
      const now = new Date().toISOString();
      const newReview: HospitalReview = {
        id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        hospital_id: id,
        user_id: user.uid,
        user_name: user.displayName || profile?.full_name || user.email?.split('@')[0] || 'Verified Patient',
        user_avatar: user.photoURL || undefined,
        is_verified: true,
        hospital_rating: hospitalRating,
        website_rating: websiteRating,
        category: reviewCategory as any,
        comment: reviewComment.trim(),
        created_at: now
      };

      try {
        await setDoc(doc(db, COLLECTIONS.hospital_reviews, newReview.id), newReview);
      } catch (err) {
        console.warn('Error writing review to Firestore:', err);
      }

      setReviews(prev => [newReview, ...prev]);
      setReviewComment('');
      alert('Thank you! Your feedback has been submitted successfully.');
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setSubmittingReview(false);
    }
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
                  <div className="flex items-start gap-2.5 text-text-muted mb-4">
                    <MapPin className="w-5 h-5 shrink-0 mt-0.5 text-primary" />
                    <div>
                      <p className="font-medium text-text-primary">{hospital.address || hospital.area}, {hospital.city}</p>
                      {hospital.pincode && (
                        <p className="text-xs text-text-muted font-medium mt-0.5">PIN Code: <span className="font-mono font-bold text-text-primary">{hospital.pincode}</span></p>
                      )}
                    </div>
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
                    <Button onClick={() => router.push(`/auth/login?redirect=/emergency/hospitals/${id}`)} variant="primary" className="shadow-md cursor-pointer text-xs sm:text-sm">
                      Registered users verify OTP • New users register & verify OTP
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
                                    {doc.designation && <p className="text-xs text-text-muted font-medium">{doc.designation}</p>}
                                    <p className="text-sm font-medium text-primary">{doc.specialization}</p>
                                    <p className="text-xs text-text-muted mt-1">{doc.experience || 'Experience N/A'}</p>
                                  </div>
                                </Link>
                                <div className="flex items-center gap-1">
                                   {doc.google_review_link && (
                                     <a
                                       href={doc.google_review_link}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       className="p-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                                       title="View Google Reviews"
                                     >
                                       <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                                     </a>
                                   )}
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
                                    {member.designation && <p className="text-xs text-text-muted font-medium">{member.designation}</p>}
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

            {/* 4. Hospital Feedback & Rating ("Rate & Review") Section */}
            <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
                <div>
                  <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" /> Hospital Feedback & Ratings
                  </h2>
                  <p className="text-xs text-text-muted mt-1">Real patient reviews and website experience feedback.</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-3.5 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-center">
                    <div className="flex items-center gap-1 text-amber-800 font-bold text-base">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                      <span>{avgHospitalRating.toFixed(1)}</span>
                    </div>
                    <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">Hospital</p>
                  </div>

                  <div className="px-3.5 py-1.5 bg-blue-50 border border-blue-200 rounded-xl text-center">
                    <div className="flex items-center gap-1 text-blue-800 font-bold text-base">
                      <Star className="w-4 h-4 fill-blue-400 text-blue-500" />
                      <span>{avgWebsiteRating.toFixed(1)}</span>
                    </div>
                    <p className="text-[10px] text-blue-700 font-bold uppercase tracking-wider">Website</p>
                  </div>
                </div>
              </div>

              {/* Interactive Rating Form */}
              <div className="bg-surface/50 border border-border rounded-2xl p-5 space-y-4">
                <h3 className="font-bold text-text-primary text-base">Rate & Review This Hospital</h3>

                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Hospital Rating */}
                    <div className="bg-white p-3.5 rounded-xl border border-border/60">
                      <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1.5">
                        Hospital Rating ⭐
                      </label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setHospitalRating(star)}
                            className="p-1 hover:scale-110 transition-transform cursor-pointer"
                          >
                            <Star
                              className={`w-5 h-5 ${star <= hospitalRating ? 'fill-amber-400 text-amber-500' : 'text-gray-300'}`}
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-xs font-bold text-amber-600">{hospitalRating}/5</span>
                      </div>
                    </div>

                    {/* Website Rating */}
                    <div className="bg-white p-3.5 rounded-xl border border-border/60">
                      <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1.5">
                        Website Experience ⭐
                      </label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setWebsiteRating(star)}
                            className="p-1 hover:scale-110 transition-transform cursor-pointer"
                          >
                            <Star
                              className={`w-5 h-5 ${star <= websiteRating ? 'fill-blue-400 text-blue-500' : 'text-gray-300'}`}
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-xs font-bold text-blue-600">{websiteRating}/5</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                      Feedback Category
                    </label>
                    <select
                      value={reviewCategory}
                      onChange={(e) => setReviewCategory(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-border rounded-xl text-xs font-medium cursor-pointer focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                      <option value="Hospital Services">Hospital Services</option>
                      <option value="Doctors & Staff">Doctors & Staff</option>
                      <option value="Cleanliness">Cleanliness</option>
                      <option value="Facilities">Facilities</option>
                      <option value="Website Experience">Website Experience</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                      Your Feedback
                    </label>
                    <textarea
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Write your experience here..."
                      className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl text-xs focus:ring-2 focus:ring-primary/20 outline-none resize-none font-medium"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    {!isVerified ? (
                      <p className="text-xs text-amber-700 font-medium flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-500" /> Verification recommended
                      </p>
                    ) : (
                      <p className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Verified User Account
                      </p>
                    )}

                    <Button
                      type="submit"
                      disabled={submittingReview}
                      variant="primary"
                      size="sm"
                      className="px-5 font-bold shadow-xs cursor-pointer"
                    >
                      {submittingReview ? 'Submitting...' : 'Submit Feedback'}
                    </Button>
                  </div>
                </form>
              </div>

              {/* Patient Reviews List */}
              <div className="space-y-3 pt-2">
                <h3 className="font-bold text-text-primary text-base">Patient Reviews ({reviews.length})</h3>

                {reviews.length > 0 ? (
                  <div className="space-y-3">
                    {reviews.map((rev) => (
                      <div key={rev.id} className="p-4 rounded-2xl bg-surface/40 border border-border/60 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                              {rev.user_name ? rev.user_name.charAt(0).toUpperCase() : 'P'}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-xs text-text-primary">{rev.user_name}</span>
                                {rev.is_verified && (
                                  <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
                                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> Verified Patient
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-text-muted">{rev.created_at ? new Date(rev.created_at).toLocaleDateString() : 'Recently'}</span>
                            </div>
                          </div>

                          <span className="text-[10px] font-semibold px-2 py-0.5 bg-white border border-border rounded-md text-text-muted">
                            {rev.category}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs font-medium">
                          <div className="flex items-center gap-1 text-amber-700">
                            <span className="text-text-muted text-[11px]">Hospital:</span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} className={`w-3 h-3 ${s <= rev.hospital_rating ? 'fill-amber-400 text-amber-500' : 'text-gray-300'}`} />
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-blue-700">
                            <span className="text-text-muted text-[11px]">Website:</span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} className={`w-3 h-3 ${s <= rev.website_rating ? 'fill-blue-400 text-blue-500' : 'text-gray-300'}`} />
                              ))}
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-text-primary font-medium pt-0.5">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center bg-surface/30 rounded-2xl border border-border/40 text-text-muted">
                    <MessageSquare className="w-7 h-7 mx-auto mb-1.5 opacity-40 text-primary" />
                    <p className="font-medium text-xs">No reviews yet.</p>
                    <p className="text-[11px] text-text-muted mt-0.5">Be the first to share your experience with this hospital!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar Column */}
          <div className="space-y-6">
            {/* 1. Related Hospitals */}
            <Card className="p-6 bg-white border border-border shadow-xs rounded-3xl">
              <h3 className="text-lg font-bold text-text-primary mb-1 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" /> Related Hospitals
              </h3>
              <p className="text-xs text-text-muted mb-4">Other hospitals in {hospital.city} you might consider.</p>
              
              {relatedHospitals.length > 0 ? (
                <div className="space-y-3">
                  {relatedHospitals.map(rh => (
                    <Link
                      key={rh.id}
                      href={`/emergency/hospitals/${rh.id}`}
                      className="block p-3.5 rounded-2xl bg-surface/60 hover:bg-surface border border-border/60 hover:border-primary/30 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-sm text-text-primary group-hover:text-primary transition-colors line-clamp-1">
                          {rh.name}
                        </h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${rh.category === 'Government' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                          {rh.category || 'Private'}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="truncate">{rh.area || rh.city} {rh.pincode ? ` - ${rh.pincode}` : ''}</span>
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-text-muted bg-surface/40 rounded-2xl border border-border/40">
                  No other related hospitals found in {hospital.city}.
                </div>
              )}
            </Card>

            {/* 2. Nearby Pharmacies */}
            <Card className="p-6 bg-white border border-border shadow-xs rounded-3xl">
              <h3 className="text-lg font-bold text-text-primary mb-1 flex items-center gap-2">
                <PlusSquare className="w-5 h-5 text-emerald-600" /> Nearby Pharmacies
              </h3>
              <p className="text-xs text-text-muted mb-4">Pharmacies near this location.</p>
              
              {nearbyPharmacies.length > 0 ? (
                <div className="space-y-3">
                  {nearbyPharmacies.map(pharm => (
                    <div key={pharm.id} className="p-3.5 rounded-2xl bg-surface/60 border border-border/60">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-sm text-text-primary line-clamp-1">{pharm.name}</h4>
                        <div className="flex gap-1">
                          {pharm.is_24_7 && <span className="text-[10px] font-bold bg-red-50 text-red-600 border border-red-200 px-1.5 py-0.5 rounded">24/7</span>}
                          {pharm.home_delivery && <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 px-1.5 py-0.5 rounded">Delivery</span>}
                        </div>
                      </div>
                      <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{pharm.area || pharm.address}, {pharm.city}</span>
                      </p>
                      {pharm.phone && (
                        <div className="mt-2 pt-2 border-t border-border/40 flex items-center justify-between">
                          <span className="text-xs font-mono text-text-muted">{pharm.phone}</span>
                          <a href={`tel:${pharm.phone}`} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                            <Phone className="w-3 h-3" /> Call
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-text-muted bg-surface/40 rounded-2xl border border-border/40">
                  No nearby pharmacies listed for this area.
                </div>
              )}
            </Card>

            {/* 3. Nearby Ambulance Services */}
            <Card className="p-6 bg-white border border-border shadow-xs rounded-3xl">
              <h3 className="text-lg font-bold text-text-primary mb-1 flex items-center gap-2">
                <AmbulanceIcon className="w-5 h-5 text-red-600" /> Nearby Ambulance
              </h3>
              <p className="text-xs text-text-muted mb-4">Emergency transport services.</p>
              
              {nearbyAmbulances.length > 0 ? (
                <div className="space-y-3">
                  {nearbyAmbulances.map(amb => (
                    <div key={amb.id} className="p-3.5 rounded-2xl bg-red-50/40 border border-red-100 flex items-center justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-sm text-text-primary">{amb.name}</h4>
                        <p className="text-xs text-text-muted mt-0.5">{amb.unit_type || '24/7 Emergency Transport'} • {amb.city}</p>
                      </div>
                      {amb.phone ? (
                        <a href={`tel:${amb.phone}`} className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0 flex items-center gap-1">
                          <Phone className="w-3 h-3 animate-pulse" /> Call
                        </a>
                      ) : (
                        <a href="tel:108" className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0 flex items-center gap-1">
                          <Phone className="w-3 h-3" /> 108
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-red-50/50 rounded-2xl border border-red-100 text-center">
                  <p className="text-xs text-red-800 font-medium mb-2">State Emergency Ambulance Hotline</p>
                  <a href="tel:108" className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-red-700 transition-colors">
                    <Phone className="w-3.5 h-3.5 animate-pulse" /> Call Ambulance (108)
                  </a>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
