'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, MapPin, Phone, Clock, CheckCircle2, Stethoscope, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { sampleHospitals } from '@/data/sample-data';

export default function HospitalDetailPage() {
  const params = useParams();
  const hospital = sampleHospitals.find((h) => h.id === params.id);

  if (!hospital) {
    return (<div className="min-h-screen flex items-center justify-center"><div className="text-center"><p className="text-5xl mb-4">🏥</p><h2 className="text-2xl font-bold mb-2">Hospital Not Found</h2><Link href="/emergency/hospitals"><Button variant="primary">Back to Hospitals</Button></Link></div></div>);
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/emergency/hospitals" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to hospitals
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card padding="lg">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center shrink-0"><Stethoscope className="w-8 h-8 text-red-500" /></div>
                <div>
                  <h1 className="text-2xl font-bold font-display">{hospital.name}</h1>
                  <div className="flex items-center gap-1.5 mt-1 text-text-muted"><MapPin className="w-4 h-4" />{hospital.address || `${hospital.area}, ${hospital.city}`}</div>
                  <div className="flex gap-2 mt-3">
                    {hospital.is_24_7 && <Badge variant="red"><Clock className="w-3 h-3 mr-1" />24/7 Open</Badge>}
                    {hospital.has_bengali_doctor && <Badge variant="bengali">🗣️ Bengali Doctor Available</Badge>}
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-bold mb-4">Specializations</h3>
              <div className="flex flex-wrap gap-2">
                {hospital.specializations.map((s) => <Badge key={s} variant="teal">{s}</Badge>)}
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-bold mb-4">Doctor Contact</h3>
              <div className="relative">
                <div className="blur-md select-none space-y-3 text-sm">
                  <p>Dr. Arun Kumar — Cardiology — Mon-Sat 10AM-4PM — 044-XXXXXXX</p>
                  <p>Dr. Priya Sharma — Orthopedic — Mon-Fri 9AM-2PM — 044-XXXXXXX</p>
                </div>
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center gap-3">
                  <Lock className="w-6 h-6 text-primary" />
                  <p className="text-sm font-medium">Login to view doctor details</p>
                  <Link href="/auth/login"><Button variant="primary" size="sm">Login</Button></Link>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-red-50 to-white">
              <h3 className="text-lg font-bold mb-4">Emergency Contact</h3>
              <div className="space-y-3">
                {hospital.emergency_phone && <a href={`tel:${hospital.emergency_phone}`}><Button variant="danger" className="w-full"><Phone className="w-4 h-4" /> Emergency: {hospital.emergency_phone}</Button></a>}
                {hospital.phone && <a href={`tel:${hospital.phone}`}><Button variant="outline" className="w-full mt-2"><Phone className="w-4 h-4" /> General: {hospital.phone}</Button></a>}
                {hospital.google_maps_url && <a href={hospital.google_maps_url} target="_blank" rel="noopener noreferrer"><Button variant="secondary" className="w-full mt-2"><MapPin className="w-4 h-4" /> Open in Maps</Button></a>}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
