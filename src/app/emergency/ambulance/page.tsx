'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Phone, Siren, Shield, Flame, MapPin, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const emergencyNumbers = [
  { label: 'All Emergency', number: '112', icon: <AlertTriangle className="w-6 h-6" />, color: 'bg-red-600', desc: 'Police, Fire, Ambulance' },
  { label: 'Ambulance', number: '108', icon: <Siren className="w-6 h-6" />, color: 'bg-red-500', desc: 'Govt. Ambulance Service' },
  { label: 'Police', number: '100', icon: <Shield className="w-6 h-6" />, color: 'bg-blue-600', desc: 'Tamil Nadu Police' },
  { label: 'Fire', number: '101', icon: <Flame className="w-6 h-6" />, color: 'bg-orange-600', desc: 'Fire & Rescue' },
  { label: "Women's Helpline", number: '181', icon: <Phone className="w-6 h-6" />, color: 'bg-purple-600', desc: 'Women Safety' },
  { label: 'Child Helpline', number: '1098', icon: <Phone className="w-6 h-6" />, color: 'bg-teal-600', desc: 'Child Protection' },
];

const privateAmbulances = [
  { name: 'GVK EMRI (108)', phone: '108', area: 'All Tamil Nadu' },
  { name: 'Apollo Ambulance', phone: '1066', area: 'Chennai' },
  { name: 'Stan Ambulance', phone: '044-28112222', area: 'Chennai' },
  { name: 'Jeevan Ambulance', phone: '9840012345', area: 'Chennai & Suburbs' },
];

export default function AmbulancePage() {
  const [showSOS, setShowSOS] = useState(false);

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-gradient-to-br from-red-600 to-red-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-white/80 mb-6">
            <Link href="/" className="hover:text-white">Home</Link><span>/</span>
            <span className="font-medium">Emergency SOS</span>
          </div>

          {/* SOS BUTTON */}
          <button
            onClick={() => setShowSOS(true)}
            className="w-40 h-40 mx-auto rounded-full bg-white text-red-600 flex flex-col items-center justify-center shadow-2xl hover:scale-110 transition-transform animate-pulse-glow cursor-pointer mb-6"
          >
            <Siren className="w-12 h-12 mb-1" />
            <span className="text-2xl font-black">SOS</span>
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold font-display">Emergency & SOS</h1>
          <p className="mt-2 text-white/80">One-tap access to emergency services. No login required.</p>
        </div>
      </div>

      {/* SOS Modal */}
      {showSOS && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setShowSOS(false)}>
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-3 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-center text-red-600 mb-4">⚠️ Emergency Options</h2>
            {[
              { label: 'Call Ambulance (108)', number: '108', color: 'bg-red-600' },
              { label: 'Call Police (100)', number: '100', color: 'bg-blue-600' },
              { label: 'Call Fire (101)', number: '101', color: 'bg-orange-600' },
              { label: 'Call All Emergency (112)', number: '112', color: 'bg-gray-900' },
            ].map((opt) => (
              <a key={opt.number} href={`tel:${opt.number}`} className={`flex items-center justify-between ${opt.color} text-white rounded-xl px-5 py-4 font-semibold hover:opacity-90 transition-opacity`}>
                {opt.label}
                <Phone className="w-5 h-5" />
              </a>
            ))}
            <button onClick={() => setShowSOS(false)} className="w-full text-center text-sm text-text-muted mt-4 py-2 cursor-pointer">Cancel</button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Emergency Numbers */}
        <h2 className="text-2xl font-bold font-display mb-6">Emergency Numbers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {emergencyNumbers.map((em) => (
            <a key={em.number} href={`tel:${em.number}`}>
              <Card className="group flex items-center gap-4 hover:border-red-300">
                <div className={`w-14 h-14 rounded-2xl ${em.color} text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                  {em.icon}
                </div>
                <div>
                  <h3 className="font-bold text-text-primary">{em.label}</h3>
                  <p className="text-2xl font-black text-primary">{em.number}</p>
                  <p className="text-xs text-text-muted">{em.desc}</p>
                </div>
              </Card>
            </a>
          ))}
        </div>

        {/* Private Ambulances */}
        <h2 className="text-2xl font-bold font-display mb-6">Private Ambulance Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {privateAmbulances.map((amb) => (
            <Card key={amb.name} className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-text-primary">{amb.name}</h3>
                <div className="flex items-center gap-1.5 text-sm text-text-muted mt-1"><MapPin className="w-3.5 h-3.5" />{amb.area}</div>
              </div>
              <a href={`tel:${amb.phone}`}><Button variant="danger" size="sm"><Phone className="w-4 h-4" />{amb.phone}</Button></a>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
