'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  ExternalLink, Building, Shield, Landmark, CreditCard, FileText, Globe,
  Fingerprint, User, UserCheck, Compass, Car, Home, Heart, Users, Briefcase,
  GraduationCap, MapPin, Phone, Clock, Search, Plane, Vote, ShieldCheck,
  Navigation, X, Star, ClipboardList, ChevronDown, ChevronUp,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import {
  GOVT_SERVICES, AADHAAR_CENTRES, PASSPORT_SEVA_KENDRAS,
  VISA_COUNTRIES, POLICE_STATIONS,
} from '@/lib/constants';

/* ─── Icon map ─── */
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Building01: Building, Shield01: Shield, Landmark01: Landmark,
  CreditCard01: CreditCard, FileText01: FileText, Globe01: Globe,
  Home01: Home, User01: User, Car01: Car, MedicalCross: Heart,
  Users01: Users, Map01: Compass, UserCheck01: UserCheck,
  Briefcase01: Briefcase, GraduationHat01: GraduationCap,
};

/* ─── Types ─── */
type Centre = {
  id: number;
  name: string;
  address: string;
  type: string;
  city: string;
  phone?: string;
  timings?: string;
  google_maps_url?: string;
  district?: string;
};

/* ─── Single Centre Row ─── */
function CentreRow({ centre }: { centre: Centre }) {
  const addr = centre.address || centre.city;
  const mapUrl = centre.google_maps_url
    || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${centre.name}, ${addr}`)}`;
  return (
    <div className="p-4 bg-surface/60 border border-border rounded-xl hover:border-primary/40 hover:bg-white hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-2">
        <h5 className="font-semibold text-sm text-text-primary leading-tight flex-1">{centre.name}</h5>
        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">{centre.type}</span>
      </div>
      <p className="text-xs text-text-muted mt-2 flex items-start gap-1.5">
        <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary/60" />
        <span>{addr}</span>
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

/* ─── Offline Centres Modal ─── */
function CentresModal({
  open, onClose, title, centres, mapsSearchQuery,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  centres: Centre[];
  mapsSearchQuery: string; // e.g. "Aadhaar Seva Kendra"
}) {
  const [query, setQuery] = useState('');
  const [showDirectory, setShowDirectory] = useState(false);

  const filtered = useMemo(() => {
    if (!query.trim()) return centres;
    const q = query.toLowerCase();
    return centres.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      (c.address || '').toLowerCase().includes(q) ||
      (c.district || '').toLowerCase().includes(q)
    );
  }, [query, centres]);

  // Google Maps search URL — opens full Maps with all results + clickable pins
  const mapsSearchTerm = query.trim()
    ? `${mapsSearchQuery} ${query.trim()}`
    : `${mapsSearchQuery} Tamil Nadu`;
  const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(mapsSearchTerm)}`;

  // Embed URL — shows interactive map with all results inside the modal
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapsSearchTerm)}&output=embed&z=10`;

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div>
            <h3 className="text-sm font-bold text-text-primary">{title}</h3>
            <p className="text-xs text-text-muted mt-0.5">Click any pin on the map to view the exact location</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface transition-colors cursor-pointer">
            <X className="w-4 h-4 text-text-muted" />
          </button>
        </div>

        {/* Search bar */}
        <div className="px-5 py-3 border-b border-border shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              autoFocus
              type="text"
              placeholder="Type a city to find centres (e.g. Chennai, Coimbatore...)"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Embedded Google Maps — shows ALL results with clickable pins */}
        <div className="shrink-0 border-b border-border">
          <div className="relative w-full" style={{ height: '320px' }}>
            <iframe
              key={mapsSearchTerm}
              src={embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Google Maps - ${mapsSearchQuery}`}
              className="w-full h-full"
            />
          </div>
          {/* Open in full Google Maps */}
          <div className="px-5 py-3 flex gap-2">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors"
            >
              <Navigation className="w-4 h-4" />
              Open in Google Maps
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>
          </div>
        </div>

        {/* Curated directory toggle */}
        <div className="overflow-y-auto flex-1 px-5 py-3 space-y-3">
          {centres.length > 0 && (
            <button
              onClick={() => setShowDirectory(!showDirectory)}
              className="w-full flex items-center justify-between p-3 bg-surface/80 border border-border rounded-xl hover:bg-surface transition-colors cursor-pointer"
            >
              <span className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                Our Curated Directory ({filtered.length} entries)
              </span>
              {showDirectory ? <ChevronUp className="w-4 h-4 text-text-muted" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
            </button>
          )}
          {showDirectory && (
            <div className="space-y-3 animate-fade-in">
              {filtered.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-xs text-text-muted">No matching entries in our directory. Use the map above.</p>
                </div>
              ) : filtered.map(c => <CentreRow key={c.id} centre={c} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Tab Toggle (Online / Offline) ─── */
function TabToggle({ mode, setMode, offlineLabel = 'Offline Centres' }: {
  mode: 'online' | 'offline';
  setMode: (m: 'online' | 'offline') => void;
  offlineLabel?: string;
}) {
  return (
    <div className="flex border-b border-border">
      <button
        onClick={() => setMode('online')}
        className={`flex-1 py-2.5 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5
          ${mode === 'online' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-text-muted hover:text-text-primary'}`}
      >
        <Globe className="w-3.5 h-3.5" /> Online Portal
      </button>
      <button
        onClick={() => setMode('offline')}
        className={`flex-1 py-2.5 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5
          ${mode === 'offline' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-text-muted hover:text-text-primary'}`}
      >
        <MapPin className="w-3.5 h-3.5" /> {offlineLabel}
      </button>
    </div>
  );
}

/* ─── Standard Service Card Shell (ensures identical height) ─── */
function ServiceCard({
  icon,
  title,
  priority = 'High Priority',
  category,
  description,
  footer,
}: {
  icon: React.ReactNode;
  title: string;
  priority?: string;
  category: string;
  description: string;
  footer: React.ReactNode;
}) {
  return (
    <Card padding="none" className="flex flex-col border-amber-200/60 bg-amber-50/30 hover:border-amber-400 hover:shadow-lg transition-all duration-300 h-full">
      {/* Header */}
      <div className="flex items-start gap-3 p-5 pb-3">
        <div className="w-11 h-11 rounded-xl bg-amber-100/70 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-text-primary leading-snug">{title}</h3>
          <div className="flex flex-wrap gap-1 mt-1.5">
            <Badge variant="amber" className="text-[10px] py-0 px-1.5">{priority}</Badge>
            <Badge variant="default" className="text-[10px] py-0 px-1.5">{category}</Badge>
          </div>
        </div>
      </div>

      {/* Description — fixed height with line-clamp */}
      <p className="text-xs text-text-muted px-5 leading-relaxed flex-1 line-clamp-3">
        {description}
      </p>

      {/* Footer actions */}
      <div className="border-t border-border mt-4">
        {footer}
      </div>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   CARD 1 & 2: AADHAAR (reused for both Update & Biometrics)
   ═══════════════════════════════════════════════════════════════════ */
function AadhaarCard({ service, IconComponent }: {
  service: typeof GOVT_SERVICES[0];
  IconComponent: React.ComponentType<{ className?: string }>;
}) {
  const [mode, setMode] = useState<'online' | 'offline'>('online');
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <CentresModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Aadhaar Enrolment / Update Centres"
        centres={AADHAAR_CENTRES as Centre[]}
        mapsSearchQuery="Aadhaar Seva Kendra"
      />
      <ServiceCard
        icon={<IconComponent className="w-5 h-5 text-amber-700" />}
        title={service.title}
        category={service.category}
        description={service.description}
        footer={
          <>
            <TabToggle mode={mode} setMode={setMode} offlineLabel="CSC Centres" />
            <div className="p-4">
              {mode === 'online' ? (
                <a href={service.url} target="_blank" rel="noopener noreferrer" className="block">
                  <Button variant="primary" size="sm" className="w-full bg-amber-600 hover:bg-amber-700 text-white border-none cursor-pointer text-xs">
                    Go to Official Portal <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </a>
              ) : (
                <Button variant="outline" size="sm" className="w-full cursor-pointer text-xs" onClick={() => setModalOpen(true)}>
                  <MapPin className="w-3.5 h-3.5 mr-1 text-primary" /> Find Aadhaar Centres
                </Button>
              )}
            </div>
          </>
        }
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   CARD 3: PASSPORT
   ═══════════════════════════════════════════════════════════════════ */
function PassportCard() {
  const [mode, setMode] = useState<'online' | 'offline'>('online');
  const [modalOpen, setModalOpen] = useState(false);
  // Normalise passport centres to Centre type
  const centres: Centre[] = PASSPORT_SEVA_KENDRAS.map(p => ({ ...p, city: p.district }));

  return (
    <>
      <CentresModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Passport Seva Kendras (PSK / POPSK)"
        centres={centres}
        mapsSearchQuery="Passport Seva Kendra"
      />
      <ServiceCard
        icon={<Compass className="w-5 h-5 text-amber-700" />}
        title="Passport Seva"
        category="Travel"
        description="Apply for a new passport, renew, or re-issue your passport. Find nearby Passport Seva Kendras (PSK) and process details."
        footer={
          <>
            <TabToggle mode={mode} setMode={setMode} offlineLabel="Passport Offices" />
            <div className="p-4">
              {mode === 'online' ? (
                <Link href="/services/government/passport" className="block">
                  <Button variant="primary" size="sm" className="w-full bg-amber-600 hover:bg-amber-700 text-white border-none cursor-pointer text-xs">
                    Open Passport Services <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" size="sm" className="w-full cursor-pointer text-xs" onClick={() => setModalOpen(true)}>
                  <MapPin className="w-3.5 h-3.5 mr-1 text-primary" /> Find Passport Seva Kendras
                </Button>
              )}
            </div>
          </>
        }
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   CARD 4: POLICE / FILE A COMPLAINT
   ═══════════════════════════════════════════════════════════════════ */
function PoliceCard() {
  const [mode, setMode] = useState<'online' | 'offline'>('online');
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <CentresModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Local Police Stations"
        centres={POLICE_STATIONS as Centre[]}
        mapsSearchQuery="Police Station"
      />
      <ServiceCard
        icon={<ShieldCheck className="w-5 h-5 text-amber-700" />}
        title="File a Complaint"
        category="Safety"
        description="File online complaints, report cyber fraud, apply for verification certificates, or locate your local police station."
        footer={
          <>
            <TabToggle mode={mode} setMode={setMode} offlineLabel="Local Police Station" />
            <div className="p-4">
              {mode === 'online' ? (
                <div className="space-y-2">
                  <a href="https://cybercrime.gov.in/Webform/Index.aspx" target="_blank" rel="noopener noreferrer" className="block">
                    <Button variant="primary" size="sm" className="w-full bg-amber-600 hover:bg-amber-700 text-white border-none cursor-pointer text-xs">
                      File Online Complaint <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </a>
                  <a href="https://eservices.tnpolice.gov.in/CCTNSENHANCED/serviceVerification.html" target="_blank" rel="noopener noreferrer" className="block">
                    <Button variant="outline" size="sm" className="w-full cursor-pointer text-xs">
                      Verification Certificate <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </a>
                </div>
              ) : (
                <Button variant="outline" size="sm" className="w-full cursor-pointer text-xs" onClick={() => setModalOpen(true)}>
                  <MapPin className="w-3.5 h-3.5 mr-1 text-primary" /> Find Police Stations
                </Button>
              )}
            </div>
          </>
        }
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   CARD 5: VOTER ID
   ═══════════════════════════════════════════════════════════════════ */
function VoterIdCard() {
  return (
    <ServiceCard
      icon={<Vote className="w-5 h-5 text-amber-700" />}
      title="Voter ID (EPIC)"
      category="Election"
      description="Register as a voter, update your address, correct details, or download your e-EPIC. Dedicated portal for Chennai Region."
      footer={
        <div className="p-4">
          <Link href="/services/government/voter-id" className="block">
            <Button variant="primary" size="sm" className="w-full bg-amber-600 hover:bg-amber-700 text-white border-none cursor-pointer text-xs">
              Open Voter Services <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      }
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════
   CARD 6: VISA SERVICES
   ═══════════════════════════════════════════════════════════════════ */
function VisaCard() {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [showApp, setShowApp] = useState(true);
  const [showBio, setShowBio] = useState(false);
  const [mode, setMode] = useState<'online' | 'offline'>('online');
  const country = useMemo(() => VISA_COUNTRIES.find(c => c.code === selectedCountry), [selectedCountry]);

  return (
    <Card padding="none" className="flex flex-col border-amber-200/60 bg-amber-50/30 hover:border-amber-400 hover:shadow-lg transition-all duration-300 lg:col-span-2 h-full">
      {/* Header */}
      <div className="flex items-start gap-3 p-5 pb-3">
        <div className="w-11 h-11 rounded-xl bg-amber-100/70 flex items-center justify-center shrink-0">
          <Plane className="w-5 h-5 text-amber-700" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-text-primary">Visa Services</h3>
          <div className="flex gap-1 mt-1.5">
            <Badge variant="amber" className="text-[10px] py-0 px-1.5">High Priority</Badge>
            <Badge variant="default" className="text-[10px] py-0 px-1.5">Travel</Badge>
          </div>
        </div>
      </div>

      <p className="text-xs text-text-muted px-5 leading-relaxed">
        Apply for visas to popular destinations. Select your country to see the official application process, biometric requirements, and nearest Visa Application Centre.
      </p>

      {/* Country Selector */}
      <div className="px-5 mt-4">
        <label className="block text-[10px] font-bold text-text-muted mb-1 uppercase tracking-wider">Select Destination Country</label>
        <select
          value={selectedCountry}
          onChange={e => { setSelectedCountry(e.target.value); setShowApp(true); setShowBio(false); }}
          className="w-full px-3 py-2 border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
        >
          <option value="">Choose a country...</option>
          {VISA_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
        </select>
      </div>

      {/* Collapsible process steps */}
      {country && (
        <div className="px-5 mt-3 space-y-2">
          <div className="border border-border rounded-xl overflow-hidden">
            <button onClick={() => setShowApp(!showApp)} className="w-full flex items-center justify-between p-3 bg-blue-50/50 hover:bg-blue-50 transition-colors cursor-pointer">
              <span className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                <ClipboardList className="w-3.5 h-3.5 text-blue-600" /> Application Process — {country.name}
              </span>
              {showApp ? <ChevronUp className="w-4 h-4 text-text-muted" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
            </button>
            {showApp && (
              <div className="p-3 border-t border-border">
                <ol className="space-y-2">
                  {country.applicationProcess.map((step, i) => (
                    <li key={i} className="flex gap-2 text-xs text-text-muted">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                      <span className="pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
          <div className="border border-border rounded-xl overflow-hidden">
            <button onClick={() => setShowBio(!showBio)} className="w-full flex items-center justify-between p-3 bg-emerald-50/50 hover:bg-emerald-50 transition-colors cursor-pointer">
              <span className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                <Fingerprint className="w-3.5 h-3.5 text-emerald-600" /> Biometric Process — {country.name}
              </span>
              {showBio ? <ChevronUp className="w-4 h-4 text-text-muted" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
            </button>
            {showBio && (
              <div className="p-3 border-t border-border">
                <ol className="space-y-2">
                  {country.biometricProcess.map((step, i) => (
                    <li key={i} className="flex gap-2 text-xs text-text-muted">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                      <span className="pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-border mt-4">
        <TabToggle mode={mode} setMode={setMode} offlineLabel="VAC Location" />
        <div className="p-4">
          {!country ? (
            <p className="text-xs text-text-muted text-center italic py-1">Select a country above to see visa portal and VAC details.</p>
          ) : mode === 'online' ? (
            <a href={country.visaPortalUrl} target="_blank" rel="noopener noreferrer" className="block">
              <Button variant="primary" size="sm" className="w-full bg-amber-600 hover:bg-amber-700 text-white border-none cursor-pointer text-xs">
                Go to {country.name} Visa Portal <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </Button>
            </a>
          ) : (
            <div className="p-3 bg-surface/60 border border-border rounded-xl">
              <h5 className="font-bold text-xs text-text-primary">{country.name} — Consulate / VAC</h5>
              <p className="text-xs text-text-muted mt-1.5 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary/60" />
                <span>{country.vacAddress}</span>
              </p>
              {country.vacPhone && (
                <p className="text-xs text-text-muted mt-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 shrink-0 text-primary/60" />
                  <a href={`tel:${country.vacPhone}`} className="text-primary hover:underline">{country.vacPhone}</a>
                </p>
              )}
              <div className="mt-2.5 pt-2 border-t border-border/60">
                <a href={country.vacGoogleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(country.vacAddress)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-xs font-semibold text-primary inline-flex items-center gap-1 bg-primary/5 hover:bg-primary/10 px-2.5 py-1.5 rounded-lg transition-colors">
                  <Navigation className="w-3.5 h-3.5" /> View on Google Maps <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════ */
export default function GovernmentPage() {
  const higherPriorityIds = ['aadhaar', 'biometrics', 'passport', 'visa', 'police-verification', 'voter-id'];

  const lowerPriorityServices = useMemo(() => {
    const seen = new Set<string>();
    return GOVT_SERVICES.filter(s => {
      if (higherPriorityIds.includes(s.id) || seen.has(s.id)) return false;
      seen.add(s.id);
      return true;
    });
  }, []);

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <span className="text-text-primary font-medium">Government Services</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-text-primary">Government Services</h1>
          <p className="mt-2 text-text-muted text-sm">Quick access to essential government portals, identity services, visa applications, and security verification.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

        {/* ── ESSENTIAL SERVICES ── */}
        <section>
          <div className="mb-6">
            <h2 className="text-xl font-bold font-display text-text-primary flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-400 shrink-0" /> Essential Services
            </h2>
            <p className="text-sm text-text-muted mt-1">
              Identity credentials, travel documentation, and security services — with Online and Offline centre locator.
            </p>
          </div>

          {/* Row 1: 4 equal-height cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 items-stretch">
            <AadhaarCard
              service={GOVT_SERVICES.find(s => s.id === 'aadhaar')!}
              IconComponent={User}
            />
            <AadhaarCard
              service={GOVT_SERVICES.find(s => s.id === 'biometrics')!}
              IconComponent={Fingerprint}
            />
            <PassportCard />
            <PoliceCard />
          </div>

          {/* Row 2: Voter ID (1 col) + Visa (3 cols) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-5 items-start">
            <div className="lg:col-span-1">
              <VoterIdCard />
            </div>
            <div className="lg:col-span-3">
              <VisaCard />
            </div>
          </div>
        </section>

        {/* ── OTHER SERVICES ── */}
        <section>
          <div className="mb-6 pt-4 border-t border-border">
            <h2 className="text-xl font-bold font-display text-text-primary flex items-center gap-2 mt-6">
              <ClipboardList className="w-5 h-5 text-primary shrink-0" /> Other Government Services
            </h2>
            <p className="text-sm text-text-muted mt-1">
              State welfare schemes, transport, employment registration, and public sector portals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 items-stretch">
            {lowerPriorityServices.map((service) => {
              const IconComponent = ICON_MAP[service.icon] || Building;
              return (
                <Card key={service.id} className="group flex flex-col bg-white border-border hover:border-primary/50 hover:shadow-md transition-all duration-300 h-full">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors leading-snug">
                        {service.title}
                      </h3>
                      <span className="text-[10px] font-medium text-text-muted bg-surface px-2 py-0.5 rounded-full mt-1.5 inline-block">
                        {service.category}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-text-muted mt-4 leading-relaxed flex-1 line-clamp-3">
                    {service.description}
                  </p>

                  <div className="mt-5 pt-4 border-t border-border">
                    {service.url.startsWith('/') ? (
                      <Link href={service.url} className="block">
                        <Button variant="outline" size="sm" className="w-full cursor-pointer text-xs">
                          Open Service Page <ExternalLink className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </Link>
                    ) : (
                      <a href={service.url} target="_blank" rel="noopener noreferrer" className="block">
                        <Button variant="outline" size="sm" className="w-full cursor-pointer text-xs">
                          Go to Official Portal <ExternalLink className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </a>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
