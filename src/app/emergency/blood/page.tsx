'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Droplets, MapPin, Phone, Globe, Loader2, ArrowRight, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { COLLECTIONS } from '@/lib/firestore/collections';
import type { BloodBank } from '@/types';
import { CITIES } from '@/lib/constants';
const MessageSquareIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export default function BloodPage() {
  const [city, setCity] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [bloodBanks, setBloodBanks] = useState<BloodBank[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBloodBanks() {
      try {
        const res = await fetch('/api/public/firestore?collection=blood_banks');
        if (!res.ok) throw new Error('Failed to fetch blood banks');
        const data = await res.json();
        setBloodBanks(data.items || []);
      } catch (e) {
        console.error('Error fetching blood banks:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchBloodBanks();
  }, []);

  const filtered = useMemo(() => {
    return bloodBanks.filter((b) => {
      if (city && b.city !== city) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = b.name.toLowerCase().includes(query);
        const matchesAddress = b.address?.toLowerCase().includes(query) || false;
        const matchesCity = b.city?.toLowerCase().includes(query) || false;
        if (!matchesName && !matchesAddress && !matchesCity) return false;
      }
      return true;
    });
  }, [bloodBanks, city, searchQuery]);

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-white border-b border-border">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
            <Link href="/" className="hover:text-primary">Home</Link><span>/</span>
            <span className="text-text-primary font-medium">Blood Help</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-text-primary flex items-center gap-3">
            <Droplets className="w-8 h-8 text-red-500" /> Blood Help
          </h1>
          <p className="mt-2 text-text-muted">Find blood banks and donors near you.</p>

          <div className="mt-6 flex flex-col md:flex-row md:items-center gap-3 relative z-30">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] md:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                placeholder="Search blood banks by name or area..." 
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" 
              />
            </div>

            {/* City select */}
            <select 
              value={city} 
              onChange={(e) => setCity(e.target.value)} 
              className="px-4 py-2.5 rounded-xl border border-border text-sm bg-white cursor-pointer min-w-[160px]"
            >
              <option value="">All Cities</option>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-[28px] border border-border p-6 text-center space-y-4">
                <Skeleton className="w-12 h-12 rounded-full mx-auto" />
                <Skeleton className="w-3/4 h-6 mx-auto" />
                <Skeleton className="w-1/2 h-4 mx-auto mb-6" />
                <div className="space-y-2 text-left">
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-full h-4" />
                </div>
                <Skeleton className="w-full h-12 rounded-2xl mt-4" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((bank) => (
                <Card key={bank.id} padding="none" className="rounded-[28px] overflow-hidden group flex flex-col justify-between hover:shadow-lg transition-all border border-gray-100 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] bg-white p-6 pb-5 relative text-center">
                  <div>
                    {/* Top Blood Drop circular pill */}
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#FFF0EB] text-[#A63A13] mx-auto mb-4 shrink-0 shadow-sm">
                      <Droplets className="w-5 h-5 text-[#A63A13] fill-[#A63A13]" />
                    </div>

                    {/* Blood Bank Title */}
                    <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-primary transition-colors font-display line-clamp-2 max-w-[95%] mx-auto">
                      {bank.name}
                    </h3>
                    
                    {/* City/Region Subtitle */}
                    <p className="text-[10px] text-[#8F9BB3] font-extrabold uppercase tracking-widest mt-2.5 flex items-center justify-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#8F9BB3]" />
                      <span>{bank.city}</span>
                    </p>

                    {/* Full Address Details */}
                    {bank.address && (
                      <p className="text-xs text-text-muted mt-2 px-2 leading-relaxed">
                        {bank.address}
                      </p>
                    )}

                    {/* Phone Details */}
                    {bank.phone && (
                      <p className="text-xs text-text-muted mt-2 font-medium">
                        Phone: <span className="text-gray-900 font-bold">{bank.phone}</span>
                      </p>
                    )}

                    {/* Thin subtle horizontal divider line */}
                    <div className="w-16 h-[1px] bg-gray-100 mx-auto my-4.5" />

                    {/* Coordinator Details */}
                    {/* <div>
                      <p className="text-[9px] text-[#8F9BB3] uppercase tracking-wider font-extrabold">Center Coordinator</p>
                      <p className="text-base font-bold text-gray-900 mt-1">
                        {bank.coordinator_name || "Sanjay Das"}
                      </p>
                    </div> */}

                    {/* Action Row: Request Blood + Website + Google Maps */}
                    <div className="flex items-center gap-2 mt-5">
                      <a href={bank.phone ? `tel:${bank.phone}` : '#'} className="flex-1">
                        <button className="w-full bg-[#B81D18] hover:bg-[#c24f28] text-white font-bold py-3.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]">
                          <Phone className="w-4 h-4" />
                          <span>Call Now</span>
                        </button>
                      </a>

                      {bank.website && (
                        <a href={bank.website} target="_blank" rel="noopener noreferrer" title="Visit Website">
                          <button className="h-11 w-11 bg-white hover:bg-slate-50 border border-[#E4E9F2] text-[#A63A13] rounded-xl flex items-center justify-center transition-all active:scale-[0.98]">
                            <Globe className="w-4.5 h-4.5 text-[#A63A13]" />
                          </button>
                        </a>
                      )}

                      {bank.google_maps_url && (
                        <a href={bank.google_maps_url} target="_blank" rel="noopener noreferrer" title="View on Map">
                          <button className="h-11 w-11 bg-white hover:bg-slate-50 border border-[#E4E9F2] text-[#A63A13] rounded-xl flex items-center justify-center transition-all active:scale-[0.98]">
                            <MapPin className="w-4.5 h-4.5 text-[#A63A13]" />
                          </button>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* WhatsApp Coordinator footer link */}
                  {/* <div className="mt-4 pt-3.5 border-t border-gray-50 flex items-center justify-center">
                    <a 
                      href={bank.whatsapp_url || (bank.phone ? `https://wa.me/${bank.phone.replace(/[^0-9]/g, '')}` : '#')} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs font-bold text-[#A63A13] hover:text-[#8F310F] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <MessageSquareIcon className="w-4.5 h-4.5 text-[#0A6C4A]" />
                      <span>WhatsApp Coordinator</span>
                    </a>
                  </div> */}
                </Card>
              ))}
            </div>
            {filtered.length === 0 && (<div className="text-center py-20"><p className="text-5xl mb-4">🩸</p><h3 className="text-xl font-bold mb-2">No blood banks found</h3><p className="text-text-muted">Try a different city selection.</p></div>)}
          </>
        )}
      </div>
    </div>
  );
}
