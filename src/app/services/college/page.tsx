'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, MapPin, Phone, GraduationCap, Globe, ExternalLink, Navigation, ChevronDown, ChevronUp, Lock, ShieldAlert, Mail, ArrowRight, Loader2, Map, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/card';
import { sampleColleges } from '@/data/sample-data';
import { CITIES, COLLEGE_TYPES } from '@/lib/constants';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firestore/collections';
import { useAuth } from '@/lib/auth/AuthContext';
import type { College } from '@/types';

const CATEGORY_LABELS: Record<string, string> = {
  engineering: 'Engineering Colleges',
  medical: 'Medical Colleges',
  arts_science: 'Arts & Science Colleges'
};

const CATEGORY_THEMES: Record<string, { bg: string; text: string; iconBg: string; iconColor: string }> = {
  engineering: { bg: 'bg-blue-50', text: 'text-blue-700', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
  medical: { bg: 'bg-rose-50', text: 'text-rose-700', iconBg: 'bg-rose-100', iconColor: 'text-rose-600' },
  arts_science: { bg: 'bg-emerald-50', text: 'text-emerald-700', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' }
};

export default function CollegePage() {
  const { firebaseUser: user, profile } = useAuth();
  const [type, setType] = useState('');
  const [city, setCity] = useState('');
  const [search, setSearch] = useState('');
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCollegeForStaff, setSelectedCollegeForStaff] = useState<College | null>(null);


  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const snap = await getDocs(collection(db, COLLECTIONS.colleges));
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as College));
        setColleges(data.length > 0 ? data : sampleColleges);
      } catch (err) {
        console.error("Error fetching colleges:", err);
        setColleges(sampleColleges);
      } finally {
        setLoading(false);
      }
    };
    fetchColleges();
  }, []);

  useEffect(() => {
    // Empty effect to match previous structure
  }, []);

  const filtered = useMemo(() => {
    return colleges
      .filter((c) => {
        if (type && c.type !== type) return false;
        if (city && c.city !== city) return false;
        if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => {
        const rankA = a.ranking !== undefined && a.ranking !== null ? Number(a.ranking) : 9999;
        const rankB = b.ranking !== undefined && b.ranking !== null ? Number(b.ranking) : 9999;
        return rankA - rankB;
      });
  }, [type, city, search, colleges]);

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
            <Link href="/" className="hover:text-primary">Home</Link><span>/</span>
            <span className="text-text-primary font-medium">College Finder</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-text-primary">College Finder</h1>
          <p className="mt-2 text-text-muted">Find Engineering, Medical, and Arts & Science colleges in major districts of Tamil Nadu.</p>

          <div className="mt-6 flex flex-wrap gap-2">
            <button 
              onClick={() => setType('')} 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${!type ? 'bg-primary text-white shadow-md' : 'bg-white border border-border hover:border-primary'}`}
            >
              All Colleges
            </button>
            {COLLEGE_TYPES.map((ct) => (
              <button 
                key={ct} 
                onClick={() => setType(ct)} 
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${type === ct ? 'bg-primary text-white shadow-md' : 'bg-white border border-border hover:border-primary'}`}
              >
                {CATEGORY_LABELS[ct] || ct}
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                placeholder="Search colleges..." 
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" 
              />
            </div>
            <select 
              value={city} 
              onChange={(e) => setCity(e.target.value)} 
              className="px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">All Districts</option>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-text-muted text-sm font-medium">Loading colleges database...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((college) => {
                const theme = CATEGORY_THEMES[college.type || 'arts_science'] || CATEGORY_THEMES.arts_science;
                  return (
                    <Card key={college.id} padding="none" className="rounded-[24px] overflow-hidden group flex flex-col justify-between hover:shadow-lg transition-all border border-gray-100 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] bg-white">
                      <div>
                        {/* Image banner with floating badge */}
                        <div className="relative w-full h-44 bg-slate-100 overflow-hidden">
                          {college.image_url ? (
                            <img src={college.image_url} alt={college.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center">
                              <GraduationCap className="w-12 h-12 text-primary opacity-30 animate-pulse" />
                            </div>
                          )}
                          
                          {/* Floating Type/Category Badge (Top Right) */}
                          <div className="absolute top-4 right-4 shadow-sm z-10">
                            <span className="bg-[#EAF6F0]/90 backdrop-blur-md text-[#0A6C4A] text-xs font-bold px-3 py-1.5 rounded-full shadow-sm tracking-wide capitalize">
                              {CATEGORY_LABELS[college.type || '']?.replace(' Colleges', '') || college.type}
                            </span>
                          </div>
                        </div>

                        {/* Card Content Panel */}
                        <div className="p-5">
                          <div className="flex justify-between items-start gap-3">
                            <h3 className="text-lg font-bold text-gray-900 leading-tight font-display group-hover:text-primary transition-colors">
                              {college.name}
                            </h3>
                            {college.ranking !== undefined && college.ranking !== null && (
                              <span className="bg-amber-50 text-amber-700 font-extrabold text-[10px] px-2 py-0.5 rounded-md border border-amber-200/30 shrink-0">
                                Rank #{college.ranking}
                              </span>
                            )}
                          </div>

                          {/* Address Info */}
                          <div className="flex items-start gap-2 mt-3 text-sm text-[#5F6368] leading-relaxed">
                            <MapPin className="w-4 h-4 text-[#A63A13] shrink-0 mt-0.5" />
                            <span>{college.address || `${college.area}, ${college.city}`}</span>
                          </div>

                          {/* Helpline Info */}
                          {college.phone && (
                            <div className="flex items-center gap-2 mt-2.5 text-sm text-[#3C4043] font-medium">
                              <Phone className="w-4 h-4 text-[#0A6C4A] shrink-0" />
                              <span>Contact Helpline: <span className="font-bold text-gray-900">{college.phone}</span></span>
                            </div>
                          )}

                          {/* Associated Forums */}
                          {college.bengali_forums && college.bengali_forums.length > 0 && (
                            <div className="mt-4 bg-primary/5 p-3 rounded-2xl border border-primary/10">
                              <h4 className="text-[11px] font-bold text-primary mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                                👥 Bengali Forums & Communities
                              </h4>
                              <div className="space-y-1.5">
                                {college.bengali_forums.map((forum, idx) => (
                                  <a
                                    key={idx}
                                    href={forum.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between text-xs font-semibold text-text-primary hover:text-primary transition-colors group/link"
                                  >
                                    <span className="truncate">{forum.name}</span>
                                    <ExternalLink className="w-3.5 h-3.5 text-text-muted group-hover/link:text-primary transition-colors shrink-0" />
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Expandable Lecturers & Staff Section */}
                          <div className="mt-4 pt-0.5">
                            <Button
                              onClick={() => setSelectedCollegeForStaff(college)}
                              variant="ghost"
                              className="w-full justify-between py-3 text-xs font-bold border border-border/60 hover:bg-surface rounded-xl cursor-pointer h-auto"
                            >
                              <span>Bengali Lecturers & Staff ({college.staff_contacts?.length || 0})</span>
                              <ArrowRight className="w-4 h-4 text-text-muted" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Side-by-Side Action Buttons */}
                      <div className="flex items-center gap-3 mt-1 pt-4 border-t border-gray-100 p-5 pt-0">
                        <a href={college.website || '#'} target="_blank" rel="noopener noreferrer" className="flex-1">
                          <button className="w-full bg-[#d85a30] hover:bg-[#60210A] text-white font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]">
                            <Globe className="w-4 h-4" />
                            <span>Visit Website</span>
                          </button>
                        </a>
                        
                        <a href={college.google_maps_url || college.website || '#'} target="_blank" rel="noopener noreferrer" className="flex-1">
                          <button className="w-full bg-white hover:bg-slate-50 border border-[#E4E9F2] text-[#d85a30] font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]">
                            <Map className="w-4 h-4" />
                            <span>View on Map</span>
                          </button>
                        </a>
                      </div>
                    </Card>
                  );
                })}
              </div>

            {filtered.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl border border-border mt-6">
                <p className="text-5xl mb-4">🎓</p>
                <h3 className="text-xl font-bold text-text-primary mb-2">No colleges found</h3>
                <p className="text-text-muted text-sm">Try using different search keywords or district filters.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal for Lecturers & Staff */}
      {selectedCollegeForStaff && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-900 leading-snug">Bengali Faculty & Staff</h3>
                <p className="text-xs text-text-muted mt-0.5">{selectedCollegeForStaff.name}</p>
              </div>
              <button 
                onClick={() => setSelectedCollegeForStaff(null)}
                className="text-text-muted hover:text-text-primary p-2 hover:bg-slate-100 rounded-full transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
              {!user ? (
                <div className="p-6 bg-amber-50/50 border border-amber-200 rounded-2xl text-center">
                  <Lock className="w-8 h-8 text-amber-600 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-amber-800">Registration Required</h4>
                  <p className="text-xs text-amber-700/80 mt-1 max-w-sm mx-auto">Please login or register to view Bengali faculty contact details.</p>
                  <Link href="/auth/login?redirect=/services/college" className="mt-4 block">
                    <Button size="sm" variant="outline" className="w-full border-amber-300 text-amber-800 hover:bg-amber-100/50 font-semibold cursor-pointer">
                      Login to Account <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedCollegeForStaff.staff_contacts && selectedCollegeForStaff.staff_contacts.length > 0 ? (
                    selectedCollegeForStaff.staff_contacts.map((contact, cIdx) => (
                      <div key={cIdx} className="p-4 bg-surface rounded-2xl border border-border/50 text-xs">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-text-primary text-sm">{contact.name}</p>
                            <p className="text-text-muted mt-0.5 capitalize font-medium">{contact.role} • {contact.department}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {contact.phone && (
                            <a href={`tel:${contact.phone}`} className="flex items-center gap-1.5 px-3 py-2 bg-white border border-border rounded-xl text-text-primary hover:text-primary hover:border-primary/30 transition-all font-semibold shadow-sm">
                              <Phone className="w-3.5 h-3.5 text-primary" /> Call {contact.phone}
                            </a>
                          )}
                          {contact.email && (
                            <a href={`mailto:${contact.email}`} className="flex items-center gap-1.5 px-3 py-2 bg-white border border-border rounded-xl text-text-primary hover:text-primary hover:border-primary/30 transition-all font-semibold shadow-sm">
                              <Mail className="w-3.5 h-3.5 text-primary" /> Email
                            </a>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-text-muted text-center py-8">No Bengali lecturers or staff contacts listed for this college.</p>
                  )}
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-slate-50/80 border-t border-gray-100 flex justify-end">
              <Button 
                onClick={() => setSelectedCollegeForStaff(null)} 
                className="px-5 rounded-xl cursor-pointer"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
