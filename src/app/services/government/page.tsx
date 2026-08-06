'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ExternalLink,
  Building,
  Shield,
  Landmark,
  CreditCard,
  FileText,
  Globe,
  Fingerprint,
  User,
  UserCheck,
  Compass,
  Car,
  Home,
  Heart,
  Users,
  Briefcase,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Vote,
  Plane,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { GOVT_SERVICES } from '@/lib/constants';

/* ─── Icon map for service cards ─── */
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Building01: Building,
  Shield01: Shield,
  Landmark01: Landmark,
  CreditCard01: CreditCard,
  FileText01: FileText,
  Globe01: Globe,
  Home01: Home,
  User01: User,
  Car01: Car,
  MedicalCross: Heart,
  Users01: Users,
  Map01: Compass,
  UserCheck01: UserCheck,
  Briefcase01: Briefcase,
  GraduationHat01: GraduationCap,
};

/* Feature summary highlights for individual services */
const FEATURE_TAGS: Record<string, string[]> = {
  'aadhaar': ['🌐 Online Update', '📍 Centre Locator', '📋 e-KYC'],
  'biometrics': ['🔐 Lock/Unlock', '🛡️ Security', '📍 Enrolment Search'],
  'passport': ['🌐 Passport Seva', '📍 PSK Finder', '📋 Fresh/Renewal'],
  'voter-id': ['🌐 Form 6 & 8', '💳 e-EPIC Download', '📍 e-Seva Finder'],
  'police-verification': ['🛡️ Register Complaint', '🚨 Cyber Crime (1930)', '📜 Verification Cert'],
  'visa': ['✈️ Country Selector', '📋 Process Steps', '📍 VAC Locations'],
  'ayushman-bharat': ['🏥 ₹5 Lakh Cover', '📋 Eligibility Check', '📜 PM-JAY Card'],
  'ration-card': ['🌾 Smart Family Card', '➕ Add Member', '📥 e-Ration Download'],
  'driving-licence': ['🚗 LLR / Permanent DL', '🔄 Renewal', '📍 RTO Locator'],
};

/* ─── Uniform Service Card Component ─── */
function UniformServiceCard({ service, isEssential = false }: { service: typeof GOVT_SERVICES[0]; isEssential?: boolean }) {
  const IconComponent = ICON_MAP[service.icon] || Building;
  const features = FEATURE_TAGS[service.id] || ['🌐 Online Portal', '📋 Official Guide'];
  const isInternal = service.url.startsWith('/');

  return (
    <Card 
      padding="none" 
      className={`group flex flex-col justify-between h-full border transition-all duration-300 ${
        isEssential 
          ? 'border-amber-200/80 bg-gradient-to-br from-amber-50/40 via-white to-white hover:border-amber-400 hover:shadow-lg' 
          : 'border-border bg-white hover:border-primary/50 hover:shadow-md'
      }`}
    >
      <div className="p-6 flex flex-col flex-1">
        {/* Top Header */}
        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
            isEssential ? 'bg-amber-100/70 text-amber-800' : 'bg-primary/10 text-primary'
          }`}>
            <IconComponent className="w-7 h-7" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-1">
              {service.title}
            </h3>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {isEssential && (
                <Badge variant="amber" className="text-[10px] py-0.5 px-2 font-semibold">Essential</Badge>
              )}
              <Badge variant="default" className="text-[10px] py-0.5 px-2 text-text-muted bg-surface font-medium">
                {service.category}
              </Badge>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-text-muted mt-4 leading-relaxed line-clamp-3 flex-1">
          {service.description}
        </p>

        {/* Feature Tags preview */}
        <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-border/60">
          {features.map((ft, idx) => (
            <span key={idx} className="text-[11px] font-semibold text-text-muted bg-surface px-2 py-1 rounded-md border border-border/50">
              {ft}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Button */}
      <div className="px-6 pb-6 pt-0">
        {isInternal ? (
          <Link href={service.url} className="block">
            <Button 
              variant="primary" 
              size="sm" 
              className={`w-full cursor-pointer justify-between font-semibold shadow-sm ${
                isEssential ? 'bg-amber-700 hover:bg-amber-800 text-white border-none' : ''
              }`}
            >
              <span>Access Service Features</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        ) : (
          <a href={service.url} target="_blank" rel="noopener noreferrer" className="block">
            <Button variant="outline" size="sm" className="w-full cursor-pointer justify-between font-semibold">
              <span>Go to Official Portal</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </Button>
          </a>
        )}
      </div>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════ */
export default function GovernmentPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const higherPriorityIds = ['aadhaar', 'biometrics', 'passport', 'visa', 'police-verification', 'voter-id', 'ayushman-bharat'];

  const essentialServices = useMemo(() => {
    return GOVT_SERVICES.filter(s => higherPriorityIds.includes(s.id));
  }, []);

  const otherServices = useMemo(() => {
    return GOVT_SERVICES.filter(s => !higherPriorityIds.includes(s.id));
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(GOVT_SERVICES.map(s => s.category)));
    return ['All', ...cats];
  }, []);

  const filteredEssential = useMemo(() => {
    if (selectedCategory === 'All') return essentialServices;
    return essentialServices.filter(s => s.category === selectedCategory);
  }, [selectedCategory, essentialServices]);

  const filteredOther = useMemo(() => {
    if (selectedCategory === 'All') return otherServices;
    return otherServices.filter(s => s.category === selectedCategory);
  }, [selectedCategory, otherServices]);

  return (
    <div className="min-h-screen bg-surface">
      {/* Header Banner */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
            <Link href="/" className="hover:text-primary">Home</Link><span>/</span>
            <span className="text-text-primary font-medium">Government Services</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-text-primary">Government Services</h1>
          <p className="mt-2 text-text-muted max-w-3xl">
            Quick access to essential government portals, identity credentials, passport & visa applications, police verification, and welfare schemes.
          </p>

          {/* Category Filter Pills */}
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-surface border border-border text-text-muted hover:text-text-primary hover:border-primary/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* ── ESSENTIAL / HIGH PRIORITY SERVICES ── */}
        {filteredEssential.length > 0 && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold font-display text-text-primary flex items-center gap-2">
                ⭐ Essential Services
              </h2>
              <p className="text-sm text-text-muted mt-1">
                Identity credentials, travel documentation, security verification, and health schemes — click any card to access full interactive features.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {filteredEssential.map((service) => (
                <UniformServiceCard key={service.id} service={service} isEssential={true} />
              ))}
            </div>
          </div>
        )}

        {/* ── OTHER GOVERNMENT SERVICES ── */}
        {filteredOther.length > 0 && (
          <div>
            <div className="mb-6 pt-4 border-t border-border">
              <h2 className="text-2xl font-bold font-display text-text-primary flex items-center gap-2 mt-4">
                📋 Welfare & Public Sector Portals
              </h2>
              <p className="text-sm text-text-muted mt-1">
                State welfare schemes, transport facilities, employment registration, and education scholarships.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {filteredOther.map((service) => (
                <UniformServiceCard key={service.id} service={service} isEssential={false} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
