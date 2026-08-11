'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Droplets, MapPin, Phone, Globe, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { COLLECTIONS } from '@/lib/firestore/collections';
import type { BloodBank } from '@/types';
import { CITIES } from '@/lib/constants';

export default function BloodPage() {
  const [city, setCity] = useState('');
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
      return true;
    });
  }, [bloodBanks, city]);

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
            <Link href="/" className="hover:text-primary">Home</Link><span>/</span>
            <span className="text-text-primary font-medium">Blood Help</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-text-primary flex items-center gap-3">
            <Droplets className="w-8 h-8 text-red-500" /> Blood Help
          </h1>
          <p className="mt-2 text-text-muted">Find blood banks and donors near you.</p>

          <div className="mt-6">
            <label className="block text-sm font-medium text-text-primary mb-2">Filter by City:</label>
            <select value={city} onChange={(e) => setCity(e.target.value)} className="px-4 py-2.5 rounded-xl border border-border text-sm">
              <option value="">All Cities</option>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-red-500" />
            <p className="text-text-muted text-sm font-medium">Loading blood banks...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((bank) => (
                <Card key={bank.id} className="group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center shrink-0"><Droplets className="w-6 h-6 text-red-500" /></div>
                    <div>
                      <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors">{bank.name}</h3>
                      <div className="flex items-center gap-1.5 mt-1 text-sm text-text-muted"><MapPin className="w-3.5 h-3.5" />{bank.city}</div>
                      {bank.phone && <div className="flex items-center gap-1.5 mt-1 text-sm text-text-muted"><Phone className="w-3.5 h-3.5" />{bank.phone}</div>}
                    </div>
                  </div>
                  {bank.address && <p className="text-sm text-text-muted mt-3">{bank.address}</p>}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                    {bank.phone && <a href={`tel:${bank.phone}`} className="flex-1"><Button variant="danger" size="sm" className="w-full"><Phone className="w-3.5 h-3.5" />Call</Button></a>}
                    {bank.website && <a href={bank.website} target="_blank" rel="noopener noreferrer"><Button variant="ghost" size="sm" title="Visit Website"><Globe className="w-4 h-4" /></Button></a>}
                    {bank.google_maps_url && <a href={bank.google_maps_url} target="_blank" rel="noopener noreferrer"><Button variant="ghost" size="sm"><MapPin className="w-4 h-4" /></Button></a>}
                  </div>
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
