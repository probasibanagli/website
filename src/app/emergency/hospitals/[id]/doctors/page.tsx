'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firestore/collections';
import { Hospital, BengaliDoctor } from '@/types';
import { ArrowLeft, Search, UserRound, Star, Clock, Phone, Mail, Share2, BadgeCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function DoctorsListPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;
  
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [doctors, setDoctors] = useState<BengaliDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [doctorSearch, setDoctorSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    const verified = localStorage.getItem('directory_verified') === 'true';
    if (!verified) {
      router.replace(`/emergency/hospitals/${id}/verify?redirect=/emergency/hospitals/${id}/doctors`);
      return;
    }
    setIsVerified(true);

    const loadData = async () => {
      try {
        const hRef = doc(db, COLLECTIONS.hospitals, id);
        const hSnap = await getDoc(hRef);
        let currentHospital: Hospital | null = null;
        if (hSnap.exists()) {
          currentHospital = { id: hSnap.id, ...hSnap.data() } as Hospital;
          setHospital(currentHospital);
        }

        const docsRef = collection(db, COLLECTIONS.bengali_doctors);
        const dSnap = await getDocs(docsRef);
        const allDoctors = dSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
        
        // Filter by either hospital ID or hospital Name to handle inconsistencies in the database
        const hospitalDoctors = allDoctors.filter(d => 
          d.hospital_id === id || 
          (currentHospital && d.hospital_id === currentHospital.name) ||
          (currentHospital && d.hospital === currentHospital.name) ||
          (currentHospital && d.hospital_name === currentHospital.name)
        );
        
        setDoctors(hospitalDoctors as BengaliDoctor[]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [id, router]);

  const filteredDoctors = doctors.filter(d => {
    const searchStr = doctorSearch.toLowerCase();
    return (
      d.doctor_name.toLowerCase().includes(searchStr) ||
      d.specialization.toLowerCase().includes(searchStr) ||
      (d.department && d.department.toLowerCase().includes(searchStr)) ||
      (d.languages && d.languages.some(lang => lang.toLowerCase().includes(searchStr)))
    );
  });

  if (loading || !isVerified) {
    return <div className="min-h-screen bg-surface flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-surface pb-20 pt-6 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link href={`/emergency/hospitals/${id}`} className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Hospital
          </Link>
          <Link href={`/emergency/hospitals/${id}/staff`} className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
            View Bengali Staff →
          </Link>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Bengali Doctors at {hospital?.name}</h1>
          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 text-sm font-semibold inline-flex">
            <BadgeCheck className="w-4 h-4" /> Verified Access
          </div>
        </div>

        {/* Search Doctors */}
        <div className="mb-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            id="doctor-search-input"
            type="text"
            placeholder="Search doctors by name or specialization..."
            value={doctorSearch}
            onChange={e => setDoctorSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none shadow-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredDoctors.map(doc => (
            <Card key={doc.id} className="p-4 hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-full bg-surface border border-border overflow-hidden shrink-0">
                    {doc.photo
                      ? <img src={doc.photo} className="w-full h-full object-cover" alt={doc.doctor_name} />
                      : <div className="w-full h-full flex items-center justify-center text-primary/30"><UserRound className="w-6 h-6" /></div>
                    }
                  </div>
                  <div>
                    <h4 className="font-bold text-text-primary">{doc.doctor_name}</h4>
                    
                    <div className="flex flex-wrap gap-2 items-center mt-1">
                      <p className="text-sm font-medium text-primary">{doc.specialization}</p>
                      {doc.department && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-border" />
                          <p className="text-sm font-medium text-text-muted">{doc.department}</p>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mt-2">
                      {doc.experience && (
                        <p className="text-xs font-semibold text-text-muted flex items-center gap-1"><Star className="w-3 h-3"/> {doc.experience}</p>
                      )}
                      {doc.qualifications && doc.qualifications.length > 0 && (
                        <p className="text-xs text-text-muted">🎓 {doc.qualifications.join(', ')}</p>
                      )}
                    </div>

                    {doc.consultation_timings && (
                      <p className="text-xs text-text-muted mt-2 flex items-center gap-1"><Clock className="w-3 h-3 text-emerald-600"/> {doc.consultation_timings}</p>
                    )}
                    
                    {doc.languages && doc.languages.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {doc.languages.map(lang => (
                          <span key={lang} className="text-xs bg-surface border border-border rounded-full px-2 py-0.5">{lang}</span>
                        ))}
                      </div>
                    )}
                    
                    {/* Protected Contact Info */}
                    <div className="mt-4 pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {doc.phone && (
                        <a href={`tel:${doc.phone}`} className="flex items-center gap-2 text-xs font-semibold text-text-primary hover:text-primary transition-colors">
                          <Phone className="w-3.5 h-3.5" /> {doc.phone}
                        </a>
                      )}
                      {doc.email && (
                        <a href={`mailto:${doc.email}`} className="flex items-center gap-2 text-xs font-semibold text-text-primary hover:text-primary transition-colors">
                          <Mail className="w-3.5 h-3.5" /> {doc.email}
                        </a>
                      )}
                    </div>

                    {doc.social_links && (
                      <div className="flex items-center gap-3 mt-3">
                        {doc.social_links.linkedin && <a href={doc.social_links.linkedin} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-700 hover:underline">LinkedIn</a>}
                        {doc.social_links.facebook && <a href={doc.social_links.facebook} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-700 hover:underline">Facebook</a>}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: `${doc.doctor_name} at ${hospital?.name}`,
                        text: `Check out ${doc.doctor_name} (${doc.specialization}) at ${hospital?.name}.`,
                        url: window.location.href,
                      });
                    } else {
                      alert('Sharing not supported on this browser.');
                    }
                  }}
                  className="p-2 text-text-muted hover:text-primary transition-colors cursor-pointer"
                  title="Share Doctor"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
          {doctors.length === 0 && (
            <p className="text-text-muted col-span-2 py-4">No Bengali doctors listed yet.</p>
          )}
          {doctors.length > 0 && filteredDoctors.length === 0 && (
            <p className="text-text-muted col-span-2 py-4">No doctors match your search.</p>
          )}
        </div>
      </div>
    </div>
  );
}
