'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2, Briefcase, Search, MapPin, Phone, Mail, Globe,
  ShieldCheck, CheckCircle2, Clock, Sparkles, Filter, Plus,
  ChevronRight, ExternalLink, MessageSquare, AlertCircle,
  Users, Award, X, Check, ArrowRight, Share2, Send, Bookmark,
  Layers, BadgeCheck, FileText, PhoneCall, HelpCircle, Eye
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/lib/auth/AuthContext';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, addDoc, query, where } from 'firebase/firestore';
import { COLLECTIONS } from '@/lib/firestore/collections';
import type { ChamberBusiness, ChamberJobOpening } from '@/types';
import { BUSINESS_CATEGORIES, INITIAL_CHAMBER_BUSINESSES } from '@/data/chamber-of-commerce-data';
import { CITIES } from '@/lib/constants';

/* ─── Category Icon & Color Mapping ─── */
const CATEGORY_META: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  'IT & Software Solutions': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: '💻' },
  'Food, Sweets & Catering': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', icon: '🍲' },
  'Textiles, Handlooms & Fashion': { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200', icon: '🧵' },
  'Healthcare & Diagnostics': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: '🩺' },
  'Construction & Real Estate': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: '🏗️' },
  'Education & Academy': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: '📚' },
  'Finance & Legal Consultancy': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', icon: '⚖️' },
  'Arts, Media & Events': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: '🎨' },
  'Logistics & Travel': { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', icon: '🚚' },
  'Retail & Trading': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', icon: '🛍️' },
  'Other Services': { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', icon: '🏢' },
};

export default function ChamberOfCommercePage() {
  const router = useRouter();
  const { firebaseUser, profile } = useAuth();

  // State
  const [businesses, setBusinesses] = useState<ChamberBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');
  const [hiringOnly, setHiringOnly] = useState(false);

  // Modals
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [selectedJobBusiness, setSelectedJobBusiness] = useState<ChamberBusiness | null>(null);
  const [detailBusiness, setDetailBusiness] = useState<ChamberBusiness | null>(null);

  // Registration Form State
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [userExistingListing, setUserExistingListing] = useState<ChamberBusiness | null>(null);
  const [formData, setFormData] = useState<Partial<ChamberBusiness>>({
    business_name: '',
    owner_name: profile?.full_name || '',
    category: 'IT & Software Solutions',
    sub_category: '',
    gst_number: '',
    year_established: new Date().getFullYear(),
    description: '',
    services_offered: [],
    address: '',
    area: '',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '',
    contact_email: profile?.email || '',
    contact_phone: profile?.phone || '',
    whatsapp: '',
    website: '',
    google_maps_url: '',
    logo_url: '',
    hiring_status: 'not_hiring',
    job_openings: [],
  });
  const [servicesInput, setServicesInput] = useState('');
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobType, setNewJobType] = useState<ChamberJobOpening['job_type']>('Full-time');
  const [newJobExp, setNewJobExp] = useState('');
  const [newJobSalary, setNewJobSalary] = useState('');
  const [newJobDesc, setNewJobDesc] = useState('');

  // Load Businesses
  useEffect(() => {
    async function loadBusinesses() {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, COLLECTIONS.chamber_of_commerce || 'chamber_of_commerce'));
        const map = new Map<string, ChamberBusiness>();

        // 1. Seed with initial businesses as baseline
        INITIAL_CHAMBER_BUSINESSES.forEach(b => map.set(b.id, b));

        // 2. Overlay Firestore documents (admin updates, user submissions, status changes)
        if (!snap.empty) {
          snap.docs.forEach(d => {
            const data = { id: d.id, ...d.data() } as ChamberBusiness;
            map.set(d.id, data);
          });
        }

        const allItems = Array.from(map.values());

        // Check if current user has an existing listing
        if (firebaseUser?.uid) {
          const myListing = allItems.find(i => i.user_id === firebaseUser.uid);
          if (myListing) setUserExistingListing(myListing);
        }

        // STRICT PUBLIC FILTER:
        // Only show items that are explicitly verified by admin
        // Reject any item where:
        // - verified is false or missing
        // - verification_status is 'rejected' or 'pending'
        // - is_active is false
        // - item was marked deleted
        const verifiedItems = allItems.filter(i => 
          i.verified === true && 
          i.verification_status === 'verified' && 
          i.is_active !== false &&
          !(i as any).deleted_at
        );

        setBusinesses(verifiedItems);
      } catch (err) {
        console.error('Error loading businesses from Firestore:', err);
        setBusinesses(INITIAL_CHAMBER_BUSINESSES.filter(i => i.verified && i.verification_status === 'verified'));
      } finally {
        setLoading(false);
      }
    }
    loadBusinesses();
  }, [firebaseUser?.uid]);

  // Handle Open Register Modal
  const handleOpenRegister = () => {
    if (!firebaseUser) {
      setShowLoginPrompt(true);
      return;
    }
    // Prefill user details if empty
    setFormData(prev => ({
      ...prev,
      owner_name: prev.owner_name || profile?.full_name || '',
      contact_email: prev.contact_email || profile?.email || '',
      contact_phone: prev.contact_phone || profile?.phone || '',
    }));
    setShowRegisterModal(true);
  };

  // Add Job to Form
  const handleAddJob = () => {
    if (!newJobTitle.trim()) return;
    const newJob: ChamberJobOpening = {
      id: `job-${Date.now()}`,
      title: newJobTitle.trim(),
      job_type: newJobType,
      experience: newJobExp.trim() || undefined,
      salary_range: newJobSalary.trim() || undefined,
      description: newJobDesc.trim() || undefined,
      contact_email: formData.contact_email,
      contact_phone: formData.contact_phone,
      is_active: true,
      posted_at: new Date().toISOString().split('T')[0],
    };
    setFormData(prev => ({
      ...prev,
      job_openings: [...(prev.job_openings || []), newJob],
      hiring_status: 'hiring',
    }));
    setNewJobTitle('');
    setNewJobExp('');
    setNewJobSalary('');
    setNewJobDesc('');
  };

  // Remove Job
  const handleRemoveJob = (index: number) => {
    setFormData(prev => {
      const updated = (prev.job_openings || []).filter((_, i) => i !== index);
      return {
        ...prev,
        job_openings: updated,
        hiring_status: updated.length > 0 ? 'hiring' : 'not_hiring',
      };
    });
  };

  // Clean undefined fields for Firestore compatibility
  function cleanFirestoreData(obj: any): any {
    if (obj === null || obj === undefined) return obj;
    if (Array.isArray(obj)) {
      return obj.map(item => cleanFirestoreData(item)).filter(item => item !== undefined);
    }
    if (typeof obj === 'object') {
      const result: Record<string, any> = {};
      for (const key of Object.keys(obj)) {
        const val = (obj as Record<string, any>)[key];
        if (val !== undefined) {
          result[key] = cleanFirestoreData(val);
        }
      }
      return result;
    }
    return obj;
  }

  // Handle Form Submission
  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.business_name || !formData.owner_name || !formData.contact_phone || !formData.city) {
      alert('Please fill in all mandatory fields (Business Name, Owner Name, Contact Phone, City).');
      return;
    }

    setSubmitting(true);
    try {
      const servicesArray = servicesInput
        ? servicesInput.split(',').map(s => s.trim()).filter(Boolean)
        : formData.services_offered || [];

      // Build clean payload with defaults for strings instead of undefined
      const rawPayload: Record<string, any> = {
        business_name: formData.business_name?.trim() || '',
        owner_name: formData.owner_name?.trim() || '',
        category: formData.category || 'Other Services',
        sub_category: formData.sub_category?.trim() || '',
        gst_number: formData.gst_number?.trim() || '',
        year_established: formData.year_established ? Number(formData.year_established) : null,
        description: formData.description?.trim() || '',
        services_offered: servicesArray,
        address: formData.address?.trim() || '',
        area: formData.area?.trim() || '',
        city: formData.city?.trim() || 'Chennai',
        state: formData.state?.trim() || 'Tamil Nadu',
        pincode: formData.pincode?.trim() || '',
        contact_email: formData.contact_email?.trim() || '',
        contact_phone: formData.contact_phone?.trim() || '',
        whatsapp: formData.whatsapp?.trim() || '',
        website: formData.website?.trim() || '',
        google_maps_url: formData.google_maps_url?.trim() || '',
        logo_url: formData.logo_url?.trim() || '',
        hiring_status: formData.hiring_status || 'not_hiring',
        job_openings: (formData.job_openings || []).map(j => ({
          id: j.id || `job-${Date.now()}`,
          title: j.title || '',
          job_type: j.job_type || 'Full-time',
          experience: j.experience || '',
          salary_range: j.salary_range || '',
          description: j.description || '',
          contact_email: j.contact_email || formData.contact_email || '',
          contact_phone: j.contact_phone || formData.contact_phone || '',
          is_active: true,
          posted_at: j.posted_at || new Date().toISOString().split('T')[0],
        })),
        user_id: firebaseUser?.uid || 'guest',
        verified: false,
        verification_status: 'pending',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const payload = cleanFirestoreData(rawPayload);

      const colRef = collection(db, COLLECTIONS.chamber_of_commerce || 'chamber_of_commerce');
      const docRef = await addDoc(colRef, payload);
      
      setUserExistingListing({ id: docRef.id, ...payload } as ChamberBusiness);
      setSubmitSuccess(true);
    } catch (err: any) {
      console.error('Error submitting business registration:', err);
      alert('Failed to submit registration: ' + (err.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered Businesses
  const filteredBusinesses = useMemo(() => {
    return businesses.filter(biz => {
      const matchesSearch =
        !searchQuery.trim() ||
        biz.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        biz.owner_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        biz.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        biz.area?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        biz.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        biz.services_offered?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'All Categories' || biz.category === selectedCategory;

      const matchesCity =
        selectedCity === 'All Cities' || biz.city.toLowerCase() === selectedCity.toLowerCase();

      const matchesHiring =
        !hiringOnly || biz.hiring_status === 'hiring' || (biz.job_openings && biz.job_openings.length > 0);

      return matchesSearch && matchesCategory && matchesCity && matchesHiring;
    });
  }, [businesses, searchQuery, selectedCategory, selectedCity, hiringOnly]);

  // Statistics
  const totalVerified = businesses.length;
  const totalHiring = businesses.filter(b => b.hiring_status === 'hiring' || (b.job_openings && b.job_openings.length > 0)).length;
  const totalJobsCount = businesses.reduce((acc, b) => acc + (b.job_openings?.length || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans">
      {/* ─── Hero Header Section ─── */}
      <section className="relative bg-gradient-to-b from-[#FAF0EC] via-white to-slate-50/50 border-b border-[#EADED9]/80 overflow-hidden pt-10 pb-12 lg:pt-14 lg:pb-16">
        {/* Subtle Decorative Elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#D85A30]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs md:text-sm text-text-muted mb-4 font-medium">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-text-muted">Services</span>
            <span>/</span>
            <span className="text-text-primary font-semibold">Chamber of Commerce</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF0EC] border border-[#D85A30]/20 text-[#D85A30] text-xs font-bold tracking-wide shadow-2xs">
                <Building2 className="w-3.5 h-3.5" />
                <span>প্রবাসী বাঙালি চেম্বার অফ কমার্স</span>
                <span className="w-1 h-1 rounded-full bg-[#D85A30]" />
                <span className="text-neutral-700 font-semibold">Bengali Chamber of Commerce</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-black tracking-tight leading-tight">
                Empowering Bengali Businesses & Careers in South India
              </h1>

              <p className="text-base sm:text-lg text-text-muted leading-relaxed max-w-2xl font-normal">
                Discover verified Bengali-owned enterprises, connect with visionary entrepreneurs, explore collaborative trade partnerships, and find high-potential job opportunities.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  onClick={handleOpenRegister}
                  className="bg-[#D85A30] hover:bg-[#c04a22] text-white font-bold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register Your Business</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setHiringOnly(!hiringOnly)}
                  className={`border font-semibold px-5 py-3 rounded-xl text-sm transition-all cursor-pointer ${
                    hiringOnly
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <Briefcase className="w-4 h-4 mr-1.5" />
                  <span>{hiringOnly ? '✓ Filtering: Open Jobs' : 'Explore Job Openings'}</span>
                  {totalJobsCount > 0 && (
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${hiringOnly ? 'bg-white text-emerald-800' : 'bg-emerald-100 text-emerald-800'}`}>
                      {totalJobsCount}
                    </span>
                  )}
                </Button>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3 shrink-0">
              <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-center min-w-[140px]">
                <div className="flex items-center gap-2 text-emerald-600 mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Verified</span>
                </div>
                <div className="text-2xl font-black text-slate-900">{totalVerified}</div>
                <p className="text-[11px] text-slate-500 mt-0.5">Vetted Enterprises</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-center min-w-[140px]">
                <div className="flex items-center gap-2 text-blue-600 mb-1">
                  <Briefcase className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Careers</span>
                </div>
                <div className="text-2xl font-black text-slate-900">{totalJobsCount}</div>
                <p className="text-[11px] text-slate-500 mt-0.5">Active Job Openings</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Search & Filters Bar ─── */}
      <section className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 py-4 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by business name, owner, services (e.g. Sweets, IT, CA, Sarees, Nursing)..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-slate-800"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* City Dropdown */}
            <div className="w-full md:w-48 shrink-0">
              <select
                value={selectedCity}
                onChange={e => setSelectedCity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white cursor-pointer"
              >
                <option value="All Cities">All Locations</option>
                {CITIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="Bengaluru">Bengaluru</option>
                <option value="Kolkata">Kolkata</option>
              </select>
            </div>

            {/* Hiring Filter Toggle */}
            <button
              onClick={() => setHiringOnly(!hiringOnly)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer shrink-0 w-full md:w-auto justify-center ${
                hiringOnly
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-2xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Briefcase className={`w-4 h-4 ${hiringOnly ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>Hiring Only</span>
              {hiringOnly && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
            </button>
          </div>

          {/* Categories Horizontal Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-medium">
            {BUSINESS_CATEGORIES.map(cat => {
              const isSelected = selectedCategory === cat;
              const meta = CATEGORY_META[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs font-bold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  {meta?.icon && <span>{meta.icon}</span>}
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Main Content / Directory Listings ─── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* User Submission Status Banner (if user has a pending or rejected submission) */}
        {userExistingListing && userExistingListing.verification_status !== 'verified' && (
          <div className={`mb-6 p-4 rounded-2xl border flex items-start gap-3 shadow-xs ${
            userExistingListing.verification_status === 'pending'
              ? 'bg-amber-50/80 border-amber-200 text-amber-900'
              : 'bg-rose-50/80 border-rose-200 text-rose-900'
          }`}>
            {userExistingListing.verification_status === 'pending' ? (
              <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 text-sm">
              <p className="font-bold">
                {userExistingListing.verification_status === 'pending'
                  ? `Your Business Listing (${userExistingListing.business_name}) is Under Review`
                  : `Your Business Listing (${userExistingListing.business_name}) was Rejected`}
              </p>
              <p className="text-xs mt-0.5 opacity-90">
                {userExistingListing.verification_status === 'pending'
                  ? 'Our admin team is currently reviewing your registration. It will appear in the public directory once verified.'
                  : (userExistingListing.rejection_reason || 'Information could not be verified by admin. Please contact support or submit updated details.')}
              </p>
            </div>
          </div>
        )}

        {/* Active Filters / Result Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-semibold text-slate-600">
            Showing <span className="font-bold text-slate-900">{filteredBusinesses.length}</span> verified Bengali {filteredBusinesses.length === 1 ? 'business' : 'businesses'}
          </p>

          {(searchQuery || selectedCategory !== 'All Categories' || selectedCity !== 'All Cities' || hiringOnly) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Categories');
                setSelectedCity('All Cities');
                setHiringOnly(false);
              }}
              className="text-xs font-bold text-[#D85A30] hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Reset all filters</span>
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Directory Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 rounded-2xl bg-slate-100 animate-pulse border border-slate-200/60" />
            ))}
          </div>
        ) : filteredBusinesses.length === 0 ? (
          <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center max-w-lg mx-auto my-12 space-y-4 shadow-sm">
            <div className="w-16 h-16 bg-[#FAF0EC] rounded-2xl flex items-center justify-center mx-auto text-3xl">
              🏢
            </div>
            <h3 className="text-lg font-bold text-slate-900">No matching businesses found</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              We couldn&apos;t find any verified businesses matching your search criteria. Try modifying your filters or be the first to register a business in this category!
            </p>
            <div className="pt-2">
              <Button onClick={handleOpenRegister} className="bg-[#D85A30] hover:bg-[#c04a22] text-white font-bold cursor-pointer">
                Register Your Business Here
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.map(biz => {
              const catMeta = CATEGORY_META[biz.category] || CATEGORY_META['Other Services'];
              const hasJobs = (biz.job_openings && biz.job_openings.length > 0) || biz.hiring_status === 'hiring';
              const cleanPhone = biz.contact_phone.replace(/[^0-9+]/g, '');
              const cleanWhatsapp = biz.whatsapp ? biz.whatsapp.replace(/[^0-9]/g, '') : cleanPhone.replace(/[^0-9]/g, '');

              return (
                <Card
                  key={biz.id}
                  padding="none"
                  className="bg-white border border-slate-200/80 hover:border-[#D85A30]/40 hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Header Banner */}
                    <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        {/* Logo or Initials */}
                        <div className="w-12 h-12 rounded-xl bg-[#FAF0EC] border border-[#EADED9] flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                          {biz.logo_url ? (
                            <img src={biz.logo_url} alt={biz.business_name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-lg font-black text-[#D85A30]">{biz.business_name.charAt(0)}</span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="font-bold font-display text-text-primary text-base group-hover:text-primary transition-colors line-clamp-1 leading-snug">
                              {biz.business_name}
                            </h3>
                            {biz.verified && (
                              <span title="Verified Bengali Business" className="inline-flex items-center text-emerald-600">
                                <BadgeCheck className="w-4 h-4 fill-emerald-100" />
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                            Prop: <span className="font-semibold text-slate-700">{biz.owner_name}</span>
                            {biz.year_established && <span className="text-slate-400"> • Est. {biz.year_established}</span>}
                          </p>
                        </div>
                      </div>

                      {/* Category Badge */}
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${catMeta.bg} ${catMeta.text} ${catMeta.border}`}>
                        {biz.category.split(' ')[0]}
                      </span>
                    </div>

                    {/* Body Content */}
                    <div className="p-5 space-y-3.5 text-xs">
                      {/* Description */}
                      <p className="text-slate-600 line-clamp-3 leading-relaxed">
                        {biz.description}
                      </p>

                      {/* Services Pills */}
                      {biz.services_offered && biz.services_offered.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {biz.services_offered.slice(0, 3).map((srv, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium text-[10px]">
                              {srv}
                            </span>
                          ))}
                          {biz.services_offered.length > 3 && (
                            <span className="px-1.5 py-0.5 text-[10px] text-slate-400 font-semibold">
                              +{biz.services_offered.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Address & City */}
                      <div className="flex items-start gap-1.5 text-slate-500 pt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">
                          {biz.area ? `${biz.area}, ` : ''}{biz.city}{biz.state ? `, ${biz.state}` : ''}
                        </span>
                      </div>

                      {/* Active Job Opportunities Banner */}
                      {hasJobs && (
                        <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                            <span className="font-bold text-emerald-900 text-[11px]">
                              {biz.job_openings?.length ? `${biz.job_openings.length} Job Opening(s) Available` : 'Actively Hiring'}
                            </span>
                          </div>
                          <button
                            onClick={() => setSelectedJobBusiness(biz)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] transition-colors cursor-pointer shadow-2xs"
                          >
                            View Openings
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {biz.contact_phone && (
                        <a
                          href={`tel:${cleanPhone}`}
                          title={`Call ${biz.owner_name}`}
                          className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors shadow-2xs"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        </a>
                      )}
                      {cleanWhatsapp && (
                        <a
                          href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(`Hello ${biz.owner_name}, I found ${biz.business_name} on the ProbasiBangali Chamber of Commerce.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="WhatsApp Business"
                          className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors shadow-2xs"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-green-600" />
                        </a>
                      )}
                      {biz.contact_email && (
                        <a
                          href={`mailto:${biz.contact_email}?subject=${encodeURIComponent(`Inquiry for ${biz.business_name}`)}`}
                          title="Email Business"
                          className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors shadow-2xs"
                        >
                          <Mail className="w-3.5 h-3.5 text-blue-600" />
                        </a>
                      )}
                      {biz.website && (
                        <a
                          href={biz.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Visit Website"
                          className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors shadow-2xs"
                        >
                          <Globe className="w-3.5 h-3.5 text-indigo-600" />
                        </a>
                      )}
                    </div>

                    <button
                      onClick={() => setDetailBusiness(biz)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#D85A30] hover:text-[#b8431c] transition-colors cursor-pointer px-2 py-1"
                    >
                      <span>Full Profile</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      {/* ─── Business Detail Modal ─── */}
      {detailBusiness && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-[#FAF0EC] to-white border-b border-[#EADED9] flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-[#FAF0EC] border border-[#EADED9] flex items-center justify-center text-xl font-black text-[#D85A30] shrink-0 shadow-xs">
                  {detailBusiness.logo_url ? (
                    <img src={detailBusiness.logo_url} alt={detailBusiness.business_name} className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    detailBusiness.business_name.charAt(0)
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold font-display text-text-primary">{detailBusiness.business_name}</h2>
                    {detailBusiness.verified && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    Owned & Operated by <strong className="text-slate-800">{detailBusiness.owner_name}</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setDetailBusiness(null)}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer shadow-2xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-sm max-h-[70vh] overflow-y-auto">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">About the Enterprise</h4>
                <p className="text-slate-700 leading-relaxed">{detailBusiness.description}</p>
              </div>

              {detailBusiness.services_offered && detailBusiness.services_offered.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Core Services & Products</h4>
                  <div className="flex flex-wrap gap-2">
                    {detailBusiness.services_offered.map((srv, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 font-medium text-slate-800 text-xs">
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Business Credentials Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Industry Category:</span>
                  <span className="font-bold text-slate-800">{detailBusiness.category}</span>
                </div>
                {detailBusiness.gst_number && (
                  <div>
                    <span className="text-slate-400 block font-medium">GST / Reg Number:</span>
                    <span className="font-bold text-slate-800">{detailBusiness.gst_number}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-400 block font-medium">Location:</span>
                  <span className="font-bold text-slate-800">{detailBusiness.address}, {detailBusiness.city}</span>
                </div>
                {detailBusiness.year_established && (
                  <div>
                    <span className="text-slate-400 block font-medium">Established:</span>
                    <span className="font-bold text-slate-800">Year {detailBusiness.year_established}</span>
                  </div>
                )}
              </div>

              {/* Job Opportunities Section inside Detail Modal */}
              {detailBusiness.job_openings && detailBusiness.job_openings.length > 0 && (
                <div className="border border-emerald-200 rounded-2xl p-4 bg-emerald-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-emerald-700" />
                      <h4 className="font-bold text-emerald-900 text-sm">Career Opportunities ({detailBusiness.job_openings.length})</h4>
                    </div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800 uppercase tracking-wider">Hiring</span>
                  </div>

                  <div className="space-y-2">
                    {detailBusiness.job_openings.map(job => (
                      <div key={job.id} className="p-3 bg-white rounded-xl border border-emerald-100 text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-slate-900">
                          <span>{job.title}</span>
                          <span className="text-emerald-700">{job.salary_range || job.job_type}</span>
                        </div>
                        {job.description && <p className="text-slate-600 text-[11px]">{job.description}</p>}
                        {job.requirements && <p className="text-slate-500 text-[10px]">Requirements: {job.requirements}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Direct Contact Actions */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Connect with Owner</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <a
                    href={`tel:${detailBusiness.contact_phone}`}
                    className="flex items-center justify-center gap-2 p-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call {detailBusiness.contact_phone}</span>
                  </a>

                  <a
                    href={`https://wa.me/${detailBusiness.whatsapp || detailBusiness.contact_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${detailBusiness.owner_name}, I am contacting you regarding ${detailBusiness.business_name} via ProbasiBangali Chamber of Commerce.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 p-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs transition-all shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat on WhatsApp</span>
                  </a>

                  {detailBusiness.contact_email && (
                    <a
                      href={`mailto:${detailBusiness.contact_email}`}
                      className="flex items-center justify-center gap-2 p-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-all"
                    >
                      <Mail className="w-3.5 h-3.5 text-blue-600" />
                      <span>Send Email</span>
                    </a>
                  )}

                  {detailBusiness.google_maps_url && (
                    <a
                      href={detailBusiness.google_maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 p-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-all"
                    >
                      <MapPin className="w-3.5 h-3.5 text-rose-600" />
                      <span>View on Google Maps</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Dedicated Job Openings Modal ─── */}
      {selectedJobBusiness && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold font-display text-text-primary text-base">Job Openings & Career Inquiries</h3>
                  <p className="text-xs text-emerald-800 font-medium">{selectedJobBusiness.business_name}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedJobBusiness(null)}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer shadow-2xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
              <div className="space-y-3">
                {selectedJobBusiness.job_openings && selectedJobBusiness.job_openings.length > 0 ? (
                  selectedJobBusiness.job_openings.map((job, idx) => (
                    <div key={job.id || idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{job.title}</h4>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                            <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-semibold">{job.job_type}</span>
                            {job.experience && <span>Exp: {job.experience}</span>}
                            {job.location && <span>• {job.location}</span>}
                          </div>
                        </div>
                        {job.salary_range && (
                          <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-1 rounded-lg">
                            {job.salary_range}
                          </span>
                        )}
                      </div>

                      {job.description && (
                        <p className="text-xs text-slate-600 leading-relaxed">{job.description}</p>
                      )}

                      {job.requirements && (
                        <div className="text-[11px] text-slate-500 bg-white p-2 rounded-lg border border-slate-100">
                          <strong className="text-slate-700">Skills / Requirements:</strong> {job.requirements}
                        </div>
                      )}

                      {/* Job Application Action */}
                      <div className="pt-2 flex items-center gap-2">
                        <a
                          href={`https://wa.me/${selectedJobBusiness.whatsapp || selectedJobBusiness.contact_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${selectedJobBusiness.owner_name}, I am writing to apply for the position of "${job.title}" at ${selectedJobBusiness.business_name} as listed on ProbasiBangali.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-2xs"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Apply / Contact via WhatsApp</span>
                        </a>

                        {selectedJobBusiness.contact_email && (
                          <a
                            href={`mailto:${selectedJobBusiness.contact_email}?subject=${encodeURIComponent(`Job Application: ${job.title} - ProbasiBangali`)}&body=${encodeURIComponent(`Dear ${selectedJobBusiness.owner_name},\n\nI am interested in applying for the ${job.title} opportunity at ${selectedJobBusiness.business_name}.\n\nPlease find my resume attached.`)}`}
                            className="inline-flex items-center justify-center px-3 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 bg-slate-50 rounded-2xl text-center space-y-2">
                    <p className="text-sm font-semibold text-slate-700">This business is open for job inquiries & internships.</p>
                    <p className="text-xs text-slate-500">Contact the business owner directly with your profile.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Login Required Prompt Modal ─── */}
      {showLoginPrompt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center space-y-4 border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-[#FAF0EC] rounded-2xl flex items-center justify-center mx-auto text-3xl">
              🔐
            </div>
            <h3 className="text-xl font-bold font-display text-text-primary">Account Login Required</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              To register your Bengali business and submit it for admin verification, you need to have an authenticated account on ProbasiBangali.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <Link
                href="/auth/login?redirect=/services/chamber-of-commerce"
                className="w-full py-3 bg-[#D85A30] hover:bg-[#c04a22] text-white font-bold rounded-xl text-sm transition-colors text-center shadow-sm"
              >
                Sign In to Your Account
              </Link>
              <Link
                href="/auth/register?redirect=/services/chamber-of-commerce"
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-colors text-center"
              >
                Create New Account
              </Link>
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="text-xs text-slate-400 hover:text-slate-600 font-semibold pt-1 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Register Business Modal ─── */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Top */}
            <div className="p-6 bg-gradient-to-r from-[#FAF0EC] to-white border-b border-[#EADED9] flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-display text-text-primary">Register Your Bengali Business</h2>
                <p className="text-xs text-text-muted mt-0.5">Submit your business for verification by the Chamber of Commerce team</p>
              </div>
              <button
                onClick={() => { setShowRegisterModal(false); setSubmitSuccess(false); }}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer shadow-2xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-3xl mx-auto text-emerald-600">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-slate-900">Business Registration Submitted!</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{formData.owner_name}</strong>. Your enterprise <strong>{formData.business_name}</strong> has been submitted. Our admin team will verify your credentials and publish your listing on the directory shortly.
                </p>
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 max-w-md mx-auto text-left space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Verification Status: Pending Admin Review
                  </div>
                  <p>You can view and manage your listing once approved.</p>
                </div>
                <Button
                  onClick={() => { setShowRegisterModal(false); setSubmitSuccess(false); }}
                  className="bg-[#D85A30] text-white font-bold px-6 py-2.5 rounded-xl cursor-pointer"
                >
                  Done
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmitRegistration} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                {/* Section 1: Basic Identity */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#D85A30] flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" /> 1. Business & Owner Identity
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Business Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.business_name}
                        onChange={e => setFormData({ ...formData, business_name: e.target.value })}
                        placeholder="e.g. Mukherjee Infotech & Cloud"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-slate-50 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Owner / Proprietor Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.owner_name}
                        onChange={e => setFormData({ ...formData, owner_name: e.target.value })}
                        placeholder="e.g. Soumitra Mukherjee"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-slate-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Industry Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-slate-50 focus:bg-white font-medium"
                      >
                        {BUSINESS_CATEGORIES.filter(c => c !== 'All Categories').map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">GST / Business Reg No. (Optional)</label>
                      <input
                        type="text"
                        value={formData.gst_number || ''}
                        onChange={e => setFormData({ ...formData, gst_number: e.target.value })}
                        placeholder="e.g. 33AABCU9603R1ZM"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-slate-50 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Year Established</label>
                      <input
                        type="number"
                        value={formData.year_established || ''}
                        onChange={e => setFormData({ ...formData, year_established: Number(e.target.value) })}
                        placeholder="e.g. 2018"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-slate-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Business Description <span className="text-red-500">*</span></label>
                    <textarea
                      required
                      rows={3}
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe what your business does, your mission, specialties, and key offerings..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-slate-50 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Services / Products Offered (comma-separated)</label>
                    <input
                      type="text"
                      value={servicesInput}
                      onChange={e => setServicesInput(e.target.value)}
                      placeholder="e.g. Cloud Hosting, Web Apps, UI Design, Mobile Apps"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Section 2: Contact & Location */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#D85A30] flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" /> 2. Location & Contact Channels
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Primary Phone / Mobile <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.contact_phone}
                        onChange={e => setFormData({ ...formData, contact_phone: e.target.value })}
                        placeholder="+91 98401 23456"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-slate-50 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Number</label>
                      <input
                        type="tel"
                        value={formData.whatsapp || ''}
                        onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                        placeholder="+91 98401 23456"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-slate-50 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Official Email <span className="text-red-500">*</span></label>
                      <input
                        type="email"
                        required
                        value={formData.contact_email}
                        onChange={e => setFormData({ ...formData, contact_email: e.target.value })}
                        placeholder="contact@mybusiness.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-slate-50 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Website URL</label>
                      <input
                        type="url"
                        value={formData.website || ''}
                        onChange={e => setFormData({ ...formData, website: e.target.value })}
                        placeholder="https://mybusiness.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-slate-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">City <span className="text-red-500">*</span></label>
                      <select
                        value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-slate-50 focus:bg-white font-medium"
                      >
                        {CITIES.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                        <option value="Bengaluru">Bengaluru</option>
                        <option value="Kolkata">Kolkata</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Area / Landmark</label>
                      <input
                        type="text"
                        value={formData.area || ''}
                        onChange={e => setFormData({ ...formData, area: e.target.value })}
                        placeholder="e.g. Adyar / T.Nagar"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-slate-50 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Address</label>
                      <input
                        type="text"
                        value={formData.address || ''}
                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Shop No, Street, Landmark"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-slate-50 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Job Openings & Hiring Status */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" /> 3. Job Opportunities & Hiring Openings
                  </h4>

                  <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-3">
                    <p className="text-xs text-slate-600">
                      Are you currently hiring or open to receiving resumes and job inquiries from Bengali professionals and community members?
                    </p>

                    {/* Added Job Openings List */}
                    {formData.job_openings && formData.job_openings.length > 0 && (
                      <div className="space-y-2">
                        {formData.job_openings.map((job, idx) => (
                          <div key={idx} className="p-3 bg-white rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                            <div>
                              <span className="font-bold text-slate-900">{job.title}</span>
                              <span className="text-slate-400 ml-2">({job.job_type})</span>
                              {job.salary_range && <span className="text-emerald-700 font-semibold ml-2">• {job.salary_range}</span>}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveJob(idx)}
                              className="text-red-500 hover:text-red-700 font-bold p-1 cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Job Subform */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <input
                        type="text"
                        value={newJobTitle}
                        onChange={e => setNewJobTitle(e.target.value)}
                        placeholder="Job Position (e.g. Frontend Developer, Chef)"
                        className="px-3.5 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:outline-none"
                      />
                      <select
                        value={newJobType}
                        onChange={e => setNewJobType(e.target.value as any)}
                        className="px-3.5 py-2 bg-white rounded-xl border border-slate-200 text-xs font-medium focus:outline-none"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Internship">Internship</option>
                        <option value="Freelance">Freelance</option>
                        <option value="Contract">Contract</option>
                      </select>
                      <input
                        type="text"
                        value={newJobSalary}
                        onChange={e => setNewJobSalary(e.target.value)}
                        placeholder="Salary / Stipend (e.g. ₹25k - ₹35k / month)"
                        className="px-3.5 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:outline-none"
                      />
                      <input
                        type="text"
                        value={newJobExp}
                        onChange={e => setNewJobExp(e.target.value)}
                        placeholder="Experience Required (e.g. 1-2 years / Freshers)"
                        className="px-3.5 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:outline-none"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleAddJob}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Job Opening</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowRegisterModal(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-[#D85A30] hover:bg-[#c04a22] text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
                  >
                    {submitting ? 'Submitting...' : 'Submit for Admin Verification'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
