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
  MapPin,
  Phone,
  Clock,
  Search,
  CheckCircle,
  HelpCircle,
  Filter
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

// ── CUSTOM INTERACTIVE DATA ──

// Aadhaar CSC & Enrollment Center Data
const AADHAAR_OFFLINE_CENTRES: Record<string, { name: string; address: string; timing: string; type: string }[]> = {
  Chennai: [
    { name: 'UIDAI Aadhaar Seva Kendra (ASK)', address: 'First Floor, Ramee Mall, No. 352, Anna Salai, Teynampet, Chennai - 600018 (Opp. Hyatt Regency)', timing: '9:30 AM - 5:30 PM (All 7 days)', type: 'Official ASK' },
    { name: 'BSNL Aadhaar Enrolment Centre', address: 'Anna Road Telephone Exchange, No. 860, Anna Salai, Chennai - 600002', timing: '10:00 AM - 5:00 PM (Mon-Sat)', type: 'Post/Telecom' },
    { name: 'Chennai Corporation Aadhaar Centre', address: 'Ripon Building Campus, General Hospital Road, Periamet, Chennai - 600003', timing: '10:00 AM - 4:30 PM (Mon-Fri)', type: 'Govt Office' }
  ],
  Coimbatore: [
    { name: 'UIDAI Aadhaar Seva Kendra (ASK)', address: 'No. 202, Kalapatti Road, Sharp Nagar, Nehru Nagar, Coimbatore - 641048', timing: '9:30 AM - 5:30 PM (All 7 days)', type: 'Official ASK' },
    { name: 'Post Office Aadhaar Centre', address: 'Coimbatore Head Post Office, Goods Shed Road, RS Puram, Coimbatore - 641002', timing: '10:00 AM - 4:00 PM (Mon-Sat)', type: 'Post/Telecom' }
  ],
  Vellore: [
    { name: 'Post Office Aadhaar Centre', address: 'Vellore Head Post Office, Officers Line, Vellore - 632001', timing: '10:00 AM - 4:00 PM (Mon-Sat)', type: 'Post/Telecom' },
    { name: 'CSC District Collectorate Vellore', address: 'Ground Floor, A-Block, Collectorate Campus, Sathuvachari, Vellore - 632009', timing: '10:00 AM - 5:00 PM (Mon-Fri)', type: 'Govt Office' }
  ]
};

// Passport Seva Kendra (PSK) Data
const PASSPORT_SEVA_CENTRES: Record<string, Record<string, { name: string; address: string; type: string }[]>> = {
  'Tamil Nadu': {
    Chennai: [
      { name: 'PSK Saligramam', address: 'No. 1, Kamarajar Salai, Saligramam, Chennai - 600093 (Near Vadapalani)', type: 'PSK' },
      { name: 'PSK Aminjikarai', address: 'No. 2, Nelson Manickam Road, Aminjikarai, Chennai - 600029 (Opp. Ampa Skywalk Mall)', type: 'PSK' },
      { name: 'PSK Tambaram', address: 'Claret Complex, Tambaram Main Road, Tambaram, Chennai - 600045', type: 'PSK' }
    ],
    Coimbatore: [
      { name: 'PSK Coimbatore', address: 'SRK Complex, No. 1290, Avinashi Road, Peelamedu, Coimbatore - 641018', type: 'PSK' }
    ],
    Vellore: [
      { name: 'Post Office Passport Seva Kendra (POPSK)', address: 'Vellore Head Post Office, Officers Line, Vellore - 632001', type: 'POPSK' }
    ],
    Madurai: [
      { name: 'PSK Madurai', address: 'Bharathi Ula Road, Race Course, Madurai - 625002', type: 'PSK' }
    ],
    Tiruchirappalli: [
      { name: 'PSK Trichy', address: 'Water Tank Road, Cantonment, Tiruchirappalli - 620001', type: 'PSK' }
    ],
    Salem: [
      { name: 'Post Office Passport Seva Kendra (POPSK)', address: 'Salem Head Post Office, Fort, Salem - 636001', type: 'POPSK' }
    ]
  },
  'West Bengal': {
    Kolkata: [
      { name: 'PSK Kolkata (Lal Bazar)', address: '4, Lalbazar Street, Kolkata - 700001', type: 'PSK' },
      { name: 'PSK Kolkata (Bypass)', address: 'RTO Building, 1025, Madurdaha, E.M. Bypass, Kolkata - 700107', type: 'PSK' }
    ],
    Siliguri: [
      { name: 'PSK Siliguri', address: 'No. 22/1, Sevoke Road, Siliguri - 734001', type: 'PSK' }
    ]
  }
};

// Visa Details Data
interface VisaDetail {
  officialUrl: string;
  applicationProcess: string[];
  biometricProcess: string[];
  offlineOption: {
    title: string;
    address: string;
    phone?: string;
    email?: string;
  };
}

const VISA_COUNTRIES: Record<string, VisaDetail> = {
  USA: {
    officialUrl: 'https://ceac.state.gov/genniv/',
    applicationProcess: [
      'Fill out the Online Nonimmigrant Visa Application Form (DS-160).',
      'Create an account on the official US Visa appointment scheduling system (ustraveldocs.com).',
      'Pay the machine-readable visa fee (MRV fee) online or via designated bank options.',
      'Schedule two appointments: the Visa Application Centre (VAC) for biometrics and the Embassy/Consulate for the visa interview.'
    ],
    biometricProcess: [
      'Attend the scheduled Visa Application Centre (VAC) appointment.',
      'Present a valid passport, the DS-160 confirmation sheet, and the appointment confirmation page.',
      'Provide your digital fingerprints scan and standard digital photo at the VAC desk.'
    ],
    offlineOption: {
      title: 'US Visa Application Centre (VAC) Chennai',
      address: 'Good Shepherd, No 32, Kodambakkam High Rd, Nungambakkam, Chennai, Tamil Nadu 600034',
      phone: '+91 22 6201 1000'
    }
  },
  UK: {
    officialUrl: 'https://www.gov.uk/apply-to-come-to-the-uk',
    applicationProcess: [
      'Complete the online visa application form on the official GOV.UK portal.',
      'Pay the visa fee and the Immigration Health Surcharge (IHS) if applying for stays longer than 6 months.',
      'Book a biometric enrollment appointment at a VFS Global visa application centre.',
      'Upload scan copies of all supporting documents directly to the portal or purchase document scanning services at VFS.'
    ],
    biometricProcess: [
      'Arrive at the VFS Global center 15 minutes before your scheduled appointment.',
      'Present your original physical passport, application receipt, and checklist.',
      'Have your digital photo captured and your 10-digit fingerprint scans enrolled.'
    ],
    offlineOption: {
      title: 'VFS Global UK Visa Application Centre',
      address: 'Fagun Mansion, 2nd Floor, No. 74, Ethiraj Salai, Egmore, Chennai, Tamil Nadu 600008',
      email: 'ukvi.feedback.in@vfshelpline.com'
    }
  },
  Canada: {
    officialUrl: 'https://www.canada.ca/en/services/immigration-citizenship.html',
    applicationProcess: [
      'Create an IRCC secure online account on the Canada government portal.',
      'Fill out the application, upload scans of necessary documents, and pay the visa and biometric fee.',
      'Receive a Biometric Instruction Letter (BIL) on your account page within 24-48 hours.',
      'Book a biometric submission slot at a local VFS Canada Visa Application Centre (CVAC).'
    ],
    biometricProcess: [
      'Bring your original passport, the Biometric Instruction Letter (BIL), and booking confirmation to VFS.',
      'Provide your electronic fingerprint scans and live digital photo at the biometrics booth.',
      'Receive a stamp of completion on your BIL copy.'
    ],
    offlineOption: {
      title: 'VFS Global Canada Visa Application Centre',
      address: 'Fagun Mansion, Ground Floor, No. 74, Ethiraj Salai, Egmore, Chennai, Tamil Nadu 600008',
      phone: '+91 22 6786 6002'
    }
  },
  'Schengen (Germany)': {
    officialUrl: 'https://videx.diplo.de/videx-kurzzeit-layout/videx?lang=en',
    applicationProcess: [
      'Complete the VIDEX Schengen Visa Application Form online.',
      'Prepare mandatory documents: flight itinerary, travel medical insurance, hotel proof, and bank statements.',
      'Book a submission and biometric slot through VFS Global Germany.',
      'Attend VFS Global to submit your physical documents, pay processing fees, and record biometrics.'
    ],
    biometricProcess: [
      'Submit the physical visa file at the VFS Global counter.',
      'Proceed to the biometric station to record ten-finger scans and a live digital photo.',
      'Passport will be securely sent to the German Consulate General in Chennai.'
    ],
    offlineOption: {
      title: 'German Consulate General Chennai / VFS Germany',
      address: 'German Consulate: 9, Boat Club Rd, Alwarpet, Chennai, TN 600028 | VFS Centre: Fagun Mansion, egmore, Chennai 600008',
      phone: '+91 44 2430 1600'
    }
  },
  Bangladesh: {
    officialUrl: 'https://www.visa.gov.bd/',
    applicationProcess: [
      'Complete the online visa application form on the Bangladesh Department of Immigration portal.',
      'Print out the submitted application form and sign it.',
      'Prepare passport, physical passport-sized photos, and supporting letters.',
      'Submit the printed form physically at the Bangladesh Visa Application Center (IVAC) in Chennai.'
    ],
    biometricProcess: [
      'Note: Standard tourist/business visa applicants submit documents physically. Biometrics are collected only for special visa categories or during passport validation.',
      'Visit the IVAC with your printout and physical copy of your documents to submit directly.'
    ],
    offlineOption: {
      title: 'Bangladesh Visa Application Centre (IVAC)',
      address: 'No. 3, First Floor, Club House Road, Anna Salai, Chennai, Tamil Nadu 600002',
      phone: '+91 44 2841 0002'
    }
  }
};

// Police Verification Offline Data
const POLICE_OFFLINE_OFFICES = [
  { city: 'Chennai', office: 'Greater Chennai Police Commissionerate', address: 'No. 132, Commissioner Office Building, EVK Sampath Road, Vepery, Chennai - 600007', phone: '044-23452345' },
  { city: 'Coimbatore', office: 'Coimbatore City Police Commissionerate', address: 'Huzur Road, near District Court, Coimbatore - 641018', phone: '0422-2300250' },
  { city: 'Vellore', office: 'Vellore District Superintendent of Police Office', address: 'Collectorate Campus, Sathuvachari, Vellore - 632009', phone: '0416-2256100' }
];

const VOTER_OFFLINE_OFFICES = [
  { city: 'Chennai', office: 'Regional Election Office, Greater Chennai Corporation', address: 'Ripon Buildings, General Hospital Road, Periamet, Chennai - 600003', phone: '044-25619300 (Helpline: 1950)' },
  { city: 'Coimbatore', office: 'District Election Office & Collectorate Coimbatore', address: 'Huzur Road, Gopalapuram, Coimbatore - 641018', phone: '0422-2300150 (Helpline: 1950)' },
  { city: 'Vellore', office: 'District Election Office & Collectorate Vellore', address: 'A-Block, Collectorate Campus, Sathuvachari, Vellore - 632009', phone: '0416-2256600 (Helpline: 1950)' }
];

export default function GovernmentPage() {
  // Page states
  const [aadhaarCity, setAadhaarCity] = useState('Chennai');
  const [passportState, setPassportState] = useState('Tamil Nadu');
  const [passportDistrict, setPassportDistrict] = useState('Chennai');
  const [visaCountry, setVisaCountry] = useState('USA');
  const [policeCity, setPoliceCity] = useState('Chennai');
  const [voterCity, setVoterCity] = useState('Chennai');
  
  // Visa sub-section toggle
  const [activeVisaTab, setActiveVisaTab] = useState<'app' | 'bio' | 'offline'>('app');

  // Filter district list based on Passport State
  const districtOptions = useMemo(() => {
    if (!passportState || !PASSPORT_SEVA_CENTRES[passportState]) return [];
    return Object.keys(PASSPORT_SEVA_CENTRES[passportState]);
  }, [passportState]);

  // Set default district when passport state changes
  const handlePassportStateChange = (state: string) => {
    setPassportState(state);
    const districts = Object.keys(PASSPORT_SEVA_CENTRES[state] || {});
    if (districts.length > 0) {
      setPassportDistrict(districts[0]);
    } else {
      setPassportDistrict('');
    }
  };

  // Split general services
  const coreServiceIds = ['aadhaar', 'passport', 'visa', 'police-verification', 'biometrics', 'voter-id'];
  const generalServices = useMemo(() => {
    return GOVT_SERVICES.filter(s => !coreServiceIds.includes(s.id));
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
          <p className="mt-2 text-text-muted">Quick access to online application portals, physical centers, and verification processes in Tamil Nadu.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* ── 1. AADHAAR SERVICES SECTION ── */}
        <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 bg-gradient-to-r from-amber-50/50 via-orange-50/20 to-white border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                <Fingerprint className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-primary">Aadhaar Services</h2>
                <p className="text-xs text-text-muted">Manage demographics, address changes, and biometric credentials.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-text-muted">Select City for Offline Centres:</label>
              <select 
                value={aadhaarCity} 
                onChange={(e) => setAadhaarCity(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-border bg-white text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Chennai">Chennai</option>
                <option value="Coimbatore">Coimbatore</option>
                <option value="Vellore">Vellore</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
            {/* Card 1: Aadhaar Update & Enrolment */}
            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-text-primary">Aadhaar Update & Enrolment</h3>
                  <Badge variant="amber">High Priority</Badge>
                </div>
                <p className="text-sm text-text-muted mt-2">
                  Update your Aadhaar name, address, date of birth, mobile number or enroll a new family member.
                </p>
              </div>

              {/* Online Option */}
              <div className="p-4 rounded-xl bg-surface border border-border/60">
                <p className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" /> Online Option
                </p>
                <p className="text-xs text-text-muted mt-1.5 mb-3">
                  Verify or update your demographic details (such as address) online via myAadhaar portal.
                </p>
                <a href="https://uidai.gov.in/" target="_blank" rel="noopener noreferrer">
                  <Button variant="primary" size="sm" className="w-full bg-amber-600 hover:bg-amber-700 text-white cursor-pointer border-none text-xs">
                    Go to Official UIDAI Portal <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </a>
              </div>

              {/* Offline Option */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Offline Option (CSC & Aadhaar Centres)
                </p>
                <div className="space-y-2.5">
                  {AADHAAR_OFFLINE_CENTRES[aadhaarCity]?.map((centre, index) => (
                    <div key={index} className="p-3 bg-white border border-border/80 rounded-lg text-xs hover:border-amber-400 transition-colors">
                      <div className="flex items-center justify-between font-semibold text-text-primary">
                        <span>{centre.name}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-surface border border-border">{centre.type}</span>
                      </div>
                      <p className="text-text-muted mt-1">{centre.address}</p>
                      <p className="text-[10px] text-text-muted mt-1.5 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" /> {centre.timing}
                      </p>
                    </div>
                  ))}
                </div>
                <a href="https://locator.csccloud.in/" target="_blank" rel="noopener noreferrer" className="block text-center mt-2">
                  <Button variant="outline" size="sm" className="w-full text-xs cursor-pointer">
                    Search Nearer CSC Centre <Search className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </a>
              </div>
            </div>

            {/* Card 2: Aadhaar Biometric Services */}
            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-text-primary">Aadhaar Biometric Services</h3>
                  <Badge variant="default">Aadhaar Security</Badge>
                </div>
                <p className="text-sm text-text-muted mt-2">
                  Lock or unlock your biometric details online to prevent unauthorized access or verify fingerprints physically.
                </p>
              </div>

              {/* Online Option */}
              <div className="p-4 rounded-xl bg-surface border border-border/60">
                <p className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" /> Online Option
                </p>
                <p className="text-xs text-text-muted mt-1.5 mb-3">
                  Quickly lock or unlock your biometrics (fingerprints/iris) or download virtual ID securely.
                </p>
                <a href="https://myaadhaar.uidai.gov.in/" target="_blank" rel="noopener noreferrer">
                  <Button variant="primary" size="sm" className="w-full bg-amber-600 hover:bg-amber-700 text-white cursor-pointer border-none text-xs">
                    Lock/Unlock Biometrics Online <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </a>
              </div>

              {/* Offline Option */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Offline Option (Mandatory Biometric Updates)
                </p>
                <div className="p-4 bg-white border border-border/80 rounded-xl text-xs space-y-2">
                  <p className="font-semibold text-text-primary">Required in-person verification for:</p>
                  <ul className="list-disc pl-4 space-y-1 text-text-muted">
                    <li>Mandatory Biometric Updates for children (at age 5 and age 15)</li>
                    <li>Updating Photo or Fingerprints/Iris scan details</li>
                    <li>Resolving complex authentication validation failures</li>
                  </ul>
                  <p className="text-text-muted pt-2 border-t border-border mt-2">
                    Biometric changes require visits to official Aadhaar Seva Kendras (ASKs) or registered post office centres in <span className="font-bold text-text-primary">{aadhaarCity}</span>.
                  </p>
                </div>
                <a href="https://appointments.uidai.gov.in/bookappointment.aspx" target="_blank" rel="noopener noreferrer" className="block">
                  <Button variant="outline" size="sm" className="w-full text-xs cursor-pointer">
                    Book Appointment Online First <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. PASSPORT SERVICES SECTION ── */}
        <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 bg-gradient-to-r from-blue-50/50 via-indigo-50/10 to-white border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-primary">Passport Services (Passport Seva)</h2>
                <p className="text-xs text-text-muted">Apply for fresh passports, renewals, reissue, and PCC documentation.</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <label className="text-xs font-semibold text-text-muted">State:</label>
                <select 
                  value={passportState} 
                  onChange={(e) => handlePassportStateChange(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-border bg-white text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {Object.keys(PASSPORT_SEVA_CENTRES).map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-1.5">
                <label className="text-xs font-semibold text-text-muted">District:</label>
                <select 
                  value={passportDistrict} 
                  onChange={(e) => setPassportDistrict(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-border bg-white text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary min-w-[120px]"
                >
                  {districtOptions.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
            {/* Passport Online */}
            <div className="p-6 space-y-4">
              <h3 className="font-bold text-text-primary text-base flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600" /> Passport Online Application
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Applicants must fill out forms and pay the application fees online on the official Passport Seva portal before visiting local offices.
              </p>
              <div className="p-4 rounded-xl bg-blue-50/20 border border-blue-100 space-y-3">
                <p className="text-xs font-semibold text-blue-800">Quick Guide:</p>
                <ul className="list-decimal pl-4 space-y-1.5 text-xs text-text-muted">
                  <li>Register on the Passport Seva Online Portal.</li>
                  <li>Log in and click on the &apos;Apply for Fresh Passport/Reissue of Passport&apos; link.</li>
                  <li>Fill in the required details in the form and submit.</li>
                  <li>Click the &apos;Pay and Schedule Appointment&apos; link to schedule your slot.</li>
                </ul>
              </div>
              <a href="https://passportindia.gov.in/" target="_blank" rel="noopener noreferrer" className="block pt-2">
                <Button variant="primary" size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white border-none cursor-pointer text-xs">
                  Go to Official Passport Application Portal <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </a>
            </div>

            {/* Passport Offline */}
            <div className="p-6 space-y-4">
              <h3 className="font-bold text-text-primary text-base flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" /> Nearest Passport Seva Kendra (PSK)
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Biometrics verification, photograph, and document submission occur at your selected physical office in <span className="font-bold text-text-primary">{passportDistrict}, {passportState}</span>.
              </p>
              
              <div className="space-y-3 max-h-[180px] overflow-y-auto pr-1">
                {PASSPORT_SEVA_CENTRES[passportState]?.[passportDistrict]?.map((psk, idx) => (
                  <div key={idx} className="p-3 bg-surface border border-border/80 rounded-lg text-xs">
                    <div className="flex justify-between items-center font-bold text-text-primary">
                      <span>{psk.name}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 border border-blue-200">{psk.type}</span>
                    </div>
                    <p className="text-text-muted mt-1">{psk.address}</p>
                  </div>
                )) || (
                  <p className="text-xs text-text-muted italic">No PSK database found for {passportDistrict}. Use search button below to find the exact local POPSK.</p>
                )}
              </div>

              <a href="https://www.passportindia.gov.in/AppOnlineProject/welcomeLink" target="_blank" rel="noopener noreferrer" className="block">
                <Button variant="outline" size="sm" className="w-full text-xs cursor-pointer">
                  Locate Passport Seva Office Official Page <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* ── 3. VISA SERVICES SECTION ── */}
        <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 bg-gradient-to-r from-emerald-50/50 via-teal-50/10 to-white border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-primary">Visa Services & Information</h2>
                <p className="text-xs text-text-muted">Visa application details, appointment booking, and local consular processing.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-text-muted">Destination Country:</label>
              <select 
                value={visaCountry} 
                onChange={(e) => setVisaCountry(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-border bg-white text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary min-w-[150px]"
              >
                {Object.keys(VISA_COUNTRIES).map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Top selectors for tabs */}
            <div className="flex flex-wrap gap-2 border-b border-border pb-3">
              <button
                onClick={() => setActiveVisaTab('app')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeVisaTab === 'app'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-surface text-text-primary hover:bg-emerald-50'
                }`}
              >
                📄 Visa Application Process
              </button>
              <button
                onClick={() => setActiveVisaTab('bio')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeVisaTab === 'bio'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-surface text-text-primary hover:bg-emerald-50'
                }`}
              >
                👣 Biometric Appointment
              </button>
              <button
                onClick={() => setActiveVisaTab('offline')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeVisaTab === 'offline'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-surface text-text-primary hover:bg-emerald-50'
                }`}
              >
                🏢 Offline Center / Embassy
              </button>
            </div>

            {/* TAB CONTENTS */}
            <div className="min-h-[160px] animate-fade-in">
              {activeVisaTab === 'app' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-sm font-bold text-text-primary">Application Steps for {visaCountry}</h3>
                    <a href={VISA_COUNTRIES[visaCountry].officialUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="text-xs text-emerald-700 border-emerald-300 hover:bg-emerald-50 cursor-pointer">
                        Official Visa Application Website <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                      </Button>
                    </a>
                  </div>
                  <ul className="space-y-2.5">
                    {VISA_COUNTRIES[visaCountry].applicationProcess.map((step, idx) => (
                      <li key={idx} className="flex gap-2.5 items-start text-xs text-text-muted">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">{idx + 1}</span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeVisaTab === 'bio' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-text-primary">Biometric Appointment Process</h3>
                  <p className="text-xs text-text-muted mb-2">
                    Required biometrics are standard procedure to record facial coordinates and fingerprint templates for overseas travel clearance.
                  </p>
                  <ul className="space-y-2.5">
                    {VISA_COUNTRIES[visaCountry].biometricProcess.map((step, idx) => (
                      <li key={idx} className="flex gap-2.5 items-start text-xs text-text-muted">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">✓</span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeVisaTab === 'offline' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-text-primary">Embassy, Consulate, or Visa Application Centre (VAC)</h3>
                  <div className="p-4 bg-surface border border-border rounded-xl space-y-3 text-xs max-w-2xl">
                    <p className="font-bold text-emerald-800 text-sm">{VISA_COUNTRIES[visaCountry].offlineOption.title}</p>
                    <p className="text-text-muted flex items-start gap-1.5"><MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />{VISA_COUNTRIES[visaCountry].offlineOption.address}</p>
                    {VISA_COUNTRIES[visaCountry].offlineOption.phone && (
                      <p className="text-text-muted flex items-center gap-1.5"><Phone className="w-4 h-4 text-emerald-700 shrink-0" />{VISA_COUNTRIES[visaCountry].offlineOption.phone}</p>
                    )}
                    {VISA_COUNTRIES[visaCountry].offlineOption.email && (
                      <p className="text-text-muted flex items-center gap-1.5"><Globe className="w-4 h-4 text-emerald-700 shrink-0" />{VISA_COUNTRIES[visaCountry].offlineOption.email}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── 4. POLICE VERIFICATION SECTION ── */}
        <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 bg-gradient-to-r from-red-50/50 via-rose-50/10 to-white border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-700">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-primary">Police Verification & Certificates</h2>
                <p className="text-xs text-text-muted">Obtain police clearance certificates (PCC), job background checks, or register security complaints.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-text-muted">Nearest Office:</label>
              <select 
                value={policeCity} 
                onChange={(e) => setPoliceCity(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-border bg-white text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary min-w-[120px]"
              >
                <option value="Chennai">Chennai</option>
                <option value="Coimbatore">Coimbatore</option>
                <option value="Vellore">Vellore</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
            {/* Online option */}
            <div className="p-6 space-y-4">
              <h3 className="font-bold text-text-primary text-base flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-red-600" /> Online Application / Portal
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Tamil Nadu Police offers online verification checks for employment, tenant registration, and domestic help background audits directly via e-Services.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a href="https://eservices.tnpolice.gov.in/" target="_blank" rel="noopener noreferrer" className="block">
                  <Button variant="outline" size="sm" className="w-full text-xs text-red-700 border-red-200 hover:bg-red-50 cursor-pointer">
                    TN Police Citizen Portal <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </a>
                <a href="https://cybercrime.gov.in/" target="_blank" rel="noopener noreferrer" className="block">
                  <Button variant="outline" size="sm" className="w-full text-xs text-red-700 border-red-200 hover:bg-red-50 cursor-pointer">
                    National Cyber Portal <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </a>
              </div>
            </div>

            {/* Offline option */}
            <div className="p-6 space-y-4">
              <h3 className="font-bold text-text-primary text-base flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-600" /> Nearest Station / Verification Office
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                For in-person identification, verification queries, or document collection, visit your local commissionerate headquarters or local police station.
              </p>

              {(() => {
                const currentOffice = POLICE_OFFLINE_OFFICES.find(o => o.city === policeCity);
                if (!currentOffice) return null;
                return (
                  <div className="p-4 bg-surface border border-border rounded-xl text-xs space-y-2">
                    <p className="font-bold text-text-primary">{currentOffice.office}</p>
                    <p className="text-text-muted flex items-start gap-1.5"><MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />{currentOffice.address}</p>
                    <p className="text-text-muted flex items-center gap-1.5"><Phone className="w-4 h-4 text-red-600 shrink-0" />Control Room: {currentOffice.phone}</p>
                  </div>
                );
              })()}

              <a href="https://eservices.tnpolice.gov.in/CCTNSPL/PoliceStationLocator" target="_blank" rel="noopener noreferrer" className="block">
                <Button variant="outline" size="sm" className="w-full text-xs cursor-pointer">
                  Search Local Station (Station Locator) <Search className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* ── 5. VOTER ID SERVICES SECTION ── */}
        <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 bg-gradient-to-r from-teal-50/30 via-indigo-50/10 to-white border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-primary">Voter ID Services (EPIC)</h2>
                <p className="text-xs text-text-muted">Register as a voter, update electoral details, or correct name/address in the voter roll.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-text-muted">Nearest Office:</label>
              <select 
                value={voterCity} 
                onChange={(e) => setVoterCity(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-border bg-white text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary min-w-[120px]"
              >
                <option value="Chennai">Chennai</option>
                <option value="Coimbatore">Coimbatore</option>
                <option value="Vellore">Vellore</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
            {/* Online option */}
            <div className="p-6 space-y-4">
              <h3 className="font-bold text-text-primary text-base flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-indigo-600" /> Online Portal (NVSP)
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Apply online for new voter registration, correction of existing details, transposition, or download your digital e-EPIC card through the National Voters&apos; Service Portal.
              </p>
              <div className="p-4 rounded-xl bg-indigo-50/20 border border-indigo-100 space-y-2 text-xs text-text-muted">
                <p className="font-semibold text-indigo-900">Available Online Services:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Form 6: Fresh registration for new electors</li>
                  <li>Form 8: Correction of entries/shifting of residence</li>
                  <li>e-EPIC: Download secure portable document format voter card</li>
                </ul>
              </div>
              <a href="https://voters.eci.gov.in/" target="_blank" rel="noopener noreferrer" className="block pt-2">
                <Button variant="primary" size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white border-none cursor-pointer text-xs">
                  Go to Official Voter ECI Portal <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </a>
            </div>

            {/* Offline option */}
            <div className="p-6 space-y-4">
              <h3 className="font-bold text-text-primary text-base flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-600" /> Election Office & Voter Centres
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                For submiting physical forms, resolving duplicate entries, or picking up physical voter ID cards, visit your local District Election Office.
              </p>

              {(() => {
                const currentOffice = VOTER_OFFLINE_OFFICES.find(o => o.city === voterCity);
                if (!currentOffice) return null;
                return (
                  <div className="p-4 bg-surface border border-border rounded-xl text-xs space-y-2">
                    <p className="font-bold text-text-primary">{currentOffice.office}</p>
                    <p className="text-text-muted flex items-start gap-1.5"><MapPin className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />{currentOffice.address}</p>
                    <p className="text-text-muted flex items-center gap-1.5"><Phone className="w-4 h-4 text-indigo-600 shrink-0" />Contact: {currentOffice.phone}</p>
                  </div>
                );
              })()}

              <a href="https://electoralsearch.eci.gov.in/" target="_blank" rel="noopener noreferrer" className="block">
                <Button variant="outline" size="sm" className="w-full text-xs cursor-pointer">
                  Search Polling Station & Details <Search className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* ── 6. OTHER SERVICES GRID ── */}
        <div>
          <div className="mb-6 pt-4 border-t border-border">
            <h2 className="text-2xl font-bold font-display text-text-primary flex items-center gap-2 mt-8">
              📋 Other Government Services & Schemes
            </h2>
            <p className="text-sm text-text-muted mt-1">
              General state welfare schemes, public transport updates, and student scholarship portals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generalServices.map((service) => {
              const IconComponent = ICON_MAP[service.icon] || Building;
              return (
                <Card key={service.id} className="group flex flex-col bg-white border-border hover:border-primary/50 hover:shadow-md transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors font-display">
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
