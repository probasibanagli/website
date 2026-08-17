'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firestore/collections';
import type { BengaliDoctor, Hospital } from '@/types';
import { Phone, Mail, ArrowLeft, Building2, UserRound, Award, Languages, ShieldAlert, CheckCircle2, Star, ExternalLink } from 'lucide-react';

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/lib/auth/AuthContext';
import { OtpVerificationModal } from '@/components/auth/OtpVerificationModal';

export default function DoctorDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;
  
  const [doctor, setDoctor] = useState<BengaliDoctor | null>(null);
  const [associatedHospitals, setAssociatedHospitals] = useState<Hospital[]>([]);
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
    async function loadDoctorAndCheckOtp() {
      try {
        let d: BengaliDoctor | null = null;
        try {
          const dRes = await fetch(`/api/public/firestore?collection=bengali_doctors&docId=${id}`);
          if (dRes.ok) {
            const dJson = await dRes.json();
            if (dJson && !dJson.fallback && dJson.id && (dJson.doctor_name || dJson.name)) {
              d = dJson as BengaliDoctor;
            }
          }
        } catch (apiErr) {
          console.warn("Doctor API fetch failed, querying client-side Firestore:", apiErr);
        }

        if (!d) {
          const docSnap = await getDoc(doc(db, COLLECTIONS.bengali_doctors, id));
          if (docSnap.exists()) {
            d = { id: docSnap.id, ...docSnap.data() } as BengaliDoctor;
          }
        }

        if (d) {
          setDoctor(d);
          
          setIsVerified(false);
          
          // Fetch associated hospitals
          const hospIds = d.hospital_ids || (d.hospital_id ? [d.hospital_id] : []);
          const hospData: Hospital[] = [];
          for (const hid of hospIds) {
            try {
              const hRes = await fetch(`/api/public/firestore?collection=hospitals&docId=${hid}`);
              if (hRes.ok) {
                const hJson = await hRes.json();
                if (hJson && !hJson.fallback && hJson.id) {
                  hospData.push(hJson as Hospital);
                  continue;
                }
              }
            } catch (err) {}
            
            const hSnap = await getDoc(doc(db, COLLECTIONS.hospitals, hid));
            if (hSnap.exists()) {
              hospData.push({ id: hSnap.id, ...hSnap.data() } as Hospital);
            }
          }
          setAssociatedHospitals(hospData);
        }
      } catch (e) {
        console.error("Error loading doctor data:", e);
      } finally {
        setLoading(false);
      }
    }
    loadDoctorAndCheckOtp();
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

  if (!doctor) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4 text-center">
         <UserRound className="w-16 h-16 text-text-muted mb-4 opacity-50" />
         <h1 className="text-2xl font-bold text-text-primary mb-2">Doctor Not Found</h1>
         <p className="text-text-muted mb-6">The doctor profile you are looking for does not exist or has been removed.</p>
         <Link href="/emergency/hospitals/bengali-doctors">
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
            <Link href="/emergency/hospitals/bengali-doctors" className="hover:text-primary shrink-0">Bengali Doctors</Link><span>/</span>
            <span className="text-text-primary font-medium truncate">{doctor.doctor_name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/emergency/hospitals/bengali-doctors" className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-primary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Directory
        </Link>

        {/* Profile Card */}
        <Card className="overflow-hidden border-border bg-white shadow-sm">
          <div className="h-32 bg-primary/5 relative">
            <div className="absolute -bottom-16 left-8">
              <div className="w-32 h-32 rounded-2xl bg-white p-1.5 shadow-lg border border-border">
                {doctor.photo ? (
                  <img src={doctor.photo} alt={doctor.doctor_name} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <div className="w-full h-full bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <UserRound className="w-12 h-12" />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="pt-20 px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-text-primary">{doctor.doctor_name}</h1>
                <p className="text-primary font-medium text-lg mt-1">{doctor.specialization}</p>
                
                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-text-muted">
                  {doctor.experience && (
                    <div className="flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span className="font-medium text-text-primary">{doctor.experience} Experience</span>
                    </div>
                  )}
                  {doctor.languages && doctor.languages.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Languages className="w-4 h-4" />
                      <span>{doctor.languages.join(', ')}</span>
                    </div>
                  )}
                </div>

                {doctor.google_review_link && (
                  <div className="mt-4">
                    <a
                      href={doctor.google_review_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-50 hover:bg-amber-100/80 text-amber-800 border border-amber-200 rounded-xl text-sm font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                      <span>Google Reviews & Ratings</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-70 ml-0.5" />
                    </a>
                  </div>
                )}
              </div>
              
              {/* Social Media Links */}
              {doctor.social_links && (
                <div className="flex items-center gap-3">
                  {doctor.social_links.linkedin && (
                    <a href={doctor.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-surface rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-text-muted">
                      <LinkedinIcon className="w-5 h-5" />
                    </a>
                  )}
                  {doctor.social_links.facebook && (
                    <a href={doctor.social_links.facebook} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-surface rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-text-muted">
                      <FacebookIcon className="w-5 h-5" />
                    </a>
                  )}
                  {doctor.social_links.instagram && (
                    <a href={doctor.social_links.instagram} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-surface rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-text-muted">
                      <InstagramIcon className="w-5 h-5" />
                    </a>
                  )}
                  {doctor.social_links.x && (
                    <a href={doctor.social_links.x} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-surface rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-text-muted">
                      <TwitterIcon className="w-5 h-5" />
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hospital Affiliation */}
              <div className="p-5 rounded-2xl bg-surface/50 border border-border/50">
                <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" /> Associated Hospitals
                </h3>
                <div className="space-y-3">
                  {associatedHospitals.length > 0 ? (
                    associatedHospitals.map(h => (
                      <Link key={h.id} href={`/emergency/hospitals/${h.id}`} className="block group border-b border-border/50 pb-2 last:border-b-0 last:pb-0">
                        <p className="font-bold text-text-primary group-hover:text-primary transition-colors">{h.name}</p>
                        <p className="text-xs text-text-muted mt-0.5">{h.city} • {h.area}</p>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-text-muted">No associated hospitals configured.</p>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="p-5 rounded-2xl bg-surface/50 border border-border/50">
                <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" /> Contact Details
                </h3>
                
                {canViewContact ? (
                  <div className="space-y-3">
                    {doctor.phone && (
                      <div className="flex items-center justify-between text-sm p-3 bg-white rounded-xl border border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Phone className="w-4 h-4 text-primary" />
                          </div>
                          <span className="font-bold text-text-primary">{doctor.phone}</span>
                        </div>
                        <a href={`tel:${doctor.phone}`} className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors">
                          Call Now
                        </a>
                      </div>
                    )}
                    {doctor.email && (
                      <div className="flex items-center justify-between text-sm p-3 bg-white rounded-xl border border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Mail className="w-4 h-4 text-primary" />
                          </div>
                          <span className="font-bold text-text-primary truncate max-w-[160px]">{doctor.email}</span>
                        </div>
                        <a href={`mailto:${doctor.email}`} className="px-3 py-1.5 bg-surface text-text-primary rounded-lg text-xs font-bold hover:bg-border transition-colors">
                          Email
                        </a>
                      </div>
                    )}
                    {!doctor.phone && !doctor.email && (
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
                      onClick={() => router.push(`/auth/login?redirect=/emergency/hospitals/bengali-doctors/${id}`)} 
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
