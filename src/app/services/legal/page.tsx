'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Scale, Shield, FileText, Building, Phone, MapPin, ExternalLink,
  Search, Clock, Navigation, X, ChevronDown, AlertTriangle,
  Gavel, BookOpen, Users, Home, Briefcase, Heart,
  Globe, CheckCircle, HelpCircle, ArrowRight, PhoneCall,
  BadgeCheck, Landmark, Loader2,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import type { LegalAidCentre, LegalCategory, LegalHelpline, LegalPortal } from '@/types';

// Dynamic data loaded from Firebase

/* ─── Centre Row ─── */
function AidCentreRow({ centre }: { centre: LegalAidCentre }) {
  const mapUrl = centre.google_maps_url
    || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${centre.name}, ${centre.city}`)}`;
  return (
    <div className="p-4 bg-surface/60 border border-border rounded-xl hover:border-primary/40 hover:bg-white hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-2">
        <h5 className="font-semibold text-sm text-text-primary leading-tight flex-1">{centre.name}</h5>
        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">{centre.centre_type || 'Centre'}</span>
      </div>
      <p className="text-xs text-text-muted mt-2 flex items-start gap-1.5">
        <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary/60" />
        <span>{centre.address}</span>
      </p>
      {centre.phone && (
        <p className="text-xs text-text-muted mt-1 flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5 shrink-0 text-primary/60" />
          <a href={`tel:${centre.phone}`} className="text-primary hover:underline font-medium">{centre.phone}</a>
        </p>
      )}
      {centre.timings && (
        <p className="text-xs text-text-muted mt-1 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 shrink-0 text-primary/60" />
          {centre.timings}
        </p>
      )}
      <div className="mt-3 pt-2 border-t border-border/60">
        <a href={mapUrl} target="_blank" rel="noopener noreferrer"
          className="text-xs font-semibold text-primary inline-flex items-center gap-1.5 bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors">
          <Navigation className="w-3.5 h-3.5" /> View on Google Maps <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

/* ─── Centres Modal ─── */
function AidCentresModal({ open, onClose, centres }: { open: boolean; onClose: () => void, centres: LegalAidCentre[] }) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    if (!query.trim()) return centres;
    const q = query.toLowerCase();
    return centres.filter(c =>
      c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q) ||
      (c.address || '').toLowerCase().includes(q) || (c.district || '').toLowerCase().includes(q)
    );
  }, [query, centres]);

  const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent('District Legal Services Authority' + (query.trim() ? ' ' + query.trim() : ' Tamil Nadu'))}`;

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div>
            <h3 className="text-sm font-bold text-text-primary">Free Legal Aid Centres – Tamil Nadu</h3>
            <p className="text-xs text-text-muted mt-0.5">{filtered.length} centre{filtered.length !== 1 ? 's' : ''} found</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface transition-colors cursor-pointer">
            <X className="w-4 h-4 text-text-muted" />
          </button>
        </div>
        <div className="px-5 py-3 border-b border-border shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input autoFocus type="text" placeholder="Search by city, district or name..."
              value={query} onChange={e => setQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
          </div>
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
            className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors">
            <Navigation className="w-4 h-4" />
            Search &quot;Legal Aid{query.trim() ? ` in ${query.trim()}` : ' near me'}&quot; on Google Maps
            <ExternalLink className="w-3.5 h-3.5 ml-auto" />
          </a>
        </div>
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-10">
              <MapPin className="w-10 h-10 text-border mx-auto mb-3" />
              <p className="text-sm font-medium text-text-muted">No results found</p>
            </div>
          ) : filtered.map(c => <AidCentreRow key={c.id} centre={c} />)}
        </div>
      </div>
    </div>
  );
}

/* ─── Color map ─── */
const colorMap: Record<string, { bg: string; iconCls: string; border: string; badge: string }> = {
  blue:   { bg: 'bg-blue-50',   iconCls: 'text-blue-600 bg-blue-100',   border: 'border-blue-200/60 hover:border-blue-400',   badge: 'text-blue-700 bg-blue-100' },
  green:  { bg: 'bg-green-50',  iconCls: 'text-green-600 bg-green-100', border: 'border-green-200/60 hover:border-green-400', badge: 'text-green-700 bg-green-100' },
  purple: { bg: 'bg-purple-50', iconCls: 'text-purple-600 bg-purple-100',border: 'border-purple-200/60 hover:border-purple-400',badge: 'text-purple-700 bg-purple-100' },
  amber:  { bg: 'bg-amber-50',  iconCls: 'text-amber-600 bg-amber-100', border: 'border-amber-200/60 hover:border-amber-400', badge: 'text-amber-700 bg-amber-100' },
  red:    { bg: 'bg-red-50',    iconCls: 'text-red-600 bg-red-100',     border: 'border-red-200/60 hover:border-red-400',     badge: 'text-red-700 bg-red-100' },
  slate:  { bg: 'bg-slate-50',  iconCls: 'text-slate-600 bg-slate-100', border: 'border-slate-200/60 hover:border-slate-400', badge: 'text-slate-700 bg-slate-100' },
};

/* ─── Icon Mapping ─── */
const ICONS: Record<string, React.ReactNode> = {
  Briefcase: <Briefcase className="w-5 h-5" />,
  Home: <Home className="w-5 h-5" />,
  Shield: <Shield className="w-5 h-5" />,
  Gavel: <Gavel className="w-5 h-5" />,
  Heart: <Heart className="w-5 h-5" />,
  BadgeCheck: <BadgeCheck className="w-5 h-5" />,
  Scale: <Scale className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  Landmark: <Landmark className="w-5 h-5" />,
  AlertTriangle: <AlertTriangle className="w-5 h-5" />,
};

/* ─── Category Card ─── */
function CategoryCard({ cat }: { cat: LegalCategory }) {
  const [expanded, setExpanded] = useState(false);
  const c = colorMap[cat.color] || colorMap.blue;
  const icon = ICONS[cat.icon_name] || <BookOpen className="w-5 h-5" />;
  return (
    <Card padding="none" className={`flex flex-col border ${c.border} ${c.bg} hover:shadow-lg transition-all duration-300 h-full`}>
      <div className="flex items-start gap-3 p-5 pb-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${c.iconCls}`}>{icon}</div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-text-primary leading-snug">{cat.label}</h3>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5 inline-block ${c.badge}`}>Legal Rights</span>
        </div>
      </div>
      <p className="text-xs text-text-muted px-5 pb-3 leading-relaxed">{cat.description}</p>
      {cat.helplines && cat.helplines.length > 0 && (
        <div className="mx-5 mb-3 flex flex-wrap gap-2">
          {cat.helplines.map(h => (
            <a key={h.number} href={`tel:${h.number}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-white border border-border px-2.5 py-1 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all">
              <PhoneCall className="w-3 h-3" /> {h.number}
            </a>
          ))}
        </div>
      )}
      <div className="border-t border-border/60 mt-auto">
        <button onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-5 py-3 text-xs font-bold text-text-muted hover:text-text-primary transition-colors cursor-pointer">
          <span>Steps & Online Portals</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
        {expanded && (
          <div className="px-5 pb-5 space-y-4">
            <div>
              <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2">How to proceed</p>
              <ol className="space-y-2">
                {cat.steps.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs">
                    <span className="w-5 h-5 rounded-full bg-white border border-border text-[10px] font-black text-primary flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                    <div><span className="font-bold text-text-primary">{s.title}:</span>{' '}<span className="text-text-muted">{s.desc}</span></div>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2">Online portals</p>
              <div className="space-y-1.5">
                {cat.portals.map(p => (
                  <a key={p.url} href={p.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-between gap-2 p-2.5 bg-white border border-border rounded-xl hover:border-primary/40 hover:shadow-sm transition-all group">
                    <div>
                      <p className="text-xs font-bold text-text-primary group-hover:text-primary transition-colors">{p.label}</p>
                      <p className="text-[10px] text-text-muted">{p.desc}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-text-muted group-hover:text-primary transition-colors shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

/* ─── Main Page ─── */
export default function LegalServicesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  const [centres, setCentres] = useState<LegalAidCentre[]>([]);
  const [categories, setCategories] = useState<LegalCategory[]>([]);
  const [helplines, setHelplines] = useState<LegalHelpline[]>([]);
  const [portals, setPortals] = useState<LegalPortal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDocs(collection(db, 'legal_services'));
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
        
        setCentres(items.filter(i => i.type === 'centre'));
        setCategories(items.filter(i => i.type === 'category'));
        setHelplines(items.filter(i => i.type === 'helpline'));
        setPortals(items.filter(i => i.type === 'portal'));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    return categories.filter(c =>
      c.label.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    );
  }, [search, categories]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <AidCentresModal open={modalOpen} onClose={() => setModalOpen(false)} centres={centres} />

      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/services/government" className="hover:text-primary">Services</Link>
            <span>/</span>
            <span className="text-text-primary font-medium">Legal Services</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold font-display text-text-primary flex items-center gap-3">
                <Scale className="w-9 h-9 text-primary shrink-0" /> Legal Services
              </h1>
              <p className="mt-2 text-text-muted text-sm max-w-2xl">
                Know your rights, access free legal aid, find nearby legal aid centres, and reach official government portals — all in one place.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <button onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm cursor-pointer">
                <MapPin className="w-4 h-4" /> Find Free Legal Aid Near Me
              </button>
              <a href="tel:15100"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-border rounded-xl text-sm font-semibold hover:border-primary hover:text-primary transition-colors">
                <PhoneCall className="w-4 h-4" /> NALSA: 15100
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

        {/* Free Legal Aid Banner */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Scale className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-text-primary">You are entitled to FREE Legal Aid</h2>
            <p className="text-sm text-text-muted mt-0.5">
              Under the <strong>Legal Services Authorities Act, 1987</strong>, if your income is below Rs 3 lakh/year — or for all women, SC/ST, minors, and trafficking victims — you have the right to free legal representation.
            </p>
          </div>
          <button onClick={() => setModalOpen(true)}
            className="shrink-0 text-sm font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer">
            Find Centre <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Emergency Helplines */}
        <section>
          <h2 className="text-xl font-bold font-display text-text-primary flex items-center gap-2 mb-4">
            <PhoneCall className="w-5 h-5 text-primary shrink-0" /> Emergency Legal Helplines
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {helplines.map(h => (
              <a key={h.id} href={`tel:${h.number}`}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center gap-1 hover:shadow-md transition-all cursor-pointer ${h.color || 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                <PhoneCall className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium opacity-80">{h.label}</span>
                <span className="text-lg font-extrabold tracking-tight">{h.number}</span>
              </a>
            ))}
          </div>
        </section>

        {/* Legal Categories */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl font-bold font-display text-text-primary flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary shrink-0" /> Know Your Rights
              </h2>
              <p className="text-sm text-text-muted mt-1">Tap any category to see step-by-step guidance and official portals.</p>
            </div>
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search legal topic..." className="w-full pl-9 pr-4 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCategories.map(cat => <CategoryCard key={cat.id} cat={cat} />)}
            {filteredCategories.length === 0 && (
              <div className="col-span-3 text-center py-16 text-text-muted">
                <HelpCircle className="w-12 h-12 mx-auto mb-3 text-border" />
                <p className="font-semibold">No matching legal topics found.</p>
              </div>
            )}
          </div>
        </section>

        {/* DLSA CTA Section */}
        <section>
          <div className="bg-white border border-border rounded-2xl overflow-hidden">
            <div className="p-6 flex flex-col sm:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0">
                <Landmark className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-bold text-lg text-text-primary">District Legal Services Authority (DLSA)</h3>
                <p className="text-sm text-text-muted mt-1">
                  Free legal consultations, free court representation, Lok Adalat referrals, and awareness camps. Available in all 38 districts of Tamil Nadu.
                </p>
              </div>
              <button onClick={() => setModalOpen(true)}
                className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors cursor-pointer">
                <MapPin className="w-4 h-4" /> Find Nearest Centre
              </button>
            </div>
            <div className="border-t border-border grid grid-cols-2 sm:grid-cols-4 divide-x divide-border">
              {[
                { label: 'Districts Covered', value: '38', icon: <MapPin className="w-4 h-4" /> },
                { label: 'DLSA Centres', value: '12+', icon: <Building className="w-4 h-4" /> },
                { label: 'Free for All Women', value: '100%', icon: <CheckCircle className="w-4 h-4" /> },
                { label: 'NALSA Helpline', value: '15100', icon: <PhoneCall className="w-4 h-4" /> },
              ].map(f => (
                <div key={f.label} className="flex items-center gap-3 px-5 py-4">
                  <span className="text-primary/60">{f.icon}</span>
                  <div>
                    <div className="text-lg font-extrabold text-text-primary">{f.value}</div>
                    <div className="text-xs text-text-muted">{f.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Important Portals */}
        <section>
          <h2 className="text-xl font-bold font-display text-text-primary flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-primary shrink-0" /> Important Legal Portals
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {portals.map(p => {
              const icon = ICONS[p.icon_name] || <ExternalLink className="w-5 h-5" />;
              return (
                <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-white border border-border rounded-xl hover:border-primary/40 hover:shadow-md transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">{p.label}</p>
                    <p className="text-xs text-text-muted">{p.desc}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors shrink-0" />
                </a>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}
