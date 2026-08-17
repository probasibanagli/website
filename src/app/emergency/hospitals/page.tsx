'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, Phone, Clock, CheckCircle2, Stethoscope, Ambulance, LifeBuoy, Building2, UserRound, ArrowRight, ShieldAlert, Lock, Users, ShieldCheck, Mail, GraduationCap, Pill, Truck, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/card';
import { CITIES } from '@/lib/constants';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { COLLECTIONS } from '@/lib/firestore/collections';
import type { Hospital, BengaliDoctor, BengaliStaff, Pharmacy } from '@/types';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { WordHelper } from '@/components/ui/WordHelper';
import { MEDICAL_VOCABULARY, MEDICAL_PHRASES, ALL_HOSPITAL_TRANSLATION_CARDS } from '@/data/hospital-words';

const PREDEFINED_SPECIALIZATIONS = [
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Oncology',
  'Emergency Medicine'
];

const PREDEFINED_DEPARTMENTS = [
  'Reception',
  'Nursing',
  'Pharmacy',
  'Laboratory',
  'Radiology',
  'Administration',
  'Billing',
  'Emergency',
  'ICU',
  'Blood Bank',
  'Maintenance',
  'Security'
];

const SAMPLE_DOCTORS: BengaliDoctor[] = [];
const SAMPLE_STAFF: BengaliStaff[] = [];

const SAMPLE_GOVT_PHARMACIES: Pharmacy[] = [
  {
    id: 'jan-aushadhi-t-nagar',
    name: 'Jan Aushadhi Kendra - T. Nagar',
    government_level: 'Central Government',
    scheme_name: 'PMBJP – Jan Aushadhi',
    pharmacy_type: 'Jan Aushadhi Kendra',
    medicine_name: 'Paracetamol 500mg, Metformin 500mg, Generic Essential Medicines',
    mrp: 50,
    offer_price: 10,
    stock: 'In Stock',
    state: 'Tamil Nadu',
    district: 'Chennai',
    city: 'Chennai',
    area: 'T. Nagar',
    pin_code: '600017',
    phone: '044-24341001',
    address: 'Pondy Bazaar, T. Nagar, Chennai',
    is_24_7: true,
    home_delivery: false,
    opening_time: '08:00 AM',
    closing_time: '10:00 PM',
    description: 'Central Government Jan Aushadhi Kendra in T. Nagar providing quality generic medicines at 50%-90% lower price than market MRP.',
    google_maps_url: 'https://maps.google.com/?q=Jan+Aushadhi+Kendra+T+Nagar+Chennai'
  },
  {
    id: 'jan-aushadhi-anna-nagar',
    name: 'Jan Aushadhi Kendra - Anna Nagar',
    government_level: 'Central Government',
    scheme_name: 'PMBJP – Jan Aushadhi',
    pharmacy_type: 'Jan Aushadhi Kendra',
    medicine_name: 'Atorvastatin 10mg, Amlodipine 5mg, Essential Generic Drugs',
    mrp: 80,
    offer_price: 15,
    stock: 'In Stock',
    state: 'Tamil Nadu',
    district: 'Chennai',
    city: 'Chennai',
    area: 'Anna Nagar',
    pin_code: '600040',
    phone: '044-26210001',
    address: '2nd Avenue, Near Roundtana, Anna Nagar, Chennai',
    is_24_7: true,
    home_delivery: false,
    opening_time: '08:00 AM',
    closing_time: '10:00 PM',
    description: 'Central Government Jan Aushadhi Kendra in Anna Nagar supplying affordable generic medications.',
    google_maps_url: 'https://maps.google.com/?q=Jan+Aushadhi+Kendra+Anna+Nagar+Chennai'
  },
  {
    id: 'jan-aushadhi-velachery',
    name: 'Jan Aushadhi Kendra - Velachery',
    government_level: 'Central Government',
    scheme_name: 'PMBJP – Jan Aushadhi',
    pharmacy_type: 'Jan Aushadhi Kendra',
    medicine_name: 'Insulin Glargine, Telmisartan 40mg, Generic Cardiac Drugs',
    mrp: 250,
    offer_price: 50,
    stock: 'In Stock',
    state: 'Tamil Nadu',
    district: 'Chennai',
    city: 'Chennai',
    area: 'Velachery',
    pin_code: '600042',
    phone: '044-22430002',
    address: 'Velachery Main Road, Near Railway Station, Velachery, Chennai',
    is_24_7: false,
    home_delivery: false,
    opening_time: '08:30 AM',
    closing_time: '09:30 PM',
    description: 'Central Government Jan Aushadhi Kendra in Velachery supplying low-cost generic pharmaceuticals.',
    google_maps_url: 'https://maps.google.com/?q=Jan+Aushadhi+Kendra+Velachery+Chennai'
  },
  {
    id: 'jan-aushadhi-adyar',
    name: 'Jan Aushadhi Kendra - Adyar',
    government_level: 'Central Government',
    scheme_name: 'PMBJP – Jan Aushadhi',
    pharmacy_type: 'Jan Aushadhi Kendra',
    medicine_name: 'Multivitamins, Pain Relief, Diabetes Medicines',
    mrp: 100,
    offer_price: 20,
    stock: 'In Stock',
    state: 'Tamil Nadu',
    district: 'Chennai',
    city: 'Chennai',
    area: 'Adyar',
    pin_code: '600020',
    phone: '044-24410003',
    address: 'LB Road, Signal Junction, Adyar, Chennai',
    is_24_7: true,
    home_delivery: false,
    opening_time: '08:00 AM',
    closing_time: '10:00 PM',
    description: 'Central Government Jan Aushadhi Kendra in Adyar offering generic medicines at subsidized rates.',
    google_maps_url: 'https://maps.google.com/?q=Jan+Aushadhi+Kendra+Adyar+Chennai'
  },
  {
    id: 'jan-aushadhi-guindy',
    name: 'Jan Aushadhi Kendra - Guindy',
    government_level: 'Central Government',
    scheme_name: 'PMBJP – Jan Aushadhi',
    pharmacy_type: 'Jan Aushadhi Kendra',
    medicine_name: 'Generic Antibiotics, Antacids, BP Care',
    mrp: 110,
    offer_price: 22,
    stock: 'In Stock',
    state: 'Tamil Nadu',
    district: 'Chennai',
    city: 'Chennai',
    area: 'Guindy',
    pin_code: '600032',
    phone: '044-22500004',
    address: 'GST Road, Near Kathipara Junction, Guindy, Chennai',
    is_24_7: true,
    home_delivery: false,
    opening_time: '08:00 AM',
    closing_time: '10:00 PM',
    description: 'Central Government Jan Aushadhi Kendra near Guindy Industrial Estate.',
    google_maps_url: 'https://maps.google.com/?q=Jan+Aushadhi+Kendra+Guindy+Chennai'
  },
  {
    id: 'mudhalvar-marundhagam-nungambakkam',
    name: 'Mudhalvar Marundhagam - Nungambakkam',
    government_level: 'State Government',
    scheme_name: 'Mudhalvar Marundhagam',
    pharmacy_type: 'Mudhalvar Marundhagam',
    medicine_name: 'Subsidized Essential & Chronic Care Drugs',
    mrp: 140,
    offer_price: 28,
    stock: 'In Stock',
    state: 'Tamil Nadu',
    district: 'Chennai',
    city: 'Chennai',
    area: 'Nungambakkam',
    pin_code: '600034',
    phone: '044-28270005',
    address: 'Nungambakkam High Road, Nungambakkam, Chennai',
    is_24_7: true,
    home_delivery: true,
    opening_time: '08:00 AM',
    closing_time: '10:00 PM',
    description: 'Tamil Nadu State Government Mudhalvar Marundhagam providing affordable generic and essential medications.',
    google_maps_url: 'https://maps.google.com/?q=Mudhalvar+Marundhagam+Nungambakkam+Chennai'
  },
  {
    id: 'mudhalvar-marundhagam-ashok-nagar',
    name: 'Mudhalvar Marundhagam - Ashok Nagar',
    government_level: 'State Government',
    scheme_name: 'Mudhalvar Marundhagam',
    pharmacy_type: 'Mudhalvar Marundhagam',
    medicine_name: 'Generic Anti-Diabetic & Cardiac Medicines',
    mrp: 130,
    offer_price: 26,
    stock: 'In Stock',
    state: 'Tamil Nadu',
    district: 'Chennai',
    city: 'Chennai',
    area: 'Ashok Nagar',
    pin_code: '600083',
    phone: '044-24710006',
    address: '1st Avenue, Near Pillar, Ashok Nagar, Chennai',
    is_24_7: true,
    home_delivery: true,
    opening_time: '08:00 AM',
    closing_time: '10:00 PM',
    description: 'TN State Government Mudhalvar Marundhagam branch in Ashok Nagar.',
    google_maps_url: 'https://maps.google.com/?q=Mudhalvar+Marundhagam+Ashok+Nagar+Chennai'
  },
  {
    id: 'mudhalvar-marundhagam-tambaram',
    name: 'Mudhalvar Marundhagam - Tambaram',
    government_level: 'State Government',
    scheme_name: 'Mudhalvar Marundhagam',
    pharmacy_type: 'Mudhalvar Marundhagam',
    medicine_name: 'Multivitamins, Antibiotics, BP & Diabetes Medicines',
    mrp: 90,
    offer_price: 18,
    stock: 'In Stock',
    state: 'Tamil Nadu',
    district: 'Chengalpattu',
    city: 'Chennai',
    area: 'Tambaram',
    pin_code: '600045',
    phone: '044-22260003',
    address: 'GST Road, Near Railway Station, Tambaram, Chennai',
    is_24_7: false,
    home_delivery: true,
    opening_time: '08:30 AM',
    closing_time: '09:30 PM',
    description: 'TN State Government Mudhalvar Marundhagam providing affordable essential health supplies.',
    google_maps_url: 'https://maps.google.com/?q=Mudhalvar+Marundhagam+Tambaram+Chennai'
  },
  {
    id: 'mudhalvar-marundhagam-perambur',
    name: 'Mudhalvar Marundhagam - Perambur',
    government_level: 'State Government',
    scheme_name: 'Mudhalvar Marundhagam',
    pharmacy_type: 'Mudhalvar Marundhagam',
    medicine_name: 'Generic Fever, Pain Relief & Pediatric Medicines',
    mrp: 75,
    offer_price: 15,
    stock: 'In Stock',
    state: 'Tamil Nadu',
    district: 'Chennai',
    city: 'Chennai',
    area: 'Perambur',
    pin_code: '600011',
    phone: '044-25510007',
    address: 'Paper Mills Road, Perambur, Chennai',
    is_24_7: false,
    home_delivery: true,
    opening_time: '08:30 AM',
    closing_time: '09:30 PM',
    description: 'State Government Mudhalvar Marundhagam branch in Perambur.',
    google_maps_url: 'https://maps.google.com/?q=Mudhalvar+Marundhagam+Perambur+Chennai'
  },
  {
    id: 'mudhalvar-marundhagam-mogappair',
    name: 'Mudhalvar Marundhagam - Mogappair',
    government_level: 'State Government',
    scheme_name: 'Mudhalvar Marundhagam',
    pharmacy_type: 'Mudhalvar Marundhagam',
    medicine_name: 'Generic Maintenance & Prescription Drugs',
    mrp: 95,
    offer_price: 19,
    stock: 'In Stock',
    state: 'Tamil Nadu',
    district: 'Chennai',
    city: 'Chennai',
    area: 'Mogappair',
    pin_code: '600037',
    phone: '044-26560008',
    address: 'Mogappair West Main Road, Mogappair, Chennai',
    is_24_7: true,
    home_delivery: true,
    opening_time: '08:00 AM',
    closing_time: '10:00 PM',
    description: 'State Government Mudhalvar Marundhagam outlet in Mogappair.',
    google_maps_url: 'https://maps.google.com/?q=Mudhalvar+Marundhagam+Mogappair+Chennai'
  }
];

function ListingCoverImage({ name, city, mapsUrl, imageUrl, fallbackIcon }: { 
  name: string; 
  city?: string; 
  mapsUrl?: string; 
  imageUrl?: string;
  fallbackIcon: React.ReactNode;
}) {
  const getFallbackImg = (hName: string) => {
    const lower = hName.toLowerCase();
    if (lower.includes('apollo')) return 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&auto=format&fit=crop&q=80';
    if (lower.includes('mgm')) return 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80';
    if (lower.includes('miot')) return 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80';
    if (lower.includes('fortis')) return 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&auto=format&fit=crop&q=80';
    if (lower.includes('kauvery')) return 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop&q=80';
    if (lower.includes('rela')) return 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80';
    if (lower.includes('ramachandra')) return 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&auto=format&fit=crop&q=80';
    if (lower.includes('cmc')) return 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80';
    if (lower.includes('cancer') || lower.includes('adyar')) return 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&auto=format&fit=crop&q=80';
    return 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&auto=format&fit=crop&q=80';
  };

  const primarySrc = imageUrl || (mapsUrl ? `/api/public/place-photo?name=${encodeURIComponent(name)}&city=${encodeURIComponent(city || '')}&mapsUrl=${encodeURIComponent(mapsUrl)}&v=3` : getFallbackImg(name));
  const [currentSrc, setCurrentSrc] = useState(primarySrc);
  const [failedOnce, setFailedOnce] = useState(false);
  const [error, setError] = useState(false);

  React.useEffect(() => {
    setCurrentSrc(imageUrl || getFallbackImg(name));
    setError(false);
    setFailedOnce(false);
  }, [imageUrl, name]);

  const handleImgError = () => {
    if (!failedOnce) {
      setFailedOnce(true);
      setCurrentSrc(getFallbackImg(name));
    } else {
      setError(true);
    }
  };

  if (error || !currentSrc) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-red-500 opacity-40 scale-[2.5]">
          {fallbackIcon}
        </div>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={name}
      onError={handleImgError}
      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      loading="lazy"
    />
  );
}

export default function EmergencyHospitalsPage() {
  const { firebaseUser: user } = useAuth();
  const router = useRouter();
  const [searchTab, setSearchTab] = useState<'hospitals' | 'doctors' | 'staff' | 'pharmacies'>('hospitals');
  
  // State lists
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [doctors, setDoctors] = useState<BengaliDoctor[]>([]);
  const [staff, setStaff] = useState<BengaliStaff[]>([]);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [twentyFourSevenFilter, setTwentyFourSevenFilter] = useState(false);
  const [deliveryFilter, setDeliveryFilter] = useState(false);

  // OTP Gating
  const isVerified = !!user;

  useEffect(() => {
    const fetchData = async () => {
      try {
        let hData: Hospital[] = [];
        let dData: BengaliDoctor[] = [];
        let sData: BengaliStaff[] = [];
        let pData: Pharmacy[] = [];

        try {
          const [hRes, dRes, sRes, pRes] = await Promise.all([
            fetch(`/api/public/firestore?collection=hospitals`),
            fetch(`/api/public/firestore?collection=bengali_doctors`),
            fetch(`/api/public/firestore?collection=bengali_staff`),
            fetch(`/api/public/firestore?collection=pharmacies`).catch(() => null)
          ]);

          if (hRes && hRes.ok) {
            const hJson = await hRes.json();
            if (!hJson.fallback && Array.isArray(hJson.items)) {
              hData = hJson.items;
            }
          }
          if (dRes && dRes.ok) {
            const dJson = await dRes.json();
            if (!dJson.fallback && Array.isArray(dJson.items)) {
              dData = dJson.items;
            }
          }
          if (sRes && sRes.ok) {
            const sJson = await sRes.json();
            if (!sJson.fallback && Array.isArray(sJson.items)) {
              sData = sJson.items;
            }
          }
          if (pRes && pRes.ok) {
            const pJson = await pRes.json();
            if (!pJson.fallback && Array.isArray(pJson.items)) {
              pData = pJson.items;
            }
          }
        } catch (apiErr) {
          console.warn("Public API fetch failed, falling back to client-side Firestore:", apiErr);
        }

        // Fallback to client-side Firestore query if array empty
        if (hData.length === 0) {
          const hSnap = await getDocs(collection(db, COLLECTIONS.hospitals)).catch(() => ({ docs: [] }));
          hData = hSnap.docs.map(d => ({ id: d.id, ...d.data() } as Hospital));
        }
        if (dData.length === 0) {
          const dSnap = await getDocs(collection(db, COLLECTIONS.bengali_doctors)).catch(() => ({ docs: [] }));
          dData = dSnap.docs.map(d => ({ id: d.id, ...d.data() } as BengaliDoctor));
        }
        if (sData.length === 0) {
          const sSnap = await getDocs(collection(db, COLLECTIONS.bengali_staff || 'bengali_staff')).catch(() => ({ docs: [] }));
          sData = sSnap.docs.map(d => ({ id: d.id, ...d.data() } as BengaliStaff));
        }
        if (pData.length === 0) {
          const pSnap = await getDocs(collection(db, COLLECTIONS.pharmacies || 'pharmacies')).catch(() => ({ docs: [] }));
          pData = pSnap.docs.map(d => ({ id: d.id, ...d.data() } as Pharmacy));
        }
        if (pData.length === 0) {
          pData = SAMPLE_GOVT_PHARMACIES;
        }

        setHospitals(hData);
        setDoctors(dData);
        setStaff(sData);
        setPharmacies(pData);
      } catch (err) {
        console.error("Error fetching database documents", err);
        setHospitals([]);
        setDoctors([]);
        setStaff([]);
        setPharmacies(SAMPLE_GOVT_PHARMACIES);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const triggerVerification = (doctorId?: string) => {
    router.push('/auth/login?redirect=/emergency/hospitals');
  };

  const hospitalMap = useMemo(() => new Map(hospitals.map(h => [h.id, h])), [hospitals]);

  // ── FILTER LOGIC ──
  
  // Hospital Filter
  const filteredHospitals = useMemo(() => {
    return hospitals.filter((h) => {
      const matchesSearch = !searchQuery || h.name.toLowerCase().includes(searchQuery.toLowerCase()) || (h.area && h.area.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesSpec = !specializationFilter || (h.specializations && h.specializations.includes(specializationFilter));
      const matchesCategory = !categoryFilter || h.category === categoryFilter;
      const matchesCity = !cityFilter || h.city === cityFilter;
      const isActive = !h.status || h.status === 'Active';
      return matchesSearch && matchesSpec && matchesCategory && matchesCity && isActive;
    });
  }, [hospitals, searchQuery, specializationFilter, categoryFilter, cityFilter]);

  // Doctor Filter (Display only one doctor for each hospital)
  const filteredDoctors = useMemo(() => {
    const list = doctors.filter((d) => {
      const docHospIds = d.hospital_ids || (d.hospital_id ? [d.hospital_id] : []);
      const matchesSearch = !searchQuery || d.doctor_name.toLowerCase().includes(searchQuery.toLowerCase()) || docHospIds.some(id => {
        const h = hospitalMap.get(id);
        return h && (h.name.toLowerCase().includes(searchQuery.toLowerCase()) || (h.area && h.area.toLowerCase().includes(searchQuery.toLowerCase())));
      });
      const matchesSpec = !specializationFilter || d.specialization === specializationFilter;
      
      const docHospitals = docHospIds.map(id => hospitalMap.get(id)).filter(Boolean);
      const matchesCategory = !categoryFilter || (docHospitals.length > 0 ? docHospitals.some(h => h?.category === categoryFilter) : true);
      const matchesCity = !cityFilter || (docHospitals.length > 0 ? docHospitals.some(h => h?.city === cityFilter) : true);

      return matchesSearch && matchesSpec && matchesCategory && matchesCity;
    });

    const seenHospitals = new Set<string>();
    const uniqueList: BengaliDoctor[] = [];
    
    for (const d of list) {
      const hospIds = d.hospital_ids || (d.hospital_id ? [d.hospital_id] : []);
      let shouldShow = false;
      
      if (hospIds.length === 0) {
        shouldShow = true; // Show doctors with no assigned hospitals
      } else {
        for (const hid of hospIds) {
          if (!seenHospitals.has(hid)) {
            shouldShow = true;
            seenHospitals.add(hid);
          }
        }
      }
      
      if (shouldShow) {
        uniqueList.push(d);
      }
    }
    return uniqueList;
  }, [doctors, searchQuery, specializationFilter, categoryFilter, cityFilter, hospitalMap]);

  // Staff Filter
  const filteredStaff = useMemo(() => {
    return staff.filter((s) => {
      const staffHosp = hospitalMap.get(s.hospital_id);
      const matchesSearch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || (s.role && s.role.toLowerCase().includes(searchQuery.toLowerCase())) || (staffHosp && (staffHosp.name.toLowerCase().includes(searchQuery.toLowerCase()) || (staffHosp.area && staffHosp.area.toLowerCase().includes(searchQuery.toLowerCase()))));
      const matchesDept = !departmentFilter || s.department === departmentFilter;
      const matchesSpec = !specializationFilter || s.department === specializationFilter || (s.role && s.role.toLowerCase().includes(specializationFilter.toLowerCase()));
      const matchesCategory = !categoryFilter || (staffHosp ? staffHosp.category === categoryFilter : true);
      const matchesCity = !cityFilter || (staffHosp ? staffHosp.city === cityFilter : true);

      return matchesSearch && matchesDept && matchesSpec && matchesCategory && matchesCity;
    });
  }, [staff, searchQuery, departmentFilter, specializationFilter, categoryFilter, cityFilter, hospitalMap]);

  // Government Pharmacy Filter State & Logic
  const [govtLevelFilter, setGovtLevelFilter] = useState<string>('All');

  const filteredPharmacies = useMemo(() => {
    return pharmacies.filter((p) => {
      const matchesGovt = govtLevelFilter === 'All' || !govtLevelFilter || p.government_level === govtLevelFilter;
      const matchesSearch = !searchQuery || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (p.scheme_name && p.scheme_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.medicine_name && p.medicine_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.area && p.area.toLowerCase().includes(searchQuery.toLowerCase())) || 
        (p.city && p.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.pin_code && p.pin_code.includes(searchQuery)) ||
        (p.hospital_name && p.hospital_name.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCity = !cityFilter || p.city === cityFilter;
      const matches247 = !twentyFourSevenFilter || p.is_24_7;
      const matchesDelivery = !deliveryFilter || p.home_delivery;
      return matchesGovt && matchesSearch && matchesCity && matches247 && matchesDelivery;
    });
  }, [pharmacies, govtLevelFilter, searchQuery, cityFilter, twentyFourSevenFilter, deliveryFilter]);

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-gradient-to-r from-red-50/70 to-orange-50/50 border-b border-red-100/50">
        <div className="w-full max-w-none px-4 sm:px-6 lg:px-[38px] pt-5 pb-3 sm:pt-6 sm:pb-4">
          <div className="flex items-center gap-2 text-sm text-red-600/70 mb-3 font-medium">
            <Link href="/" className="hover:text-red-600 transition-colors">Home</Link><span>/</span>
            <Link href="/emergency" className="hover:text-red-600 transition-colors">Emergency</Link><span>/</span>
            <span className="text-red-700 font-semibold">Hospital Services</span>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6 justify-between lg:items-start">
            <div className="max-w-2xl">
              <h1 className="text-3xl sm:text-4xl font-bold font-display text-text-primary flex items-center gap-3">
                <span>Hospitals & Bengali Doctors</span>
              </h1>
              <p className="mt-2.5 text-text-muted text-base sm:text-lg leading-relaxed">
                Connect with leading government and private medical centers, verified Bengali-speaking doctors, support staff, and pharmacies across Tamil Nadu.
              </p>
              
              <div className="mt-4 flex flex-wrap gap-3">
                <a href="tel:108">
                  <Button variant="danger" size="lg" className="shadow-lg shadow-red-500/20 font-semibold h-11 px-5 text-sm">
                    <Phone className="w-4 h-4 mr-2" /> Quick Call (108)
                  </Button>
                </a>
                <Link href="/emergency/ambulance">
                  <Button variant="outline" size="lg" className="border-red-200 text-red-600 hover:bg-red-50/50 h-11 px-5 text-sm">
                    <Ambulance className="w-4 h-4 mr-2" /> Ambulance services
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="w-full lg:w-[520px] xl:w-[560px] shrink-0 flex items-center">
              <WordHelper
                words={ALL_HOSPITAL_TRANSLATION_CARDS}
                title="Hospital Word Helper"
                subtitle="Essential hospital and medical phrases in Tamil & Bengali"
                variant="horizontal"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="bg-white border-b border-border sticky top-0 z-20 shadow-xs">
        <div className="w-full max-w-none px-4 sm:px-6 lg:px-[38px]">
          <div className="flex items-center gap-1 sm:gap-4 md:gap-6 overflow-x-auto scrollbar-none py-1">
            <button
              onClick={() => { setSearchTab('hospitals'); setSearchQuery(''); setSpecializationFilter(''); }}
              className={`py-3.5 px-3.5 sm:px-4 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2.5 whitespace-nowrap ${
                searchTab === 'hospitals' 
                  ? 'border-primary text-primary bg-primary/5 rounded-t-xl' 
                  : 'border-transparent text-text-muted hover:text-text-primary hover:bg-surface rounded-t-xl'
              }`}
            >
              <Building2 className={`w-4.5 h-4.5 ${searchTab === 'hospitals' ? 'text-primary' : 'text-text-muted'}`} />
              <span>1. Hospital</span>
            </button>
            
            <button
              onClick={() => { setSearchTab('doctors'); setSearchQuery(''); setSpecializationFilter(''); }}
              className={`py-3.5 px-3.5 sm:px-4 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2.5 whitespace-nowrap ${
                searchTab === 'doctors' 
                  ? 'border-primary text-primary bg-primary/5 rounded-t-xl' 
                  : 'border-transparent text-text-muted hover:text-text-primary hover:bg-surface rounded-t-xl'
              }`}
            >
              <Stethoscope className={`w-4.5 h-4.5 ${searchTab === 'doctors' ? 'text-primary' : 'text-text-muted'}`} />
              <span>2. Bengali Doctor</span>
            </button>
            
            <button
              onClick={() => { setSearchTab('staff'); setSearchQuery(''); }}
              className={`py-3.5 px-3.5 sm:px-4 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2.5 whitespace-nowrap ${
                searchTab === 'staff' 
                  ? 'border-primary text-primary bg-primary/5 rounded-t-xl' 
                  : 'border-transparent text-text-muted hover:text-text-primary hover:bg-surface rounded-t-xl'
              }`}
            >
              <Users className={`w-4.5 h-4.5 ${searchTab === 'staff' ? 'text-primary' : 'text-text-muted'}`} />
              <span>3. Bengali Staff</span>
            </button>

            <button
              onClick={() => { setSearchTab('pharmacies'); setSearchQuery(''); }}
              className={`py-3.5 px-3.5 sm:px-4 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2.5 whitespace-nowrap ${
                searchTab === 'pharmacies' 
                  ? 'border-primary text-primary bg-primary/5 rounded-t-xl' 
                  : 'border-transparent text-text-muted hover:text-text-primary hover:bg-surface rounded-t-xl'
              }`}
            >
              <Pill className={`w-4.5 h-4.5 ${searchTab === 'pharmacies' ? 'text-primary' : 'text-text-muted'}`} />
              <span>4. Govt Pharmacy</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters Header */}
      <div className="bg-white border-b border-border shadow-xs">
        <div className="w-full max-w-none px-4 sm:px-6 lg:px-[38px] py-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* 1. Category / Government Pharmacy Level Filter */}
            <div className="min-w-[210px] flex-1 sm:flex-initial">
              {searchTab === 'pharmacies' ? (
                <select
                  aria-label="Government Pharmacy filter"
                  value={govtLevelFilter}
                  onChange={(e) => setGovtLevelFilter(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-blue-200 text-sm font-bold text-blue-900 bg-blue-50/60 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 hover:border-blue-300 transition-colors shadow-xs"
                >
                  <option value="All">All Govt Pharmacies</option>
                  <option value="Central Government">Central Govt (PMBJP - Jan Aushadhi)</option>
                  <option value="State Government">State Govt (Mudhalvar Marundhagam)</option>
                </select>
              ) : (
                <select
                  aria-label="Category filter"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border text-sm font-medium bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 hover:border-gray-300 transition-colors shadow-xs"
                >
                  <option value="">All Categories</option>
                  <option value="Government">Government Hospitals</option>
                  <option value="Private">Private Hospitals</option>
                </select>
              )}
            </div>

            {/* 2. Specialization Filter */}
            {searchTab !== 'pharmacies' && (
              <div className="min-w-[180px] flex-1 sm:flex-initial">
                {searchTab === 'staff' ? (
                  <select
                    aria-label="Department filter"
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border text-sm font-medium bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 hover:border-gray-300 transition-colors shadow-xs"
                  >
                    <option value="">All Departments</option>
                    {PREDEFINED_DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                ) : (
                  <select
                    aria-label="Specialization filter"
                    value={specializationFilter}
                    onChange={(e) => setSpecializationFilter(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border text-sm font-medium bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 hover:border-gray-300 transition-colors shadow-xs font-medium"
                  >
                    <option value="">All Specializations</option>
                    {PREDEFINED_SPECIALIZATIONS.map((spec) => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* 3. All Cities Filter */}
            <div className="min-w-[150px] flex-1 sm:flex-initial">
              <select
                aria-label="City filter"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border text-sm font-medium bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 hover:border-gray-300 transition-colors shadow-xs"
              >
                <option value="">All Cities</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* 4. Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchTab === 'pharmacies' ? "Search Govt Pharmacy, Scheme, Medicine, Area, PIN..." : "Search by Name and Area..."}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-surface/30 font-medium shadow-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="w-full max-w-none px-4 sm:px-6 lg:px-[38px] py-8">
        {loading ? (
          <div className="text-center py-20 animate-pulse">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-text-muted font-medium">Loading records...</p>
          </div>
        ) : (
          <>
            {/* ── HOSPITALS SEARCH RESULTS ── */}
            {searchTab === 'hospitals' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-[28px] w-full">
                  {filteredHospitals.map((hospital) => (
                    <Card key={hospital.id} padding="none" className="overflow-hidden group flex flex-col h-full bg-white border border-gray-100 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] rounded-[24px] w-full">
                      {/* Image header with text overlay */}
                      <div className="relative h-[273px] bg-slate-100 overflow-hidden shrink-0">
                        <ListingCoverImage 
                          name={hospital.name} 
                          city={hospital.city} 
                          mapsUrl={hospital.google_maps_url} 
                          imageUrl={hospital.image_url}
                          fallbackIcon={<Building2 className="w-12 h-12" />}
                        />
                        
                        {/* Gradient Shadow Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5 z-10 pointer-events-none">
                          <h3 className="text-xl font-bold text-white leading-tight font-display">{hospital.name}</h3>
                          <div className="flex items-center gap-1.5 mt-2 text-sm text-white/90">
                            <MapPin className="w-4 h-4 text-white shrink-0" />
                            <span>{hospital.area ? `${hospital.area}, ` : ''}{hospital.city}</span>
                          </div>
                        </div>

                        {/* Top-left Badges */}
                        <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 z-20">
                          {hospital.category && (
                            <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider text-white shadow-sm ${hospital.category === 'Government' ? 'bg-blue-600' : 'bg-orange-600'}`}>
                              {hospital.category}
                            </span>
                          )}
                          {hospital.is_24_7 && (
                            <span className="bg-red-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 uppercase tracking-wider">
                              <Clock className="w-3.5 h-3.5" /> 24/7
                            </span>
                          )}
                          {hospital.has_bengali_doctor && (
                            <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm uppercase tracking-wider">
                              🩺 Bengali Doctor
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="px-6 py-[22px] flex-1 flex flex-col justify-between">
                        {/* Specializations Tags */}
                        <div>
                          {hospital.specializations && hospital.specializations.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {hospital.specializations.slice(0, 4).map((s) => (
                                <span key={s} className="px-3 py-1.5 bg-[#FFF1F0] border border-[#FFA39E] rounded-lg text-xs font-semibold text-[#B81D18]">
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Side-by-Side Action Buttons */}
                        <div className="flex items-center gap-3 w-full mt-6">
                          <a href={`tel:${hospital.emergency_phone || hospital.phone || '108'}`} className="flex-1 w-full bg-[#B81D18] hover:bg-[#9E1612] text-white font-bold py-2.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]">
                            <Phone className="w-4 h-4" />
                            <span>Emergency</span>
                          </a>
                          
                          <Link href={`/emergency/hospitals/${hospital.id}`} className="flex-1 w-full bg-white hover:bg-slate-50 border border-[#E4E9F2] text-gray-800 font-bold py-2.5 px-4 rounded-xl text-sm flex items-center justify-center shadow-sm transition-all active:scale-[0.98]">
                            <span>Details</span>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                {filteredHospitals.length === 0 && (
                  <div className="text-center py-20 bg-white rounded-3xl border border-border shadow-xs">
                    <p className="text-5xl mb-4">🏥</p>
                    <h3 className="text-xl font-bold mb-2">No hospitals found</h3>
                    <p className="text-text-muted">Try removing filters or altering your search.</p>
                  </div>
                )}
              </>
            )}

            {/* ── DOCTORS SEARCH RESULTS ── */}
            {searchTab === 'doctors' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-[28px]">
                  {filteredDoctors.map((doctor) => {
                    const docHospitals = doctor.hospital_ids?.map(hid => hospitals.find(h => h.id === hid)).filter(Boolean) || [hospitals.find(h => h.id === doctor.hospital_id)].filter(Boolean);
                    const otpRequired = doctor.otp_required !== false;
                    const canViewProfile = isVerified;

                    return (
                      <Card key={doctor.id} className="group hover:shadow-lg transition-all duration-300 relative overflow-hidden bg-white border border-border flex flex-col justify-between">
                        <div>
                          <div className="flex items-start gap-4">
                            <div className="w-20 h-20 rounded-2xl bg-surface border-2 border-white shadow-md overflow-hidden shrink-0 relative">
                              {canViewProfile && doctor.photo ? (
                                <img src={doctor.photo} alt={doctor.doctor_name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                                  <Stethoscope className="w-8 h-8" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 pt-1">
                              <h3 className="text-lg font-bold text-text-primary leading-tight group-hover:text-primary transition-colors">
                                {doctor.doctor_name}
                              </h3>
                              <p className="text-primary font-semibold text-sm mt-1">{doctor.specialization}</p>
                              
                              {canViewProfile && doctor.experience ? (
                                <div className="flex items-center gap-1.5 mt-2 text-xs text-text-muted font-semibold">
                                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                  <span>{doctor.experience} Experience</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100 max-w-fit">
                                  <Lock className="w-3.5 h-3.5" /> OTP Verification Required
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="mt-5 space-y-3">
                            {/* Associated Hospitals List */}
                            <div className="p-3 bg-surface/50 rounded-xl border border-border/50">
                              <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5 text-primary" /> Affiliated Hospitals
                              </p>
                              <div className="space-y-1.5">
                                {docHospitals.length > 0 ? (
                                  docHospitals.map((h: any) => (
                                    <div key={h.id} className="text-xs font-bold text-text-primary">
                                      {h.name} <span className="text-[10px] text-text-muted">({h.city})</span>
                                    </div>
                                  ))
                                ) : (
                                  <span className="text-xs text-text-muted italic">No associated hospitals configured</span>
                                )}
                              </div>
                            </div>

                            {/* Masked details in case not verified */}
                            {canViewProfile ? (
                              <div className="space-y-2 text-sm text-text-primary bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                                {doctor.qualifications && doctor.qualifications.length > 0 && (
                                  <div className="flex items-start gap-2">
                                    <span className="font-bold text-xs text-emerald-800 w-24">Qualification:</span>
                                    <span className="text-xs font-medium">{doctor.qualifications.join(', ')}</span>
                                  </div>
                                )}
                                {doctor.consultation_timings && (
                                  <div className="flex items-start gap-2">
                                    <span className="font-bold text-xs text-emerald-800 w-24">Timings:</span>
                                    <span className="text-xs font-medium">{doctor.consultation_timings}</span>
                                  </div>
                                )}
                                {doctor.phone && (
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-xs text-emerald-800 w-24">Phone:</span>
                                    <a href={`tel:${doctor.phone}`} className="text-xs font-bold text-primary hover:underline">{doctor.phone}</a>
                                  </div>
                                )}
                                {doctor.email && (
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-xs text-emerald-800 w-24">Email:</span>
                                    <a href={`mailto:${doctor.email}`} className="text-xs font-medium text-text-primary hover:underline">{doctor.email}</a>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="relative overflow-hidden bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                                <p className="text-xs font-semibold text-text-muted leading-relaxed">
                                  Full doctor credentials, phone number, email address and consultations details are hidden for privacy.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-border">
                          {canViewProfile ? (
                            <Link href={`/emergency/hospitals/bengali-doctors/${doctor.id}`}>
                              <Button variant="primary" size="sm" className="w-full font-bold">
                                View Profile Details
                              </Button>
                            </Link>
                          ) : (
                            <Button onClick={() => triggerVerification(doctor.id)} variant="danger" size="sm" className="w-full font-bold shadow-md shadow-red-500/10 text-xs flex items-center justify-center">
                              <Lock className="w-4 h-4 mr-2 shrink-0" /> Registered users verify OTP • New users register & verify OTP
                            </Button>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
                {filteredDoctors.length === 0 && (
                  <div className="text-center py-20 bg-white rounded-3xl border border-border shadow-xs">
                    <p className="text-5xl mb-4">👨‍⚕️</p>
                    <h3 className="text-xl font-bold mb-2">No doctors found</h3>
                    <p className="text-text-muted">Try adapting your search parameter or specialization.</p>
                  </div>
                )}
              </>
            )}

            {/* ── STAFF SEARCH RESULTS ── */}
            {searchTab === 'staff' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-[28px]">
                  {filteredStaff.map((s) => {
                    const hospital = hospitals.find((h) => h.id === s.hospital_id);
                    const otpRequired = s.otp_required !== false;
                    const canViewProfile = isVerified;

                    return (
                      <Card key={s.id} className="group hover:shadow-lg transition-all duration-300 relative overflow-hidden bg-white border border-border p-5 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-xl bg-surface border border-border overflow-hidden shrink-0 relative flex items-center justify-center text-primary/30">
                              {canViewProfile && s.photo ? (
                                <img src={s.photo} alt={s.name} className="w-full h-full object-cover" />
                              ) : (
                                <Users className="w-8 h-8" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-base font-bold text-text-primary leading-tight group-hover:text-primary transition-colors">
                                {s.name}
                              </h3>
                              <p className="text-primary font-semibold text-xs mt-1">{s.role}</p>
                              <Badge className="bg-surface border border-border/50 text-text-muted font-bold text-[10px] mt-1.5">
                                {s.department}
                              </Badge>
                              {!canViewProfile && (
                                <div className="flex items-center gap-1.5 mt-2 text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100 max-w-fit">
                                  <Lock className="w-3 h-3" /> OTP Required
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="mt-4 space-y-2 border-t border-border/50 pt-4">
                            {hospital && (
                              <div className="flex items-start gap-2 text-xs text-text-primary font-semibold">
                                <Building2 className="w-4 h-4 text-text-muted mt-0.5" />
                                <span>{hospital.name} ({hospital.city})</span>
                              </div>
                            )}
                            {s.languages && s.languages.length > 0 && (
                              <div className="flex items-center gap-2 text-xs text-text-muted font-medium">
                                <Clock className="w-4 h-4 text-text-muted" />
                                <span>Languages: {s.languages.join(', ')}</span>
                              </div>
                            )}
                            {canViewProfile && s.experience && (
                              <div className="text-xs text-text-muted font-medium pl-6">
                                Experience: {s.experience}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-5 pt-3 border-t border-border">
                          {canViewProfile ? (
                            <Link href={`/emergency/hospitals/bengali-staff/${s.id}`}>
                              <Button variant="primary" size="sm" className="w-full font-bold">
                                View Profile Details
                              </Button>
                            </Link>
                          ) : (
                            <Button onClick={() => triggerVerification(s.id)} variant="danger" size="sm" className="w-full font-bold shadow-md shadow-red-500/10 text-xs flex items-center justify-center">
                              <Lock className="w-4 h-4 mr-2 shrink-0" /> Registered users verify OTP • New users register & verify OTP
                            </Button>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
                {filteredStaff.length === 0 && (
                  <div className="text-center py-20 bg-white rounded-3xl border border-border shadow-xs">
                    <p className="text-5xl mb-4">👥</p>
                    <h3 className="text-xl font-bold mb-2">No staff found</h3>
                    <p className="text-text-muted">Try selecting a different department filter.</p>
                  </div>
                )}
              </>
            )}

            {/* ── GOVERNMENT PHARMACY SEARCH RESULTS ── */}
            {searchTab === 'pharmacies' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[28px] w-full">
                  {filteredPharmacies.map((pharmacy) => {
                    const isCentral = (pharmacy.government_level || 'Central Government') === 'Central Government';
                    const isState = pharmacy.government_level === 'State Government';
                    const scheme = pharmacy.scheme_name || (isState ? 'Mudhalvar Marundhagam' : 'PMBJP – Pradhan Mantri Bhartiya Janaushadhi Pariyojana');
                    const pType = pharmacy.pharmacy_type || (isState ? 'Mudhalvar Marundhagam' : 'Jan Aushadhi Kendra');

                    return (
                      <Card key={pharmacy.id} padding="none" className="overflow-hidden group flex flex-col h-full bg-white border border-gray-100 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] rounded-[24px] w-full">
                        {/* Top Banner Header */}
                        <div className={`p-6 border-b ${isCentral ? 'bg-gradient-to-r from-blue-900 to-indigo-900 text-white' : 'bg-gradient-to-r from-emerald-800 to-teal-900 text-white'}`}>
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${isCentral ? 'bg-blue-500/30 text-blue-100 border border-blue-300/30' : 'bg-emerald-500/30 text-emerald-100 border border-emerald-300/30'}`}>
                              {isCentral ? '🏛️ Central Government' : '🏬 State Govt (Tamil Nadu)'}
                            </span>
                            {pharmacy.is_24_7 && (
                              <span className="bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider shadow-sm">
                                <Clock className="w-3 h-3" /> 24/7
                              </span>
                            )}
                          </div>

                          <h3 className="text-xl font-extrabold text-white leading-tight font-display mb-1">{pharmacy.name}</h3>
                          <p className="text-xs font-medium opacity-90 line-clamp-1">{scheme}</p>
                        </div>

                        <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-3">
                            {/* Scheme & Type Tag */}
                            <div className="flex flex-wrap gap-2 items-center text-xs font-semibold">
                              <span className="bg-slate-100 text-text-primary px-2.5 py-1 rounded-lg border border-slate-200">
                                Type: <strong className="text-text-primary">{pType}</strong>
                              </span>
                              {pharmacy.stock && (
                                <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-200">
                                  Stock: <strong>{pharmacy.stock}</strong>
                                </span>
                              )}
                            </div>

                            {/* Specific Medicine & Price Box */}
                            {(pharmacy.medicine_name || pharmacy.offer_price || pharmacy.mrp) && (
                              <div className="p-3.5 bg-surface rounded-xl border border-border space-y-1.5">
                                {pharmacy.medicine_name && (
                                  <div className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                                    <Pill className="w-3.5 h-3.5 text-primary shrink-0" />
                                    <span>{pharmacy.medicine_name}</span>
                                  </div>
                                )}
                                {(pharmacy.mrp || pharmacy.offer_price) && (
                                  <div className="flex items-center justify-between text-xs pt-1 border-t border-border/50">
                                    <div className="flex items-center gap-2">
                                      {pharmacy.mrp && <span className="line-through text-text-muted">MRP: ₹{pharmacy.mrp}</span>}
                                      {pharmacy.offer_price && <span className="text-sm font-extrabold text-emerald-600">Offer: ₹{pharmacy.offer_price}</span>}
                                    </div>
                                    {pharmacy.mrp && pharmacy.offer_price && (
                                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                        Save {Math.round((1 - Number(pharmacy.offer_price) / Number(pharmacy.mrp)) * 100)}%
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Location Details */}
                            <div className="text-xs text-text-muted space-y-1.5">
                              <div className="flex items-start gap-1.5 text-text-primary font-medium">
                                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                <span>
                                  {pharmacy.address || `${pharmacy.area ? pharmacy.area + ', ' : ''}${pharmacy.city}`}
                                  {pharmacy.district && `, ${pharmacy.district}`}
                                  {pharmacy.state && `, ${pharmacy.state}`}
                                  {pharmacy.pin_code && ` - ${pharmacy.pin_code}`}
                                </span>
                              </div>
                              {pharmacy.hospital_name && (
                                <div className="flex items-center gap-1.5 text-xs text-primary font-semibold pl-5">
                                  <Building2 className="w-3.5 h-3.5" /> {pharmacy.hospital_name}
                                </div>
                              )}
                              {pharmacy.opening_time && (
                                <div className="flex items-center gap-1.5 text-xs text-text-muted pl-5">
                                  <Clock className="w-3.5 h-3.5" /> Hours: {pharmacy.opening_time} {pharmacy.closing_time ? `- ${pharmacy.closing_time}` : ''}
                                </div>
                              )}
                            </div>

                            {pharmacy.description && (
                              <p className="text-xs text-text-muted line-clamp-2 italic">{pharmacy.description}</p>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-3 w-full pt-2">
                            {pharmacy.phone ? (
                              <a href={`tel:${pharmacy.phone}`} className="flex-1 w-full bg-[#B81D18] hover:bg-[#9E1612] text-white font-bold py-2.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]">
                                <Phone className="w-4 h-4" />
                                <span>Call Pharmacy</span>
                              </a>
                            ) : (
                              <div className="flex-1 text-xs text-text-muted text-center py-2.5 bg-slate-100 rounded-xl font-medium">Direct Govt Visit</div>
                            )}
                            
                            <a href={pharmacy.google_maps_url || `https://maps.google.com/?q=${encodeURIComponent(pharmacy.name + ' ' + pharmacy.city)}`} target="_blank" rel="noopener noreferrer" className="flex-1 w-full bg-white hover:bg-slate-50 border border-[#E4E9F2] text-gray-800 font-bold py-2.5 px-4 rounded-xl text-sm flex items-center justify-center gap-1 shadow-sm transition-all active:scale-[0.98]">
                              <MapPin className="w-4 h-4 text-primary" />
                              <span>Directions</span>
                            </a>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
                {filteredPharmacies.length === 0 && (
                  <div className="text-center py-20 bg-white rounded-3xl border border-border shadow-xs">
                    <p className="text-5xl mb-4">🏛️</p>
                    <h3 className="text-xl font-bold mb-2">No Government Pharmacies Found</h3>
                    <p className="text-text-muted">Try switching between Central Government and State Government filters or adjusting city search.</p>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
