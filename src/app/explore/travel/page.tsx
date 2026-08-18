'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Navigation,
  Bus,
  Train,
  Car,
  Bike,
  ExternalLink,
  Loader2,
  AlertCircle,
  Search,
  Megaphone,
  Map,
  ArrowRight,
  Clock,
  CreditCard,
  ArrowUpDown,
  CheckCircle2,
  Compass,
  Filter,
  Volume2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import { TAMIL_WORDS } from '@/lib/constants';
import { checkRouteAvailability, RouteResponse, TransportCategory, PrivateMode } from '@/lib/routingService';
import {
  METRO_STATIONS,
  getMetroTimings,
  LOCAL_TRAINS,
  MTC_BUSES,
  OUTSTATION_DESTINATIONS
} from '@/data/transport-data';
import { SUBURBAN_TRAINS } from '@/data/suburban-trains-data';
import { CHENNAI_METRO_FARES } from '@/data/chennai-metro-fares-data';

const STATION_CODE_TO_NAME: Record<string, string> = {
  'VLCY': 'Velachery',
  'MSB': 'Chennai Beach',
  'TRT': 'Tiruttani',
  'AJJ': 'Arakkonam',
  'TRL': 'Tiruvallur',
  'MMC': 'Chennai Central (MMC)',
  'AVD': 'Avadi',
  'PTMS': 'Pattabiram Military Siding',
  'SPE': 'Sullurupeta',
  'GPD': 'Gummidipoondi',
  'TBM': 'Tambaram',
  'CGL': 'Chengalpattu',
  'AJJ/TMLP': 'Arakkonam / Tirumalpur',
  'CJ': 'Kanchipuram',
  'TMLP/AJJ': 'Tirumalpur / Arakkonam'
};

const SUBURBAN_STATIONS = [
  { code: 'AJJ', name: 'Arakkonam' },
  { code: 'AJJ/TMLP', name: 'Arakkonam / Tirumalpur' },
  { code: 'AVD', name: 'Avadi' },
  { code: 'CGL', name: 'Chengalpattu' },
  { code: 'MSB', name: 'Chennai Beach' },
  { code: 'MMC', name: 'Chennai Central (MMC)' },
  { code: 'GPD', name: 'Gummidipoondi' },
  { code: 'CJ', name: 'Kanchipuram' },
  { code: 'PTMS', name: 'Pattabiram Military Siding' },
  { code: 'SPE', name: 'Sullurupeta' },
  { code: 'TBM', name: 'Tambaram' },
  { code: 'TRL', name: 'Tiruvallur' },
  { code: 'TRT', name: 'Tiruttani' },
  { code: 'TMLP/AJJ', name: 'Tirumalpur / Arakkonam' },
  { code: 'VLCY', name: 'Velachery' }
];

function parseSuburbanTimeToMinutes(t: string): number {
  if (!t) return 9999;
  const first = t.split('/')[0];
  const m = first.match(/(\d{1,2})[.:](\d{2})/);
  if (!m) return 9999;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  if (h === 24) h = 0;
  return h * 60 + min;
}

function formatSuburbanTime(timeStr: string): string {
  if (!timeStr) return '';
  const parts = timeStr.split('.');
  let h = parseInt(parts[0], 10);
  const m = parts[1] || '00';
  if (isNaN(h)) return timeStr;
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  const min = m.padEnd(2, '0');
  return `${h}:${min} ${ampm}`;
}

const METRO_BLUE_LINE = [
  'Wimco Nagar Depot',
  'Wimco Nagar',
  'Thiruvotriyur',
  'Thiruvotriyur Theredi',
  'Kaladipet',
  'Toll Gate',
  'New Washermenpet',
  'Tondiarpet',
  'Thyagaraya College',
  'Washermenpet',
  'Mannadi',
  'High Court',
  'Puratchi Thalaivar Dr.M.G.Ramachandran Central Metro',
  'Government Estate',
  'LIC',
  'Thousand Light',
  'AG-DMS',
  'Teynampet',
  'Nandanam',
  'Saidapet',
  'Little Mount',
  'Guindy',
  'Arignar Anna Alandur Metro',
  'Meenambakkam',
  'Airport'
];

const METRO_GREEN_LINE = [
  'Puratchi Thalaivar Dr.M.G.Ramachandran Central Metro',
  'Egmore',
  'Nehru Park',
  'Kilpauk',
  'Pachiappas College',
  'Shenoy Nagar',
  'Anna Nagar East',
  'Anna Nagar Tower',
  'Thirumangalam',
  'Koyambedu',
  'Puratchi Thalaivi Dr.J.Jayalalitha CMBT Metro',
  'Arumbakkam',
  'Vadapalani',
  'Ashok Nagar',
  'Ekkattuthangal',
  'Arignar Anna Alandur Metro',
  'St. Thomas Mount'
];

const METRO_STATION_COORDS: Record<string, [number, number]> = {
  'Wimco Nagar Depot': [13.1720, 80.3015],
  'Wimco Nagar': [13.1652, 80.3017],
  'Thiruvotriyur': [13.1557, 80.3016],
  'Thiruvotriyur Theredi': [13.1466, 80.2995],
  'Kaladipet': [13.1368, 80.2965],
  'Toll Gate': [13.1294, 80.2945],
  'New Washermenpet': [13.1203, 80.2908],
  'Tondiarpet': [13.1118, 80.2882],
  'Thyagaraya College': [13.1044, 80.2872],
  'Washermenpet': [13.0975, 80.2833],
  'Mannadi': [13.0945, 80.2875],
  'High Court': [13.0880, 80.2891],
  'Puratchi Thalaivar Dr.M.G.Ramachandran Central Metro': [13.0818, 80.2721],
  'Government Estate': [13.0673, 80.2718],
  'LIC': [13.0617, 80.2673],
  'Thousand Light': [13.0583, 80.2584],
  'AG-DMS': [13.0440, 80.2505],
  'Teynampet': [13.0371, 80.2472],
  'Nandanam': [13.0305, 80.2435],
  'Saidapet': [13.0223, 80.2372],
  'Little Mount': [13.0180, 80.2307],
  'Guindy': [13.0090, 80.2201],
  'Arignar Anna Alandur Metro': [13.0039, 80.2014],
  'Meenambakkam': [12.9877, 80.1764],
  'Airport': [12.9818, 80.1718],
  'Egmore': [13.0784, 80.2625],
  'Nehru Park': [13.0792, 80.2514],
  'Kilpauk': [13.0788, 80.2418],
  'Pachiappas College': [13.0785, 80.2308],
  'Shenoy Nagar': [13.0788, 80.2236],
  'Anna Nagar East': [13.0847, 80.2198],
  'Anna Nagar Tower': [13.0850, 80.2117],
  'Thirumangalam': [13.0851, 80.2017],
  'Koyambedu': [13.0734, 80.1948],
  'Puratchi Thalaivi Dr.J.Jayalalitha CMBT Metro': [13.0674, 80.2052],
  'Arumbakkam': [13.0617, 80.2117],
  'Vadapalani': [13.0503, 80.2120],
  'Ashok Nagar': [13.0354, 80.2114],
  'Ekkattuthangal': [13.0167, 80.2054],
  'St. Thomas Mount': [12.9980, 80.2023]
};


const getMetroPath = (from: string, to: string): string[] => {
  if (!from || !to) return [];
  if (from === to) return [from];

  const fromInBlue = METRO_BLUE_LINE.indexOf(from);
  const toInBlue = METRO_BLUE_LINE.indexOf(to);
  const fromInGreen = METRO_GREEN_LINE.indexOf(from);
  const toInGreen = METRO_GREEN_LINE.indexOf(to);

  // Case 1: Both stations are on the Blue Line
  if (fromInBlue !== -1 && toInBlue !== -1) {
    const start = Math.min(fromInBlue, toInBlue);
    const end = Math.max(fromInBlue, toInBlue);
    const path = METRO_BLUE_LINE.slice(start, end + 1);
    return fromInBlue < toInBlue ? path : [...path].reverse();
  }

  // Case 2: Both stations are on the Green Line
  if (fromInGreen !== -1 && toInGreen !== -1) {
    const start = Math.min(fromInGreen, toInGreen);
    const end = Math.max(fromInGreen, toInGreen);
    const path = METRO_GREEN_LINE.slice(start, end + 1);
    return fromInGreen < toInGreen ? path : [...path].reverse();
  }

  // Case 3: Stations are on different lines (Requires Transfer)
  const transferA = 'Arignar Anna Alandur Metro';
  const transferC = 'Puratchi Thalaivar Dr.M.G.Ramachandran Central Metro';

  let pathA: string[] = [];
  try {
    pathA = [
      ...getMetroPath(from, transferA),
      ...getMetroPath(transferA, to).slice(1)
    ];
  } catch (e) {}

  let pathB: string[] = [];
  try {
    pathB = [
      ...getMetroPath(from, transferC),
      ...getMetroPath(transferC, to).slice(1)
    ];
  } catch (e) {}

  if (pathA.length > 0 && pathB.length > 0) {
    return pathA.length <= pathB.length ? pathA : pathB;
  }
  return pathA.length > 0 ? pathA : pathB;
};

const SINGARA_FAQ = [
  {
    q: "What is SBI Singara Chennai Card?",
    a: "It is an SBI prepaid card with a contactless dual-interface EMV chip and stored-value functionality. It can be used for Tap-and-Go payments at CMRL Metro stations and NCMC-enabled transit projects."
  },
  {
    q: "What is MTS Card?",
    a: "MTS stands for Mass Transit Systems. It is a specific category of prepaid card that can be used for public transport such as Metro, Buses, Rail, Waterways, Tolls, and Parking. SBI says MTS cards can be issued without KYC verification and are restricted to transit-related use. The outstanding amount cannot exceed Rs. 3,000 at any point, while the chip/global balance limit is Rs. 2,000. MTS is a category of prepaid card, and SBI specifically describes a Mass Transit System (MTS) Singara Chennai Card."
  },
  {
    q: "How can I get a Singara Chennai Card?",
    a: "SBI gives two methods for the Minimum Details Singara Chennai Card: (Method 1 - At Metro station) Go to your nearest CMRL Metro station, ask at the Ticket Counter for a Singara Chennai Card, fill in the application form, verify the OTP sent to your registered mobile number, and pay the top-up amount. (Method 2 - Online application) Pre-fill your details online on the official SBI prepaid application portal (https://prepaid.sbi.bank.in/web/#/apply-card), note down the reference number, and give it to the ticket operator at the Metro station to receive your card. For the MTS Singara Chennai Card: Go to a CMRL Metro station ticket counter, ask for the Singara Chennai MTS Card, provide your mobile number, verify the OTP, and pay the top-up amount."
  },
  {
    q: "What documents are required?",
    a: "For the MTS card, no documents are required. For the Minimum Details Singara Chennai Card, you need to provide a self-declaration of an Officially Valid Document (OVD) number, such as Passport, Voter ID, Driving Licence, NREGA Job Card, National Population Register letter, or Aadhaar proof."
  },
  {
    q: "How do I use the Singara Chennai Card at Metro stations?",
    a: "Tap your card at the entry gate to enter. Tap the same card at your destination exit gate to exit. The fare is automatically deducted from the stored-value balance on your card."
  },
  {
    q: "How do I check my Metro Card balance?",
    a: "At any CMRL station, tap your Singara Chennai Card on the Ticket Reader (TR) machine. The balance will appear on the display screen."
  },
  {
    q: "How can I top up/recharge the card?",
    a: "You can reload the card via: (1) Ticket counters at CMRL Metro stations using Cash, UPI, Debit card, or Credit card. (2) Online via the official SBI prepaid customer portal. (3) Via Bharat Bill Payment System (BBPS) platforms such as SBI Unipay, BHIM UPI, PhonePe, or other supported apps."
  },
  {
    q: "What are the minimum and maximum top-up limits?",
    a: "The minimum top-up limit is Rs. 10. The maximum chip/global offline balance limit is Rs. 2,000. Initial top-ups must be at least Rs. 10, and subsequent top-ups must be in multiples of Rs. 10. The overall balance limit is Rs. 3,000 for MTS Cards and Rs. 10,000 for Small PPI / Minimum Details Cards."
  },
  {
    q: "What is the global/chip balance limit?",
    a: "The global/chip balance limit is Rs. 2,000 maximum. This is the amount available in the card's offline/chip stored-value component."
  },
  {
    q: "What if my card is lost, stolen or damaged?",
    a: "Block the card immediately through the SBI prepaid customer portal, or call SBI at 1800-1234 or 080-26599990. Provide identification details (card number, mobile number, DOB). A ticket number will be sent to your registered mobile. Go to a CMRL Metro station and submit a replacement request. Note that if the card is replaced when the original card is not present, the offline stored-value balance cannot be transferred to the new card."
  },
  {
    q: "Where can I complain/get help?",
    a: "You can call 1800-1234, call 080-26599990, email contactcentre@sbi.co.in, or visit the customer care counter at your nearest CMRL Metro station."
  }
];

type AppTab = 'planner' | 'metro' | 'train' | 'bus' | 'private' | 'timetable' | 'outstation';

export default function TravelPage() {
  const [activeTab, setActiveTab] = useState<AppTab>('planner');

  // 1. General Route Planner State
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [category, setCategory] = useState<TransportCategory>('public');
  const [plannerPrivateMode, setPlannerPrivateMode] = useState<PrivateMode>('ola');
  const [isLoading, setIsLoading] = useState(false);
  const [routeResult, setRouteResult] = useState<RouteResponse | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // 2. Metro Module State
  const [metroFrom, setMetroFrom] = useState('');
  const [metroTo, setMetroTo] = useState('');

  // 3. Local Train State
  const [trainFrom, setTrainFrom] = useState('');
  const [trainTo, setTrainTo] = useState('');
  const [trainSearchQuery, setTrainSearchQuery] = useState('');
  const [trainActiveSection, setTrainActiveSection] = useState('ALL');
  const [expandedTrainNo, setExpandedTrainNo] = useState<string | null>(null);

  // 4. MTC Bus State
  const [busSearch, setBusSearch] = useState('');
  const [busFromFilter, setBusFromFilter] = useState('');
  const [busToFilter, setBusToFilter] = useState('');
  const [busSuggestionsFrom, setBusSuggestionsFrom] = useState<string[]>([]);
  const [busSuggestionsTo, setBusSuggestionsTo] = useState<string[]>([]);
  const [showSuggestionsFrom, setShowSuggestionsFrom] = useState(false);
  const [showSuggestionsTo, setShowSuggestionsTo] = useState(false);
  const [busSearchResult, setBusSearchResult] = useState<{ direct: any[]; transfers: any[] } | null>(null);
  const [isBusLoading, setIsBusLoading] = useState(false);

  // 5. Private Operator State
  const [privateFrom, setPrivateFrom] = useState('');
  const [privateTo, setPrivateTo] = useState('');
  const [selectedPrivateOperator, setSelectedPrivateOperator] = useState<string>('ola');
  const [privateModeResult, setPrivateModeResult] = useState<RouteResponse | null>(null);
  const [isPrivateLoading, setIsPrivateLoading] = useState(false);

  // 6. Timetable Module State
  const [timetableCategory, setTimetableCategory] = useState<'city' | 'state'>('city');
  // Within City State
  const [cityFrom, setCityFrom] = useState('');
  const [cityTo, setCityTo] = useState('');
  const [cityTransportType, setCityTransportType] = useState<'public' | 'private'>('public');
  const [cityPublicMode, setCityPublicMode] = useState<'metro' | 'train' | 'bus' | null>(null);
  const [cityPrivateMode, setCityPrivateMode] = useState<'ola' | 'uber' | 'rapido' | 'nammayatri' | 'redtaxi' | 'fasttrack' | null>(null);
  const [cityRouteResult, setCityRouteResult] = useState<RouteResponse | null>(null);
  const [isCityRouteLoading, setIsCityRouteLoading] = useState(false);

  const [currentTamilIdx, setCurrentTamilIdx] = useState(0);
  const [isNcmcFlipped, setIsNcmcFlipped] = useState(false);
  const [activeCardTab, setActiveCardTab] = useState<'about' | 'benefits' | 'topup' | 'fees' | 'howto'>('about');
  const [activeMetroCardType, setActiveMetroCardType] = useState<'ncmc' | 'svp' | 'faq'>('ncmc');
  const [activeSvpTab, setActiveSvpTab] = useState<'about' | 'limits' | 'howto'>('about');
  const [scheduleDayTab, setScheduleDayTab] = useState<'weekday' | 'weekend'>('weekday');
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);
  const [activeAmenitiesTab, setActiveAmenitiesTab] = useState<'lastmile' | 'women' | 'disabled'>('lastmile');
  const [mapScale, setMapScale] = useState(1);
  const metroLineMapContainerRef = useRef<HTMLDivElement | null>(null);
  const dragStatusRef = useRef({ isDragging: false, startX: 0, startY: 0, scrollLeft: 0, scrollTop: 0 });

  const handleMapMouseDown = (e: React.MouseEvent) => {
    const container = metroLineMapContainerRef.current;
    if (!container) return;
    if (e.button !== 0) return;
    dragStatusRef.current = {
      isDragging: true,
      startX: e.pageX - container.offsetLeft,
      startY: e.pageY - container.offsetTop,
      scrollLeft: container.scrollLeft,
      scrollTop: container.scrollTop
    };
    container.style.cursor = 'grabbing';
    container.style.userSelect = 'none';
  };

  const handleMapMouseMove = (e: React.MouseEvent) => {
    if (!dragStatusRef.current.isDragging) return;
    const container = metroLineMapContainerRef.current;
    if (!container) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const y = e.pageY - container.offsetTop;
    const walkX = (x - dragStatusRef.current.startX) * 1.5;
    const walkY = (y - dragStatusRef.current.startY) * 1.5;
    container.scrollLeft = dragStatusRef.current.scrollLeft - walkX;
    container.scrollTop = dragStatusRef.current.scrollTop - walkY;
  };

  const handleMapMouseUpOrLeave = () => {
    const container = metroLineMapContainerRef.current;
    if (container) {
      container.style.cursor = mapScale > 1 ? 'grab' : 'default';
      container.style.removeProperty('user-select');
    }
    dragStatusRef.current.isDragging = false;
  };
  const [metroLiveStatus, setMetroLiveStatus] = useState<{
    status: string;
    frequency: string;
    active: boolean;
    type: 'peak' | 'standard' | 'latenight' | 'sunday' | 'closed' | 'loading';
  }>({ status: 'Loading Live Status...', frequency: 'Checking...', active: false, type: 'loading' });

  useEffect(() => {
    const updateStatus = () => {
      const date = new Date();
      const day = date.getDay();
      const hours = date.getHours();
      const mins = date.getMinutes();
      const timeVal = hours * 60 + mins;
      const isSunday = day === 0;

      // Set default tab based on current day of week
      if (isSunday) {
        setScheduleDayTab('weekend');
        const openTime = 8 * 60;
        const closeTime = 22 * 60;
        if (timeVal >= openTime && timeVal < closeTime) {
          setMetroLiveStatus({ status: 'Sunday Schedule Active', frequency: 'Every 10 mins', active: true, type: 'sunday' });
        } else {
          setMetroLiveStatus({ status: 'Service Closed', frequency: 'Starts at 08:00 AM Sunday', active: false, type: 'closed' });
        }
      } else {
        setScheduleDayTab('weekday');
        const openTime = 5 * 60;
        const closeTime = 23 * 60;
        if (timeVal < openTime || timeVal >= closeTime) {
          setMetroLiveStatus({ status: 'Service Closed', frequency: 'Starts at 05:00 AM Mon-Sat', active: false, type: 'closed' });
        } else {
          const isMorningPeak = timeVal >= (8 * 60) && timeVal < (11 * 60);
          const isEveningPeak = timeVal >= (17 * 60) && timeVal < (20 * 60);
          if (isMorningPeak || isEveningPeak) {
            setMetroLiveStatus({ status: 'Peak Hours Active', frequency: 'Every 5 mins', active: true, type: 'peak' });
          } else if (timeVal >= (22 * 60) && timeVal < (23 * 60)) {
            setMetroLiveStatus({ status: 'Late Night Schedule', frequency: 'Every 15 mins', active: true, type: 'latenight' });
          } else {
            setMetroLiveStatus({ status: 'Standard Hours Active', frequency: 'Every 9 mins', active: true, type: 'standard' });
          }
        }
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const speakWord = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ta-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Leaflet map refs & loading state
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const mapRef = React.useRef<any>(null);
  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  const pathPolylineRef = React.useRef<any>(null);
  const markerLayersRef = React.useRef<{ station: string; marker: any }[]>([]);

  // Within State State
  const [stateFrom, setStateFrom] = useState('');
  const [stateTo, setStateTo] = useState('');
  const [stateTransportType, setStateTransportType] = useState<'public' | 'private'>('public');
  const [statePublicMode, setStatePublicMode] = useState<'bus' | 'train' | null>(null);
  const [statePrivateMode, setStatePrivateMode] = useState<'flight' | 'bus' | 'cab' | null>(null);


  useEffect(() => {
    // Detect if user is on a mobile device to correctly format deep links
    const handle = requestAnimationFrame(() => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  // Load Leaflet dynamically from CDN
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ((window as any).L) {
      setLeafletLoaded(true);
      return;
    }

    let link = document.querySelector('link[href*="leaflet.css"]');
    if (!link) {
      link = document.createElement('link');
      (link as any).rel = 'stylesheet';
      (link as any).href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    let script = document.querySelector('script[src*="leaflet.js"]');
    if (!script) {
      script = document.createElement('script');
      (script as any).src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      (script as any).async = true;
      (script as any).onload = () => {
        setLeafletLoaded(true);
      };
      document.head.appendChild(script);
    } else {
      const interval = setInterval(() => {
        if ((window as any).L) {
          setLeafletLoaded(true);
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, []);

  // Initialize Leaflet Map for Chennai Metro
  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current || cityPublicMode !== 'metro') {
      // Cleanup map if unmounted or mode changed
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      pathPolylineRef.current = null;
      markerLayersRef.current = [];
      return;
    }

    const L = (window as any).L;
    if (!L) return;

    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [13.06, 80.23],
        zoom: 11,
        minZoom: 10,
        maxZoom: 15,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      mapRef.current = map;

      // Extract coordinates lists for lines
      const blueLineCoords = METRO_BLUE_LINE.map(stn => METRO_STATION_COORDS[stn]).filter(Boolean) as [number, number][];
      const greenLineCoords = METRO_GREEN_LINE.map(stn => METRO_STATION_COORDS[stn]).filter(Boolean) as [number, number][];

      L.polyline(blueLineCoords, { color: '#2563eb', weight: 4, opacity: 0.8 }).addTo(map);
      L.polyline(greenLineCoords, { color: '#16a34a', weight: 4, opacity: 0.8 }).addTo(map);

      const markers: { station: string; marker: any }[] = [];
      const allStations = Array.from(new Set([...METRO_BLUE_LINE, ...METRO_GREEN_LINE]));

      allStations.forEach(stn => {
        const coords = METRO_STATION_COORDS[stn];
        if (!coords) return;

        const isInterchange = METRO_BLUE_LINE.includes(stn) && METRO_GREEN_LINE.includes(stn);
        const isBlue = METRO_BLUE_LINE.includes(stn);

        let markerColor = '#2563eb';
        if (isInterchange) {
          markerColor = '#7e22ce';
        } else if (!isBlue) {
          markerColor = '#16a34a';
        }

        const marker = L.circleMarker(coords, {
          radius: isInterchange ? 6 : 5,
          fillColor: markerColor,
          color: '#ffffff',
          weight: 1.5,
          fillOpacity: 1
        }).addTo(map);

        let tooltipClass = 'metro-tooltip-blue';
        if (isInterchange) {
          tooltipClass = 'metro-tooltip-interchange';
        } else if (!isBlue) {
          tooltipClass = 'metro-tooltip-green';
        }

        marker.bindTooltip(stn, {
          permanent: true,
          direction: 'top',
          offset: [0, -5],
          opacity: 0.9,
          className: `metro-tooltip ${tooltipClass}`
        });

        marker.on('click', () => {
          setCityFrom(prevFrom => {
            if (!prevFrom) {
              return stn;
            } else {
              setCityTo(prevTo => {
                if (prevFrom === stn) return prevTo;
                return stn;
              });
              return prevFrom;
            }
          });
        });

        markers.push({ station: stn, marker });
      });

      markerLayersRef.current = markers;
    }

    // Force map to recalculate its size on container mount
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 100);

    return () => {
      // Cleanup on tab switch or unmount
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      pathPolylineRef.current = null;
      markerLayersRef.current = [];
    };
  }, [leafletLoaded, cityPublicMode]);

  // Update Map Route Highlights dynamically
  useEffect(() => {
    if (!mapRef.current || !leafletLoaded || cityPublicMode !== 'metro') return;

    const L = (window as any).L;
    if (!L) return;

    // Clear old path polyline
    if (pathPolylineRef.current) {
      mapRef.current.removeLayer(pathPolylineRef.current);
      pathPolylineRef.current = null;
    }

    // Reset markers style
    markerLayersRef.current.forEach(({ station, marker }) => {
      const isInterchange = METRO_BLUE_LINE.includes(station) && METRO_GREEN_LINE.includes(station);
      const isBlue = METRO_BLUE_LINE.includes(station);
      let markerColor = '#2563eb';
      if (isInterchange) {
        markerColor = '#7e22ce';
      } else if (!isBlue) {
        markerColor = '#16a34a';
      }

      marker.setStyle({
        radius: isInterchange ? 6 : 5,
        fillColor: markerColor,
        color: '#ffffff',
        weight: 1.5
      });
    });

    if (cityFrom && cityTo) {
      const path = getMetroPath(cityFrom, cityTo);
      const pathCoords = path.map(stn => METRO_STATION_COORDS[stn]).filter(Boolean) as [number, number][];

      if (pathCoords.length > 0) {
        // Draw path polyline
        pathPolylineRef.current = L.polyline(pathCoords, {
          color: '#ef4444',
          weight: 6,
          opacity: 0.9,
          className: 'metro-path-animate'
        }).addTo(mapRef.current);

        // Highlight marker endpoints and path
        markerLayersRef.current.forEach(({ station, marker }) => {
          if (station === cityFrom) {
            marker.setStyle({
              radius: 9,
              fillColor: '#10b981', // green for origin
              color: '#ffffff',
              weight: 3
            });
            marker.openTooltip();
          } else if (station === cityTo) {
            marker.setStyle({
              radius: 9,
              fillColor: '#ef4444', // red for destination
              color: '#ffffff',
              weight: 3
            });
            marker.openTooltip();
          } else if (path.includes(station)) {
            marker.setStyle({
              radius: 6,
              fillColor: '#ef4444',
              color: '#ffffff',
              weight: 2
            });
          }
        });

        // Zoom map to show route
        try {
          mapRef.current.fitBounds(L.polyline(pathCoords).getBounds(), {
            padding: [50, 50],
            maxZoom: 14
          });
        } catch (e) {}
      }
    } else {
      mapRef.current.setView([13.06, 80.23], 11);
    }
  }, [cityFrom, cityTo, leafletLoaded, cityPublicMode]);


  // Clear route result when planner inputs change
  useEffect(() => {
    setRouteResult(null);
  }, [from, to, category, plannerPrivateMode]);

  // Private Route details calculation for within city
  useEffect(() => {
    if (timetableCategory === 'city' && cityTransportType === 'private' && cityPrivateMode && cityFrom.trim() && cityTo.trim()) {
      const delayDebounceFn = setTimeout(() => {
        setIsCityRouteLoading(true);
        checkRouteAvailability(cityFrom, cityTo, 'private', cityPrivateMode === 'nammayatri' ? 'ola' : cityPrivateMode, isMobile)
          .then(res => {
            if (cityPrivateMode === 'nammayatri' && res.isValid) {
              res.modeUsed = 'Namma Yatri';
              res.url = 'https://nammayatri.in/';
            }
            setCityRouteResult(res);
          })
          .catch(err => {
            console.error(err);
            setCityRouteResult(null);
          })
          .finally(() => {
            setIsCityRouteLoading(false);
          });
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setCityRouteResult(null);
    }
  }, [cityFrom, cityTo, cityTransportType, cityPrivateMode, timetableCategory, isMobile]);

  // Fetch MTC bus suggestions for autocomplete (From)
  useEffect(() => {
    if (timetableCategory === 'city' && cityPublicMode === 'bus' && cityFrom.trim().length > 0) {
      const controller = new AbortController();
      fetch(`/api/mtc-bus?autocomplete=${encodeURIComponent(cityFrom)}`, { signal: controller.signal })
        .then(res => res.json())
        .then(data => {
          if (data.stops) {
            setBusSuggestionsFrom(data.stops);
            setShowSuggestionsFrom(true);
          }
        })
        .catch(err => {
          if (err.name !== 'AbortError') console.error(err);
        });
      return () => controller.abort();
    } else {
      setBusSuggestionsFrom([]);
      setShowSuggestionsFrom(false);
    }
  }, [cityFrom, cityPublicMode, timetableCategory]);

  // Fetch MTC bus suggestions for autocomplete (To)
  useEffect(() => {
    if (timetableCategory === 'city' && cityPublicMode === 'bus' && cityTo.trim().length > 0) {
      const controller = new AbortController();
      fetch(`/api/mtc-bus?autocomplete=${encodeURIComponent(cityTo)}`, { signal: controller.signal })
        .then(res => res.json())
        .then(data => {
          if (data.stops) {
            setBusSuggestionsTo(data.stops);
            setShowSuggestionsTo(true);
          }
        })
        .catch(err => {
          if (err.name !== 'AbortError') console.error(err);
        });
      return () => controller.abort();
    } else {
      setBusSuggestionsTo([]);
      setShowSuggestionsTo(false);
    }
  }, [cityTo, cityPublicMode, timetableCategory]);

  // Fetch MTC bus search results (Direct + 1-Transfer)
  useEffect(() => {
    if (timetableCategory === 'city' && cityPublicMode === 'bus' && cityFrom.trim() && cityTo.trim()) {
      setIsBusLoading(true);
      const controller = new AbortController();
      fetch(`/api/mtc-bus?from=${encodeURIComponent(cityFrom)}&to=${encodeURIComponent(cityTo)}`, { signal: controller.signal })
        .then(res => res.json())
        .then(data => {
          setBusSearchResult({
            direct: data.direct || [],
            transfers: data.transfers || []
          });
        })
        .catch(err => {
          if (err.name !== 'AbortError') {
            console.error('Error fetching MTC routes:', err);
            setBusSearchResult(null);
          }
        })
        .finally(() => {
          setIsBusLoading(false);
        });
      return () => controller.abort();
    } else {
      setBusSearchResult(null);
    }
  }, [cityFrom, cityTo, cityPublicMode, timetableCategory]);

  const handleGetRoute = async () => {
    setIsLoading(true);
    setRouteResult(null);
    try {
      const res = await checkRouteAvailability(from, to, category, plannerPrivateMode, isMobile);
      setRouteResult(res);
    } catch (error) {
      setRouteResult({ isValid: false, message: 'An error occurred while fetching the route.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to handle Private Operator route calculation
  const handlePrivateOperatorSearch = async () => {
    if (!privateFrom.trim() || !privateTo.trim()) return;
    setIsPrivateLoading(true);
    setPrivateModeResult(null);
    try {
      let mappedMode: PrivateMode = 'ola';
      if (selectedPrivateOperator === 'uber') mappedMode = 'uber';
      if (selectedPrivateOperator === 'rapido') mappedMode = 'rapido';

      const res = await checkRouteAvailability(privateFrom, privateTo, 'private', mappedMode, isMobile);

      // Customize name for App Auto / Namma Yatri
      if (selectedPrivateOperator === 'appauto' && res.isValid) {
        res.modeUsed = 'App Auto (Ola/Uber Auto)';
      } else if (selectedPrivateOperator === 'nammayatri' && res.isValid) {
        res.modeUsed = 'Namma Yatri';
        res.url = 'https://nammayatri.in/';
      }
      setPrivateModeResult(res);
    } catch (error) {
      setPrivateModeResult({ isValid: false, message: 'Failed to calculate private operator fare.' });
    } finally {
      setIsPrivateLoading(false);
    }
  };

  // Get active Metro timings
  const activeMetroTimings = metroFrom && metroTo ? getMetroTimings(metroFrom, metroTo) : null;

  // Helper to match input station with database station names
  const findMetroStation = (name: string) => {
    if (!name) return null;
    const lowerName = name.toLowerCase().trim();
    // Try exact match first
    let station = METRO_STATIONS.find(s => s.name.toLowerCase() === lowerName || s.id === lowerName);
    if (!station) {
      // Try substring match
      station = METRO_STATIONS.find(s => s.name.toLowerCase().includes(lowerName) || lowerName.includes(s.name.toLowerCase()));
    }
    return station;
  };

  // Filter Local Trains
  const filteredTrains = LOCAL_TRAINS.filter(train => {
    const matchesFrom = trainFrom ? train.from === trainFrom : true;
    const matchesTo = trainTo ? train.to === trainTo : true;
    const matchesSearch = trainSearchQuery
      ? train.name.toLowerCase().includes(trainSearchQuery.toLowerCase()) || train.number.includes(trainSearchQuery)
      : true;
    return matchesFrom && matchesTo && matchesSearch;
  });

  // Filter MTC Buses
  const filteredBuses = MTC_BUSES.filter(bus => {
    const matchesSearch = busSearch
      ? bus.number.toLowerCase().includes(busSearch.toLowerCase()) ||
      bus.from.toLowerCase().includes(busSearch.toLowerCase()) ||
      bus.to.toLowerCase().includes(busSearch.toLowerCase())
      : true;
    const matchesFromFilter = busFromFilter
      ? bus.stops.some(stop => stop.toLowerCase().includes(busFromFilter.toLowerCase())) || bus.from.toLowerCase().includes(busFromFilter.toLowerCase())
      : true;
    const matchesToFilter = busToFilter
      ? bus.stops.some(stop => stop.toLowerCase().includes(busToFilter.toLowerCase())) || bus.to.toLowerCase().includes(busToFilter.toLowerCase())
      : true;
    return matchesSearch && matchesFromFilter && matchesToFilter;
  });

  // Unique Train Stations lists
  const trainOrigins = Array.from(new Set(LOCAL_TRAINS.map(t => t.from))).sort();
  const trainDestinations = Array.from(new Set(LOCAL_TRAINS.map(t => t.to))).sort();

  return (
    <div className="min-h-screen bg-surface">
      {/* Banner */}
      <div className="bg-white border-b border-border">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/explore/travel" className="hover:text-primary">Explore</Link>
            <span>/</span>
            <span className="text-text-primary font-medium">Travel & Transport</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-text-primary">
            Travel & Transport
          </h1>
          <p className="mt-2 text-text-muted">
            Your ultimate Chennai transit companion. Plan your daily commute via Metro, Suburban Trains, and MTC buses, or book rides and outstation travel flows.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Dashboard Layout */}
        <div className="flex flex-col gap-8">
          {/* Main Content Area */}
          <div className="w-full space-y-6">

            {/* 6. TIMETABLE MODULE (NEW) */}
            
              <div className="space-y-6">
                <Card padding="lg" className="border-primary/20 overflow-visible">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 border-b border-slate-100 pb-3">
                    <div>
                      <h2 className="text-2xl font-bold flex items-center gap-2 text-text-primary">
                        <Clock className="w-6 h-6 text-primary" /> Plan Your Journey
                      </h2>
                      <span className="block text-[11px] font-semibold text-text-muted mt-0.5 font-bengali">আপনার যাত্রা পরিকল্পনা করুন</span>
                    </div>
                    <div className="relative flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner w-full sm:w-80 shrink-0 justify-center overflow-hidden">
                      {/* Sliding Active Background */}
                      <div 
                        className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-primary rounded-xl shadow-md transition-transform duration-300 ease-out ${
                          timetableCategory === 'city' ? 'translate-x-0' : 'translate-x-[calc(100%+4px)]'
                        }`} 
                      />
                      <button
                        onClick={() => {
                          setTimetableCategory('city');
                          setCityFrom('');
                          setCityTo('');
                          setCityPublicMode(null);
                          setCityPrivateMode(null);
                        }}
                        className={`relative flex-1 px-4 py-2 rounded-xl text-xs font-black tracking-wide transition-colors duration-300 z-10 cursor-pointer text-center ${
                          timetableCategory === 'city' ? 'text-white' : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        <div>Within the City</div>
                        <div className="text-[9px] opacity-80 font-bengali font-semibold mt-0.5">শহরের মধ্যে</div>
                      </button>
                      <button
                        onClick={() => {
                          setTimetableCategory('state');
                          setStateFrom('');
                          setStateTo('');
                          setStatePublicMode(null);
                          setStatePrivateMode(null);
                        }}
                        className={`relative flex-1 px-4 py-2 rounded-xl text-xs font-black tracking-wide transition-colors duration-300 z-10 cursor-pointer text-center ${
                          timetableCategory === 'state' ? 'text-white' : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        <div>Within the State</div>
                        <div className="text-[9px] opacity-80 font-bengali font-semibold mt-0.5">রাজ্যের মধ্যে</div>
                      </button>
                    </div>
                  </div>

                  {/* TIMETABLE CATEGORY A: WITHIN THE CITY */}
                  {timetableCategory === 'city' && (
                    <div className="space-y-5">
                      {/* Step A: Select Transport Category */}
                      <div>
                        <div>
                          <label className="block text-sm font-semibold text-text-primary">1. Select Transport Category</label>
                          <span className="block text-[11px] text-text-muted font-medium font-bengali mb-3">পরিবহন বিভাগ নির্বাচন করুন</span>
                        </div>
                        <div className="relative flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner w-full overflow-hidden">
                          {/* Sliding Active Background */}
                          <div 
                            className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-primary rounded-xl shadow-md transition-transform duration-300 ease-out ${
                              cityTransportType === 'public' ? 'translate-x-0' : 'translate-x-[calc(100%+4px)]'
                            }`} 
                          />
                          <button
                            onClick={() => {
                              setCityTransportType('public');
                              setCityPublicMode(null);
                              setCityFrom('');
                              setCityTo('');
                            }}
                            className={`relative flex-1 flex flex-col items-center justify-center p-2.5 rounded-xl font-black text-xs transition-colors duration-300 z-10 cursor-pointer ${
                              cityTransportType === 'public' ? 'text-white' : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <Bus className="w-4 h-4" /> Public Transit
                            </div>
                            <div className="text-[9px] opacity-85 font-bengali font-semibold mt-0.5">গণপরিবহন</div>
                          </button>
                          <button
                            onClick={() => {
                              setCityTransportType('private');
                              setCityPrivateMode(null);
                              setCityFrom('');
                              setCityTo('');
                            }}
                            className={`relative flex-1 flex flex-col items-center justify-center p-2.5 rounded-xl font-black text-xs transition-colors duration-300 z-10 cursor-pointer ${
                              cityTransportType === 'private' ? 'text-white' : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <Car className="w-4 h-4" /> Private & Outstation
                            </div>
                            <div className="text-[9px] opacity-85 font-bengali font-semibold mt-0.5">ব্যক্তিগত ও আউটস্টেশন</div>
                          </button>
                        </div>
                      </div>

                      {/* Step B: Select Mode of Transport */}
                      {cityTransportType === 'public' && (
                        <div>
                          <label className="block text-sm font-semibold text-text-primary mb-3">2. Select Mode of Transport</label>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setCityPublicMode('metro');
                                setCityFrom('');
                                setCityTo('');
                              }}
                              className={`px-4 py-2 rounded-xl border text-sm font-bold transition-all ${cityPublicMode === 'metro' ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-500/10' : 'bg-white border-border text-text-muted hover:border-gray-300'}`}
                            >
                              Chennai Metro
                            </button>
                            <button
                              onClick={() => {
                                setCityPublicMode('train');
                                setCityFrom('');
                                setCityTo('');
                              }}
                              className={`px-4 py-2 rounded-xl border text-sm font-bold transition-all ${cityPublicMode === 'train' ? 'bg-amber-50 border-amber-500 text-amber-700 ring-2 ring-amber-500/10' : 'bg-white border-border text-text-muted hover:border-gray-300'}`}
                            >
                              Suburban Train
                            </button>
                            <button
                              onClick={() => {
                                setCityPublicMode('bus');
                                setCityFrom('');
                                setCityTo('');
                              }}
                              className={`px-4 py-2 rounded-xl border text-sm font-bold transition-all ${cityPublicMode === 'bus' ? 'bg-green-50 border-green-500 text-green-700 ring-2 ring-green-500/10' : 'bg-white border-border text-text-muted hover:border-gray-300'}`}
                            >
                              MTC Bus
                            </button>
                          </div>
                        </div>
                      )}

                      {cityTransportType === 'private' && (
                        <div>
                          <label className="block text-sm font-semibold text-text-primary mb-3">2. Select Ride-Hailing App</label>
                          <div className="flex flex-wrap gap-2">
                            {[
                              { id: 'ola', name: 'Ola Cabs' },
                              { id: 'uber', name: 'Uber' },
                              { id: 'rapido', name: 'Rapido' },
                              { id: 'nammayatri', name: 'Namma Yatri' },
                              { id: 'redtaxi', name: 'Red Taxi' },
                              { id: 'fasttrack', name: 'Fasttrack' }
                            ].map(app => (
                              <button
                                key={app.id}
                                onClick={() => {
                                  setCityPrivateMode(app.id as any);
                                  setCityFrom('');
                                  setCityTo('');
                                }}
                                className={`px-4 py-2 rounded-xl border text-sm font-bold transition-all ${cityPrivateMode === app.id ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-500/10' : 'bg-white border-border text-text-muted hover:border-gray-300'}`}
                              >
                                {app.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Step C: Show From & To Inputs (Only after mode is selected!) */}
                      {((cityTransportType === 'public' && cityPublicMode) || (cityTransportType === 'private' && cityPrivateMode)) && (
                        <div className="space-y-4">
                          {cityPublicMode === 'metro' ? (
                            <div className="space-y-4">
                              <div className="relative flex flex-col md:flex-row gap-4 items-center bg-slate-50/50 p-4 rounded-2xl border border-slate-100/60">
                                {/* Left side route line decoration */}
                                <div className="hidden md:flex flex-col items-center justify-between h-[84px] py-3.5 w-6">
                                  <span className="w-2.5 h-2.5 rounded-full border-2 border-emerald-500 bg-white" />
                                  <div className="w-0.5 flex-1 border-l-2 border-dashed border-slate-300 my-1" />
                                  <span className="w-2.5 h-2.5 rounded-full border-2 border-rose-500 bg-white" />
                                </div>

                                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                                  {/* Swap Button */}
                                  <div className="absolute right-4 md:right-auto md:left-1/2 top-1/2 -translate-y-1/2 md:-translate-x-1/2 z-20">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const temp = cityFrom;
                                        setCityFrom(cityTo);
                                        setCityTo(temp);
                                      }}
                                      className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all text-primary hover:text-primary-dark cursor-pointer"
                                      title="Swap Stations"
                                    >
                                      <ArrowUpDown className="w-4 h-4" />
                                    </button>
                                  </div>

                                  <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">From Station</label>
                                    <select
                                      value={cityFrom}
                                      onChange={(e) => setCityFrom(e.target.value)}
                                      className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white font-medium"
                                    >
                                      <option value="">-- Select Origin Station --</option>
                                      <optgroup label="Blue Line (Wimco Nagar Depot ↔ Airport)">
                                        {METRO_BLUE_LINE.map(station => (
                                          <option key={`from-blue-${station}`} value={station}>🔵 {station}</option>
                                        ))}
                                      </optgroup>
                                      <optgroup label="Green Line (Central ↔ St. Thomas Mount)">
                                        {METRO_GREEN_LINE.map(station => (
                                          <option key={`from-green-${station}`} value={station}>🟢 {station}</option>
                                        ))}
                                      </optgroup>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">To Station</label>
                                    <select
                                      value={cityTo}
                                      onChange={(e) => setCityTo(e.target.value)}
                                      className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white font-medium"
                                    >
                                      <option value="">-- Select Destination Station --</option>
                                      <optgroup label="Blue Line (Wimco Nagar Depot ↔ Airport)">
                                        {METRO_BLUE_LINE.map(station => (
                                          <option key={`to-blue-${station}`} value={station}>🔵 {station}</option>
                                        ))}
                                      </optgroup>
                                      <optgroup label="Green Line (Central ↔ St. Thomas Mount)">
                                        {METRO_GREEN_LINE.map(station => (
                                          <option key={`to-green-${station}`} value={station}>🟢 {station}</option>
                                        ))}
                                      </optgroup>
                                    </select>
                                  </div>
                                </div>
                              </div>

                              {/* Interactive Leaflet Map */}
                              <div className="relative">
                                {!leafletLoaded && (
                                  <div className="absolute inset-0 bg-slate-50 flex items-center justify-center rounded-xl border border-border h-[400px] z-20">
                                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                                    <span className="text-xs text-text-muted ml-2 font-semibold">Loading interactive map...</span>
                                  </div>
                                )}
                                <div 
                                  ref={mapContainerRef} 
                                  style={{ height: '400px' }} 
                                  className="w-full rounded-xl border border-border overflow-hidden shadow-sm z-0" 
                                />
                                <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-border text-[10px] font-bold text-text-muted z-10 flex gap-2.5 shadow-xs">
                                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-600 border border-white" /> Blue Line</span>
                                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-green-600 border border-white" /> Green Line</span>
                                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-600 border border-white animate-pulse" /> Interchange</span>
                                </div>
                              </div>
                            </div>
                          ) : cityPublicMode === 'train' ? (
                            <div className="space-y-4 bg-slate-50/50 p-4 rounded-2xl border border-border">
                              <div className="relative flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-xl border border-slate-100">
                                {/* Left side route line decoration */}
                                <div className="hidden md:flex flex-col items-center justify-between h-[84px] py-3.5 w-6">
                                  <span className="w-2.5 h-2.5 rounded-full border-2 border-emerald-500 bg-white" />
                                  <div className="w-0.5 flex-1 border-l-2 border-dashed border-slate-300 my-1" />
                                  <span className="w-2.5 h-2.5 rounded-full border-2 border-rose-500 bg-white" />
                                </div>

                                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                                  {/* Swap Button */}
                                  <div className="absolute right-4 md:right-auto md:left-1/2 top-1/2 -translate-y-1/2 md:-translate-x-1/2 z-20">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const tmp = trainFrom;
                                        setTrainFrom(trainTo);
                                        setTrainTo(tmp);
                                      }}
                                      className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all text-primary hover:text-primary-dark cursor-pointer"
                                      title="Swap Stations"
                                    >
                                      <ArrowUpDown className="w-4 h-4" />
                                    </button>
                                  </div>

                                  <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5 font-sans">From Station</label>
                                    <select
                                      value={trainFrom}
                                      onChange={(e) => setTrainFrom(e.target.value)}
                                      className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white font-semibold text-text-primary"
                                    >
                                      <option value="">Any Station</option>
                                      {SUBURBAN_STATIONS.map(stn => (
                                        <option key={`train-from-${stn.code}`} value={stn.code}>{stn.name}</option>
                                      ))}
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5 font-sans">To Station</label>
                                    <select
                                      value={trainTo}
                                      onChange={(e) => setTrainTo(e.target.value)}
                                      className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white font-semibold text-text-primary"
                                    >
                                      <option value="">Any Station</option>
                                      {SUBURBAN_STATIONS.map(stn => (
                                        <option key={`train-to-${stn.code}`} value={stn.code}>{stn.name}</option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-3">
                                <div className="flex-1 min-w-[200px] relative">
                                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-muted" />
                                  <input
                                    type="text"
                                    placeholder="Search Train Number (e.g. 43501)..."
                                    value={trainSearchQuery}
                                    onChange={(e) => setTrainSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setTrainFrom('');
                                    setTrainTo('');
                                    setTrainSearchQuery('');
                                    setTrainActiveSection('ALL');
                                    setExpandedTrainNo(null);
                                  }}
                                  className="text-xs text-amber-600 hover:text-amber-700 font-bold underline cursor-pointer"
                                >
                                  Clear Filters
                                </button>
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-2 font-sans">Filter by Line / Section</label>
                                <div className="flex flex-wrap gap-1.5">
                                  {[
                                    { id: 'ALL', name: 'All Lines' },
                                    { id: 'MAS-AJJ', name: 'MAS-AJJ (Arakkonam/Tiruttani)' },
                                    { id: 'MAS-GPD', name: 'MAS-GPD (Gummidipoondi/Sullurupeta)' },
                                    { id: 'MRTS Beach-Velachery', name: 'MRTS (Beach-Velachery)' },
                                    { id: 'MSB-CGL-TMLP-CJ', name: 'MSB-CGL (Beach-Chengalpattu/Tirumalpur)' }
                                  ].map(tab => (
                                    <button
                                      key={tab.id}
                                      type="button"
                                      onClick={() => setTrainActiveSection(tab.id)}
                                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                                        trainActiveSection === tab.id
                                          ? 'bg-amber-600 border-amber-600 text-white shadow-sm'
                                          : 'bg-white border-border text-text-muted hover:border-gray-300'
                                      }`}
                                    >
                                      {tab.name}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="relative flex flex-col md:flex-row gap-4 items-center bg-slate-50/50 p-4 rounded-2xl border border-slate-100/60">
                              {/* Left side route line decoration */}
                              <div className="hidden md:flex flex-col items-center justify-between h-[84px] py-3.5 w-6">
                                <span className="w-2.5 h-2.5 rounded-full border-2 border-emerald-500 bg-white" />
                                <div className="w-0.5 flex-1 border-l-2 border-dashed border-slate-300 my-1" />
                                <span className="w-2.5 h-2.5 rounded-full border-2 border-rose-500 bg-white" />
                              </div>

                              <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                                {/* Swap Button */}
                                <div className="absolute right-4 md:right-auto md:left-1/2 top-1/2 -translate-y-1/2 md:-translate-x-1/2 z-20">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const temp = cityFrom;
                                      setCityFrom(cityTo);
                                      setCityTo(temp);
                                    }}
                                    className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all text-primary hover:text-primary-dark cursor-pointer"
                                    title="Swap Stations"
                                  >
                                    <ArrowUpDown className="w-4 h-4" />
                                  </button>
                                </div>

                                <div className="relative">
                                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">From Station / Area</label>
                                  <input
                                    type="text"
                                    value={cityFrom}
                                    onChange={(e) => setCityFrom(e.target.value)}
                                    onFocus={() => { if (cityPublicMode === 'bus') setShowSuggestionsFrom(true); }}
                                    onBlur={() => {
                                      if (cityPublicMode === 'bus') {
                                        setTimeout(() => setShowSuggestionsFrom(false), 200);
                                      }
                                    }}
                                    placeholder={cityTransportType === 'private' ? 'Enter pickup point...' : 'Enter starting point...'}
                                    className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                                  />
                                  {cityPublicMode === 'bus' && showSuggestionsFrom && busSuggestionsFrom.length > 0 && (
                                    <div className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto bg-white border border-border rounded-xl shadow-lg text-sm">
                                      {busSuggestionsFrom.map((stop, idx) => (
                                        <div
                                          key={`sugg-from-${idx}`}
                                          onMouseDown={() => {
                                            setCityFrom(stop);
                                            setShowSuggestionsFrom(false);
                                          }}
                                          className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-text-primary border-b border-slate-100 last:border-0 font-medium"
                                        >
                                          {stop}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <div className="relative">
                                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">To Station / Area</label>
                                  <input
                                    type="text"
                                    value={cityTo}
                                    onChange={(e) => setCityTo(e.target.value)}
                                    onFocus={() => { if (cityPublicMode === 'bus') setShowSuggestionsTo(true); }}
                                    onBlur={() => {
                                      if (cityPublicMode === 'bus') {
                                        setTimeout(() => setShowSuggestionsTo(false), 200);
                                      }
                                    }}
                                    placeholder={cityTransportType === 'private' ? 'Enter dropoff point...' : 'Enter destination...'}
                                    className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                                  />
                                  {cityPublicMode === 'bus' && showSuggestionsTo && busSuggestionsTo.length > 0 && (
                                    <div className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto bg-white border border-border rounded-xl shadow-lg text-sm">
                                      {busSuggestionsTo.map((stop, idx) => (
                                        <div
                                          key={`sugg-to-${idx}`}
                                          onMouseDown={() => {
                                            setCityTo(stop);
                                            setShowSuggestionsTo(false);
                                          }}
                                          className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-text-primary border-b border-slate-100 last:border-0 font-medium"
                                        >
                                          {stop}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}


                          {/* Display relevant timetable / route results */}
                          {cityFrom && cityTo && (
                            <div className="mt-4 p-5 bg-primary-light/30 rounded-2xl border border-primary/10 space-y-4">
                              {cityTransportType === 'public' ? (
                                <div className="space-y-4">
                                  {cityPublicMode === 'metro' && (() => {
                                    const fromStation = cityFrom;
                                    const toStation = cityTo;
                                    const fareRecord = CHENNAI_METRO_FARES.find(f => 
                                      (f.from === fromStation && f.to === toStation) || 
                                      (f.from === toStation && f.to === fromStation)
                                    );
                                    const path = fromStation && toStation ? getMetroPath(fromStation, toStation) : [];

                                    return (
                                      <div className="space-y-4">
                                        <div className="p-5 bg-white rounded-xl border border-border shadow-sm space-y-4">
                                          <h4 className="font-bold text-lg text-blue-600">Chennai Metro Trip Details</h4>
                                          
                                          {fromStation && toStation && fareRecord ? (
                                            <div className="space-y-4">
                                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl text-sm items-center">
                                                <div>
                                                  <span className="text-xs text-text-muted block font-semibold">Route</span>
                                                  <span className="font-bold text-blue-700">{fromStation} ➔ {toStation}</span>
                                                </div>
                                                <div className="flex flex-wrap items-center justify-between gap-3">
                                                  <div>
                                                    <span className="text-xs text-text-muted block font-semibold">Stops Count</span>
                                                    <span className="font-bold text-text-primary">{Math.max(0, path.length - 2)} stops</span>
                                                  </div>
                                                  <a 
                                                    href="https://travelplanner.chennaimetrorail.org/" 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-bold transition-colors"
                                                  >
                                                    Official Metro Travel Planner <ExternalLink className="w-3.5 h-3.5" />
                                                  </a>
                                                </div>
                                              </div>

                                              <div className="border border-blue-100 bg-blue-50/50 p-4 rounded-xl space-y-2">
                                                <h5 className="font-bold text-xs text-blue-800 uppercase tracking-wider">Fare Calculation</h5>
                                                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                                  <div className="bg-white p-2.5 rounded-lg border border-blue-100 flex flex-col justify-center">
                                                    <span className="text-text-muted block mb-0.5 font-semibold">Normal Fare</span>
                                                    <span className="text-sm font-extrabold text-text-primary">₹{fareRecord.normal}</span>
                                                  </div>
                                                  <div className="bg-white p-2.5 rounded-lg border border-blue-100 flex flex-col justify-center">
                                                    <span className="text-text-muted block mb-0.5 font-semibold">QR/Smart Card</span>
                                                    <span className="text-sm font-extrabold text-green-600">₹{fareRecord.discounted} <span className="text-[10px] font-normal">(20% off)</span></span>
                                                  </div>
                                                  <a 
                                                    href="https://tickets.chennaimetrorail.org/onlineticket" 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-lg border border-blue-600 flex flex-col items-center justify-center text-center cursor-pointer transition-colors shadow-xs"
                                                  >
                                                    <span className="block mb-0.5 font-bold">Book Tickets</span>
                                                    <span className="text-[9px] font-medium flex items-center gap-1 opacity-90">Online Ticket <ExternalLink className="w-2.5 h-2.5"/></span>
                                                  </a>
                                                </div>
                                              </div>

                                              {/* Route Station Paths - Rendered Beautifully */}
                                              <div className="p-4 bg-slate-50 rounded-xl space-y-3">
                                                <strong className="block text-xs text-text-primary uppercase tracking-wider">Route Station Path ({path.length} Stations)</strong>
                                                <div className="relative pl-6 border-l-2 border-dashed border-blue-400 flex flex-col gap-3 mt-2">
                                                  {path.map((station, index) => {
                                                    const isStart = index === 0;
                                                    const isEnd = index === path.length - 1;
                                                    const isTransfer = station === 'Arignar Anna Alandur Metro' || station === 'Puratchi Thalaivar Dr.M.G.Ramachandran Central Metro';
                                                    
                                                    // Determine dot color
                                                    let dotColor = "bg-blue-500";
                                                    if (METRO_GREEN_LINE.includes(station) && !METRO_BLUE_LINE.includes(station)) {
                                                      dotColor = "bg-green-600";
                                                    } else if (METRO_BLUE_LINE.includes(station) && METRO_GREEN_LINE.includes(station)) {
                                                      dotColor = "bg-purple-600 animate-pulse";
                                                    }
                                                    
                                                    return (
                                                      <div key={index} className="relative flex items-center gap-3">
                                                        <div className={`absolute -left-[30px] w-3.5 h-3.5 rounded-full border-2 border-white flex items-center justify-center ${dotColor}`}>
                                                          {isTransfer && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                                        </div>
                                                        <span className={`text-xs ${isStart || isEnd ? 'font-bold text-text-primary' : 'text-text-muted'} ${isTransfer ? 'text-purple-700 font-bold' : ''}`}>
                                                          {station}
                                                          {isTransfer && <span className="ml-1.5 px-1 py-0.2 text-[8px] font-black uppercase tracking-wider bg-purple-100 text-purple-700 rounded-md">Interchange</span>}
                                                          {isStart && <span className="ml-1.5 text-[9px] text-emerald-600 font-bold">(Origin)</span>}
                                                          {isEnd && <span className="ml-1.5 text-[9px] text-red-500 font-bold">(Destination)</span>}
                                                        </span>
                                                      </div>
                                                    );
                                                  })}
                                                </div>
                                              </div>
                                            </div>
                                          ) : (
                                            <p className="text-xs text-text-muted">
                                              Select Origin and Destination station above to calculate fare and view route path.
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })()}

                                  {cityPublicMode === 'bus' && (() => {
                                    if (isBusLoading) {
                                      return (
                                        <div className="flex items-center justify-center p-6 bg-slate-50 rounded-xl border border-border">
                                          <Loader2 className="w-5 h-5 animate-spin text-green-600" />
                                          <span className="text-xs text-text-muted ml-2 font-semibold font-sans">Searching MTC route database...</span>
                                        </div>
                                      );
                                    }

                                    const direct = busSearchResult?.direct || [];
                                    const transfers = busSearchResult?.transfers || [];

                                    if (!cityFrom || !cityTo) {
                                      return (
                                        <div className="p-6 bg-white rounded-xl border border-border shadow-sm text-center text-text-muted space-y-2">
                                          <div className="text-3xl">🚌</div>
                                          <h4 className="font-bold text-sm text-text-primary">Ready to Search</h4>
                                          <p className="text-xs">
                                            Select or type a From and To stop above to find MTC bus options.
                                          </p>
                                        </div>
                                      );
                                    }

                                    if (direct.length === 0 && transfers.length === 0) {
                                      return (
                                        <div className="p-6 bg-white rounded-xl border border-border shadow-sm text-center text-text-muted space-y-2">
                                          <div className="text-3xl">🔍</div>
                                          <h4 className="font-bold text-sm text-text-primary text-red-600">No Routes Found</h4>
                                          <p className="text-xs leading-relaxed">
                                            No direct or one-transfer routes found in our MTC database between <strong>{cityFrom}</strong> and <strong>{cityTo}</strong>.
                                            Try typing nearby landmarks (e.g. <strong>Adyar</strong>, <strong>Tambaram</strong>, <strong>Guindy</strong>, <strong>Central</strong>).
                                          </p>
                                        </div>
                                      );
                                    }

                                    return (
                                      <div className="p-4 bg-white rounded-xl border border-border shadow-sm space-y-4">
                                        <h4 className="font-bold text-lg text-green-700">MTC Bus Routes</h4>

                                        {direct.length > 0 && (
                                          <div className="space-y-3">
                                            <h5 className="font-bold text-xs uppercase tracking-wider text-green-800 flex items-center gap-1.5">
                                              Direct Buses <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full font-extrabold text-[10px]">{direct.length}</span>
                                            </h5>
                                            <div className="max-h-80 overflow-y-auto border border-border rounded-xl text-xs space-y-3 p-1">
                                              {direct.map((item, idx) => (
                                                <div key={`direct-${idx}`} className="p-3 border-l-4 border-l-green-600 border border-border rounded-r-xl bg-slate-50 space-y-2 hover:bg-slate-100/50 transition-colors">
                                                  <div className="flex items-center justify-between">
                                                    <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded font-black text-sm">{item.busNo}</span>
                                                    <span className="text-text-muted text-[10px] uppercase font-bold tracking-wider">{item.areaSection} Section</span>
                                                  </div>
                                                  <div className="text-text-primary font-bold text-xs">
                                                    {item.start} ➔ {item.destination}
                                                  </div>
                                                  <div className="text-text-muted text-[10px] leading-relaxed bg-white/70 p-2 rounded-lg border border-slate-100">
                                                    <p className="mb-1 text-slate-800 font-bold">Journey Details:</p>
                                                    <p>• Board: <strong className="text-green-700">{item.stops[item.boardIndex]}</strong></p>
                                                    <p>• Alight: <strong className="text-red-600">{item.stops[item.alightIndex]}</strong></p>
                                                    <p className="mt-1 opacity-75">({item.alightIndex - item.boardIndex} stops total)</p>
                                                  </div>
                                                  <div className="text-text-muted text-[10px] leading-relaxed">
                                                    <strong>Full Sequence:</strong> {item.stops.join(' ➔ ')}
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}

                                        {transfers.length > 0 && (
                                          <div className="space-y-3 border-t border-border pt-4">
                                            <h5 className="font-bold text-xs uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                                              With One Transfer <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full font-extrabold text-[10px]">{transfers.length}</span>
                                            </h5>
                                            <div className="max-h-80 overflow-y-auto border border-border rounded-xl text-xs space-y-3 p-1">
                                              {transfers.map((item, idx) => (
                                                <div key={`transfer-${idx}`} className="p-3 border-l-4 border-l-amber-500 border border-border rounded-r-xl bg-slate-50 space-y-2 hover:bg-slate-100/50 transition-colors">
                                                  <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5">
                                                      <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded font-black text-sm">{item.busNoA}</span>
                                                      <span className="text-text-muted font-bold">➔</span>
                                                      <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded font-black text-sm">{item.busNoB}</span>
                                                    </div>
                                                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full font-bold text-[9px] uppercase tracking-wider">1 Transfer</span>
                                                  </div>
                                                  <div className="text-text-primary text-xs font-semibold leading-relaxed">
                                                    Board at <span className="text-green-700">{cityFrom}</span> on <span className="font-bold">{item.busNoA}</span>, transfer at <span className="text-amber-600 font-extrabold">{item.transferStop}</span> to <span className="font-bold">{item.busNoB}</span> to reach <span className="text-red-600">{cityTo}</span>.
                                                  </div>
                                                  <div className="text-text-muted text-[10px] leading-relaxed bg-white/70 p-2 rounded-lg border border-slate-100 space-y-1">
                                                    <div>
                                                      <strong>Leg 1 ({item.busNoA}):</strong> {item.startA} ➔ {item.destinationA}
                                                      <p className="pl-3 text-[9px]">• Board: {item.stopsA[item.boardIndexA]}</p>
                                                      <p className="pl-3 text-[9px]">• Alight/Transfer: {item.stopsA[item.transferIndexA]}</p>
                                                    </div>
                                                    <div className="pt-1 border-t border-slate-100">
                                                      <strong>Leg 2 ({item.busNoB}):</strong> {item.startB} ➔ {item.destinationB}
                                                      <p className="pl-3 text-[9px]">• Board: {item.stopsB[item.transferIndexB]}</p>
                                                      <p className="pl-3 text-[9px]">• Alight: {item.stopsB[item.alightIndexB]}</p>
                                                    </div>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}

                                        <div className="flex flex-wrap gap-2 pt-3 border-t border-border">
                                          <a href="https://chalo.com/app/" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-green-600 text-white rounded text-xs font-bold flex items-center gap-1 hover:bg-green-700">Chalo App (Live Tracking) <ExternalLink className="w-3 h-3"/></a>
                                        </div>
                                      </div>
                                    );
                                  })()}
                                </div>
                              ) : (
                                <div className="space-y-3">
                                  {isCityRouteLoading ? (
                                    <div className="flex items-center justify-center p-6 bg-slate-50 rounded-xl border border-border">
                                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                      <span className="text-xs text-text-muted ml-2 font-semibold">Calculating estimated ride details...</span>
                                    </div>
                                  ) : cityRouteResult?.isValid ? (
                                    <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-2">
                                      <h5 className="font-bold text-xs text-emerald-800 uppercase tracking-wider">Estimated Route Details</h5>
                                      <div className="grid grid-cols-2 gap-4 text-sm text-text-primary">
                                        <div className="flex items-center gap-2">
                                          <Clock className="w-4 h-4 text-emerald-600" />
                                          <div>
                                            <span className="text-xs text-text-muted block">Duration</span>
                                            <span className="font-bold">{cityRouteResult.estimatedTime}</span>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Navigation className="w-4 h-4 text-emerald-600" />
                                          <div>
                                            <span className="text-xs text-text-muted block">Distance</span>
                                            <span className="font-bold">{cityRouteResult.estimatedDistance}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : null}

                                  <div className="p-4 bg-white rounded-xl border border-border shadow-sm">
                                     <h4 className="font-bold text-xs text-emerald-600 uppercase tracking-wider mb-3">Book via {cityPrivateMode === 'ola' ? 'Ola Cabs' : cityPrivateMode === 'uber' ? 'Uber' : cityPrivateMode === 'rapido' ? 'Rapido' : 'Namma Yatri'}</h4>
                                     <div>
                                       {cityPrivateMode === 'ola' && (
                                         <a href="https://book.olacabs.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs">
                                           Book on Ola Cabs <ExternalLink className="w-3.5 h-3.5" />
                                         </a>
                                       )}
                                       {cityPrivateMode === 'uber' && (
                                         <a href="https://m.uber.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs">
                                           Book on Uber <ExternalLink className="w-3.5 h-3.5" />
                                         </a>
                                       )}
                                       {cityPrivateMode === 'rapido' && (
                                         <a href="https://www.rapido.bike/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs">
                                           Book on Rapido <ExternalLink className="w-3.5 h-3.5" />
                                         </a>
                                       )}
                                       {cityPrivateMode === 'nammayatri' && (
                                         <a href="https://nammayatri.in/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs">
                                           Book on Namma Yatri <ExternalLink className="w-3.5 h-3.5" />
                                         </a>
                                       )}
                                     </div>
                                   </div>
                                </div>
                              )}
                            </div>
                          )}

                          {cityPublicMode === 'train' && (() => {
                            // Filter matched trains
                            const matchedTrains = SUBURBAN_TRAINS.filter(train => {
                              if (trainActiveSection !== 'ALL' && train.section !== trainActiveSection) {
                                return false;
                              }
                              if (trainSearchQuery.trim() && !train.train_no.toLowerCase().includes(trainSearchQuery.toLowerCase().trim())) {
                                return false;
                              }
                              const stops = train.stops || [];
                              if (trainFrom && trainTo) {
                                const idxF = stops.findIndex(s => s.station === trainFrom);
                                const idxT = stops.findIndex(s => s.station === trainTo);
                                return idxF !== -1 && idxT !== -1 && idxF < idxT;
                              } else if (trainFrom) {
                                return stops.some(s => s.station === trainFrom);
                              } else if (trainTo) {
                                return stops.some(s => s.station === trainTo);
                              }
                              return true;
                            });

                            // Map to row objects
                            const trainRows = matchedTrains.map(train => {
                              const stops = train.stops || [];
                              const idxF = trainFrom ? stops.findIndex(s => s.station === trainFrom) : 0;
                              const idxT = trainTo ? stops.findIndex(s => s.station === trainTo) : stops.length - 1;

                              const depStation = trainFrom || train.origin;
                              const depTime = stops[idxF]?.time || '';
                              const arrStation = trainTo || train.destination;
                              const arrTime = stops[idxT]?.time || '';

                              return {
                                train,
                                depStation,
                                depTime,
                                arrStation,
                                arrTime
                              };
                            });

                            // Sort by departure time
                            trainRows.sort((a, b) => {
                              const ma = parseSuburbanTimeToMinutes(a.depTime);
                              const mb = parseSuburbanTimeToMinutes(b.depTime);
                              return ma - mb;
                            });

                            return (
                              <div className="mt-4 p-5 bg-amber-50/20 border border-amber-100 rounded-2xl space-y-4">
                                <div className="flex items-center justify-between border-b border-amber-200/50 pb-2">
                                  <div>
                                    <h4 className="font-bold text-lg text-amber-800 flex items-center gap-2">
                                      <Train className="w-5 h-5 animate-pulse" /> Chennai Suburban Weekday Timetable
                                    </h4>
                                    <p className="text-xs text-text-muted mt-0.5 font-medium">
                                      {trainRows.length} train{trainRows.length === 1 ? '' : 's'} found • Click row to expand full schedule
                                    </p>
                                  </div>
                                </div>

                                {trainRows.length === 0 ? (
                                  <div className="p-8 text-center bg-white rounded-xl border border-border text-text-muted text-xs font-semibold">
                                    No trains match this combination. Try clearing filters or picking different stations.
                                  </div>
                                ) : (
                                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                                    {trainRows.map((row, index) => {
                                      const isExpanded = expandedTrainNo === row.train.train_no;
                                      const sectionNameMap: Record<string, string> = {
                                        'MAS-AJJ': 'Arakkonam/Tiruttani Line',
                                        'MAS-GPD': 'Gummidipoondi Line',
                                        'MRTS Beach-Velachery': 'MRTS Line',
                                        'MSB-CGL-TMLP-CJ': 'Chengalpattu Line'
                                      };
                                      const sectionLabel = sectionNameMap[row.train.section] || row.train.section;

                                      return (
                                        <div key={`${row.train.train_no}-${index}`} className="bg-white border border-border rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
                                          <div
                                            onClick={() => setExpandedTrainNo(isExpanded ? null : row.train.train_no)}
                                            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none hover:bg-slate-50/50 transition-colors"
                                          >
                                            <div className="space-y-1.5">
                                              <div className="flex items-center gap-2">
                                                <span className="font-mono font-black text-sm text-amber-800">{row.train.train_no}</span>
                                                <span className={`px-2 py-0.5 rounded font-black text-[9px] uppercase tracking-wider text-white ${
                                                  row.train.direction === 'UP' ? 'bg-teal-600' : 'bg-orange-600'
                                                }`}>
                                                  {row.train.direction}
                                                </span>
                                                <Badge variant="outline" className="text-[10px] font-bold border-amber-200 bg-amber-50/50 text-amber-800">
                                                  {sectionLabel}
                                                </Badge>
                                              </div>
                                              <div className="flex items-center gap-2 text-xs font-semibold text-text-primary">
                                                <span className={trainFrom ? 'text-amber-700 font-extrabold' : ''}>{STATION_CODE_TO_NAME[row.depStation] || row.depStation}</span>
                                                <span className="text-text-muted">➔</span>
                                                <span className={trainTo ? 'text-amber-700 font-extrabold' : ''}>{STATION_CODE_TO_NAME[row.arrStation] || row.arrStation}</span>
                                              </div>
                                            </div>

                                            <div className="flex items-center justify-between sm:justify-end gap-4">
                                              <div className="text-right">
                                                <span className="block text-[10px] text-text-muted font-bold uppercase tracking-wider">Departure Time</span>
                                                <span className="text-sm font-extrabold text-amber-800">{formatSuburbanTime(row.depTime)}</span>
                                              </div>
                                              <span className={`text-lg text-amber-500 font-black transition-transform duration-200 ${
                                                isExpanded ? 'rotate-90' : ''
                                              }`}>
                                                ›
                                              </span>
                                            </div>
                                          </div>

                                          {isExpanded && (
                                            <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-3">
                                              <h5 className="font-bold text-xs uppercase tracking-wider text-amber-900">Full Timeline ({row.train.stops.length} stops)</h5>
                                              <div className="flex flex-wrap gap-2">
                                                {row.train.stops.map((stop, stopIdx) => {
                                                  const isStart = stop.station === row.depStation;
                                                  const isEnd = stop.station === row.arrStation;
                                                  const stnFullName = STATION_CODE_TO_NAME[stop.station] || stop.station;

                                                  let highlightClass = "bg-white border-border text-text-primary";
                                                  if (isStart) {
                                                    highlightClass = "bg-emerald-50 border-emerald-400 text-emerald-800 ring-2 ring-emerald-500/10 font-bold";
                                                  } else if (isEnd) {
                                                    highlightClass = "bg-rose-50 border-rose-400 text-rose-800 ring-2 ring-rose-500/10 font-bold";
                                                  }

                                                  return (
                                                    <div key={stopIdx} className={`flex flex-col p-2.5 rounded-lg border text-center min-w-[90px] shadow-sm ${highlightClass}`}>
                                                      <span className="text-[10px] text-text-muted font-bold">{formatSuburbanTime(stop.time)}</span>
                                                      <span className="text-xs mt-0.5 truncate max-w-[120px]" title={stnFullName}>
                                                        {stnFullName}
                                                      </span>
                                                      {isStart && <span className="text-[8px] text-emerald-600 font-black uppercase tracking-wider mt-0.5">Board</span>}
                                                      {isEnd && <span className="text-[8px] text-rose-600 font-black uppercase tracking-wider mt-0.5">Alight</span>}
                                                    </div>
                                                  );
                                                })}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}

                                <div className="flex flex-wrap gap-2 pt-3 border-t border-amber-200/50">
                                  <a href="https://play.google.com/store/apps/details?id=com.cris.utsmobile&hl=en-US" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-bold flex items-center gap-1 transition-colors">
                                    UTS Ticket Booking <ExternalLink className="w-3 h-3"/>
                                  </a>
                                  <a href="https://www.railyatri.in/live-train-status" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded text-xs font-bold flex items-center gap-1 transition-colors">
                                    Live Train Status <ExternalLink className="w-3 h-3"/>
                                  </a>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TIMETABLE CATEGORY B: WITHIN THE STATE */}
                  {timetableCategory === 'state' && (
                    <div className="space-y-5">
                      {/* Step A: Select Transport Category */}
                      <div>
                        <div>
                          <label className="block text-sm font-semibold text-text-primary">1. Select Transport Category</label>
                          <span className="block text-[11px] text-text-muted font-medium font-bengali mb-3">পরিবহন বিভাগ নির্বাচন করুন</span>
                        </div>
                        <div className="relative flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner w-full overflow-hidden">
                          {/* Sliding Active Background */}
                          <div 
                            className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-primary rounded-xl shadow-md transition-transform duration-300 ease-out ${
                              stateTransportType === 'public' ? 'translate-x-0' : 'translate-x-[calc(100%+4px)]'
                            }`} 
                          />
                          <button
                            onClick={() => {
                              setStateTransportType('public');
                              setStatePublicMode(null);
                              setStateFrom('');
                              setStateTo('');
                            }}
                            className={`relative flex-1 flex flex-col items-center justify-center p-2.5 rounded-xl font-black text-xs transition-colors duration-300 z-10 cursor-pointer ${
                              stateTransportType === 'public' ? 'text-white' : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <Bus className="w-4 h-4" /> Public Transit
                            </div>
                            <div className="text-[9px] opacity-85 font-bengali font-semibold mt-0.5">গণপরিবহন</div>
                          </button>
                          <button
                            onClick={() => {
                              setStateTransportType('private');
                              setStatePrivateMode(null);
                              setStateFrom('');
                              setStateTo('');
                            }}
                            className={`relative flex-1 flex flex-col items-center justify-center p-2.5 rounded-xl font-black text-xs transition-colors duration-300 z-10 cursor-pointer ${
                              stateTransportType === 'private' ? 'text-white' : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <Car className="w-4 h-4" /> Private & Outstation
                            </div>
                            <div className="text-[9px] opacity-85 font-bengali font-semibold mt-0.5">ব্যক্তিগত ও আউটস্টেশন</div>
                          </button>
                        </div>
                      </div>

                      {/* Step B: Select Mode of Transport */}
                      {stateTransportType === 'public' && (
                        <div>
                          <label className="block text-sm font-semibold text-text-primary mb-3">2. Select Public Mode</label>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setStatePublicMode('bus');
                                setStateFrom('');
                                setStateTo('');
                              }}
                              className={`px-4 py-2 rounded-xl border text-sm font-bold transition-all ${statePublicMode === 'bus' ? 'bg-primary-light border-primary text-primary-dark ring-2 ring-primary/10' : 'bg-white border-border text-text-muted hover:border-gray-300'}`}
                            >
                              State Buses (TNSTC & SETC)
                            </button>
                            <button
                              onClick={() => {
                                setStatePublicMode('train');
                                setStateFrom('');
                                setStateTo('');
                              }}
                              className={`px-4 py-2 rounded-xl border text-sm font-bold transition-all ${statePublicMode === 'train' ? 'bg-primary-light border-primary text-primary-dark ring-2 ring-primary/10' : 'bg-white border-border text-text-muted hover:border-gray-300'}`}
                            >
                              Indian Railways
                            </button>
                          </div>
                        </div>
                      )}

                      {stateTransportType === 'private' && (
                        <div>
                          <div>
                            <label className="block text-sm font-semibold text-text-primary">2. Select Private Option</label>
                            <span className="block text-[11px] text-text-muted font-medium font-bengali mb-3">ব্যক্তিগত বিকল্প নির্বাচন করুন</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {[
                              { id: 'flight', name: 'Flights' },
                              { id: 'bus', name: 'Private Buses' },
                              { id: 'cab', name: 'Outstation Cabs' }
                            ].map(opt => (
                              <button
                                key={opt.id}
                                onClick={() => {
                                  setStatePrivateMode(opt.id as any);
                                  setStateFrom('');
                                  setStateTo('');
                                }}
                                className={`px-4 py-2 rounded-xl border text-sm font-bold transition-all ${statePrivateMode === opt.id ? 'bg-primary-light border-primary text-primary-dark ring-2 ring-primary/10' : 'bg-white border-border text-text-muted hover:border-gray-300'}`}
                              >
                                {opt.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* Step C: Directly show booking redirects (No From/To inputs for within state!) */}
                      {stateTransportType === 'public' && statePublicMode && (
                        <div className="mt-4 p-5 bg-slate-50 rounded-2xl border border-border space-y-4 animate-fadeIn">
                          <div className="flex items-center justify-between border-b border-gray-200/60 pb-3">
                            <h3 className="text-sm font-bold text-text-primary">
                              Public Intercity Booking Redirections
                            </h3>
                          </div>
                          <div className="space-y-4">
                            {statePublicMode === 'bus' && (
                              <div className="p-4 bg-white rounded-xl border border-border shadow-sm">
                                <h4 className="font-bold text-sm text-primary-dark mb-2">State Buses (TNSTC & SETC)</h4>
                                <p className="text-xs text-text-muted mb-3 font-medium">Book express and deluxe coaches across Tamil Nadu directly via the official portal.</p>
                                <div className="flex flex-wrap gap-2">
                                  <a href="https://www.tnstc.in/OTRSOnline/" target="_blank" rel="noopener noreferrer" className="inline-flex px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition-colors">
                                    Book on TNSTC Portal
                                  </a>
                                  <a href="https://www.redbus.in/online-booking/tnstc" target="_blank" rel="noopener noreferrer" className="inline-flex px-4 py-2 border border-primary/20 bg-primary-light text-primary-dark hover:bg-primary/15 rounded-xl text-xs font-bold transition-colors">
                                    Book on redbus
                                  </a>
                                </div>
                              </div>
                            )}
                            {statePublicMode === 'train' && (
                              <div className="p-4 bg-white rounded-xl border border-border shadow-sm">
                                <h4 className="font-bold text-sm text-amber-700 mb-2">Indian Railways</h4>
                                <p className="text-xs text-text-muted mb-3 font-medium">Search trains and book reserve tickets on IRCTC website.</p>
                                <div className="flex flex-wrap gap-2">
                                  <a href="https://www.irctc.co.in/nget/train-search" target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors">
                                    Book on IRCTC
                                  </a>
                                  <a href="https://trains.abhibus.com/?channel=abhibus-web" target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-xl text-xs font-bold transition-colors">
                                    Book on abhibus
                                  </a>
                                  <a href="https://www.redbus.in/railways" target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-xl text-xs font-bold transition-colors">
                                    Book on Redbus
                                  </a>
                                  <a href="https://www.ixigo.com/trains" target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-xl text-xs font-bold transition-colors">
                                    Book on Ixigo
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {stateTransportType === 'private' && statePrivateMode && (
                        <div className="mt-4 p-5 bg-slate-50 rounded-2xl border border-border space-y-4 animate-fadeIn">
                          <div className="flex items-center justify-between border-b border-gray-200/60 pb-3">
                            <h3 className="text-sm font-bold text-text-primary">
                              Private Outstation Booking Redirections
                            </h3>
                          </div>
                          <div className="space-y-4">
                            {statePrivateMode === 'flight' && (
                              <div className="p-4 bg-white rounded-xl border border-border shadow-sm">
                                <h4 className="font-bold text-sm text-blue-700 mb-2">Flights</h4>
                                <p className="text-xs text-text-muted mb-3 font-medium">Compare airfares and book flights from Chennai to other airport cities in Tamil Nadu.</p>
                                <div className="flex flex-wrap gap-2 text-xs">
                                  <a href="https://www.goibibo.com/flights/" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-bold">Goibibo</a>
                                  <a href="https://www.ixigo.com/flights" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-bold">Ixigo</a>
                                  <a href="https://www.yatra.com/" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-bold">Yatra</a>
                                </div>
                              </div>
                            )}

                            {statePrivateMode === 'bus' && (
                              <div className="p-4 bg-white rounded-xl border border-border shadow-sm">
                                <h4 className="font-bold text-sm text-red-700 mb-2">Private Buses</h4>
                                <p className="text-xs text-text-muted mb-3 font-medium">Book luxury private buses (sleeper, semi-sleeper) to various towns.</p>
                                <div className="flex flex-wrap gap-2 text-xs">
                                  <a href="https://www.redbus.in/" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg font-bold">RedBus</a>
                                  <a href="https://www.abhibus.com/" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg font-bold">AbhiBus</a>
                                  <a href="https://www.ixigo.com/buses" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg font-bold">Ixigo</a>
                                  <a href="https://www.goibibo.com/bus/" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg font-bold">Goibibo</a>
                                </div>
                              </div>
                            )}

                            {statePrivateMode === 'cab' && (
                              <div className="p-4 bg-white rounded-xl border border-border shadow-sm">
                                <h4 className="font-bold text-sm text-emerald-700 mb-2">Outstation Cabs & Rentals</h4>
                                <p className="text-xs text-text-muted mb-3 font-medium">Book intercity cabs, taxi rentals or one-way drop taxis.</p>
                                <div className="flex flex-wrap gap-2 text-xs">
                                  <a href="https://www.makemytrip.com/cabs/" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-bold">MakeMyTrip Cabs</a>
                                  <a href="https://www.olacabs.com/outstation" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-bold">Ola Intercity</a>
                                  <a href="https://www.olacabs.com/rentals" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-bold">Ola Rentals</a>
                                  <a href="https://fasttrackcalltaxi.in/" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-bold">Fasttrack</a>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              </div>
            {/* 7. OUTSTATION TRAVEL TAB */}
            {false && (
              <div className="space-y-6">
                <Card padding="lg" className="border-indigo-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Map className="w-6 h-6 text-indigo-500" />
                    <h2 className="text-2xl font-bold text-text-primary">Outstation Travel Escapes</h2>
                  </div>
                  <p className="text-sm text-text-muted mb-6">
                    Ready to leave the city? Here are 12 popular outstation destinations from Chennai, featuring distance, timings, and custom booking redirections.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {OUTSTATION_DESTINATIONS.map((dest) => (
                      <div
                        key={dest.name}
                        className={`flex flex-col p-5 rounded-2xl ${dest.color} border transition-all hover:shadow-md hover:-translate-y-1`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-black">{dest.name}</h3>
                          <Badge variant="secondary" className="bg-white/70 font-semibold text-xs border-transparent">
                            {dest.distance} • {dest.duration}
                          </Badge>
                        </div>

                        <div className="space-y-2 text-xs opacity-90 mt-1 pb-4 flex-1">
                          <div>
                            <strong className="block text-[10px] uppercase font-bold tracking-wider opacity-60">Train Options</strong>
                            <span>{dest.trainDetails}</span>
                          </div>
                          <div>
                            <strong className="block text-[10px] uppercase font-bold tracking-wider opacity-60">Bus Options</strong>
                            <span>{dest.busDetails}</span>
                          </div>
                          {dest.flightDetails && (
                            <div>
                              <strong className="block text-[10px] uppercase font-bold tracking-wider opacity-60">Flight Options</strong>
                              <span>{dest.flightDetails}</span>
                            </div>
                          )}
                          <div>
                            <strong className="block text-[10px] uppercase font-bold tracking-wider opacity-60">One-Way Taxi Option</strong>
                            <span>{dest.taxiDetails}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 border-t border-black/5 pt-3 mt-auto">
                          <a href={dest.trainLink} target="_blank" rel="noopener noreferrer">
                            <Badge variant="outline" className="bg-white/40 border-black/10 text-black text-[10px] hover:bg-white flex items-center gap-0.5">
                              IRCTC <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                            </Badge>
                          </a>
                          <a href={dest.busLink} target="_blank" rel="noopener noreferrer">
                            <Badge variant="outline" className="bg-white/40 border-black/10 text-black text-[10px] hover:bg-white flex items-center gap-0.5">
                              RedBus <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                            </Badge>
                          </a>
                          <a href={dest.taxiLink} target="_blank" rel="noopener noreferrer">
                            <Badge variant="outline" className="bg-white/40 border-black/10 text-black text-[10px] hover:bg-white flex items-center gap-0.5">
                              DropTaxi <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                            </Badge>
                          </a>
                          {dest.flightLink && (
                            <a href={dest.flightLink} target="_blank" rel="noopener noreferrer">
                              <Badge variant="outline" className="bg-white/40 border-black/10 text-black text-[10px] hover:bg-white flex items-center gap-0.5">
                                Flights <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                              </Badge>
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* Station Parking & Tariffs and Commuter Amenities side-by-side in Left Column */}
            {cityPublicMode === 'metro' && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mt-5">
                {/* Metro Station Parking & Tariffs Card */}
                <Card className="border-blue-100">
                  <h3 className="text-base font-black flex items-center gap-2 text-text-primary border-b border-slate-100 pb-2">
                    <Car className="w-5 h-5 text-blue-600" /> Station Parking & Tariffs
                  </h3>
                  <div className="space-y-3 mt-1">
                    <p className="text-xs text-text-muted leading-relaxed font-medium">
                      Chennai Metro provides structured parking areas at key stations. Check live availability, rules, and approved fee structures:
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
                      <a 
                        href="https://commuters-data.chennaimetrorail.org/parkingavailability" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-indigo-50/50 hover:border-indigo-200 text-center transition-all group"
                      >
                        <MapPin className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform mb-1" />
                        <span className="text-[11px] font-black text-text-primary">Live Parking Spots</span>
                        <span className="text-[9px] text-text-muted mt-0.5">Real-time availability</span>
                      </a>
                      
                      <a 
                        href="https://chennaimetrorail.org/wp-content/uploads/2025/03/Approved-Parking-Tariff-Feb-2025-updated.pdf" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-indigo-50/50 hover:border-indigo-200 text-center transition-all group"
                      >
                        <CreditCard className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform mb-1" />
                        <span className="text-[11px] font-black text-text-primary">Parking Tariff PDF</span>
                        <span className="text-[9px] text-text-muted mt-0.5">Approved rates (Feb 2025)</span>
                      </a>

                      <a 
                        href="https://chennaimetrorail.org/wp-content/uploads/2026/03/Parking-Facilities-Availabilities-09-03-2025.pdf" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-indigo-50/50 hover:border-indigo-200 text-center transition-all group"
                      >
                        <ExternalLink className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform mb-1" />
                        <span className="text-[11px] font-black text-text-primary">Station Facilities List</span>
                        <span className="text-[9px] text-text-muted mt-0.5">Parking space capacities</span>
                      </a>
                    </div>
                  </div>
                </Card>

                {/* Commuter Amenities & Multimodal Integration Card */}
                <Card className="border-blue-100">
                  <h3 className="text-base font-black flex items-center gap-2 text-text-primary border-b border-slate-100 pb-2">
                    <Compass className="w-5 h-5 text-blue-600" /> Commuter Amenities & Feeder Services
                  </h3>
                  
                  {/* Tabs Selector */}
                  <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl mb-4 text-[10px] font-bold">
                    <button
                      onClick={() => setActiveAmenitiesTab('lastmile')}
                      className={`py-1.5 rounded-lg text-center transition-all ${
                        activeAmenitiesTab === 'lastmile'
                          ? 'bg-white text-indigo-950 shadow-xs'
                          : 'text-text-muted hover:text-text-primary'
                      }`}
                    >
                      Last Mile Connect
                    </button>
                    <button
                      onClick={() => setActiveAmenitiesTab('women')}
                      className={`py-1.5 rounded-lg text-center transition-all ${
                        activeAmenitiesTab === 'women'
                          ? 'bg-white text-indigo-950 shadow-xs'
                          : 'text-text-muted hover:text-text-primary'
                      }`}
                    >
                      Women Safety
                    </button>
                    <button
                      onClick={() => setActiveAmenitiesTab('disabled')}
                      className={`py-1.5 rounded-lg text-center transition-all ${
                        activeAmenitiesTab === 'disabled'
                          ? 'bg-white text-indigo-950 shadow-xs'
                          : 'text-text-muted hover:text-text-primary'
                      }`}
                    >
                      Universal Access
                    </button>
                  </div>

                  {/* Tab Contents */}
                  <div className="text-xs text-text-muted leading-relaxed font-medium min-h-[140px] transition-all duration-350">
                    {activeAmenitiesTab === 'lastmile' && (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-text-primary text-sm">Multimodal Last-Mile Connect</h4>
                          <a 
                            href="https://chennaimetrorail.org/wp-content/uploads/2023/11/Cycle-Pamplet.pdf" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[10px] text-indigo-600 hover:underline font-bold flex items-center gap-0.5"
                          >
                            Bicycle Pamphlet PDF <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                        <p>
                          CMRL provides a safe, efficient, and comfortable journey to its commuters by extending its transit service through structured last-mile connectivity programs:
                        </p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                          <li className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <strong className="text-text-primary block text-[10px]">Vehicular Feeder Facilities</strong>
                            Free Bicycles, Rental Bikes, Rental Autos, and Rental E-cycle facilities are available at major stations.
                          </li>
                          <li className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <strong className="text-text-primary block text-[10px]">MTC Minibus Connects</strong>
                            Dedicated minibuses operate from stations (S51, S60, S70K, S82, S83, S84, S69, S56, S97, S98, S100).
                          </li>
                          <li className="bg-slate-50 p-2 rounded-lg border border-slate-100 col-span-1 md:col-span-2">
                            <strong className="text-text-primary block text-[10px]">Exclusive Corporate Feeder Connections</strong>
                            - Arignar Anna Alandur to DLF Cybercity (Ramapuram) and RMZ One Paramount (Porur)
                            <br />
                            - Thirumangalam Station to Kosmo One IT Park (Ambattur)
                            <br />
                            - Little Mount Station to International Tech Park Campus (ITPC, Taramani)
                          </li>
                        </ul>
                        <div className="bg-slate-50/70 p-2 rounded-md border border-slate-100 text-[10px] text-center">
                          More info: <a href="https://chennaimetrorail.org/multimodal-integration/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-semibold">Multimodal Integration</a> | <a href="https://chennaimetrorail.org/feeder-service/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-semibold">Feeder Service</a>
                        </div>
                      </div>
                    )}

                    {activeAmenitiesTab === 'women' && (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-text-primary text-sm">Women's Safety & Security Facilities</h4>
                          <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                            Helpline: 155370
                          </span>
                        </div>
                        <p>
                          Dedicated measures are actively implemented at all times to ensure a safe and secure commuting environment for women passengers:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-[11px]">
                          <div className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <span className="text-indigo-600 font-bold">✓</span>
                            <div>
                              <strong className="text-text-primary block">Women-Only Coaches</strong>
                              Every train has a designated coach reserved exclusively for women.
                            </div>
                          </div>
                          <div className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <span className="text-indigo-600 font-bold">✓</span>
                            <div>
                              <strong className="text-text-primary block">Pink Squad Patrols</strong>
                              Special women security personnel trained in martial arts routinely patrol trains and check coaches.
                            </div>
                          </div>
                          <div className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <span className="text-indigo-600 font-bold">✓</span>
                            <div>
                              <strong className="text-text-primary block">CCTV Surveillance</strong>
                              Active cameras are installed across all coaches, platforms, and station corridors.
                            </div>
                          </div>
                          <div className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <span className="text-indigo-600 font-bold">✓</span>
                            <div>
                              <strong className="text-text-primary block">Station Security Staff</strong>
                              Uniformed security staff are deployed at all Ticket counters, Customer Care booths, and AFC gates.
                            </div>
                          </div>
                        </div>
                        <div className="bg-slate-50/70 p-2 rounded-md border border-slate-100 text-[10px] text-center">
                          More info: <a href="https://chennaimetrorail.org/facilities-for-women-passengers/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-semibold">Women Commuters Page</a>
                        </div>
                      </div>
                    )}

                    {activeAmenitiesTab === 'disabled' && (
                      <div className="space-y-3">
                        <h4 className="font-bold text-text-primary text-sm">Universal Accessibility & Differently-Abled Facilities</h4>
                        <p>
                          Every station is designed for universal access connecting road levels, street levels, concourses, platforms, and train compartments:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-[10.5px]">
                          <div className="space-y-2">
                            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                              <strong className="text-text-primary block">Street to Platform Accessibility</strong>
                              - Drop-off bays with kerb ramps and dedicated parking.
                              <br />
                              - Lifts with lower-height control panels, Braille buttons, and handrails.
                              <br />
                              - Entry ramps with a gentle 1:12 slope.
                            </div>
                            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                              <strong className="text-text-primary block">Guidance & Warnings</strong>
                              - Continuous tactile pathways for visually-challenged commuters.
                              <br />
                              - 100mm warning strips placed 600mm from platform edges.
                              <br />
                              - Contrast strips and handrails (900mm height) on staircases.
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                              <strong className="text-text-primary block">Station & Train Amenities</strong>
                              - Low-height ticketing counters and drinking water dispensers.
                              <br />
                              - Dedicated wide AFC wheelchair gates and accessible toilets.
                              <br />
                              - Dedicated wheelchair spaces and long-stop call buttons inside trains.
                            </div>
                            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                              <strong className="text-text-primary block">Assistance & Support</strong>
                              - Wheelchairs and stretchers at the Station Control Rooms.
                              <br />
                              - Loop induction units for hearing aids.
                              <br />
                              - Audio chimes during train arrival and departures.
                            </div>
                          </div>
                        </div>
                        <div className="bg-slate-50/70 p-2 rounded-md border border-slate-100 text-[10px] text-center">
                          More info: <a href="https://chennaimetrorail.org/facilities-for-differently-abled-people/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-semibold">Differently Abled Page</a>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            )}


            {/* Glassmorphic SBI NCMC Card & Tamil Helper */}
          </div>

          {/* Right Column: Timings, Route Map, NCMC and Tamil Word Helper */}
          <div className="space-y-6 lg:sticky lg:top-8 h-fit">
            {/* SBI NCMC Smart Card - Only shown when Chennai Metro is selected */}
            {timetableCategory === 'city' && cityTransportType === 'public' && cityPublicMode === 'metro' && (
              <Card className="relative overflow-hidden border-indigo-150/40 shadow-xs">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
                
                {/* Mode Selector Header */}
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-base font-black flex items-center gap-1.5 text-text-primary">
                    <CreditCard className="w-5 h-5 text-indigo-600 shrink-0" /> CMRL Passes
                  </h3>
                  
                  {/* Segmented control for NCMC vs SVP vs FAQs */}
                  <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[9px] font-bold">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMetroCardType('ncmc');
                      }}
                      className={`px-2 py-1 rounded-md transition-all ${
                        activeMetroCardType === 'ncmc'
                          ? 'bg-white text-indigo-950 shadow-2xs'
                          : 'text-text-muted hover:text-text-primary'
                      }`}
                    >
                      SBI NCMC
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMetroCardType('svp');
                      }}
                      className={`px-2 py-1 rounded-md transition-all ${
                        activeMetroCardType === 'svp'
                          ? 'bg-white text-indigo-950 shadow-2xs'
                          : 'text-text-muted hover:text-text-primary'
                      }`}
                    >
                      SVP QR Pass
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMetroCardType('faq');
                      }}
                      className={`px-2 py-1 rounded-md transition-all ${
                        activeMetroCardType === 'faq'
                          ? 'bg-white text-indigo-950 shadow-2xs'
                          : 'text-text-muted hover:text-text-primary'
                      }`}
                    >
                      FAQs & Support
                    </button>
                  </div>
                </div>

                {activeMetroCardType === 'ncmc' && (
                  <p className="text-xs text-text-muted mb-4 font-medium leading-tight">National Common Mobility Card (NCMC) for unified transit. Click card to flip.</p>
                )}
                {activeMetroCardType === 'svp' && (
                  <p className="text-xs text-text-muted mb-4 font-medium leading-tight">Store Value Pass (SVP) Online QR for mobile-based travel with 20% discount.</p>
                )}
                {activeMetroCardType === 'faq' && (
                  <p className="text-xs text-text-muted mb-4 font-medium leading-tight">Frequently Asked Questions & customer support details for Singara Chennai NCMC Card.</p>
                )}
                
                {activeMetroCardType === 'ncmc' && (
                  /* NCMC Physical Card */
                  <div className="flip-card-container h-[200px]" onClick={() => setIsNcmcFlipped(!isNcmcFlipped)}>
                    <div className={`flip-card-inner h-full ${isNcmcFlipped ? 'flipped' : ''}`}>
                      {/* Front Side */}
                      <div 
                        className="flip-card-front absolute inset-0 w-full h-full backface-hidden rounded-3xl p-5 text-white flex flex-col justify-between shadow-xl select-none border border-white/30 overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #00C8EC 0%, #0094D3 100%)' }}
                      >
                        {/* Chennai Landmark Silhouette Overlay */}
                        <svg 
                          className="absolute inset-x-0 bottom-0 w-full h-[95px] text-blue-950/20 pointer-events-none z-0" 
                          viewBox="0 0 320 110" 
                          preserveAspectRatio="none" 
                          fill="currentColor"
                        >
                          {/* Metro Tracks */}
                          <path d="M 0 100 L 320 100" stroke="currentColor" strokeWidth="2" />
                          
                          {/* Chennai Central Railway Station Structure */}
                          <path d="M 110 100 L 110 65 L 122 65 L 122 45 L 132 45 L 132 65 L 152 65 L 152 35 L 158 20 L 164 20 L 170 35 L 170 65 L 190 65 L 190 45 L 200 45 L 200 65 L 212 65 L 212 100 Z" />
                          <circle cx="161" cy="40" r="5" fill="currentColor" opacity="0.3" />
                          
                          {/* Station wings */}
                          <path d="M 80 100 L 80 75 L 110 75 L 110 100 Z" />
                          <path d="M 212 100 L 212 75 L 242 75 L 242 100 Z" />

                          {/* Labor Statue */}
                          <path d="M 255 100 L 295 100 L 290 92 L 260 92 Z" />
                          <path d="M 262 92 C 260 85, 265 80, 268 85 C 270 82, 275 80, 273 92" />
                          <path d="M 276 92 C 274 84, 279 81, 281 86 C 283 83, 288 81, 286 92" />
                          <circle cx="282" cy="80" r="2" />
                          <circle cx="268" cy="79" r="2" />
                          <path d="M 288 92 C 285 78, 298 78, 296 92 Z" />

                          {/* CMRL Metro Train (Bottom Left) */}
                          <path d="M 5 100 L 75 100 M 5 102 L 75 102" stroke="currentColor" strokeWidth="1" />
                          <path d="M 12 99 L 65 99 L 65 86 L 30 86 L 15 92 Z" />
                          <rect x="33" y="88" width="8" height="5" fill="#00C8EC" opacity="0.6" />
                          <rect x="44" y="88" width="8" height="5" fill="#00C8EC" opacity="0.6" />
                          <rect x="55" y="88" width="7" height="5" fill="#00C8EC" opacity="0.6" />
                          <path d="M 16 92 L 28 87 L 28 92 Z" fill="#00C8EC" opacity="0.7" />
                        </svg>

                        {/* Header Logos & Branding (Top Row) */}
                        <div className="flex justify-between items-center z-10 w-full">
                          {/* Top-Left: CMRL Logo & 75 Azadi emblem */}
                          <div className="flex items-center gap-1">
                            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                              <svg className="w-4 h-4 text-[#0067b1]" viewBox="0 0 100 100" fill="none">
                                <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="12" />
                                <path d="M30 42 C 40 32, 60 32, 70 42 C 60 52, 40 52, 30 42 Z" fill="currentColor" />
                                <path d="M30 58 C 40 68, 60 68, 70 58 C 60 48, 40 48, 30 58 Z" fill="currentColor" />
                              </svg>
                            </div>
                            <div className="w-7 h-6 bg-white/95 rounded-xs flex items-center justify-center p-0.5 shadow-xs border border-white/50 shrink-0">
                              <svg className="w-full h-full" viewBox="0 0 80 60" fill="none">
                                <path d="M5 23 C 20 13, 30 13, 45 23 C 60 33, 70 33, 75 23" stroke="#FF9933" strokeWidth="3" fill="none" />
                                <path d="M5 28 C 20 18, 30 18, 45 28 C 60 38, 70 38, 75 28" stroke="#FFFFFF" strokeWidth="3" fill="none" />
                                <path d="M5 33 C 20 23, 30 23, 45 33 C 60 43, 70 43, 75 33" stroke="#128807" strokeWidth="3" fill="none" />
                                <text x="40" y="30" fill="#000080" fontSize="17" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">75</text>
                                <text x="40" y="41" fill="#000080" fontSize="5" fontWeight="bold" textAnchor="middle">Azadi Ka</text>
                                <text x="40" y="47" fill="#128807" fontSize="5" fontWeight="black" textAnchor="middle">Amrit Mahotsav</text>
                              </svg>
                            </div>
                          </div>

                          {/* Top-Center: Title & Tagline */}
                          <div className="flex flex-col items-center">
                            <span className="text-[10px] font-black tracking-widest text-blue-950 font-sans text-center leading-none">SINGARA CHENNAI</span>
                            <span className="text-[5.5px] font-black tracking-widest text-[#FF9933] text-center mt-0.5 leading-none">ONE CITY ONE CARD</span>
                          </div>

                          {/* Top-Right: SBI Logo */}
                          <div className="bg-white px-1.5 py-0.5 rounded-sm flex items-center justify-center shadow-xs border border-white/50 shrink-0">
                            <svg className="w-10 h-3 text-[#00a4e4]" viewBox="0 0 100 30" fill="currentColor">
                              <path d="M 15 15 A 10 10 0 1 0 15 15.01 Z M 15 11 A 4 4 0 1 1 15 11.01 Z" fillRule="evenodd" />
                              <rect x="13.5" y="15" width="3" height="10" />
                              <text x="32" y="21" fill="#007cc3" fontSize="20" fontWeight="bold" fontFamily="sans-serif">SBI</text>
                            </svg>
                          </div>
                        </div>

                        {/* Middle Row: Chip & Wireless Indicators */}
                        <div className="flex justify-between items-center z-10 w-full mt-2">
                          {/* EMV Chip */}
                          <div className="w-9 h-7 rounded-md bg-amber-400 p-[1.5px] border border-amber-300 shadow-sm relative overflow-hidden shrink-0">
                            <div className="w-full h-full border border-yellow-700/20 rounded-[4px] relative">
                              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-yellow-700/30 -translate-y-1/2" />
                              <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-yellow-700/30 -translate-x-1/2" />
                              <div className="absolute top-1 bottom-1 left-1/4 w-[1px] bg-yellow-700/30" />
                              <div className="absolute top-1 bottom-1 right-1/4 w-[1px] bg-yellow-700/30" />
                              <div className="absolute top-1/4 bottom-1/4 left-0 right-0 h-[1px] bg-yellow-700/30" />
                              <div className="absolute top-3/4 bottom-1/4 left-0 right-0 h-[1px] bg-yellow-700/30" />
                            </div>
                          </div>

                          {/* Contactless Indicators */}
                          <div className="flex items-center gap-1">
                            {/* Black NFC Wave Symbol */}
                            <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                              <path d="M5,8 C6.2,9.5 6.2,14.5 5,16" />
                              <path d="M9,6 C11,8.5 11,15.5 9,18" />
                              <path d="M13,4 C15.8,7.5 15.8,16.5 13,20" />
                            </svg>
                            
                            {/* NCMC Logo (Orange/Green arrow) */}
                            <svg className="w-7 h-7" viewBox="0 0 40 40" fill="none">
                              <path d="M8,12 L18,20 L8,28 L14,28 L24,20 L14,12 Z" fill="#FF9933" />
                              <path d="M17,12 L27,20 L17,28 L23,28 L33,20 L23,12 Z" fill="#128807" />
                            </svg>
                          </div>
                        </div>

                        {/* Card Numbers & Commuter Name */}
                        <div className="z-10 mt-1">
                          <div className="text-sm font-mono font-bold tracking-widest text-blue-950 drop-shadow-xs leading-none">
                            4321 9876 5432 1098
                          </div>
                          <div className="text-[7.5px] font-sans font-black text-blue-900 tracking-wider mt-1 uppercase">
                            Chennai Commuter
                          </div>
                        </div>

                        {/* Bottom Banner Elements */}
                        <div className="flex justify-between items-end z-10 w-full mt-auto">
                          {/* Bottom Left: VALID THRU next to the train silhouette */}
                          <div className="flex flex-col justify-end pb-0.5 pl-1">
                            <span className="text-[5.5px] font-black text-blue-950 tracking-wider leading-none">VALID THRU</span>
                            <span className="text-[9px] font-mono font-black text-blue-950 leading-none mt-0.5">12/31</span>
                          </div>

                          {/* Bottom Right: Silver/Grey Base Strip */}
                          <div className="w-[55%] h-8 bg-slate-200 rounded-br-3xl rounded-tl-xl flex flex-col justify-center items-center shadow-inner border-t border-l border-white/40 -mr-5 -mb-5 pr-5">
                            <div className="flex items-center">
                              <span className="text-xs font-black tracking-tighter text-blue-900 italic font-sans leading-none">RuPay</span>
                              <svg className="w-4 h-2.5 ml-0.5 shrink-0" viewBox="0 0 20 12" fill="none">
                                <path d="M2,2 L14,2 L10,10 L2,10 Z" fill="#FF9933" />
                                <path d="M8,2 L20,2 L16,10 L8,10 Z" fill="#128807" />
                              </svg>
                            </div>
                            <span className="text-[6px] font-black text-slate-800 tracking-widest mt-0.5 leading-none">PREPAID CARD</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Back Side */}
                      <div className="flip-card-back absolute inset-0 w-full h-full backface-hidden rounded-3xl p-5 text-white flex flex-col justify-between shadow-xl select-none bg-slate-900/80 backdrop-blur-xl border border-white/20">
                        <div className="h-4 bg-slate-900 -mx-5 -mt-1 mb-2" />
                        
                        <div className="flex gap-4 items-center flex-1">
                          {/* QR Ticket */}
                          <div className="w-16 h-16 bg-white p-1 rounded-lg border border-white/25 shrink-0 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-slate-800 font-mono">QR CODE</span>
                          </div>
                          <div className="text-[10px] text-slate-300 font-medium space-y-1">
                            <div className="text-white font-bold">NCMC Digital Pass</div>
                            <div>Scan at any Metro gate or Suburban MRTS validation terminal.</div>
                            <div className="text-[8px] text-slate-400 font-normal">Powered by RuPay Contactless</div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 border-t border-white/10 pt-3">
                          <a 
                            href="https://prepaid.sbi.bank.in/" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            onClick={(e) => e.stopPropagation()} 
                            className="flex-1 py-1.5 bg-white text-indigo-950 font-bold text-center text-xs rounded-xl hover:bg-slate-100 transition-colors shadow-sm"
                          >
                            Quick Recharge
                          </a>
                          <a 
                            href="https://chennaimetrorail.org" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            onClick={(e) => e.stopPropagation()} 
                            className="py-1.5 px-3 bg-white/10 hover:bg-white/20 text-white font-bold text-center text-xs rounded-xl transition-all border border-white/20"
                          >
                            Portal
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeMetroCardType === 'svp' && (
                  /* SVP Digital QR Card */
                  <div 
                    className="relative w-full h-[200px] rounded-3xl p-4 text-white flex flex-col justify-between shadow-xl select-none border border-white/20 overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #0f172a 0%, #004f87 50%, #020617 100%)' }}
                  >
                    {/* SVG background grid/glow for digital pass feel */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.12),transparent)] pointer-events-none" />
                    
                    <div className="flex justify-between items-start z-10 w-full">
                      {/* Left: Pass title */}
                      <div>
                        <span className="text-[10px] font-black tracking-widest text-sky-200 block uppercase leading-none">Chennai Metro Rail</span>
                        <span className="text-[9px] font-black text-white/95 bg-sky-500/40 px-2 py-0.5 rounded-full border border-sky-400/30 inline-block mt-1 leading-none">STORE VALUE PASS</span>
                      </div>
                      
                      {/* Right: Branding logo (CMRL Circle logo) */}
                      <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-xs shrink-0">
                        <svg className="w-4 h-4 text-[#0067b1]" viewBox="0 0 100 100" fill="none">
                          <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="12" />
                          <path d="M30 42 C 40 32, 60 32, 70 42 C 60 52, 40 52, 30 42 Z" fill="currentColor" />
                          <path d="M30 58 C 40 68, 60 68, 70 58 C 60 48, 40 48, 30 58 Z" fill="currentColor" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Middle: Dynamic Security QR Code */}
                    <div className="flex items-center justify-center gap-5 z-10 flex-1 my-1">
                      {/* QR Code Graphic */}
                      <div className="bg-white p-1.5 rounded-xl border border-white/20 shadow-md relative shrink-0">
                        <img 
                          src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dorg.chennaimetrorail.appv1%26hl%3Den-US&color=0f172a&bgcolor=ffffff" 
                          alt="Real CMRL App Play Store QR Code" 
                          className="w-14 h-14 rounded-lg select-none"
                          loading="lazy"
                        />
                        
                        <div className="absolute inset-0 bg-emerald-500/10 rounded-xl pointer-events-none animate-pulse" />
                      </div>
                      
                      {/* Live Security Details next to QR */}
                      <div className="flex flex-col text-[10px] space-y-1 font-medium opacity-90 max-w-[140px]">
                        <div className="flex items-center gap-1 text-emerald-400 leading-none">
                          <span className="relative flex h-1.5 w-1.5 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                          </span>
                          <span className="font-extrabold uppercase tracking-wide text-[7px]">Secure Online QR</span>
                        </div>
                        <p className="leading-tight text-slate-300 text-[9px]">
                          Pass updates dynamically. QR changes daily for security reasons.
                        </p>
                      </div>
                    </div>
                    
                    {/* Bottom: SVP Pass Balance and Savings badges */}
                    <div className="flex justify-between items-end z-10 w-full border-t border-white/10 pt-2">
                      <div className="flex flex-col">
                        <span className="text-[6.5px] font-black uppercase text-sky-200 tracking-wider leading-none">PASS ID</span>
                        <span className="text-[10px] font-mono font-bold leading-none mt-0.5">SVP-2026-8736-9281</span>
                      </div>
                      
                      {/* 20% savings badge */}
                      <div className="bg-emerald-500 text-white font-black text-[8px] px-2.5 py-0.5 rounded-full border border-emerald-400/20 flex items-center gap-1 shadow-sm leading-none uppercase tracking-wide">
                        <span>Save 20%</span>
                        <span className="text-[7.5px] font-bold opacity-85">&bull; QR</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeMetroCardType === 'faq' && (
                  <div className="space-y-4">
                    <div className="bg-indigo-50/75 border border-indigo-100 p-3 rounded-2xl flex items-center justify-between text-indigo-950 text-xs">
                      <div>
                        <strong className="block text-[12px] font-bold text-text-primary">NCMC Customer Support</strong>
                        <p className="text-[10px] text-text-muted mt-0.5 font-semibold">Call: 1800-1234 / 080-26599990</p>
                      </div>
                      <a 
                        href="mailto:contactcentre@sbi.co.in" 
                        className="bg-indigo-600 hover:bg-indigo-750 text-white font-extrabold text-[9px] px-2.5 py-1 rounded-lg transition-colors uppercase tracking-wider"
                      >
                        Email Support
                      </a>
                    </div>
                    
                    <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                      {SINGARA_FAQ.map((faq, idx) => {
                        const isOpen = openFaqIdx === idx;
                        return (
                          <div key={idx} className="border-b border-slate-100 pb-2 last:border-b-0">
                            <button
                              onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                              className="w-full flex justify-between items-center text-left py-1 text-[11px] font-bold text-slate-800 hover:text-indigo-650 transition-colors"
                            >
                              <span>{faq.q}</span>
                              <span className="text-slate-400 font-bold ml-2 shrink-0">{isOpen ? '-' : '+'}</span>
                            </button>
                            {isOpen && (
                              <div className="mt-1 text-[10px] text-text-muted leading-relaxed font-medium bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                                {faq.a}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              {/* Information Tabs for NCMC */}
              {activeMetroCardType === 'ncmc' && (
                <div className="mt-6 border-t border-slate-100 pt-4">
                  {/* Tab Selector */}
                  <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl mb-4 text-[10px] font-bold">
                    <button
                      onClick={() => setActiveCardTab('about')}
                      className={`py-1.5 rounded-lg text-center transition-all ${
                        activeCardTab === 'about'
                          ? 'bg-white text-indigo-950 shadow-xs'
                          : 'text-text-muted hover:text-text-primary'
                      }`}
                    >
                      About
                    </button>
                    <button
                      onClick={() => setActiveCardTab('benefits')}
                      className={`py-1.5 rounded-lg text-center transition-all ${
                        activeCardTab === 'benefits'
                          ? 'bg-white text-indigo-950 shadow-xs'
                          : 'text-text-muted hover:text-text-primary'
                      }`}
                    >
                      Benefits
                    </button>
                    <button
                      onClick={() => setActiveCardTab('topup')}
                      className={`py-1.5 rounded-lg text-center transition-all ${
                        activeCardTab === 'topup'
                          ? 'bg-white text-indigo-950 shadow-xs'
                          : 'text-text-muted hover:text-text-primary'
                      }`}
                    >
                      Limits & Fees
                    </button>
                    <button
                      onClick={() => setActiveCardTab('howto')}
                      className={`py-1.5 rounded-lg text-center transition-all ${
                        activeCardTab === 'howto'
                          ? 'bg-white text-indigo-950 shadow-xs'
                          : 'text-text-muted hover:text-text-primary'
                      }`}
                    >
                      How to Get
                    </button>
                  </div>

                  {/* Tab Content */}
                  <div className="text-xs text-text-muted leading-relaxed font-medium min-h-[120px] transition-opacity duration-300">
                    {activeCardTab === 'about' && (
                      <div className="space-y-2">
                        <h4 className="font-bold text-text-primary text-sm">About SBI Singara Chennai Card</h4>
                        <p>State Bank of India introduces to you Singara Chennai Card.</p>
                        <p>
                          Singara Chennai Card is a contactless dual interface (EMV chip based) prepaid card with stored value functionality for providing a safe, secure, and seamless way of payment. A simple way to pay fares in the Metros, this card offers extended usage in Chennai metro and in other transit projects across the country.
                        </p>
                        <p>
                          Compartmentalization of amount for different utilities such as transit amongst others is a unique feature of this State Bank Singara Chennai Card, which can be used in NCMC enabled transit projects such as buses and parking, using the store value of the card.
                        </p>
                      </div>
                    )}

                    {activeCardTab === 'benefits' && (
                      <div className="space-y-3">
                        <h4 className="font-bold text-text-primary text-sm">Benefits & Features</h4>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <li className="flex items-start gap-2 bg-indigo-50/50 p-2 rounded-lg border border-indigo-100/30">
                            <span className="text-indigo-600 font-bold">✓</span>
                            <div>
                              <strong className="text-text-primary block">Cashless Travels</strong>
                              Seamless fare payments without cash.
                            </div>
                          </li>
                          <li className="flex items-start gap-2 bg-indigo-50/50 p-2 rounded-lg border border-indigo-100/30">
                            <span className="text-indigo-600 font-bold">✓</span>
                            <div>
                              <strong className="text-text-primary block">Purchase Tickets</strong>
                              Easily buy tickets for your travel needs.
                            </div>
                          </li>
                          <li className="flex items-start gap-2 bg-indigo-50/50 p-2 rounded-lg border border-indigo-100/30">
                            <span className="text-indigo-600 font-bold">✓</span>
                            <div>
                              <strong className="text-text-primary block">Chip-Protection</strong>
                              EMV chip ensures better security.
                            </div>
                          </li>
                          <li className="flex items-start gap-2 bg-indigo-50/50 p-2 rounded-lg border border-indigo-100/30">
                            <span className="text-indigo-600 font-bold">✓</span>
                            <div>
                              <strong className="text-text-primary block">Tap-and-Pay</strong>
                              Contactless NFC for instant gates entry.
                            </div>
                          </li>
                        </ul>
                      </div>
                    )}

                    {activeCardTab === 'topup' && (
                      <div className="space-y-3">
                        <h4 className="font-bold text-text-primary text-sm">Limits & Fees</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            <strong className="text-text-primary block mb-0.5">Top-Up Bounds</strong>
                            <p className="text-[10px]">
                              • <strong>Minimum Initial Top-up</strong>: ₹10 (Multiples of ₹10 thereafter).
                            </p>
                            <p className="text-[10px] mt-1">
                              • <strong>Maximum Stored-Value Balance</strong>: ₹2,000 (Overall limits: ₹3,000 for MTS cards and ₹10,000 for Small PPI Cards).
                            </p>
                            <a 
                              href="https://prepaid.sbi.bank.in/" 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-indigo-600 hover:underline font-bold inline-block mt-2 text-[10px]"
                            >
                              prepaid.sbi.bank.in
                            </a>
                          </div>

                          <div className="border border-slate-100 rounded-lg overflow-hidden text-[9.5px]">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                  <th className="p-1.5 font-bold text-text-primary">Fee Category</th>
                                  <th className="p-1.5 font-bold text-text-primary text-right">Charges</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-slate-100/50">
                                  <td className="p-1.5">Card Issuance Fee</td>
                                  <td className="p-1.5 text-right font-semibold text-green-600">NIL</td>
                                </tr>
                                <tr className="border-b border-slate-100/50">
                                  <td className="p-1.5">Annual Maintenance</td>
                                  <td className="p-1.5 text-right font-semibold text-green-600">NIL</td>
                                </tr>
                                <tr className="border-b border-slate-100/50">
                                  <td className="p-1.5">Card Replacement</td>
                                  <td className="p-1.5 text-right font-semibold">Rs. 100/-</td>
                                </tr>
                                <tr>
                                  <td className="p-1.5">Reload/Top-up fee</td>
                                  <td className="p-1.5 text-right font-semibold text-green-600">NIL</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeCardTab === 'howto' && (
                      <div className="space-y-4">
                        <h4 className="font-bold text-text-primary text-sm">How to Get your Singara Chennai Card</h4>
                        
                        {/* Minimum Details Card */}
                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-2">
                          <strong className="text-indigo-950 block text-[11px] font-extrabold border-b border-indigo-100 pb-1 uppercase tracking-wider">
                            Option A: Minimum Details Singara Chennai Card
                          </strong>
                          <ol className="relative pl-4 border-l border-indigo-200 space-y-1.5 mt-2">
                            <li className="relative">
                              <span className="absolute -left-[21px] top-0.5 w-3.5 h-3.5 rounded-full bg-indigo-500 text-white text-[8px] font-bold flex items-center justify-center">1</span>
                              <p className="text-[10px] text-text-muted">Visit nearest CMRL Metro station and request for Card at Ticket Counter.</p>
                            </li>
                            <li className="relative">
                              <span className="absolute -left-[21px] top-0.5 w-3.5 h-3.5 rounded-full bg-indigo-500 text-white text-[8px] font-bold flex items-center justify-center">2</span>
                              <p className="text-[10px] text-text-muted">Fill your details in the simple Application Form and submit to operator.</p>
                            </li>
                            <li className="relative">
                              <span className="absolute -left-[21px] top-0.5 w-3.5 h-3.5 rounded-full bg-indigo-500 text-white text-[8px] font-bold flex items-center justify-center">3</span>
                              <p className="text-[10px] text-text-muted">Operator enters details; an OTP is generated and sent to your mobile number.</p>
                            </li>
                            <li className="relative">
                              <span className="absolute -left-[21px] top-0.5 w-3.5 h-3.5 rounded-full bg-indigo-500 text-white text-[8px] font-bold flex items-center justify-center">4</span>
                              <p className="text-[10px] text-text-muted">Validate OTP, then pay top-up amount to load balance for usage.</p>
                            </li>
                          </ol>
                          <div className="bg-indigo-50/50 p-2 rounded-md border border-indigo-100/50 mt-2 text-[9.5px]">
                            <strong>Online Option (Skip the Form):</strong> Pre-fill details online at{' '}
                            <a 
                              href="https://prepaid.sbi.bank.in/web/#/apply-card" 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-indigo-600 hover:underline font-bold"
                            >
                              prepaid.sbi.bank.in/web/#/apply-card
                            </a>{' '}
                            and give the generated Reference Number to the ticket operator.
                          </div>
                        </div>

                        {/* MTS Card */}
                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-2">
                          <strong className="text-indigo-950 block text-[11px] font-extrabold border-b border-indigo-100 pb-1 uppercase tracking-wider">
                            Option B: Mass Transit System (MTS) Singara Chennai Card
                          </strong>
                          <ol className="relative pl-4 border-l border-indigo-200 space-y-1.5 mt-2">
                            <li className="relative">
                              <span className="absolute -left-[21px] top-0.5 w-3.5 h-3.5 rounded-full bg-indigo-500 text-white text-[8px] font-bold flex items-center justify-center">1</span>
                              <p className="text-[10px] text-text-muted">Visit nearest CMRL Metro station and request for Singara Chennai MTS Card.</p>
                            </li>
                            <li className="relative">
                              <span className="absolute -left-[21px] top-0.5 w-3.5 h-3.5 rounded-full bg-indigo-500 text-white text-[8px] font-bold flex items-center justify-center">2</span>
                              <p className="text-[10px] text-text-muted">Provide your Mobile number to the operator.</p>
                            </li>
                            <li className="relative">
                              <span className="absolute -left-[21px] top-0.5 w-3.5 h-3.5 rounded-full bg-indigo-500 text-white text-[8px] font-bold flex items-center justify-center">3</span>
                              <p className="text-[10px] text-text-muted">Operator enters Mobile number; OTP is generated and sent to your phone.</p>
                            </li>
                            <li className="relative">
                              <span className="absolute -left-[21px] top-0.5 w-3.5 h-3.5 rounded-full bg-indigo-500 text-white text-[8px] font-bold flex items-center justify-center">4</span>
                              <p className="text-[10px] text-text-muted">Validate OTP, then pay top-up amount to load balance for usage.</p>
                            </li>
                          </ol>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Information Tabs for SVP */}
              {activeMetroCardType === 'svp' && (
                <div className="mt-6 border-t border-slate-100 pt-4">
                  {/* CMRL Official App Redirect Banner */}
                  <div className="mb-4 p-3 bg-indigo-50/50 border border-indigo-100/60 rounded-2xl flex items-center justify-between text-indigo-950 text-xs">
                    <div>
                      <strong className="block text-[11.5px] font-black text-text-primary">Download CMRL Mobile App</strong>
                      <p className="text-[10px] text-text-muted mt-0.5 font-semibold">Buy online QR passes, check fares, & book parking</p>
                    </div>
                    <a 
                      href="https://play.google.com/store/apps/details?id=org.chennaimetrorail.appv1&hl=en-US" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="bg-indigo-600 hover:bg-indigo-750 text-white font-extrabold text-[9px] px-3 py-1.5 rounded-lg transition-colors uppercase tracking-wider shrink-0 flex items-center gap-1 shadow-sm"
                    >
                      Google Play <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>

                  {/* Tab Selector */}
                  <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl mb-4 text-[10px] font-bold">
                    <button
                      onClick={() => setActiveSvpTab('about')}
                      className={`py-1.5 rounded-lg text-center transition-all ${
                        activeSvpTab === 'about'
                          ? 'bg-white text-indigo-950 shadow-xs'
                          : 'text-text-muted hover:text-text-primary'
                      }`}
                    >
                      About & Adv
                    </button>
                    <button
                      onClick={() => setActiveSvpTab('limits')}
                      className={`py-1.5 rounded-lg text-center transition-all ${
                        activeSvpTab === 'limits'
                          ? 'bg-white text-indigo-950 shadow-xs'
                          : 'text-text-muted hover:text-text-primary'
                      }`}
                    >
                      Pricing & Limits
                    </button>
                    <button
                      onClick={() => setActiveSvpTab('howto')}
                      className={`py-1.5 rounded-lg text-center transition-all ${
                        activeSvpTab === 'howto'
                          ? 'bg-white text-indigo-950 shadow-xs'
                          : 'text-text-muted hover:text-text-primary'
                      }`}
                    >
                      How to Get
                    </button>
                  </div>

                  {/* Tab Content */}
                  <div className="text-xs text-text-muted leading-relaxed font-medium min-h-[120px] transition-opacity duration-300">
                    {activeSvpTab === 'about' && (
                      <div className="space-y-3">
                        <h4 className="font-bold text-text-primary text-sm">Store Value Pass (SVP) Online QR</h4>
                        <p>
                          Store Value Pass (SVP) Online QR is a digital card for quick and cashless metro transit designed by Chennai Metro Rail Limited (CMRL) to provide a seamless travel experience without the need to carry physical smart cards.
                        </p>
                        
                        <div className="mt-3">
                          <strong className="text-text-primary block mb-2">Key Advantages:</strong>
                          <ul className="grid grid-cols-1 gap-2">
                            <li className="flex items-start gap-2 bg-indigo-50/50 p-2 rounded-lg border border-indigo-100/30">
                              <span className="text-indigo-600 font-bold">✓</span>
                              <div>
                                <strong className="text-text-primary block">Instant Booking</strong>
                                Purchase through the official CMRL mobile app and instantly obtain an online QR for travel.
                              </div>
                            </li>
                            <li className="flex items-start gap-2 bg-indigo-50/50 p-2 rounded-lg border border-indigo-100/30">
                              <span className="text-indigo-600 font-bold">✓</span>
                              <div>
                                <strong className="text-text-primary block">Save Time</strong>
                                Avoid standing in queues for tickets during every journey.
                              </div>
                            </li>
                            <li className="flex items-start gap-2 bg-indigo-50/50 p-2 rounded-lg border border-indigo-100/30">
                              <span className="text-indigo-600 font-bold">✓</span>
                              <div>
                                <strong className="text-text-primary block">No Extra Media</strong>
                                Your smartphone holds your ticket; no need to carry any media separately.
                              </div>
                            </li>
                            <li className="flex items-start gap-2 bg-indigo-50/50 p-2 rounded-lg border border-indigo-100/30">
                              <span className="text-indigo-600 font-bold">✓</span>
                              <div>
                                <strong className="text-text-primary block">Multi-utility & Discounts</strong>
                                The same pass shall be used to pay CMRL parking fares and avail commuter discounts.
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {activeSvpTab === 'limits' && (
                      <div className="space-y-3">
                        <h4 className="font-bold text-text-primary text-sm">Pricing, Recharge Bounds & Validity</h4>
                        
                        <div className="border border-slate-100 rounded-lg overflow-hidden mb-3">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="p-2 font-bold text-text-primary">Parameter</th>
                                <th className="p-2 font-bold text-text-primary text-right">Value / Limit</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-slate-100/50">
                                <td className="p-2">Refundable Deposit</td>
                                <td className="p-2 text-right font-semibold text-text-primary">Rs. 50/-</td>
                              </tr>
                              <tr className="border-b border-slate-100/50">
                                <td className="p-2">Minimum Recharges</td>
                                <td className="p-2 text-right font-semibold text-text-primary">Rs. 50/-</td>
                              </tr>
                              <tr className="border-b border-slate-100/50">
                                <td className="p-2">Maximum Balance Limit</td>
                                <td className="p-2 text-right font-semibold text-text-primary">Rs. 3,000/-</td>
                              </tr>
                              <tr className="border-b border-slate-100/50">
                                <td className="p-2">Travel Savings</td>
                                <td className="p-2 text-right font-bold text-emerald-600">20% Fare Discount</td>
                              </tr>
                              <tr>
                                <td className="p-2">Pass Validity</td>
                                <td className="p-2 text-right font-semibold text-text-primary">5 Years (from last purchase/recharge)</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        
                        <div className="bg-rose-50/50 border border-rose-100 p-2.5 rounded-lg text-rose-950">
                          <strong className="block mb-0.5 text-rose-900 font-bold">Important Rules & Notes:</strong>
                          <p className="leading-tight text-[11px]">
                            If passenger performs entry and exit from the same station within 20 mins, a minimum fare will be deducted from the SVP.
                          </p>
                        </div>
                      </div>
                    )}

                    {activeSvpTab === 'howto' && (
                      <div className="space-y-3">
                        <h4 className="font-bold text-text-primary text-sm">How to Get Stored Value Pass (SVP)</h4>
                        <div className="relative pl-4 border-l border-indigo-100 space-y-3 mt-2">
                          <div className="relative">
                            <span className="absolute -left-[21px] top-0.5 w-3.5 h-3.5 rounded-full bg-indigo-500 text-white text-[9px] font-bold flex items-center justify-center">1</span>
                            <strong className="text-text-primary block text-[11px] leading-none mb-1">Download CMRL Mobile App</strong>
                            <p className="text-[10px]">
                              Download and open the official{' '}
                              <a 
                                href="https://play.google.com/store/apps/details?id=org.chennaimetrorail.appv1&hl=en-US"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:underline font-bold"
                              >
                                CMRL Mobile App
                              </a>{' '}
                              on your phone.
                            </p>
                          </div>
                          <div className="relative">
                            <span className="absolute -left-[21px] top-0.5 w-3.5 h-3.5 rounded-full bg-indigo-500 text-white text-[9px] font-bold flex items-center justify-center">2</span>
                            <strong className="text-text-primary block text-[11px] leading-none mb-1">Register & Login</strong>
                            <p className="text-[10px]">Register or login securely using your mobile number.</p>
                          </div>
                          <div className="relative">
                            <span className="absolute -left-[21px] top-0.5 w-3.5 h-3.5 rounded-full bg-indigo-500 text-white text-[9px] font-bold flex items-center justify-center">3</span>
                            <strong className="text-text-primary block text-[11px] leading-none mb-1">Select Store Value Pass</strong>
                            <p className="text-[10px]">Look for the “Store Value Pass (SVP)” option on the dashboard.</p>
                          </div>
                          <div className="relative">
                            <span className="absolute -left-[21px] top-0.5 w-3.5 h-3.5 rounded-full bg-indigo-500 text-white text-[9px] font-bold flex items-center justify-center">4</span>
                            <strong className="text-text-primary block text-[11px] leading-none mb-1">Choose Activation</strong>
                            <p className="text-[10px]">Select the "Activate Stored Value Pass" option to start.</p>
                          </div>
                          <div className="relative">
                            <span className="absolute -left-[21px] top-0.5 w-3.5 h-3.5 rounded-full bg-indigo-500 text-white text-[9px] font-bold flex items-center justify-center">5</span>
                            <strong className="text-text-primary block text-[11px] leading-none mb-1">Add Money / Recharge</strong>
                            <p className="text-[10px]">Add money to the SVP - recharge is a minimum of ₹50, with a maximum balance/top-up limit of ₹3,000.</p>
                          </div>
                          <div className="relative">
                            <span className="absolute -left-[21px] top-0.5 w-3.5 h-3.5 rounded-full bg-indigo-500 text-white text-[9px] font-bold flex items-center justify-center">6</span>
                            <strong className="text-text-primary block text-[11px] leading-none mb-1">Generate Online QR</strong>
                            <p className="text-[10px]">The app will generate a secure QR code for metro travel. The QR changes daily for security.</p>
                          </div>
                          <div className="relative">
                            <span className="absolute -left-[21px] top-0.5 w-3.5 h-3.5 rounded-full bg-indigo-500 text-white text-[9px] font-bold flex items-center justify-center">7</span>
                            <strong className="text-text-primary block text-[11px] leading-none mb-1">Scan at AFC Gate</strong>
                            <p className="text-[10px]">At the metro station, scan the QR code at the AFC gate for entry and exit.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
            )}

            {/* Metro Service Timings & Network Map - Only shown when Chennai Metro is selected */}
            {timetableCategory === 'city' && cityTransportType === 'public' && cityPublicMode === 'metro' && (
              <>
                {/* Metro Service Timings Card */}
                <Card className="border-blue-150/40 shadow-xs relative overflow-hidden">
                  {/* Decorative element */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-8 -mt-8 pointer-events-none" />

                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-text-primary">
                    <Clock className="w-5 h-5 text-blue-600" /> Metro Service Timings
                  </h3>
                  
                  {/* Live Status Widget */}
                  <div className={`p-3 rounded-2xl border mb-4 flex items-center justify-between transition-all duration-300 ${
                    metroLiveStatus.active 
                      ? 'bg-emerald-50/70 border-emerald-100 text-emerald-950 shadow-xs' 
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                    <div className="flex items-center gap-3">
                      {/* Pulse Status Light */}
                      <span className="relative flex h-3.5 w-3.5 shrink-0">
                        {metroLiveStatus.active && (
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        )}
                        <span className={`relative inline-flex rounded-full h-3.5 w-3.5 ${
                          metroLiveStatus.active ? 'bg-emerald-500' : 'bg-slate-400'
                        }`}></span>
                      </span>
                      
                      <div className="flex flex-col">
                        <span className="text-xs font-black tracking-wide uppercase leading-none mb-1">
                          {metroLiveStatus.active ? 'Live Service: Active' : 'Live Service: Closed'}
                        </span>
                        <span className="text-[10px] font-medium opacity-80 leading-none">
                          {metroLiveStatus.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right flex flex-col justify-center items-end">
                      <span className="text-[9px] font-bold uppercase tracking-wider opacity-60 leading-none mb-1">Current Frequency</span>
                      <span className="text-xs font-extrabold font-mono tracking-tight leading-none bg-white/60 px-2 py-1 rounded-md border border-white/40 shadow-2xs">
                        {metroLiveStatus.frequency}
                      </span>
                    </div>
                  </div>

                  {/* Schedule Segment Selector */}
                  <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl mb-4 text-xs font-bold">
                    <button
                      onClick={() => setScheduleDayTab('weekday')}
                      className={`py-1.5 rounded-lg text-center transition-all ${
                        scheduleDayTab === 'weekday'
                          ? 'bg-white text-indigo-950 shadow-xs'
                          : 'text-text-muted hover:text-text-primary'
                      }`}
                    >
                      Weekdays & Saturdays
                    </button>
                    <button
                      onClick={() => setScheduleDayTab('weekend')}
                      className={`py-1.5 rounded-lg text-center transition-all ${
                        scheduleDayTab === 'weekend'
                          ? 'bg-white text-indigo-950 shadow-xs'
                          : 'text-text-muted hover:text-text-primary'
                      }`}
                    >
                      Sundays & Holidays
                    </button>
                  </div>

                  {/* Timings Visual Display */}
                  <div className="space-y-3">
                    {scheduleDayTab === 'weekday' ? (
                      <>
                        {/* Peak hours Card */}
                        <div className={`p-3 rounded-2xl border transition-all duration-300 ${
                          metroLiveStatus.type === 'peak'
                            ? 'bg-sky-50/70 border-sky-300 ring-2 ring-sky-200/50 shadow-xs'
                            : 'bg-white border-slate-100 hover:border-slate-200 shadow-2xs'
                        }`}>
                          <div className="flex justify-between items-start">
                            <div className="flex gap-2.5 items-center">
                              {/* Custom Lightning Bolt SVG */}
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                metroLiveStatus.type === 'peak' ? 'bg-sky-500 text-white' : 'bg-sky-50 text-sky-600'
                              }`}>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M11 21h-1l1-7H5.5L13 3h1l-1 7h5.5L11 21z" />
                                </svg>
                              </div>
                              <div>
                                <h4 className="text-xs font-extrabold text-text-primary flex items-center gap-1.5">
                                  Peak Commute
                                  {metroLiveStatus.type === 'peak' && (
                                    <span className="text-[7.5px] font-bold text-sky-600 bg-sky-100 px-1.5 py-0.5 rounded-full uppercase leading-none tracking-wide animate-pulse">Now</span>
                                  )}
                                </h4>
                                <p className="text-[10px] text-text-muted font-medium mt-0.5">
                                  08:00 AM - 11:00 AM &bull; 05:00 PM - 08:00 PM
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`text-[10px] font-black uppercase tracking-wider block leading-none mb-0.5 ${
                                metroLiveStatus.type === 'peak' ? 'text-sky-700' : 'text-slate-400'
                              }`}>Interval</span>
                              <span className="text-xs font-black font-mono tracking-tight text-text-primary">Every 5 mins</span>
                            </div>
                          </div>
                        </div>

                        {/* Standard hours Card */}
                        <div className={`p-3 rounded-2xl border transition-all duration-300 ${
                          metroLiveStatus.type === 'standard'
                            ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-200/50 shadow-xs'
                            : 'bg-white border-slate-100 hover:border-slate-200 shadow-2xs'
                        }`}>
                          <div className="flex justify-between items-start">
                            <div className="flex gap-2.5 items-center">
                              {/* Custom Standard clock SVG */}
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                metroLiveStatus.type === 'standard' ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-600'
                              }`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                  <circle cx="12" cy="12" r="10" />
                                  <path d="M12 6v6l4 2" strokeLinecap="round" />
                                </svg>
                              </div>
                              <div>
                                <h4 className="text-xs font-extrabold text-text-primary flex items-center gap-1.5">
                                  Standard Frequency
                                  {metroLiveStatus.type === 'standard' && (
                                    <span className="text-[7.5px] font-bold text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded-full uppercase leading-none tracking-wide animate-pulse">Now</span>
                                  )}
                                </h4>
                                <p className="text-[10px] text-text-muted font-medium mt-0.5">
                                  Early morning, mid-day, and evening services
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`text-[10px] font-black uppercase tracking-wider block leading-none mb-0.5 ${
                                metroLiveStatus.type === 'standard' ? 'text-indigo-700' : 'text-slate-400'
                              }`}>Interval</span>
                              <span className="text-xs font-black font-mono tracking-tight text-text-primary">Every 9 mins</span>
                            </div>
                          </div>
                        </div>

                        {/* Late Night hours Card */}
                        <div className={`p-3 rounded-2xl border transition-all duration-300 ${
                          metroLiveStatus.type === 'latenight'
                            ? 'bg-slate-50/70 border-slate-300 ring-2 ring-slate-200/50 shadow-xs'
                            : 'bg-white border-slate-100 hover:border-slate-200 shadow-2xs'
                        }`}>
                          <div className="flex justify-between items-start">
                            <div className="flex gap-2.5 items-center">
                              {/* Custom Moon SVG */}
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                metroLiveStatus.type === 'latenight' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                              }`}>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 3a9 9 0 109 9 9.75 9.75 0 01-9-9z" />
                                </svg>
                              </div>
                              <div>
                                <h4 className="text-xs font-extrabold text-text-primary flex items-center gap-1.5">
                                  Late Night Commute
                                  {metroLiveStatus.type === 'latenight' && (
                                    <span className="text-[7.5px] font-bold text-slate-900 bg-slate-200 px-1.5 py-0.5 rounded-full uppercase leading-none tracking-wide animate-pulse">Now</span>
                                  )}
                                </h4>
                                <p className="text-[10px] text-text-muted font-medium mt-0.5">
                                  10:00 PM - 11:00 PM
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`text-[10px] font-black uppercase tracking-wider block leading-none mb-0.5 ${
                                metroLiveStatus.type === 'latenight' ? 'text-slate-900' : 'text-slate-400'
                              }`}>Interval</span>
                              <span className="text-xs font-black font-mono tracking-tight text-text-primary">Every 15 mins</span>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Sunday & Holidays Card */}
                        <div className={`p-3 rounded-2xl border transition-all duration-300 ${
                          metroLiveStatus.type === 'sunday'
                            ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-200/50 shadow-xs'
                            : 'bg-white border-slate-100 hover:border-slate-200 shadow-2xs'
                        }`}>
                          <div className="flex justify-between items-start">
                            <div className="flex gap-2.5 items-center">
                              {/* Custom Sun/Calendar SVG */}
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                metroLiveStatus.type === 'sunday' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-600'
                              }`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                                </svg>
                              </div>
                              <div>
                                <h4 className="text-xs font-extrabold text-text-primary flex items-center gap-1.5">
                                  Sundays & Holidays
                                  {metroLiveStatus.type === 'sunday' && (
                                    <span className="text-[7.5px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-full uppercase leading-none tracking-wide animate-pulse">Now</span>
                                  )}
                                </h4>
                                <p className="text-[10px] text-text-muted font-medium mt-0.5">
                                  Operating Hours: 08:00 AM - 10:00 PM
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`text-[10px] font-black uppercase tracking-wider block leading-none mb-0.5 ${
                                metroLiveStatus.type === 'sunday' ? 'text-amber-700' : 'text-slate-400'
                              }`}>Interval</span>
                              <span className="text-xs font-black font-mono tracking-tight text-text-primary">Every 10 mins</span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </Card>

                {/* Metro Network Route Map Card */}
                <Card className="border-blue-100">
                  <div className="flex justify-between items-center mb-3 border-b border-slate-100 pb-2">
                    <h3 className="text-base font-black flex items-center gap-2 text-text-primary">
                      <Map className="w-5 h-5 text-blue-600" /> Metro Network Map
                    </h3>
                    
                    {/* Zoom Controls */}
                    <div className="flex items-center gap-1.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                      <button
                        onClick={() => setMapScale(prev => Math.max(prev - 0.2, 0.6))}
                        className="w-6 h-6 flex items-center justify-center rounded bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-200 shadow-2xs text-xs active:scale-95 transition-all cursor-pointer"
                        title="Zoom Out"
                      >
                        -
                      </button>
                      <span className="text-[10px] font-mono font-bold text-slate-600 w-10 text-center select-none">
                        {Math.round(mapScale * 100)}%
                      </span>
                      <button
                        onClick={() => setMapScale(prev => Math.min(prev + 0.2, 3))}
                        className="w-6 h-6 flex items-center justify-center rounded bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-200 shadow-2xs text-xs active:scale-95 transition-all cursor-pointer"
                        title="Zoom In"
                      >
                        +
                      </button>
                      <button
                        onClick={() => setMapScale(1)}
                        className="w-6 h-6 flex items-center justify-center rounded bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold text-[10px] active:scale-95 transition-all ml-0.5 cursor-pointer"
                        title="Reset Zoom"
                      >
                        ↺
                      </button>
                    </div>
                  </div>

                  <div 
                    ref={metroLineMapContainerRef}
                    onMouseDown={handleMapMouseDown}
                    onMouseMove={handleMapMouseMove}
                    onMouseUp={handleMapMouseUpOrLeave}
                    onMouseLeave={handleMapMouseUpOrLeave}
                    className="relative overflow-auto max-h-[460px] border border-slate-100 rounded-xl bg-slate-50/50 p-2 flex items-start justify-start shadow-inner select-none [&::-webkit-scrollbar]:hidden"
                    style={{ 
                      scrollbarWidth: 'none', 
                      msOverflowStyle: 'none', 
                      cursor: mapScale > 1 ? 'grab' : 'default' 
                    }}
                  >
                    <div 
                      className="transition-all duration-200 ease-out origin-top-left shrink-0"
                      style={{ width: `${mapScale * 100}%`, minWidth: '100%' }}
                    >
                      <img 
                        src="/chennai-metro-line-map.svg" 
                        alt="Chennai Metro Route Map" 
                        className="w-full h-auto rounded-lg select-none" 
                        draggable="false"
                      />
                    </div>
                  </div>
                </Card>

              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
