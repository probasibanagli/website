'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firestore/collections';
import type { BengaliStaff, Hospital } from '@/types';
import { Phone, Mail, ArrowLeft, Building2, Users, Award, Languages, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/lib/auth/AuthContext';
import { OtpVerificationModal } from '@/components/auth/OtpVerificationModal';

export default function StaffDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;
  
  const [staff, setStaff] = useState<BengaliStaff | null>(null);
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { firebaseUser: user } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (user) {
      setIsVerified(true);
    }
  }, [user]);

  useEffect(() => {
    async function loadStaffAndCheckOtp() {
      try {
        let d: BengaliStaff | null = null;
        try {
          const sRes = await fetch(`/api/public/firestore?collection=bengali_staff&docId=${id}`);
          if (sRes.ok) {
            const sJson = await sRes.json();
            if (sJson && !sJson.fallback && sJson.id && sJson.name) {
              d = sJson as BengaliStaff;
            }
          }
        } catch (apiErr) {
          console.warn("Staff API fetch failed, querying client-side Firestore:", apiErr);
        }

        if (!d) {
          const docSnap = await getDoc(doc(db, COLLECTIONS.bengali_staff || 'bengali_staff', id));
          if (docSnap.exists()) {
            d = { id: docSnap.id, ...docSnap.data() } as BengaliStaff;
          }
        }

        if (d) {
          setStaff(d);
          
          // Fetch hospital
          if (d.hospital_id) {
            let h: Hospital | null = null;
            try {
              const hRes = await fetch(`/api/public/firestore?collection=hospitals&docId=${d.hospital_id}`);
              if (hRes.ok) {
                const hJson = await hRes.json();
                if (hJson && !hJson.fallback && hJson.id) {
                  h = hJson as Hospital;
                }
              }
            } catch (err) {}

            if (!h) {
              const hSnap = await getDoc(doc(db, COLLECTIONS.hospitals, d.hospital_id));
              if (hSnap.exists()) {
                h = { id: hSnap.id, ...hSnap.data() } as Hospital;
              }
            }
            setHospital(h);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadStaffAndCheckOtp();
  }, [id, router]);

  const isOtpVerified = typeof window !== 'undefined' && localStorage.getItem('directory_verified') === 'true';
  const canViewContact = !!user && isOtpVerified;

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
         <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4 text-center">
         <Users className="w-16 h-16 text-text-muted mb-4 opacity-50" />
         <h1 className="text-2xl font-bold text-text-primary mb-2">Staff Not Found</h1>
         <p className="text-text-muted mb-6">The staff profile you are looking for does not exist or has been removed.</p>
         <Link href="/emergency/hospitals/bengali-staff">
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
            <Link href="/emergency/hospitals/bengali-staff" className="hover:text-primary shrink-0">Bengali Staff</Link><span>/</span>
            <span className="text-text-primary font-medium truncate">{staff.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/emergency/hospitals/bengali-staff" className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-primary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Directory
        </Link>

        {/* Profile Card */}
        <Card className="overflow-hidden border-border bg-white shadow-sm">
          <div className="h-32 bg-primary/5 relative">
            <div className="absolute -bottom-16 left-8">
              <div className="w-32 h-32 rounded-2xl bg-white p-1.5 shadow-lg border border-border">
                {staff.photo ? (
                  <img src={staff.photo} alt={staff.name} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <div className="w-full h-full bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <Users className="w-12 h-12" />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="pt-20 px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-text-primary">{staff.name}</h1>
                <p className="text-primary font-medium text-lg mt-1">{staff.role}</p>
                <p className="text-text-muted mt-1">{staff.department}</p>
                
                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-text-muted">
                  {staff.experience && (
                    <div className="flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span className="font-medium text-text-primary">{staff.experience} Experience</span>
                    </div>
                  )}
                  {staff.languages && staff.languages.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Languages className="w-4 h-4" />
                      <span>{staff.languages.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {staff.description && (
              <div className="mt-8 pt-8 border-t border-border">
                <h3 className="font-semibold text-text-primary mb-3">About</h3>
                <p className="text-text-muted leading-relaxed">{staff.description}</p>
              </div>
            )}

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hospital Affiliation */}
              <div className="p-5 rounded-2xl bg-surface/50 border border-border/50">
                <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" /> Associated Hospital
                </h3>
                {hospital ? (
                  <Link href={`/emergency/hospitals/${hospital.id}`} className="block group">
                    <p className="font-bold text-text-primary group-hover:text-primary transition-colors">{hospital.name}</p>
                    <p className="text-sm text-text-muted mt-1">{hospital.city} • {hospital.area}</p>
                  </Link>
                ) : (
                  <p className="text-sm text-text-muted">Hospital information not available.</p>
                )}
                
                {staff.availability && (
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <p className="text-xs text-text-muted mb-1">Availability</p>
                    <p className="font-medium text-text-primary">{staff.availability}</p>
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div className="p-5 rounded-2xl bg-surface/50 border border-border/50">
                <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" /> Contact Details
                </h3>
                
                {canViewContact ? (
                  <div className="space-y-3">
                    {staff.phone && (
                      <div className="flex items-center justify-between text-sm p-3 bg-white rounded-xl border border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Phone className="w-4 h-4 text-primary" />
                          </div>
                          <span className="font-bold text-text-primary">{staff.phone}</span>
                        </div>
                        <a href={`tel:${staff.phone}`} className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors">
                          Call Now
                        </a>
                      </div>
                    )}
                    {staff.email && (
                      <div className="flex items-center justify-between text-sm p-3 bg-white rounded-xl border border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Mail className="w-4 h-4 text-primary" />
                          </div>
                          <span className="font-bold text-text-primary truncate max-w-[160px]">{staff.email}</span>
                        </div>
                        <a href={`mailto:${staff.email}`} className="px-3 py-1.5 bg-surface text-text-primary rounded-lg text-xs font-bold hover:bg-border transition-colors">
                          Email
                        </a>
                      </div>
                    )}
                    {(staff.instagram_url || staff.facebook_url || staff.social_links?.instagram || staff.social_links?.facebook) && (
                      <div className="flex items-center gap-2 pt-2">
                        {(staff.instagram_url || staff.social_links?.instagram) && (
                          <a href={staff.instagram_url || staff.social_links?.instagram} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-pink-50 text-pink-700 rounded-lg text-xs font-bold hover:bg-pink-100 transition-colors flex items-center gap-1.5">
                            <span>📸 Instagram</span>
                          </a>
                        )}
                        {(staff.facebook_url || staff.social_links?.facebook) && (
                          <a href={staff.facebook_url || staff.social_links?.facebook} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-1.5">
                            <span>📘 Facebook</span>
                          </a>
                        )}
                      </div>
                    )}
                    {!staff.phone && !staff.email && !(staff.instagram_url || staff.facebook_url) && (
                      <p className="text-sm text-text-muted">No direct contact details provided.</p>
                    )}
                  </div>
                ) : !user ? (
                  <div className="text-center py-4 px-3 bg-white rounded-2xl border border-amber-200 shadow-xs">
                    <ShieldAlert className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                    <h4 className="text-sm font-bold text-text-primary mb-1">See Contact Details</h4>
                    <p className="text-xs text-text-muted mb-4">
                      Please register or log in first and complete OTP verification to view contact details.
                    </p>
                    <Button 
                      onClick={() => router.push(`/auth/login?redirect=/emergency/hospitals/bengali-staff/${id}`)} 
                      variant="primary" 
                      size="sm" 
                      className="w-full font-semibold cursor-pointer shadow-xs text-xs sm:text-sm"
                    >
                      Registered users verify OTP • New users register & verify OTP
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4 px-3 bg-white rounded-2xl border border-amber-200 shadow-xs">
                    <ShieldAlert className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                    <h4 className="text-sm font-bold text-text-primary mb-1">See Contact Details</h4>
                    <p className="text-xs text-text-muted mb-4">
                      Account verification required through OTP before displaying contact details.
                    </p>
                    <Button 
                      onClick={() => setShowOtpModal(true)} 
                      variant="primary" 
                      size="sm" 
                      className="w-full font-semibold cursor-pointer shadow-xs"
                    >
                      Verify via OTP to See Contact Details
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
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
