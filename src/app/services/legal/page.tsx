'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Scale, Shield, FileText, Building, Building2, Phone, MapPin, ExternalLink,
  Search, Clock, Navigation, X, ChevronDown, AlertTriangle,
  Gavel, BookOpen, Users, Home, Briefcase, Heart,
  Globe, CheckCircle2, HelpCircle, ArrowRight, PhoneCall,
  BadgeCheck, Landmark, Loader2, Mail, Filter, CheckCircle
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import type { LegalAidCentre, LegalCategory, LegalHelpline, LegalPortal, LegalServiceListing } from '@/types';
import { INITIAL_LEGAL_SERVICES, LEGAL_CATEGORIES } from '@/data/legal-services-data';

/* ─── Category Badge Color Scheme ─── */
const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
  'Judiciary - High Court': {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    icon: <Gavel className="w-3.5 h-3.5" />
  },
  'Legal Services Authority': {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    icon: <Scale className="w-3.5 h-3.5" />
  },
  'Bar Council': {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    icon: <Users className="w-3.5 h-3.5" />
  },
  'Government - Law Department': {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    icon: <Landmark className="w-3.5 h-3.5" />
  },
  'Legal Education': {
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    border: 'border-sky-200',
    icon: <BookOpen className="w-3.5 h-3.5" />
  },
};

/* ─── Legal Service Listing Card ─── */
function LegalServiceCard({ item }: { item: LegalServiceListing }) {
  const catStyle = CATEGORY_COLORS[item.category] || {
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
    icon: <Building className="w-3.5 h-3.5" />
  };

  const mapUrl = item.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${item.name}, ${item.address}`)}`;
  
  // Format primary phone for tel: link
  const primaryPhone = item.phone ? item.phone.split(';')[0].split('/')[0].replace(/[^0-9+]/g, '') : null;

  return (
    <Card padding="none" className="flex flex-col bg-white border border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden h-full">
      {/* Top Category Strip */}
      <div className="p-5 pb-3 border-b border-slate-100 flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}>
            {catStyle.icon}
            {item.category}
          </span>
          {item.district && (
            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              {item.district}
            </span>
          )}
        </div>
        {item.verified !== false && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
            <CheckCircle2 className="w-3 h-3" /> Verified
          </span>
        )}
      </div>

      {/* Office Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-bold text-base text-text-primary leading-snug tracking-tight">
            {item.name}
          </h3>

          {/* Address */}
          <div className="mt-3 flex items-start gap-2 text-xs text-text-muted">
            <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span className="leading-relaxed">{item.address}</span>
          </div>

          {/* Phone */}
          {item.phone && (
            <div className="mt-2.5 flex items-start gap-2 text-xs">
              <Phone className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div className="flex-1 font-medium text-slate-700 leading-relaxed">
                {item.phone}
              </div>
            </div>
          )}

          {/* Email */}
          {item.email && (
            <div className="mt-2 flex items-center gap-2 text-xs">
              <Mail className="w-4 h-4 text-primary shrink-0" />
              <a href={`mailto:${item.email}`} className="text-primary hover:underline font-medium truncate">
                {item.email}
              </a>
            </div>
          )}

          {/* Timings */}
          {item.timings && (
            <div className="mt-2 flex items-center gap-2 text-xs text-text-muted">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{item.timings}</span>
            </div>
          )}

          {/* Description */}
          {item.description && (
            <p className="mt-3 text-xs text-text-muted leading-relaxed line-clamp-2 pt-2 border-t border-slate-100">
              {item.description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
          {primaryPhone && (
            <a
              href={`tel:${primaryPhone}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              <PhoneCall className="w-3 h-3" /> Call
            </a>
          )}
          
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface hover:bg-slate-200 border border-border text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            <Navigation className="w-3 h-3 text-primary" /> Directions
          </a>

          {item.website && (
            <a
              href={item.website.startsWith('http') ? item.website : `https://${item.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface hover:bg-slate-200 border border-border text-primary rounded-lg text-xs font-bold transition-colors ml-auto cursor-pointer"
            >
              <Globe className="w-3 h-3" /> Portal <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}

/* ─── Aid Centre Row in Modal ─── */
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

/* ─── Free Legal Aid Centres Modal ─── */
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

/* ─── Color map for Knowledge Cards ─── */
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

/* ─── Category Rights Card ─── */
function CategoryCard({ cat }: { cat: LegalCategory }) {
  const [expanded, setExpanded] = useState(false);
  const c = colorMap[cat.color] || colorMap.blue;
  const icon = ICONS[cat.icon_name] || <BookOpen className="w-5 h-5" />;
  return (
    <Card padding="none" className={`flex flex-col border ${c.border} ${c.bg} hover:shadow-lg transition-all duration-300 h-full rounded-2xl overflow-hidden`}>
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

/* ─── Main Public Legal Services Page ─── */
export default function LegalServicesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Offices');
  const [selectedCity, setSelectedCity] = useState<string>('');
  
  const [legalListings, setLegalListings] = useState<LegalServiceListing[]>(INITIAL_LEGAL_SERVICES);
  const [centres, setCentres] = useState<LegalAidCentre[]>([]);
  const [categories, setCategories] = useState<LegalCategory[]>([]);
  const [helplines, setHelplines] = useState<LegalHelpline[]>([
    { id: 'h-1', type: 'helpline', label: 'NALSA Legal Aid', number: '15100', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
    { id: 'h-2', type: 'helpline', label: 'TNSLSA State Line', number: '1800 4252 441', color: 'bg-indigo-50 border-indigo-200 text-indigo-800' },
    { id: 'h-3', type: 'helpline', label: 'Women Helpline', number: '181', color: 'bg-rose-50 border-rose-200 text-rose-800' },
    { id: 'h-4', type: 'helpline', label: 'Child Helpline', number: '1098', color: 'bg-amber-50 border-amber-200 text-amber-800' },
    { id: 'h-5', type: 'helpline', label: 'Senior Citizen Line', number: '14567', color: 'bg-blue-50 border-blue-200 text-blue-800' },
    { id: 'h-6', type: 'helpline', label: 'Cyber Crime Cell', number: '1930', color: 'bg-purple-50 border-purple-200 text-purple-800' },
  ]);
  const [portals, setPortals] = useState<LegalPortal[]>([
    { id: 'p-1', type: 'portal', label: 'eCourts Services India', desc: 'Case status, cause lists & court orders across all courts', url: 'https://ecourts.gov.in', icon_name: 'Landmark' },
    { id: 'p-2', type: 'portal', label: 'Madras High Court Portal', desc: 'Case history, judgments, cause lists & online filings', url: 'https://hcmadras.tn.gov.in', icon_name: 'Gavel' },
    { id: 'p-3', type: 'portal', label: 'TNSLSA Legal Services', desc: 'Apply for free legal aid & Lok Adalat online representation', url: 'https://tnlegalservices.tn.gov.in', icon_name: 'Scale' },
    { id: 'p-4', type: 'portal', label: 'National Consumer Helpline', desc: 'Register consumer complaints and claim compensation', url: 'https://consumerhelpline.gov.in', icon_name: 'Shield' },
    { id: 'p-5', type: 'portal', label: 'RTI Online Portal', desc: 'File online Right to Information applications & first appeals', url: 'https://rtionline.tn.gov.in', icon_name: 'FileText' },
    { id: 'p-6', type: 'portal', label: 'Cyber Crime Reporting', desc: 'Report online fraud, identity theft & harassment', url: 'https://cybercrime.gov.in', icon_name: 'AlertTriangle' },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDocs(collection(db, 'legal_services'));
        if (!snap.empty) {
          const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
          
          const dbListings = items.filter((i: any) => i.category && i.name && !i.type);
          if (dbListings.length > 0) {
            setLegalListings(dbListings);
          }
          
          const dbCentres = items.filter((i: any) => i.type === 'centre');
          if (dbCentres.length > 0) setCentres(dbCentres);

          const dbCats = items.filter((i: any) => i.type === 'category');
          if (dbCats.length > 0) setCategories(dbCats);

          const dbHelps = items.filter((i: any) => i.type === 'helpline');
          if (dbHelps.length > 0) setHelplines(dbHelps);

          const dbPorts = items.filter((i: any) => i.type === 'portal');
          if (dbPorts.length > 0) setPortals(dbPorts);
        }
      } catch (e) {
        console.error('Error fetching legal services data:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter listings
  const filteredListings = useMemo(() => {
    return legalListings.filter(item => {
      const matchCat = selectedCategory === 'All Offices' || item.category === selectedCategory;
      const matchCity = !selectedCity || item.city === selectedCity || item.district === selectedCity;
      
      const q = search.toLowerCase().trim();
      const matchSearch = !q ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.address.toLowerCase().includes(q) ||
        (item.city || '').toLowerCase().includes(q) ||
        (item.district || '').toLowerCase().includes(q) ||
        (item.phone || '').toLowerCase().includes(q) ||
        (item.email || '').toLowerCase().includes(q);

      return matchCat && matchCity && matchSearch;
    });
  }, [legalListings, selectedCategory, selectedCity, search]);

  // Unique cities/districts list
  const availableLocations = useMemo(() => {
    const locs = new Set<string>();
    legalListings.forEach(l => {
      if (l.city) locs.add(l.city);
      if (l.district && l.district !== 'All Tamil Nadu') locs.add(l.district);
    });
    return Array.from(locs).sort();
  }, [legalListings]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { 'All Offices': legalListings.length };
    legalListings.forEach(l => {
      counts[l.category] = (counts[l.category] || 0) + 1;
    });
    return counts;
  }, [legalListings]);

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
        <div className="max-w-[1536px] mx-auto px-3 sm:px-6 lg:px-8 py-3 md:py-4 lg:py-5">
          <div className="hidden md:flex items-center gap-2 text-xs md:text-sm text-text-muted mb-2">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/services/government" className="hover:text-primary">Services</Link>
            <span>/</span>
            <span className="text-text-primary font-medium">Legal Services</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2.5">
            <div>
              <h1 className="text-lg sm:text-2xl md:text-3xl font-bold font-display text-text-primary flex items-center gap-2 leading-tight">
                <Scale className="w-6 h-6 md:w-8 md:h-8 text-primary shrink-0" /> Legal Services & Courts
              </h1>
              <p className="hidden md:block mt-1 text-xs md:text-sm text-text-muted max-w-2xl">
                Official directory of Madras High Court, District Legal Services Authorities (DLSA), Taluk committees, Bar Council, and legal aid institutions.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <button onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 bg-primary text-white rounded-lg md:rounded-xl text-xs md:text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm cursor-pointer">
                <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4" /> Find Free Legal Aid
              </button>
              <a href="tel:15100"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 bg-white border border-border rounded-lg md:rounded-xl text-xs md:text-sm font-semibold hover:border-primary hover:text-primary transition-colors">
                <PhoneCall className="w-3.5 h-3.5 md:w-4 md:h-4" /> NALSA: 15100
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

        {/* Free Legal Aid Notice Banner */}
        <div className="bg-gradient-to-r from-emerald-500/10 via-primary/5 to-transparent border border-emerald-500/20 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
            <Scale className="w-6 h-6 text-emerald-700" />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-text-primary text-base">You are entitled to 100% FREE Legal Aid</h2>
            <p className="text-sm text-text-muted mt-0.5">
              Under Section 12 of the <strong>Legal Services Authorities Act, 1987</strong>, free legal aid and advocate representation are provided to women, children, SC/ST members, factory workers, custody inmates, and persons with annual income below ₹3 Lakhs.
            </p>
          </div>
          <a
            href="https://tnlegalservices.tn.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-sm font-bold text-emerald-700 hover:text-emerald-800 bg-white border border-emerald-300 px-4 py-2 rounded-xl shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
          >
            Apply on TNSLSA <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Emergency Legal Helplines */}
        <section>
          <h2 className="text-xl font-bold font-display text-text-primary flex items-center gap-2 mb-4">
            <PhoneCall className="w-5 h-5 text-primary shrink-0" /> Emergency Legal Helplines
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {helplines.map(h => (
              <a key={h.id} href={`tel:${h.number.replace(/[^0-9]/g, '')}`}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center gap-1 hover:shadow-md transition-all cursor-pointer ${h.color || 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                <PhoneCall className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium opacity-80">{h.label}</span>
                <span className="text-base sm:text-lg font-extrabold tracking-tight">{h.number}</span>
              </a>
            ))}
          </div>
        </section>

        {/* ─── LEGAL OFFICES & AUTHORITIES DIRECTORY (LISTINGS MODULE) ─── */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Gavel className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold font-display text-text-primary">
                  Legal Offices & Authorities Directory
                </h2>
              </div>
              <p className="text-sm text-text-muted mt-1">
                Explore official contact details, addresses, and portals for courts, DLSAs, and legal committees across Tamil Nadu.
              </p>
            </div>
            <div className="text-xs font-bold text-text-muted bg-surface px-3 py-1.5 rounded-lg border border-border shrink-0 self-start md:self-auto">
              Showing {filteredListings.length} of {legalListings.length} listings
            </div>
          </div>

          {/* Search and Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-border shadow-xs space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Text Search */}
              <div className="md:col-span-8 relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by court name, district, address, phone or email..."
                  className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary text-xs font-bold p-1"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* District / City Dropdown */}
              <div className="md:col-span-4 relative">
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                  <select
                    value={selectedCity}
                    onChange={e => setSelectedCity(e.target.value)}
                    className="w-full pl-10 pr-8 py-2.5 bg-surface border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                  >
                    <option value="">All Districts & Cities ({availableLocations.length})</option>
                    {availableLocations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
              <span className="text-xs font-bold text-text-muted flex items-center gap-1 mr-1 shrink-0">
                <Filter className="w-3.5 h-3.5" /> Category:
              </span>
              {LEGAL_CATEGORIES.map(cat => {
                const isSelected = selectedCategory === cat;
                const count = categoryCounts[cat] || 0;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-surface hover:bg-slate-200/70 text-slate-700 border border-border'
                    }`}
                  >
                    {cat} {count > 0 && <span className={`ml-1 text-[10px] opacity-80 ${isSelected ? 'text-white' : 'text-slate-500'}`}>({count})</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredListings.map(item => (
              <LegalServiceCard key={item.id} item={item} />
            ))}
          </div>

          {/* Empty State */}
          {filteredListings.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-border">
              <HelpCircle className="w-12 h-12 mx-auto mb-3 text-border" />
              <h3 className="text-base font-bold text-text-primary">No legal offices found</h3>
              <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
                No matching results for your search query. Try clearing your filters or searching with a different term.
              </p>
              <button
                onClick={() => { setSearch(''); setSelectedCategory('All Offices'); setSelectedCity(''); }}
                className="mt-4 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </section>

        {/* ─── KNOW YOUR RIGHTS SECTION ─── */}
        {categories.length > 0 && (
          <section>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div>
                <h2 className="text-xl font-bold font-display text-text-primary flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary shrink-0" /> Legal Rights & Guidance
                </h2>
                <p className="text-sm text-text-muted mt-1">Tap any category to see step-by-step rights, procedures, and portals.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {categories.map(cat => <CategoryCard key={cat.id} cat={cat} />)}
            </div>
          </section>
        )}

        {/* ─── IMPORTANT PORTALS SECTION ─── */}
        <section>
          <h2 className="text-xl font-bold font-display text-text-primary flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-primary shrink-0" /> Important Legal Portals
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {portals.map(p => {
              const icon = ICONS[p.icon_name] || <ExternalLink className="w-5 h-5" />;
              return (
                <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-white border border-border rounded-2xl hover:border-primary/40 hover:shadow-md transition-all group">
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
