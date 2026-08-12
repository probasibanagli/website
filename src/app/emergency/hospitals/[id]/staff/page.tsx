'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firestore/collections';
import { Hospital, BengaliStaff } from '@/types';
import { ArrowLeft, Users, BadgeCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function StaffListPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;
  
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [staff, setStaff] = useState<BengaliStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const verified = localStorage.getItem('directory_verified') === 'true';
    if (!verified) {
      router.replace(`/emergency/hospitals/${id}/verify?redirect=/emergency/hospitals/${id}/staff`);
      return;
    }
    setIsVerified(true);

    const loadData = async () => {
      try {
        const hRes = await fetch(`/api/public/firestore?collection=hospitals&docId=${id}`);
        let currentHospital: Hospital | null = null;
        if (hRes.ok) {
          currentHospital = await hRes.json() as Hospital;
          setHospital(currentHospital);
        }

        const sRes = await fetch(`/api/public/firestore?collection=bengali_staff`);
        if (sRes.ok) {
          const sJson = await sRes.json();
          const allStaff = (sJson.items || []) as any[];
          
          // Filter by either hospital ID or hospital Name to handle inconsistencies in the database
          const hospitalStaff = allStaff.filter(s => 
            s.hospital_id === id || 
            (currentHospital && s.hospital_id === currentHospital.name) ||
            (currentHospital && s.hospital === currentHospital.name) ||
            (currentHospital && s.hospital_name === currentHospital.name)
          );
          
          setStaff(hospitalStaff as BengaliStaff[]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [id, router]);

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
          <Link href={`/emergency/hospitals/${id}/doctors`} className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
            View Bengali Doctors →
          </Link>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Bengali Staff at {hospital?.name}</h1>
          <div className="flex items-center gap-2 text-blue-600 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2 text-sm font-semibold inline-flex">
            <BadgeCheck className="w-4 h-4" /> Verified Access
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {staff.map(member => (
            <Card key={member.id} className="p-4 hover:shadow-md transition-all">
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-xl bg-surface border border-border overflow-hidden shrink-0">
                  {member.photo
                    ? <img src={member.photo} className="w-full h-full object-cover" alt={member.name} />
                    : <div className="w-full h-full flex items-center justify-center text-primary/30"><Users className="w-6 h-6" /></div>
                  }
                </div>
                <div>
                  <h4 className="font-bold text-text-primary">{member.name}</h4>
                  <p className="text-sm font-medium text-primary">{member.role}</p>
                  <p className="text-xs text-text-muted mt-1">{member.department || 'Department N/A'}</p>
                </div>
              </div>
            </Card>
          ))}
          {staff.length === 0 && (
            <p className="text-text-muted col-span-2 py-4">No Bengali staff listed yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
