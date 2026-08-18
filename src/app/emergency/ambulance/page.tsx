'use client';

import React, { useState, useEffect } from 'react';
import { default as Link } from 'next/link';
import { 
  Phone, Siren, Shield, Flame, MapPin, AlertTriangle, Loader2, 
  Plane, Truck, Check, ListFilter, Zap, Clock, Train, Layers,
  BriefcaseMedical, ArrowLeftRight, CheckCircle2, Search
} from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Ambulance } from '@/types';
import { CITIES } from '@/lib/constants';

const emergencyNumbers = [
  { label: 'All Emergency', number: '112', icon: (cls: string) => <AlertTriangle className={`w-6 h-6 ${cls}`} />, color: 'text-red-600', desc: 'Police, Fire, Ambulance' },
  { label: 'Ambulance', number: '108', icon: (cls: string) => <Siren className={`w-6 h-6 ${cls}`} />, color: 'text-red-600', desc: 'Govt. Ambulance Service' },
  { label: 'Police', number: '100', icon: (cls: string) => <Shield className={`w-6 h-6 ${cls}`} />, color: 'text-red-600', desc: 'Tamil Nadu Police' },
  { label: 'Fire', number: '101', icon: (cls: string) => <Flame className={`w-6 h-6 ${cls}`} />, color: 'text-red-600', desc: 'Fire & Rescue' },
  { label: "Women's Helpline", number: '181', icon: (cls: string) => <Phone className={`w-6 h-6 ${cls}`} />, color: 'text-red-600', desc: 'Women Safety' },
  { label: 'Child Helpline', number: '1098', icon: (cls: string) => <Phone className={`w-6 h-6 ${cls}`} />, color: 'text-red-600', desc: 'Child Protection' },
];

export default function AmbulancePage() {
  const [showSOS, setShowSOS] = useState(false);
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [loading, setLoading] = useState(true);

  // Active filters applied to the query
  const [mainTab, setMainTab] = useState<'all' | 'local' | 'flight' | 'train'>('all');
  const [subFilter, setSubFilter] = useState<'all' | 'government' | 'private'>('all');
  const [sizeFilter, setSizeFilter] = useState<'all' | 'small' | 'medium' | 'large'>('all');
  const [selectedServices, setSelectedServices] = useState({
    patient_shifting: false,
    dead_body_transport: false,
    tn_to_wb: false,
    wb_to_tn: false
  });

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [city, setCity] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchAmbulances() {
      try {
        const res = await fetch('/api/public/firestore?collection=ambulances');
        const data = await res.json();
        const items = data.items || [];
        const sorted = items.sort((a: Ambulance, b: Ambulance) => {
          const getScore = (item: Ambulance) => {
            let score = 0;
            if (item.name?.trim()) score++;
            if (item.sub_category?.trim()) score++;
            if (item.type_mode?.trim()) score++;
            if (item.city?.trim()) score++;
            if (item.phone?.trim()) score++;
            if (item.address?.trim()) score++;
            if (item.source_notes?.trim()) score++;
            return score;
          };

          const scoreA = getScore(a);
          const scoreB = getScore(b);

          if (scoreA !== scoreB) {
            return scoreB - scoreA;
          }
          return (a.name || '').localeCompare(b.name || '');
        });
        setAmbulances(sorted);
      } catch (e) {
        console.error('Error fetching ambulances:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchAmbulances();
  }, []);

  const handleMainTabChange = (val: 'all' | 'local' | 'flight' | 'train') => {
    setMainTab(val);
    setSubFilter('all');
  };

  const toggleService = (key: keyof typeof selectedServices) => {
    setSelectedServices(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const filteredAmbulances = ambulances.filter(amb => {
    // 1. Main Category filter
    const mainCat = amb.main_category || 'local';
    if (mainTab !== 'all' && mainCat !== mainTab) return false;

    // 2. Sub Category filter
    const subCat = amb.sub_category || 'private';
    const is108 = amb.name?.includes('108') || amb.phone?.includes('108') || amb.source_notes?.includes('108');
    
    // Note: Remove 108 Ambulance from the Private Ambulance section.
    if (subFilter === 'private') {
      if (is108) return false;
      if (subCat !== 'private') return false;
    } else if (subFilter === 'government') {
      if (subCat !== 'government' && !is108) return false;
    }

    // 3. Size Category filter
    if (sizeFilter !== 'all') {
      const sizeCat = amb.size_category || 'medium';
      if (sizeCat !== sizeFilter) return false;
    }

    // 4. Additional Services filter
    if (selectedServices.patient_shifting && !amb.patient_shifting) return false;
    if (selectedServices.dead_body_transport && !amb.dead_body_transport) return false;
    if (selectedServices.tn_to_wb && !amb.tn_to_wb) return false;
    if (selectedServices.wb_to_tn && !amb.wb_to_tn) return false;

    // 5. City filter
    if (city && amb.city !== city) return false;

    // 6. Search query filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const nameMatch = amb.name?.toLowerCase().includes(q);
      const addressMatch = amb.address?.toLowerCase().includes(q);
      const notesMatch = amb.source_notes?.toLowerCase().includes(q);
      const specMatch = amb.specialization?.toLowerCase().includes(q);
      if (!nameMatch && !addressMatch && !notesMatch && !specMatch) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* SOS Banner */}
      <div className="bg-red-600 text-white">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
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

      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Emergency Numbers */}
        <h2 className="text-2xl font-bold font-display mb-6">Emergency Numbers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
          {emergencyNumbers.map((em) => (
            <a key={em.number} href={`tel:${em.number}`}>
              <Card className="group flex items-center gap-4 hover:border-red-300">
                <div className="w-14 h-14 rounded-2xl bg-surface border border-border/40 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                  {em.icon(em.color)}
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

        {/* Directory Header with Local/Flight Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold font-display">Ambulance Directory</h2>
            <p className="text-text-muted text-sm mt-1">Browse and filter verified medical transport services</p>
            
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3 relative z-30">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px] md:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  placeholder="Search ambulances by name or area..." 
                  className="w-full pl-10 pr-4 py-2 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" 
                />
              </div>

              {/* City select */}
              <select 
                value={city} 
                onChange={(e) => setCity(e.target.value)} 
                className="px-4 py-2 rounded-xl border border-border text-sm bg-white cursor-pointer min-w-[160px]"
              >
                <option value="">All Cities</option>
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Mobile Filters Toggle */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-border rounded-xl text-sm font-semibold text-text-primary hover:bg-neutral-50 shadow-sm"
            >
              <ListFilter className="w-4 h-4 text-primary" /> Filters
            </button>

            {/* Horizontal tabs removed - Filter moved to sidebar/modal */}
          </div>
        </div>

        {/* Two-Column Grid: Left Sidebar (Filters), Right Content (Listings) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* 1. Sidebar Filters (Desktop View) */}
          <div className="hidden lg:block bg-white rounded-[24px] border border-border/80 shadow-sm overflow-hidden p-6 space-y-8">
            <div className="flex items-center gap-2 border-b border-border/50 pb-4">
              <ListFilter className="w-5 h-5 text-text-primary" />
              <h3 className="font-bold text-lg text-text-primary">Filters</h3>
            </div>

            {/* 1. TRANSPORT TYPE */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-4 bg-[#D85A30] rounded-full" />
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Transport Type</span>
              </div>
              <div className="space-y-1">
                {[
                  { value: 'all', label: 'All Types' },
                  { value: 'local', label: 'Local (Road)' },
                  { value: 'flight', label: 'Flight (Air)' },
                  { value: 'train', label: 'Train (Rail)' },
                ].map((opt) => {
                  const isActive = mainTab === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleMainTabChange(opt.value as any)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isActive 
                          ? 'bg-[#D85A30] text-white font-bold' 
                          : 'text-text-primary hover:bg-neutral-50 hover:text-primary'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isActive && <CheckCircle2 className="w-4 h-4 text-white fill-white/20" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. AGENCY CATEGORY */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-4 bg-[#D85A30] rounded-full" />
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Agency Category</span>
              </div>
              <div className="space-y-1">
                {[
                  { value: 'all', label: 'All Services' },
                  { value: 'government', label: 'Government' },
                  { value: 'private', label: 'Private' },
                ].map((opt) => {
                  const isActive = subFilter === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setSubFilter(opt.value as any)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isActive 
                          ? 'bg-[#D85A30] text-white font-bold' 
                          : 'text-text-primary hover:bg-neutral-50 hover:text-primary'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isActive && <CheckCircle2 className="w-4 h-4 text-white fill-white/20" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* B. AMBULANCE SIZE */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-4 bg-[#D85A30] rounded-full" />
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Ambulance Size</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'all', label: 'All Sizes' },
                  { value: 'small', label: 'Small' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'large', label: 'Large' },
                ].map((opt) => {
                  const isActive = sizeFilter === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setSizeFilter(opt.value as any)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                        isActive 
                          ? 'bg-[#D85A30] border-[#D85A30] text-white font-bold' 
                          : 'bg-white border-border hover:border-neutral-400 text-text-primary'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* C. ADDITIONAL SERVICES */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-4 bg-[#D85A30] rounded-full" />
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Additional Services</span>
              </div>
              <div className="space-y-1">
                {[
                  { key: 'patient_shifting', label: 'Patient Shifting', icon: <BriefcaseMedical className="w-4 h-4 shrink-0" /> },
                  { key: 'dead_body_transport', label: 'Dead Body Transport', icon: <Truck className="w-4 h-4 shrink-0" /> },
                  { key: 'tn_to_wb', label: 'Interstate (TN → WB)', icon: <ArrowLeftRight className="w-4 h-4 shrink-0" /> },
                  { key: 'wb_to_tn', label: 'Interstate (WB → TN)', icon: <ArrowLeftRight className="w-4 h-4 shrink-0" /> },
                ].map((srv) => {
                  const isActive = selectedServices[srv.key as keyof typeof selectedServices];
                  return (
                    <button
                      key={srv.key}
                      onClick={() => toggleService(srv.key as any)}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold transition-all ${
                        isActive 
                          ? 'bg-[#D85A30] text-white shadow-md' 
                          : 'text-text-primary hover:bg-neutral-50'
                      }`}
                    >
                      {srv.icon}
                      <span>{srv.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 2. Listings Container (Right side) */}
          <div className="lg:col-span-3 space-y-4">
            {loading ? (
              <div className="grid grid-cols-1 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 gap-6 bg-white rounded-[24px] border border-border">
                    <div className="flex-1 space-y-3">
                      <Skeleton className="w-24 h-6 rounded-full" />
                      <Skeleton className="w-64 h-8" />
                      <Skeleton className="w-48 h-4" />
                    </div>
                    <Skeleton className="w-full md:w-40 h-12 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                {filteredAmbulances.map((amb) => {
                  const features = [
                    { key: 'icu_ambulance', label: 'ICU' },
                    { key: 'cardiac_ambulance', label: 'Cardiac' },
                    { key: 'neonatal_ambulance', label: 'Neonatal' },
                    { key: 'ventilator_ambulance', label: 'Ventilator' },
                    { key: 'nurse_support', label: 'Nurse Support' },
                    { key: 'multi_specialty', label: 'Multi-Specialty' },
                  ].filter(f => (amb as any)[f.key]);

                  const additionalList = [
                    { key: 'patient_shifting', label: 'Patient Shifting' },
                    { key: 'dead_body_transport', label: 'Dead Body Transportation' },
                    { key: 'tn_to_wb', label: 'TN to West Bengal' },
                    { key: 'wb_to_tn', label: 'West Bengal to TN' },
                  ].filter(srv => (amb as any)[srv.key]);

                  return (
                    <Card key={amb.id} padding="none" className="flex flex-col md:flex-row items-stretch justify-between p-6 gap-6 hover:shadow-lg transition-all border border-gray-100 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] bg-white rounded-[24px] w-full">
                      
                      {/* Left details */}
                      <div className="flex-1 min-w-0 text-left flex flex-col justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Main Category Badge */}
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 text-neutral-800 border border-neutral-200 text-xs font-bold rounded-full uppercase tracking-wider">
                              {amb.main_category === 'flight' ? <Plane className="w-3 h-3" /> : amb.main_category === 'train' ? <Train className="w-3 h-3" /> : <Truck className="w-3 h-3" />}
                              {amb.main_category === 'flight' ? 'Flight' : amb.main_category === 'train' ? 'Train' : 'Local'}
                            </span>

                            {/* Sub Category Badge */}
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 text-neutral-800 border border-neutral-200 text-xs font-bold rounded-full uppercase tracking-wider">
                              {(amb.sub_category || 'private') === 'government' ? 'Government' : 'Private'}
                            </span>

                            {/* Size Badge */}
                            {amb.size_category && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 text-neutral-800 border border-neutral-200 text-xs font-bold rounded-full uppercase tracking-wider">
                                {amb.size_category} Size
                              </span>
                            )}
                          </div>
                          
                          <h3 className="text-xl font-bold text-gray-900 leading-tight font-display flex flex-wrap items-center gap-2">
                            {amb.name}
                            {amb.specialization && (
                              <span className="text-xs font-medium text-text-muted bg-surface border border-border px-2.5 py-0.5 rounded-lg">
                                {amb.specialization}
                              </span>
                            )}
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

                          {/* Address */}
                          {amb.address && (
                            <p className="text-xs text-text-muted leading-relaxed max-w-2xl">
                              {amb.address}
                            </p>
                          )}
                        </div>

                        {/* Features badges */}
                        {features.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {features.map(f => (
                              <span key={f.key} className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FFF0EB] text-[#A63A13] text-xs font-bold rounded-lg border border-[#FBE0D6]/60">
                                <Zap className="w-3 h-3 text-[#A63A13]" />
                                {f.label}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Middle details */}
                      <div className="flex flex-col justify-center gap-3 min-w-[220px] text-left md:border-l md:border-border md:pl-6">
                        
                        {amb.eta && (
                          <div className="flex items-center gap-2 text-sm text-[#5F6368] font-semibold">
                            <Clock className="w-4.5 h-4.5 text-[#A63A13] shrink-0" />
                            <span>ETA: {amb.eta}</span>
                          </div>
                        )}
                        
                        {amb.equipment && (
                          <div className="flex items-center gap-2 text-sm text-[#5F6368]">
                            <BriefcaseMedical className="w-4.5 h-4.5 text-[#0A6C4A] shrink-0" />
                            <span className="truncate max-w-[200px]" title={amb.equipment}>{amb.equipment}</span>
                          </div>
                        )}

                        {additionalList.length > 0 && (
                          <div className="space-y-1 mt-2">
                            <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Additional Services</span>
                            <div className="flex flex-wrap gap-1">
                              {additionalList.map(srv => (
                                <span key={srv.key} className="inline-block bg-neutral-100 text-neutral-700 text-[10px] font-semibold px-2 py-0.5 rounded">
                                  {srv.label}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right actions */}
                      <div className="flex flex-row md:flex-col items-center justify-end gap-3 shrink-0 md:border-l md:border-border md:pl-6 w-full md:w-auto">
                        {amb.google_maps_url && (
                          <a href={amb.google_maps_url} target="_blank" rel="noopener noreferrer" title="View on Map" className="shrink-0 w-11 h-11 md:w-full">
                            <button className="h-11 w-11 md:w-full bg-[#FFF0EB] hover:bg-[#FFE5DC] text-[#A63A13] rounded-full md:rounded-xl flex items-center justify-center md:gap-2 transition-all active:scale-[0.98] border border-[#FBE0D6]/60 text-sm font-semibold md:px-4">
                              <MapPin className="w-5 h-5 text-[#A63A13] shrink-0" />
                              <span className="hidden md:inline">View Location</span>
                            </button>
                          </a>
                        )}

                        {amb.phone && (
                          <a href={`tel:${amb.phone}`} className="flex-1 md:flex-none md:w-full">
                            <button className="w-full h-11 bg-[#d85a30] hover:bg-[#c24f28] text-white font-bold rounded-full md:rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] md:px-6">
                              <Phone className="w-4 h-4 text-white fill-white" />
                              <span>Call Agency</span>
                            </button>
                          </a>
                        )}
                      </div>
                    </Card>
                  );
                })}
                {filteredAmbulances.length === 0 && (
                  <div className="text-center py-16 bg-white rounded-3xl border border-border border-dashed text-text-muted italic">
                    No ambulance services registered under the selected filters.
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* 3. Mobile Filter Modal/Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[100] lg:hidden flex items-end justify-center p-0">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
          
          <div className="relative bg-white w-full rounded-t-[28px] max-h-[85vh] overflow-y-auto flex flex-col p-6 space-y-6 animate-slide-up z-10">
            <div className="flex items-center justify-between border-b border-border/50 pb-4">
              <div className="flex items-center gap-2">
                <ListFilter className="w-5 h-5 text-text-primary" />
                <h3 className="font-bold text-lg text-text-primary">Filters</h3>
              </div>
              <button 
                onClick={() => setShowMobileFilters(false)} 
                className="text-xs font-bold text-text-muted hover:text-text-primary cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* 1. TRANSPORT TYPE */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-4 bg-[#D85A30] rounded-full" />
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Transport Type</span>
              </div>
              <div className="space-y-1">
                {[
                  { value: 'all', label: 'All Types' },
                  { value: 'local', label: 'Local (Road)' },
                  { value: 'flight', label: 'Flight (Air)' },
                  { value: 'train', label: 'Train (Rail)' },
                ].map((opt) => {
                  const isActive = mainTab === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => { handleMainTabChange(opt.value as any); setShowMobileFilters(false); }}
                      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                        isActive 
                          ? 'bg-[#D85A30] text-white font-bold' 
                          : 'text-text-primary bg-neutral-50'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isActive && <CheckCircle2 className="w-4 h-4 text-white fill-white/20" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. AGENCY CATEGORY */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-4 bg-[#D85A30] rounded-full" />
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Agency Category</span>
              </div>
              <div className="space-y-1">
                {[
                  { value: 'all', label: 'All Services' },
                  { value: 'government', label: 'Government' },
                  { value: 'private', label: 'Private' },
                ].map((opt) => {
                  const isActive = subFilter === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => { setSubFilter(opt.value as any); setShowMobileFilters(false); }}
                      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                        isActive 
                          ? 'bg-[#D85A30] text-white font-bold' 
                          : 'text-text-primary bg-neutral-50'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isActive && <CheckCircle2 className="w-4 h-4 text-white fill-white/20" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* B. AMBULANCE SIZE */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-4 bg-[#D85A30] rounded-full" />
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Ambulance Size</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'all', label: 'All Sizes' },
                  { value: 'small', label: 'Small' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'large', label: 'Large' },
                ].map((opt) => {
                  const isActive = sizeFilter === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setSizeFilter(opt.value as any)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                        isActive 
                          ? 'bg-[#D85A30] border-[#D85A30] text-white font-bold' 
                          : 'bg-white border-border text-text-primary'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* C. ADDITIONAL SERVICES */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-4 bg-[#D85A30] rounded-full" />
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Additional Services</span>
              </div>
              <div className="space-y-1.5">
                {[
                  { key: 'patient_shifting', label: 'Patient Shifting', icon: <BriefcaseMedical className="w-4 h-4 shrink-0" /> },
                  { key: 'dead_body_transport', label: 'Dead Body Transport', icon: <Truck className="w-4 h-4 shrink-0" /> },
                  { key: 'tn_to_wb', label: 'Interstate (TN → WB)', icon: <ArrowLeftRight className="w-4 h-4 shrink-0" /> },
                  { key: 'wb_to_tn', label: 'Interstate (WB → TN)', icon: <ArrowLeftRight className="w-4 h-4 shrink-0" /> },
                ].map((srv) => {
                  const isActive = selectedServices[srv.key as keyof typeof selectedServices];
                  return (
                    <button
                      key={srv.key}
                      onClick={() => toggleService(srv.key as any)}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold transition-all ${
                        isActive 
                          ? 'bg-[#D85A30] text-white' 
                          : 'bg-neutral-50 text-text-primary'
                      }`}
                    >
                      {srv.icon}
                      <span>{srv.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Close panel hint */}
            <div className="pt-4 border-t border-border/50">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full py-4 bg-neutral-100 hover:bg-neutral-200 text-text-primary text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                Close Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
