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
  const [bengaliOnly, setBengaliOnly] = useState(false);

  useEffect(() => {
    async function fetchAmbulances() {
      try {
        const res = await fetch('/api/public/firestore?collection=ambulances');
        const data = await res.json();
        const items: Ambulance[] = Array.isArray(data) ? data : (data.items || []);
        const sorted = items.sort((a: Ambulance, b: Ambulance) => {
          const getScore = (item: Ambulance) => {
            let score = 0;
            if (item.bengali_speaking) score += 5;
            if (item.contact_person_name) score += 3;
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
          return getScore(b) - getScore(a);
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

    // 4. Bengali Support filter
    if (bengaliOnly && !amb.bengali_speaking && !amb.contact_person_name) return false;

    // 5. Additional Services filter
    if (selectedServices.patient_shifting && !amb.patient_shifting) return false;
    if (selectedServices.dead_body_transport && !amb.dead_body_transport) return false;
    if (selectedServices.tn_to_wb && !amb.tn_to_wb) return false;
    if (selectedServices.wb_to_tn && !amb.wb_to_tn) return false;

    // 6. City filter
    if (city && amb.city !== city) return false;

    // 7. Search query filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const nameMatch = amb.name?.toLowerCase().includes(q);
      const addressMatch = amb.address?.toLowerCase().includes(q);
      const notesMatch = amb.source_notes?.toLowerCase().includes(q);
      const specMatch = amb.specialization?.toLowerCase().includes(q);
      const contactMatch = amb.contact_person_name?.toLowerCase().includes(q);
      const contactPhoneMatch = amb.contact_person_phone?.toLowerCase().includes(q);
      if (!nameMatch && !addressMatch && !notesMatch && !specMatch && !contactMatch && !contactPhoneMatch) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* SOS Modal */}
      {showSOS && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setShowSOS(false)}>
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-3 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-center text-red-600 mb-4">⚠️ Emergency Quick Dial</h2>
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

      {/* Main Container: Immediate above-the-fold search, filter, and listings */}
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Breadcrumb & Compact Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-6 border-b border-border/70">
          <div>
            <div className="flex items-center gap-2 text-xs text-text-muted mb-1.5">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <span className="text-text-primary font-semibold">Ambulance Directory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-text-primary flex items-center gap-2.5">
              <Truck className="w-7 h-7 text-[#D85A30]" />
              Ambulance Directory & SOS
            </h1>
            <p className="text-text-muted text-xs sm:text-sm mt-0.5">
              Find verified road, train, and air ambulance services with Bengali support
            </p>
          </div>

          {/* Search, City & Action bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-72 min-w-[200px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                placeholder="Search ambulance, area, coordinator..." 
                className="w-full pl-10 pr-4 py-2 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D85A30]/30 shadow-xs" 
              />
            </div>

            {/* City Selector */}
            <select 
              value={city} 
              onChange={(e) => setCity(e.target.value)} 
              className="px-3.5 py-2 rounded-xl border border-border text-sm bg-white cursor-pointer min-w-[140px] shadow-xs outline-none focus:ring-2 focus:ring-[#D85A30]/30"
            >
              <option value="">All Cities</option>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>

            {/* Quick SOS Trigger Button */}
            <button
              onClick={() => setShowSOS(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer shrink-0 animate-pulse-glow"
            >
              <Siren className="w-4 h-4" />
              <span>SOS (108 / 112)</span>
            </button>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-border rounded-xl text-sm font-semibold text-text-primary hover:bg-neutral-50 shadow-xs"
            >
              <ListFilter className="w-4 h-4 text-[#D85A30]" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Two-Column Grid: Left Sidebar (Emergency Numbers + Filters), Right Content (Listings) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* 1. Sidebar (Desktop View) */}
          <div className="hidden lg:block space-y-6">

            {/* Emergency Speed Dial Card */}
            <div className="bg-white rounded-3xl border border-border/80 p-5 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                    <Siren className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-text-primary tracking-tight">Emergency Speed Dial</h3>
                </div>
                <span className="text-[10px] bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-full font-bold">24x7</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Ambulance', number: '108', desc: 'Govt. 108', numColor: 'text-red-600' },
                  { label: 'Emergency', number: '112', desc: 'All Helplines', numColor: 'text-neutral-900' },
                  { label: 'Police', number: '100', desc: 'TN Police', numColor: 'text-blue-600' },
                  { label: 'Fire', number: '101', desc: 'Fire Rescue', numColor: 'text-orange-600' },
                ].map((item) => (
                  <a
                    key={item.number}
                    href={`tel:${item.number}`}
                    className="flex flex-col p-2.5 bg-surface/50 hover:bg-surface rounded-2xl border border-border/60 hover:border-red-200 transition-all text-left group"
                  >
                    <span className="text-[10px] text-text-muted font-medium group-hover:text-text-primary transition-colors">{item.label}</span>
                    <span className={`text-lg font-black leading-tight ${item.numColor}`}>{item.number}</span>
                  </a>
                ))}
              </div>
            </div>
            
            {/* Filters Box */}
            <div className="bg-white rounded-3xl border border-border/80 shadow-xs overflow-hidden p-5 space-y-6">
              <div className="flex items-center gap-2 border-b border-border/50 pb-3">
                <ListFilter className="w-4 h-4 text-[#D85A30]" />
                <h3 className="font-bold text-sm text-text-primary">Filter Ambulance Services</h3>
              </div>

              {/* BENGALI SUPPORT FILTER */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-3.5 bg-[#D85A30] rounded-full" />
                  <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Bengali Support</span>
                </div>
                <button
                  onClick={() => setBengaliOnly(prev => !prev)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                    bengaliOnly
                      ? 'bg-orange-50 border-orange-300 text-orange-700 shadow-xs ring-2 ring-orange-400/20'
                      : 'bg-surface/50 border-border hover:border-neutral-300 text-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-orange-600 text-white font-black text-[10px] flex items-center justify-center">
                      বং
                    </span>
                    <span>Bengali Speaking Only</span>
                  </div>
                  {bengaliOnly && <CheckCircle2 className="w-4 h-4 text-orange-600 fill-orange-100" />}
                </button>
              </div>

              {/* 1. TRANSPORT TYPE */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-3.5 bg-[#D85A30] rounded-full" />
                  <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Transport Type</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { value: 'all', label: 'All' },
                    { value: 'local', label: 'Local Road' },
                    { value: 'flight', label: 'Flight' },
                    { value: 'train', label: 'Train' },
                  ].map((opt) => {
                    const isActive = mainTab === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleMainTabChange(opt.value as any)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border text-center ${
                          isActive 
                            ? 'bg-[#D85A30] border-[#D85A30] text-white font-bold shadow-xs' 
                            : 'bg-surface/40 border-border hover:border-neutral-300 text-text-primary'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. AGENCY CATEGORY */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-3.5 bg-[#D85A30] rounded-full" />
                  <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Agency Category</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { value: 'all', label: 'All' },
                    { value: 'government', label: 'Govt' },
                    { value: 'private', label: 'Private' },
                  ].map((opt) => {
                    const isActive = subFilter === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setSubFilter(opt.value as any)}
                        className={`px-2.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border text-center ${
                          isActive 
                            ? 'bg-[#D85A30] border-[#D85A30] text-white font-bold shadow-xs' 
                            : 'bg-surface/40 border-border hover:border-neutral-300 text-text-primary'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. AMBULANCE SIZE */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-3.5 bg-[#D85A30] rounded-full" />
                  <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Ambulance Size</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
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
                        className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border text-center ${
                          isActive 
                            ? 'bg-[#D85A30] border-[#D85A30] text-white font-bold shadow-xs' 
                            : 'bg-surface/40 border-border hover:border-neutral-300 text-text-primary'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. ADDITIONAL SERVICES */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-3.5 bg-[#D85A30] rounded-full" />
                  <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Special Services</span>
                </div>
                <div className="space-y-1">
                  {[
                    { key: 'patient_shifting', label: 'Patient Shifting', icon: <BriefcaseMedical className="w-3.5 h-3.5 shrink-0" /> },
                    { key: 'dead_body_transport', label: 'Dead Body Transport', icon: <Truck className="w-3.5 h-3.5 shrink-0" /> },
                    { key: 'tn_to_wb', label: 'Interstate (TN → WB)', icon: <ArrowLeftRight className="w-3.5 h-3.5 shrink-0" /> },
                    { key: 'wb_to_tn', label: 'Interstate (WB → TN)', icon: <ArrowLeftRight className="w-3.5 h-3.5 shrink-0" /> },
                  ].map((srv) => {
                    const isActive = selectedServices[srv.key as keyof typeof selectedServices];
                    return (
                      <button
                        key={srv.key}
                        onClick={() => toggleService(srv.key as any)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isActive 
                            ? 'bg-[#D85A30] text-white shadow-xs' 
                            : 'bg-surface/30 hover:bg-surface text-text-primary border border-border/50'
                        }`}
                      >
                        {srv.icon}
                        <span className="truncate">{srv.label}</span>
                      </button>
                    );
                  })}
                </div>
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

                        {/* Bengali Contact Person Highlight Box */}
                        {(amb.bengali_speaking || amb.contact_person_name) && (
                          <div className="mt-2 p-3.5 bg-gradient-to-r from-orange-50/90 via-amber-50/70 to-orange-50/50 border border-orange-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                            <div className="flex items-center gap-3">
                              <div className="relative shrink-0">
                                <img 
                                  src={amb.bengali_contact_avatar || '/images/bengali_ambulance_contact_avatar.png'} 
                                  alt={amb.contact_person_name || 'Bengali Coordinator'} 
                                  className="w-12 h-12 rounded-2xl object-cover bg-white border-2 border-orange-300 shadow-sm"
                                />
                                <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white shadow-xs">
                                  ✓
                                </span>
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-sm font-bold text-neutral-900 font-display">
                                    {amb.contact_person_name || 'Bengali Support Coordinator'}
                                  </span>
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-600 text-white text-[10px] font-extrabold rounded-full tracking-wide uppercase shadow-xs">
                                    বাংলা সহায়তা
                                  </span>
                                </div>
                                <p className="text-xs text-neutral-600 mt-0.5">
                                  {amb.bengali_speaking 
                                    ? 'Bengali-speaking support available for patients & families' 
                                    : 'Direct Ambulance Coordinator'}
                                </p>
                              </div>
                            </div>

                            {amb.contact_person_phone && (
                              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                                <a 
                                  href={`tel:${amb.contact_person_phone}`}
                                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95"
                                >
                                  <Phone className="w-3.5 h-3.5 fill-white" />
                                  <span>Call {amb.contact_person_name ? amb.contact_person_name.split(' ')[0] : 'Coordinator'}</span>
                                </a>
                                <a 
                                  href={`https://wa.me/${amb.contact_person_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${amb.contact_person_name || ''}, I need ambulance assistance from ProbasiBangali.`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center w-8 h-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-xs active:scale-95"
                                  title="Chat on WhatsApp"
                                >
                                  <span className="text-xs font-bold">WA</span>
                                </a>
                              </div>
                            )}
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

            {/* BENGALI SUPPORT */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-4 bg-[#D85A30] rounded-full" />
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Bengali Support</span>
              </div>
              <button
                onClick={() => setBengaliOnly(prev => !prev)}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-sm font-bold transition-all ${
                  bengaliOnly
                    ? 'bg-orange-50 border-orange-300 text-orange-700 shadow-xs'
                    : 'bg-neutral-50 border-transparent text-neutral-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-orange-600 text-white font-black text-[10px] flex items-center justify-center">
                    বং
                  </span>
                  <span>Bengali Speaking Available</span>
                </div>
                {bengaliOnly && <CheckCircle2 className="w-4 h-4 text-orange-600 fill-orange-100" />}
              </button>
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
