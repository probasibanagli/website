'use client';

import React, { useState, useEffect } from 'react';
import { default as Link } from 'next/link';
import { Phone, Siren, Shield, Flame, MapPin, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Ambulance } from '@/types';

const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const BanknoteIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="12" x="2" y="6" rx="2" />
    <circle cx="12" cy="12" r="2" />
    <line x1="6" x2="6.01" y1="12" y2="12" />
    <line x1="18" x2="18.01" y1="12" y2="12" />
  </svg>
);

const MedicalKitIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 4h-8V2H8v2H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-4z" />
    <path d="M12 10v6" />
    <path d="M9 13h6" />
  </svg>
);

const emergencyNumbers = [
  { label: 'All Emergency', number: '112', icon: <AlertTriangle className="w-6 h-6" />, color: 'bg-red-600', desc: 'Police, Fire, Ambulance' },
  { label: 'Ambulance', number: '108', icon: <Siren className="w-6 h-6" />, color: 'bg-red-500', desc: 'Govt. Ambulance Service' },
  { label: 'Police', number: '100', icon: <Shield className="w-6 h-6" />, color: 'bg-blue-600', desc: 'Tamil Nadu Police' },
  { label: 'Fire', number: '101', icon: <Flame className="w-6 h-6" />, color: 'bg-orange-600', desc: 'Fire & Rescue' },
  { label: "Women's Helpline", number: '181', icon: <Phone className="w-6 h-6" />, color: 'bg-purple-600', desc: 'Women Safety' },
  { label: 'Child Helpline', number: '1098', icon: <Phone className="w-6 h-6" />, color: 'bg-teal-600', desc: 'Child Protection' },
];

export default function AmbulancePage() {
  const [showSOS, setShowSOS] = useState(false);
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAmbulances() {
      try {
        const res = await fetch('/api/public/firestore?collection=ambulances');
        if (!res.ok) throw new Error('Failed to fetch ambulances');
        const data = await res.json();
        setAmbulances(data.items || []);
      } catch (e) {
        console.error('Error fetching ambulances:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchAmbulances();
  }, []);

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
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-red-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {ambulances.map((amb) => (
              <Card key={amb.id} padding="none" className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 gap-6 hover:shadow-lg transition-all border border-gray-100 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] bg-white rounded-3xl w-full">
                {/* Left section: Title, Badge, City, Phone & Description */}
                <div className="flex-1 min-w-0 text-left space-y-2">
                  {/* Unit Type Badge */}
                  {amb.unit_type && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF0EB] text-[#A63A13] text-xs font-bold rounded-full mb-1 tracking-wide uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A63A13] shrink-0" />
                      {amb.unit_type}
                    </span>
                  )}
                  
                  <h3 className="text-xl font-bold text-gray-900 leading-tight font-display">
                    {amb.name}
                  </h3>

                  {/* Location Pin */}
                  <div className="flex items-center gap-2 text-sm text-[#5F6368]">
                    <MapPin className="w-4 h-4 text-[#5F6368] shrink-0" />
                    <span>{amb.city}</span>
                  </div>

                  {/* Phone Details */}
                  {amb.phone && (
                    <div className="flex items-center gap-2 text-sm text-[#A63A13] font-semibold">
                      <Phone className="w-4 h-4 text-[#A63A13] shrink-0" />
                      <span>{amb.phone}</span>
                    </div>
                  )}

                  {/* Description / Address */}
                  {amb.address && (
                    <p className="text-xs text-text-muted mt-2 max-w-2xl leading-relaxed">
                      {amb.address}
                    </p>
                  )}
                </div>

                {/* Middle section: Special details (ETA, Equipment, Base Rate) - Only shown if defined */}
                {(amb.eta || amb.equipment || amb.base_rate) && (
                  <>
                    {/* Vertical Divider */}
                    <div className="hidden md:block w-[1px] h-16 bg-gray-100 shrink-0 self-center mx-2" />

                    <div className="flex flex-col gap-2 min-w-[200px] text-left">
                      {amb.eta && (
                        <div className="flex items-center gap-2 text-sm text-[#5F6368] font-semibold">
                          <ClockIcon className="w-4 h-4 text-[#A63A13] shrink-0" />
                          <span>{amb.eta}</span>
                        </div>
                      )}
                      
                      {amb.equipment && (
                        <div className="flex items-center gap-2 text-sm text-[#5F6368]">
                          <MedicalKitIcon className="w-4 h-4 text-[#0A6C4A] shrink-0" />
                          <span className="truncate" title={amb.equipment}>{amb.equipment}</span>
                        </div>
                      )}
                      
                      {amb.base_rate && (
                        <div className="flex items-center gap-2 text-sm text-[#5F6368] font-semibold">
                          <BanknoteIcon className="w-4 h-4 text-[#0A6C4A] shrink-0" />
                          <span>{amb.base_rate}</span>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Vertical Divider */}
                <div className="hidden md:block w-[1px] h-16 bg-gray-100 shrink-0 self-center mx-2" />

                {/* Right: Actions */}
                <div className="flex items-center gap-3 shrink-0 self-stretch md:self-auto justify-end w-full md:w-auto">
                  {amb.google_maps_url && (
                    <a href={amb.google_maps_url} target="_blank" rel="noopener noreferrer" title="View on Map" className="shrink-0">
                      <button className="h-11 w-11 bg-[#FFF0EB] hover:bg-[#FFE5DC] text-[#A63A13] rounded-full flex items-center justify-center transition-all active:scale-[0.98] shadow-sm border border-[#FBE0D6]/60">
                        <MapPin className="w-5 h-5 text-[#A63A13]" />
                      </button>
                    </a>
                  )}

                  {amb.phone && (
                    <a href={`tel:${amb.phone}`} className="flex-1 md:flex-none">
                      <button className="w-full md:w-auto bg-[#d85a30] hover:bg-[#c24f28] text-white font-bold py-3 px-6 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]">
                        <Phone className="w-4 h-4 text-white fill-white" />
                        <span>Call</span>
                      </button>
                    </a>
                  )}
                </div>
              </Card>
            ))}
            {ambulances.length === 0 && (
              <div className="text-center py-12 text-text-muted italic">
                No ambulance services registered in this region yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
