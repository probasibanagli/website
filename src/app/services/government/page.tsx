'use client';

import React, { useMemo } from 'react';
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
  GraduationCap
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { GOVT_SERVICES } from '@/lib/constants';

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
  GraduationHat01: GraduationCap
};

const MOCK_CENTRES = [
  { id: 1, name: 'CSC Aadhaar Kendra - T Nagar', address: '12, North Usman Road, T Nagar, Chennai', type: 'CSC / Enrolment Centre', distance: '1.2 km' },
  { id: 2, name: 'UIDAI Authorized Update Centre', address: 'Post Office Building, Anna Nagar, Chennai', type: 'Update Centre', distance: '3.5 km' },
  { id: 3, name: 'CSC Aadhaar Kendra - RS Puram', address: '45, DB Road, RS Puram, Coimbatore', type: 'CSC / Enrolment Centre', distance: '2.1 km' },
  { id: 4, name: 'UIDAI Authorized Update Centre', address: 'Head Post Office, KK Nagar, Madurai', type: 'Update Centre', distance: '1.5 km' },
];

function AadhaarCard({ service, IconComponent }: { service: any, IconComponent: any }) {
  const [mode, setMode] = React.useState<'online' | 'offline'>('online');
  const [loadingLoc, setLoadingLoc] = React.useState(false);
  const [city, setCity] = React.useState('');
  const [centres, setCentres] = React.useState<typeof MOCK_CENTRES | null>(null);

  const findNearby = () => {
    setLoadingLoc(true);
    setTimeout(() => {
      setLoadingLoc(false);
      setCentres(MOCK_CENTRES.filter(c => city ? c.address.toLowerCase().includes(city.toLowerCase()) : true));
    }, 800);
  };

  const useCurrentLocation = () => {
    setLoadingLoc(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(() => {
        setTimeout(() => {
          setLoadingLoc(false);
          setCentres(MOCK_CENTRES.slice(0, 2)); // Mocking nearest 2
        }, 800);
      }, () => {
        setLoadingLoc(false);
        alert('Location access denied. Please enter city manually.');
      });
    }
  };

  return (
    <Card className="group flex flex-col border-amber-200/60 bg-amber-50/5 hover:border-amber-400 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start gap-4 p-5 pb-0">
        <div className="w-14 h-14 rounded-2xl bg-amber-100/50 flex items-center justify-center text-primary shrink-0">
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
        <div className="flex border-b border-border">
          <button onClick={() => setMode('online')} className={`flex-1 py-3 text-sm font-bold transition-colors ${mode === 'online' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-text-muted hover:text-text-primary'}`}>
            Online Portal
          </button>
          <button onClick={() => setMode('offline')} className={`flex-1 py-3 text-sm font-bold transition-colors ${mode === 'offline' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-text-muted hover:text-text-primary'}`}>
            Offline Centres
          </button>
        </div>
        
        <div className="p-5">
          {mode === 'online' ? (
            <a href={service.url} target="_blank" rel="noopener noreferrer" className="block">
              <Button variant="primary" size="sm" className="w-full bg-amber-600 hover:bg-amber-700 text-white border-none shadow-sm cursor-pointer">
                Go to Official Portal <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </a>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Enter city (e.g. Chennai)" 
                  value={city} 
                  onChange={e => setCity(e.target.value)}
                  className="flex-1 px-3 py-2 border border-border rounded-lg text-sm"
                />
                <Button variant="outline" size="sm" onClick={findNearby} className="cursor-pointer bg-white">
                  Search
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-px bg-border flex-1"></div>
                <span className="text-xs text-text-muted">OR</span>
                <div className="h-px bg-border flex-1"></div>
              </div>
              <Button variant="outline" size="sm" onClick={useCurrentLocation} disabled={loadingLoc} className="w-full cursor-pointer bg-white">
                {loadingLoc ? 'Locating...' : 'Use My Current Location'} <Compass className="w-3.5 h-3.5 ml-1.5" />
              </Button>
              
              {centres && (
                <div className="mt-4 space-y-3">
                  <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">Nearby Centres</h4>
                  {centres.length > 0 ? centres.map(c => (
                    <div key={c.id} className="p-3 bg-white border border-border rounded-xl shadow-sm">
                      <div className="flex justify-between items-start">
                        <h5 className="font-bold text-sm text-text-primary">{c.name}</h5>
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{c.distance}</span>
                      </div>
                      <p className="text-xs text-text-muted mt-1">{c.address}</p>
                      <p className="text-[10px] font-medium text-amber-600 mt-2">{c.type}</p>
                    </div>
                  )) : (
                    <p className="text-sm text-text-muted italic">No centres found in this area.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function GovernmentPage() {
  const higherPriorityIds = ['aadhaar', 'passport', 'visa', 'police-verification', 'biometrics', 'voter-id'];
  
  const higherPriorityServices = useMemo(() => {
    // Preserve ordering matching: Aadhaar, Passport, Visa, Police Verification, Biometric Services, Voter ID
    const orderedIds = ['aadhaar', 'passport', 'visa', 'police-verification', 'biometrics', 'voter-id'];
    return orderedIds
      .map(id => GOVT_SERVICES.find(s => s.id === id))
      .filter((s): s is typeof GOVT_SERVICES[0] => !!s);
  }, []);

  const lowerPriorityServices = useMemo(() => {
    return GOVT_SERVICES.filter(s => !higherPriorityIds.includes(s.id));
  }, []);

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
            <Link href="/" className="hover:text-primary">Home</Link><span>/</span>
            <span className="text-text-primary font-medium">Government Services</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-text-primary">Government Services</h1>
          <p className="mt-2 text-text-muted">Quick access to essential government portals, security verification, and social schemes.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* ── HIGHER PRIORITY SERVICES ── */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold font-display text-text-primary flex items-center gap-2">
              ⭐ Higher Priority Services
            </h2>
            <p className="text-sm text-text-muted mt-1">
              Essential identity credentials, security safety checks, and international travel documentation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {higherPriorityServices.map((service) => {
              const IconComponent = service.id === 'biometrics' 
                ? Fingerprint 
                : (ICON_MAP[service.icon] || Building);
                
              if (service.id === 'aadhaar' || service.id === 'biometrics') {
                return <AadhaarCard key={service.id} service={service} IconComponent={IconComponent} />;
              }
                
              return (
                <Card key={service.id} className="group flex flex-col border-amber-200/60 bg-amber-50/5 hover:border-amber-400 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-4 p-5 pb-0">
                    <div className="w-14 h-14 rounded-2xl bg-amber-100/50 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-8 h-8 text-amber-700" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors">
                          {service.title}
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        <Badge variant="amber" className="text-[10px] py-0.5 px-2">
                          High Priority
                        </Badge>
                        <Badge variant="default" className="text-[10px] py-0.5 px-2">
                          {service.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-text-muted mt-4 px-5 leading-relaxed flex-1">
                    {service.description}
                  </p>
                  
                  <div className="mt-5 p-5 border-t border-border">
                    <a href={service.url} target="_blank" rel="noopener noreferrer" className="block">
                      <Button variant="primary" size="sm" className="w-full bg-amber-600 hover:bg-amber-700 text-white border-none shadow-sm cursor-pointer">
                        Go to Official Portal <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                      </Button>
                    </a>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* ── LOWER PRIORITY SERVICES ── */}
        <div>
          <div className="mb-6 pt-4 border-t border-border">
            <h2 className="text-2xl font-bold font-display text-text-primary flex items-center gap-2 mt-8">
              📋 Lower Priority Services
            </h2>
            <p className="text-sm text-text-muted mt-1">
              General state welfare schemes, transport facilities, and public sector employment portals.
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
                    <a href={service.url} target="_blank" rel="noopener noreferrer" className="block">
                      <Button variant="outline" size="sm" className="w-full cursor-pointer">
                        Go to Official Portal <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                      </Button>
                    </a>
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
