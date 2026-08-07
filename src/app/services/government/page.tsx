import React from 'react';
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
  MapPin,
  Phone,
  Clock,
  ChevronDown,
  ChevronUp,
  Search,
  Plane,
  Vote,
  ShieldCheck,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import {
  GOVT_SERVICES,
  AADHAAR_CENTRES,
  PASSPORT_SEVA_KENDRAS,
  TN_DISTRICTS,
  VISA_COUNTRIES,
  POLICE_STATIONS,
  ELECTION_OFFICES,
} from '@/lib/constants';

/* ─── Icon map for lower priority service cards ─── */
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

/* ─── Shared Online/Offline Tab Toggle ─── */
function TabToggle({ mode, setMode }: { mode: 'online' | 'offline'; setMode: (m: 'online' | 'offline') => void }) {
  return (
    <div className="flex border-b border-border">
      <button
        onClick={() => setMode('online')}
        className={`flex-1 py-3 text-sm font-bold transition-colors cursor-pointer ${mode === 'online' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-text-muted hover:text-text-primary'}`}
      >
        🌐 Online
      </button>
      <button
        onClick={() => setMode('offline')}
        className={`flex-1 py-3 text-sm font-bold transition-colors cursor-pointer ${mode === 'offline' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-text-muted hover:text-text-primary'}`}
      >
        📍 Offline Centres
      </button>
    </div>
  );
}

/* ─── Shared Centre List Card ─── */
function CentreCard({ centre }: { centre: { name: string; address: string; type: string; phone?: string; timings?: string } }) {
  return (
    <div className="p-3.5 bg-surface/50 border border-border rounded-xl">
      <div className="flex justify-between items-start gap-2">
        <h5 className="font-bold text-sm text-text-primary leading-tight">{centre.name}</h5>
        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">{centre.type}</span>
      </div>
      <p className="text-xs text-text-muted mt-1.5 flex items-start gap-1.5">
        <MapPin className="w-3 h-3 shrink-0 mt-0.5" />
        {centre.address}
      </p>
      {centre.phone && (
        <p className="text-xs text-text-muted mt-1 flex items-center gap-1.5">
          <Phone className="w-3 h-3 shrink-0" />
          <a href={`tel:${centre.phone}`} className="text-primary hover:underline">{centre.phone}</a>
        </p>
      )}
      {centre.timings && (
        <p className="text-xs text-text-muted mt-1 flex items-center gap-1.5">
          <Clock className="w-3 h-3 shrink-0" />
          {centre.timings}
        </p>
      )}
    </div>
  );
}

/* ─── City Search Input ─── */
function CitySearch({ city, setCity, onSearch, loading }: { city: string; setCity: (c: string) => void; onSearch: () => void; loading: boolean }) {
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Enter city (e.g. Chennai)"
            value={city}
            onChange={e => setCity(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onSearch()}
            className="w-full pl-9 pr-3 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <Button variant="primary" size="sm" onClick={onSearch} disabled={loading} className="cursor-pointer shrink-0">
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   1. AADHAAR SERVICE CARD
   ═══════════════════════════════════════════════════════════════════ */
function AadhaarServiceCard({ service, IconComponent }: { service: typeof GOVT_SERVICES[0]; IconComponent: React.ComponentType<{ className?: string }> }) {
  const [mode, setMode] = useState<'online' | 'offline'>('online');
  const [city, setCity] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const filteredCentres = useMemo(() => {
    if (!searchCity) return AADHAAR_CENTRES;
    return AADHAAR_CENTRES.filter(c => c.city.toLowerCase().includes(searchCity.toLowerCase()) || c.address.toLowerCase().includes(searchCity.toLowerCase()));
  }, [searchCity]);

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      setSearchCity(city);
      setSearched(true);
      setLoading(false);
    }, 400);
  };

  return (
    <Card padding="none" className="group flex flex-col border-amber-200/60 bg-gradient-to-br from-amber-50/30 to-white hover:border-amber-400 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start gap-4 p-5 pb-0">
        <div className="w-14 h-14 rounded-2xl bg-amber-100/60 flex items-center justify-center shrink-0">
          <IconComponent className="w-8 h-8 text-amber-700" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-text-primary">{service.title}</h3>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            <Badge variant="amber" className="text-[10px] py-0.5 px-2">High Priority</Badge>
            <Badge variant="default" className="text-[10px] py-0.5 px-2">{service.category}</Badge>
          </div>
        </div>
      </div>

      <p className="text-sm text-text-muted mt-4 px-5 leading-relaxed flex-1">
        {service.description}
      </p>

      <div className="mt-5 border-t border-border">
        <TabToggle mode={mode} setMode={setMode} />

        <div className="p-5">
          {mode === 'online' ? (
            <a href={service.url} target="_blank" rel="noopener noreferrer" className="block">
              <Button variant="primary" size="sm" className="w-full bg-amber-600 hover:bg-amber-700 text-white border-none shadow-sm cursor-pointer">
                Go to Official Portal <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </a>
          ) : (
            <div className="space-y-4">
              <CitySearch city={city} setCity={setCity} onSearch={handleSearch} loading={loading} />

              {searched && (
                <div className="space-y-3 animate-fade-in">
                  <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                    {filteredCentres.length > 0 ? `Nearby CSC / Aadhaar Centres${searchCity ? ` in ${searchCity}` : ''}` : 'No centres found'}
                  </h4>
                  {filteredCentres.length > 0 ? (
                    <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                      {filteredCentres.map(c => <CentreCard key={c.id} centre={c} />)}
                    </div>
                  ) : (
                    <p className="text-sm text-text-muted italic">No centres found for &quot;{searchCity}&quot;. Try a different city name.</p>
                  )}
                </div>
              )}

              {!searched && (
                <p className="text-xs text-text-muted text-center">Search a city to find nearby Aadhaar centres</p>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   2. PASSPORT SERVICE CARD
   ═══════════════════════════════════════════════════════════════════ */
function PassportServiceCard() {
  return (
    <Card padding="none" className="group flex flex-col border-amber-200/60 bg-gradient-to-br from-amber-50/30 to-white hover:border-amber-400 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start gap-4 p-5 pb-0">
        <div className="w-14 h-14 rounded-2xl bg-amber-100/60 flex items-center justify-center shrink-0">
          <Compass className="w-8 h-8 text-amber-700" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-text-primary">Passport Seva</h3>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            <Badge variant="amber" className="text-[10px] py-0.5 px-2">High Priority</Badge>
            <Badge variant="default" className="text-[10px] py-0.5 px-2">Travel</Badge>
          </div>
        </div>
      </div>

      <p className="text-sm text-text-muted mt-4 px-5 leading-relaxed flex-1">
        Apply for a new passport, renew, or re-issue your passport. Find nearby Passport Seva Kendras (PSK) and process details.
      </p>

      <div className="mt-5 p-5 border-t border-border">
        <Link href="/services/government/passport" className="block">
          <Button variant="primary" size="sm" className="w-full bg-amber-600 hover:bg-amber-700 text-white border-none shadow-sm cursor-pointer">
            Open Passport Services <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   3. VISA SERVICE CARD
   ═══════════════════════════════════════════════════════════════════ */
function VisaServiceCard() {
  const [mode, setMode] = useState<'online' | 'offline'>('online');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [showApplicationSteps, setShowApplicationSteps] = useState(true);
  const [showBiometricSteps, setShowBiometricSteps] = useState(false);

  const country = useMemo(() => {
    return VISA_COUNTRIES.find(c => c.code === selectedCountry);
  }, [selectedCountry]);

  return (
    <Card padding="none" className="group flex flex-col border-amber-200/60 bg-gradient-to-br from-amber-50/30 to-white hover:border-amber-400 hover:shadow-lg transition-all duration-300 lg:col-span-2">
      <div className="flex items-start gap-4 p-5 pb-0">
        <div className="w-14 h-14 rounded-2xl bg-amber-100/60 flex items-center justify-center shrink-0">
          <Plane className="w-8 h-8 text-amber-700" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-text-primary">Visa Services</h3>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            <Badge variant="amber" className="text-[10px] py-0.5 px-2">High Priority</Badge>
            <Badge variant="default" className="text-[10px] py-0.5 px-2">Travel</Badge>
          </div>
        </div>
      </div>

      <p className="text-sm text-text-muted mt-4 px-5 leading-relaxed">
        Apply for visas to popular destinations. Select your country to see the official application process, biometric requirements, and nearest Visa Application Centre.
      </p>

      {/* Country Selector */}
      <div className="px-5 mt-4">
        <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wider">Select Destination Country</label>
        <select
          value={selectedCountry}
          onChange={e => { setSelectedCountry(e.target.value); setShowApplicationSteps(true); setShowBiometricSteps(false); }}
          className="w-full px-3 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
        >
          <option value="">Choose a country...</option>
          {VISA_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
        </select>
      </div>

      {/* Country-specific content */}
      {country && (
        <div className="px-5 mt-4 space-y-3 animate-fade-in">
          {/* Visa Application Process */}
          <div className="border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => setShowApplicationSteps(!showApplicationSteps)}
              className="w-full flex items-center justify-between p-3.5 bg-blue-50/50 hover:bg-blue-50 transition-colors cursor-pointer"
            >
              <span className="text-sm font-bold text-text-primary flex items-center gap-2">
                📋 Visa Application Process — {country.name}
              </span>
              {showApplicationSteps ? <ChevronUp className="w-4 h-4 text-text-muted" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
            </button>
            {showApplicationSteps && (
              <div className="p-4 border-t border-border">
                <ol className="space-y-2.5">
                  {country.applicationProcess.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm text-text-muted">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                      <span className="pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          {/* Biometric Appointment Process */}
          <div className="border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => setShowBiometricSteps(!showBiometricSteps)}
              className="w-full flex items-center justify-between p-3.5 bg-emerald-50/50 hover:bg-emerald-50 transition-colors cursor-pointer"
            >
              <span className="text-sm font-bold text-text-primary flex items-center gap-2">
                🔐 Biometric Appointment Process — {country.name}
              </span>
              {showBiometricSteps ? <ChevronUp className="w-4 h-4 text-text-muted" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
            </button>
            {showBiometricSteps && (
              <div className="p-4 border-t border-border">
                <ol className="space-y-2.5">
                  {country.biometricProcess.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm text-text-muted">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                      <span className="pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-5 border-t border-border flex-1 flex flex-col">
        <TabToggle mode={mode} setMode={setMode} />

        <div className="p-5 flex-1">
          {!country ? (
            <p className="text-sm text-text-muted text-center py-4 italic">Please select a destination country above to see visa portal and VAC details.</p>
          ) : mode === 'online' ? (
            <a href={country.visaPortalUrl} target="_blank" rel="noopener noreferrer" className="block">
              <Button variant="primary" size="sm" className="w-full bg-amber-600 hover:bg-amber-700 text-white border-none shadow-sm cursor-pointer">
                Go to {country.name} Visa Portal <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </a>
          ) : (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">Visa Application Centre (VAC)</h4>
              <div className="p-3.5 bg-surface/50 border border-border rounded-xl">
                <h5 className="font-bold text-sm text-text-primary">{country.name} — VAC / Embassy</h5>
                <p className="text-xs text-text-muted mt-1.5 flex items-start gap-1.5">
                  <MapPin className="w-3 h-3 shrink-0 mt-0.5" />
                  {country.vacAddress}
                </p>
                <p className="text-xs text-text-muted mt-1 flex items-center gap-1.5">
                  <Phone className="w-3 h-3 shrink-0" />
                  <a href={`tel:${country.vacPhone}`} className="text-primary hover:underline">{country.vacPhone}</a>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   4. POLICE VERIFICATION CARD
   ═══════════════════════════════════════════════════════════════════ */
function PoliceVerificationCard() {
  const [mode, setMode] = useState<'online' | 'offline'>('online');
  const [city, setCity] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const filteredStations = useMemo(() => {
    if (!searchCity) return POLICE_STATIONS;
    return POLICE_STATIONS.filter(s => s.city.toLowerCase().includes(searchCity.toLowerCase()) || s.address.toLowerCase().includes(searchCity.toLowerCase()));
  }, [searchCity]);

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      setSearchCity(city);
      setSearched(true);
      setLoading(false);
    }, 400);
  };

  return (
    <Card padding="none" className="group flex flex-col border-amber-200/60 bg-gradient-to-br from-amber-50/30 to-white hover:border-amber-400 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start gap-4 p-5 pb-0">
        <div className="w-14 h-14 rounded-2xl bg-amber-100/60 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-8 h-8 text-amber-700" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-text-primary">Police Verification</h3>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            <Badge variant="amber" className="text-[10px] py-0.5 px-2">High Priority</Badge>
            <Badge variant="default" className="text-[10px] py-0.5 px-2">Safety</Badge>
          </div>
        </div>
      </div>

      <p className="text-sm text-text-muted mt-4 px-5 leading-relaxed flex-1">
        File police verification requests, report cyber fraud, or locate your nearest police station for in-person verification.
      </p>

      <div className="mt-5 border-t border-border">
        <TabToggle mode={mode} setMode={setMode} />

        <div className="p-5">
          {mode === 'online' ? (
            <div className="space-y-3">
              <a href="https://cybercrime.gov.in/Webform/Crime_CategoryRegister.aspx" target="_blank" rel="noopener noreferrer" className="block">
                <Button variant="primary" size="sm" className="w-full bg-amber-600 hover:bg-amber-700 text-white border-none shadow-sm cursor-pointer">
                  Report Cyber Crime <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </a>
              <a href="https://eservices.tnpolice.gov.in/" target="_blank" rel="noopener noreferrer" className="block">
                <Button variant="outline" size="sm" className="w-full cursor-pointer">
                  Request Verification Certificate <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              <CitySearch city={city} setCity={setCity} onSearch={handleSearch} loading={loading} />

              {searched && (
                <div className="space-y-3 animate-fade-in">
                  <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                    {filteredStations.length > 0 ? `Police Stations${searchCity ? ` in ${searchCity}` : ''}` : 'No stations found'}
                  </h4>
                  {filteredStations.length > 0 ? (
                    <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                      {filteredStations.map(s => <CentreCard key={s.id} centre={s} />)}
                    </div>
                  ) : (
                    <p className="text-sm text-text-muted italic">No police stations found for &quot;{searchCity}&quot;. Try a different city.</p>
                  )}
                </div>
              )}

              {!searched && (
                <p className="text-xs text-text-muted text-center">Search a city to find nearby police stations</p>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   5. VOTER ID SERVICE CARD
   ═══════════════════════════════════════════════════════════════════ */
function VoterIdServiceCard() {
  return (
    <Card padding="none" className="group flex flex-col border-amber-200/60 bg-gradient-to-br from-amber-50/30 to-white hover:border-amber-400 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start gap-4 p-5 pb-0">
        <div className="w-14 h-14 rounded-2xl bg-amber-100/60 flex items-center justify-center shrink-0">
          <Vote className="w-8 h-8 text-amber-700" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-text-primary">Voter ID (EPIC)</h3>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            <Badge variant="amber" className="text-[10px] py-0.5 px-2">High Priority</Badge>
            <Badge variant="default" className="text-[10px] py-0.5 px-2">Election</Badge>
          </div>
        </div>
      </div>

      <p className="text-sm text-text-muted mt-4 px-5 leading-relaxed flex-1">
        Register as a voter, update your address, correct details, or download your e-EPIC. Dedicated portal for Chennai Region.
      </p>

      <div className="mt-5 p-5 border-t border-border">
        <Link href="/services/government/voter-id" className="block">
          <Button variant="primary" size="sm" className="w-full bg-amber-600 hover:bg-amber-700 text-white border-none shadow-sm cursor-pointer">
            Open Voter Services <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </Link>
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
    return GOVT_SERVICES.filter(s => !higherPriorityIds.includes(s.id));
  }, []);

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
          <p className="mt-2 text-text-muted">Quick access to essential government portals, identity services, visa applications, and security verification.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* ── HIGHER PRIORITY SERVICES ── */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold font-display text-text-primary flex items-center gap-2">
              ⭐ Essential Services
            </h2>
            <p className="text-sm text-text-muted mt-1">
              Identity credentials, travel documentation, security verification, and voter services — with both Online and Offline access.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Aadhaar Update */}
            <AadhaarServiceCard
              service={GOVT_SERVICES.find(s => s.id === 'aadhaar')!}
              IconComponent={User}
            />

            {/* Aadhaar Biometrics */}
            <AadhaarServiceCard
              service={GOVT_SERVICES.find(s => s.id === 'biometrics')!}
              IconComponent={Fingerprint}
            />

            {/* Passport */}
            <PassportServiceCard />

            {/* Police Verification */}
            <PoliceVerificationCard />

            {/* Voter ID */}
            <VoterIdServiceCard />

            {/* Visa — spans 2 cols on lg */}
            <VisaServiceCard />
          </div>
        </div>

        {/* ── OTHER SERVICES ── */}
        <div>
          <div className="mb-6 pt-4 border-t border-border">
            <h2 className="text-2xl font-bold font-display text-text-primary flex items-center gap-2 mt-8">
              📋 Other Government Services
            </h2>
            <p className="text-sm text-text-muted mt-1">
              State welfare schemes, transport facilities, employment registration, and public sector portals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lowerPriorityServices.map((service) => {
              const IconComponent = ICON_MAP[service.icon] || Building;
              return (
                <Card key={service.id} className="group flex flex-col bg-white border-border hover:border-primary/50 hover:shadow-md transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      <span className="text-[10px] font-medium text-text-muted bg-surface px-2 py-0.5 rounded-full mt-1.5 inline-block">
                        {service.category}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-text-muted mt-4 leading-relaxed flex-1">
                    {service.description}
                  </p>

                  <div className="mt-5 pt-4 border-t border-border">
                    {service.url.startsWith('/') ? (
                      <Link href={service.url} className="block">
                        <Button variant="outline" size="sm" className="w-full cursor-pointer">
                          Open Service Page <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                        </Button>
                      </Link>
                    ) : (
                      <a href={service.url} target="_blank" rel="noopener noreferrer" className="block">
                        <Button variant="outline" size="sm" className="w-full cursor-pointer">
                          Go to Official Portal <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                        </Button>
                      </a>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
