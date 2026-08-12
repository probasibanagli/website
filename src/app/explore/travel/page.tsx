'use client';

import React, { useState, useEffect } from 'react';
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

      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left/Middle Content Area based on Selected Tab */}
          <div className="lg:col-span-2 space-y-6">

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


            {/* Glassmorphic SBI NCMC Card & Tamil Helper */}
          </div>

          {/* Right Column: Timings, Route Map, NCMC and Tamil Word Helper */}
          <div className="space-y-6 lg:sticky lg:top-8 h-fit">
            {/* SBI NCMC Smart Card - Only shown when Chennai Metro is selected */}
            {timetableCategory === 'city' && cityTransportType === 'public' && cityPublicMode === 'metro' && (
              <Card className="relative overflow-hidden border-indigo-150/40 shadow-xs">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-text-primary">
                  <CreditCard className="w-5 h-5 text-indigo-600 animate-pulse" /> SBI NCMC Card
                </h3>
                <p className="text-xs text-text-muted mb-4 font-medium">National Common Mobility Card (NCMC) for unified transit. Click card to flip.</p>
                
                <div className="flip-card-container h-[200px]" onClick={() => setIsNcmcFlipped(!isNcmcFlipped)}>
                  <div className={`flip-card-inner h-full ${isNcmcFlipped ? 'flipped' : ''}`}>
                    {/* Front Side */}
                    <div className="flip-card-front absolute inset-0 w-full h-full backface-hidden rounded-3xl p-5 text-white flex flex-col justify-between shadow-xl select-none bg-gradient-to-br from-blue-900/60 to-indigo-950/60 backdrop-blur-xl border border-white/20">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-black tracking-widest text-indigo-200 block uppercase">State Bank of India</span>
                          <span className="text-[8px] font-semibold text-slate-300 block">Chennai Metro Transit</span>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                          <CreditCard className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      
                      <div className="my-2">
                        <div className="text-lg font-mono font-bold tracking-widest text-slate-100">
                          4321 9876 5432 1098
                        </div>
                        <div className="flex gap-4 mt-1 text-[9px] font-semibold text-indigo-200">
                          <div>
                            VAL THRU <span className="text-white ml-1">12/31</span>
                          </div>
                          <div>
                            CVV <span className="text-white ml-1">•••</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-end border-t border-white/10 pt-2.5">
                        <div>
                          <span className="text-[10px] font-black tracking-wide text-indigo-100 uppercase block">Chennai Commuter</span>
                          <span className="text-[8px] font-normal text-slate-300 block">NCMC Wallet Enabled</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] font-extrabold tracking-wide text-white bg-indigo-600 px-2 py-0.5 rounded-md border border-indigo-400/30">
                            RuPay
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Back Side */}
                    <div className="flip-card-back absolute inset-0 w-full h-full backface-hidden rounded-3xl p-5 text-white flex flex-col justify-between shadow-xl select-none bg-gradient-to-br from-slate-900/60 to-slate-950/60 backdrop-blur-xl border border-white/20">
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
                          href="https://metro.sbi/online-recharge" 
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
              </Card>
            )}

            {/* Metro Service Timings & Network Map - Only shown when Chennai Metro is selected */}
            {timetableCategory === 'city' && cityTransportType === 'public' && cityPublicMode === 'metro' && (
              <>
                {/* Metro Service Timings Card */}
                <Card className="border-blue-100">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-text-primary border-b border-slate-100 pb-2">
                    <Clock className="w-5 h-5 text-blue-600" /> Metro Service Timings
                  </h3>
                  <div className="space-y-4 text-xs text-text-muted font-medium">
                    <div>
                      <strong className="text-text-primary block mb-1">Weekdays & Saturdays:</strong>
                      <p>• Operating Hours: 05:00 AM - 11:00 PM</p>
                      <p className="mt-1">• Peak Hours (08:00 AM - 11:00 AM, 05:00 PM - 08:00 PM): Every 5 mins</p>
                      <p className="mt-1">• Non-Peak Hours: Every 9 mins</p>
                      <p className="mt-1">• Late Night (10:00 PM - 11:00 PM): Every 15 mins</p>
                    </div>
                    <div className="border-t border-slate-100 pt-3">
                      <strong className="text-text-primary block mb-1">Sundays & Public Holidays:</strong>
                      <p>• Operating Hours: 08:00 AM - 10:00 PM</p>
                      <p className="mt-1">• Frequency: Every 10 mins throughout the day</p>
                    </div>
                  </div>
                </Card>

                {/* Metro Network Route Map Card */}
                <Card className="border-blue-100">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-text-primary border-b border-slate-100 pb-2">
                    <Map className="w-5 h-5 text-blue-600" /> Metro Network Map
                  </h3>
                  <div className="space-y-2">
                    <img src="/chennai-metro-route.png" alt="Chennai Metro Route Map" className="w-full rounded-xl border border-border shadow-sm hover:scale-[1.02] transition-transform duration-300" />
                  </div>
                </Card>
              </>
            )}

            {/* Tamil & Bengali Word Helper Carousel - Shown only when Chennai Metro is NOT selected */}
            {!(timetableCategory === 'city' && cityTransportType === 'public' && cityPublicMode === 'metro') && (
              <Card className="relative overflow-hidden border-primary/20 shadow-xs">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
                <h3 className="text-lg font-bold mb-2 inline-flex items-center gap-2 text-text-primary">
                  <Megaphone className="w-5 h-5 text-primary" /> Tamil & Bengali Word Helper
                </h3>
                <p className="text-xs text-text-muted mb-4 font-medium">Flashcards for daily commute phrases. Click the speaker to hear pronunciation.</p>
                
                {TAMIL_WORDS.length > 0 && (() => {
                  const BENGALI_MEANINGS: Record<string, string> = {
                    'Hello / Welcome': 'স্বাগতম / নমস্কার',
                    'Thank you': 'ধন্যবাদ',
                    'How much?': 'কত দাম?',
                    'When will it come?': 'কখন আসবে?',
                    'Where is it?': 'কোথায় আছে?',
                    'Money': 'টাকা / পয়সা',
                    'Will auto come?': 'অটো কি আসবে?',
                    'I need water': 'আমার জল লাগবে',
                    'Food / Meal': 'খাবার / ভাত',
                    'Bus station': 'বাস স্টেশন',
                    'Hospital': 'হাসপাতাল',
                    'Help!': 'সাহায্য!',
                    'I need to go home': 'আমি বাড়ি যেতে চাই',
                    'Very good!': 'খুব ভালো!',
                    "I don't understand": 'বুঝতে পারছি না',
                    'One moment': 'এক মিনিট',
                  };
                  const currentWord = TAMIL_WORDS[currentTamilIdx] || TAMIL_WORDS[0];
                  return (
                    <div className="relative bg-slate-50 border border-slate-150 rounded-2xl p-5 text-center min-h-[170px] flex flex-col justify-between shadow-inner">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                          {currentTamilIdx + 1} of {TAMIL_WORDS.length}
                        </span>
                        <button
                          type="button"
                          onClick={() => speakWord(currentWord.tamil)}
                          className="p-1.5 rounded-lg bg-primary-light hover:bg-primary/15 text-primary border border-primary/10 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
                          title="Listen Tamil Pronunciation"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="my-2 space-y-1">
                        <div className="text-xl font-extrabold text-slate-800">
                          {currentWord.pronunciation}
                        </div>
                        <div className="text-xs font-bold text-primary font-tamil tracking-wider">
                          {currentWord.tamil}
                        </div>
                        
                        {/* Bengali equivalent */}
                        <div className="pt-2 border-t border-dashed border-slate-200/60 mt-2 space-y-1 bg-white/50 p-2 rounded-xl border border-slate-100">
                          <div className="text-xs text-slate-500 font-semibold">
                            উচ্চারণ: <span className="text-slate-800 font-bold font-bengali">{currentWord.bengali || ''}</span>
                          </div>
                          <div className="text-xs text-slate-500 font-semibold">
                            অর্থ: <span className="text-primary-dark font-bold font-bengali">{BENGALI_MEANINGS[currentWord.meaning] || currentWord.meaning}</span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-slate-200/50 pt-2 text-xs font-semibold text-text-muted">
                        English Meaning: <span className="text-slate-700 font-bold">{currentWord.meaning}</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Navigation controls */}
                <div className="flex justify-between items-center mt-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentTamilIdx((prev) => (prev - 1 + TAMIL_WORDS.length) % TAMIL_WORDS.length)}
                    className="px-3 py-1.5 border border-border bg-white text-xs font-bold rounded-lg hover:bg-slate-50 cursor-pointer transition-colors shadow-2xs"
                  >
                    ← Prev
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentTamilIdx((prev) => (prev + 1) % TAMIL_WORDS.length)}
                    className="px-3 py-1.5 border border-border bg-white text-xs font-bold rounded-lg hover:bg-slate-50 cursor-pointer transition-colors shadow-2xs"
                  >
                    Next →
                  </button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
