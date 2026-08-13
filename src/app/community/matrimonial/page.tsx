'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Link from 'next/link';
import {
  Search, MapPin, GraduationCap, Briefcase, CheckCircle2, Lock, Heart,
  SlidersHorizontal, X, ChevronDown, Users, Star, ArrowUpDown, Ruler,
  Utensils, User, UserPlus, AlertCircle, Mail, Phone, ArrowRight, Banknote, Building
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/button';
import { CustomSelect } from '@/components/ui/CustomSelect';

import { CITIES, MARITAL_STATUSES, DIET_TYPES, EDUCATION_LEVELS, RELIGIONS } from '@/lib/constants';
import { getMyProfile, searchProfiles, sortProfiles, getAllProfiles, type MatrimonyFilters, type SortOption, getMedia } from '@/lib/matrimony-service';
import { useAuth } from '@/lib/auth/AuthContext';
import { calculateMatchPercentage } from '@/lib/match-utils';
import type { MatrimonialProfile } from '@/types';

function ProfileCardAvatar({ profile, className = "w-16 h-16" }: { profile: any; className?: string }) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadAvatar = async () => {
      const mainPhotoKey = profile.profile_photo || (profile.photos && Array.isArray(profile.photos) ? (profile.photos[profile.profile_picture_index || 0] || profile.photos.find((k: string) => k)) : null);
      if (mainPhotoKey) {
        const url = await getMedia(mainPhotoKey);
        if (url) {
          setPhotoUrl(url);
        }
      }
    };
    loadAvatar();
  }, [profile.profile_photo, profile.profile_picture_index, profile.photos]);

  if (photoUrl) {
    return (
      <div className={`${className} rounded-2xl overflow-hidden shrink-0 border border-border shadow-sm`}>
        <img src={photoUrl} alt={profile.full_name} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className={`${className} rounded-2xl flex items-center justify-center text-xl font-bold shrink-0 shadow-sm ${
      profile.gender === 'male'
        ? 'bg-blue-100 text-blue-600'
        : 'bg-pink-100 text-pink-600'
    }`}>
      {profile.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
    </div>
  );
}

export default function MatrimonialPage() {
  const { firebaseUser, profile: userProfile, loading: authLoading } = useAuth();
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [myProfile, setMyProfile] = useState<MatrimonialProfile | null>(null);
  const [allProfs, setAllProfs] = useState<MatrimonialProfile[]>([]);

  useEffect(() => {
    let mounted = true;
    const fetchProfiles = async () => {
      try {
        const all = await getAllProfiles();
        if (!mounted) return;
        setAllProfs(all);

        let mp = firebaseUser ? await getMyProfile(firebaseUser.uid) : null;
        
        // Auto-link if logged in but local link is missing
        if (!mp && firebaseUser) {
          const found = all.find(p => 
            (firebaseUser.email && p.email === firebaseUser.email) || 
            (firebaseUser.phoneNumber && p.phone === firebaseUser.phoneNumber)
          );
          if (found) {
            // Update the profile with the user_id so it's linked permanently in Firestore
            const m = await import('@/lib/matrimony-service');
            found.user_id = firebaseUser.uid;
            await m.saveMyProfile(found);
            mp = found;
          }
        }
        
        if (mounted) {
          setHasProfile(!!mp);
          setMyProfile(mp);
        }
      } catch (err) {
        console.error(err);
        if (mounted) setHasProfile(false);
      }
    };
    fetchProfiles();
    return () => { mounted = false; };
  }, [firebaseUser]);

  const [filters, setFilters] = useState<MatrimonyFilters>({});
  const [sort, setSort] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(9);
  const [activeTab, setActiveTab] = useState<'browse' | 'matches'>('browse');

  const updateFilter = useCallback((key: keyof MatrimonyFilters, value: string | number | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value || undefined }));
    setVisibleCount(9);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setSearchQuery('');
    setVisibleCount(9);
  }, []);

  const filtered = useMemo(() => {
    let results = searchProfiles(allProfs, { ...filters, searchQuery });
    if (myProfile) {
      results = results.filter(p => 
        p.id !== myProfile.id && 
        !(p.email && p.email === myProfile.email) &&
        !(p.phone && p.phone === myProfile.phone)
      );
    }
    return sortProfiles(results, sort);
  }, [filters, searchQuery, sort, myProfile, allProfs]);

  // Automatic matching: find mutual matches
  const autoMatches = useMemo(() => {
    if (!myProfile) return [];
    const myGender = myProfile.gender?.toLowerCase();
    const targetGender = (myGender === 'male' || myGender === 'groom') ? 'female' : (myGender === 'female' || myGender === 'bride') ? 'male' : null;
    
    const all = allProfs.filter(p => {
      if (p.id === myProfile.id) return false;
      if (p.email && p.email === myProfile.email) return false;
      if (p.phone && p.phone === myProfile.phone) return false;
      if (!p.published) return false;
      if (targetGender && p.gender) {
        const pg = p.gender.toLowerCase();
        if (targetGender === 'female' && pg !== 'female' && pg !== 'bride') return false;
        if (targetGender === 'male' && pg !== 'male' && pg !== 'groom') return false;
      }
      return true;
    });

    const matches = all.map(candidate => {
      const myMatchOnCandidate = calculateMatchPercentage(myProfile, candidate);
      const candidateMatchOnMe = calculateMatchPercentage(candidate, myProfile);
      const mutualScore = Math.round((myMatchOnCandidate.percentage + candidateMatchOnMe.percentage) / 2);
      return { profile: candidate, myScore: myMatchOnCandidate.percentage, theirScore: candidateMatchOnMe.percentage, mutualScore };
    })
    .filter(m => m.myScore >= 50 && m.theirScore >= 50)
    .sort((a, b) => b.mutualScore - a.mutualScore);
    return matches;
  }, [myProfile, allProfs]);

  const displayProfiles = activeTab === 'browse' ? filtered : autoMatches.map(m => m.profile);
  const visibleProfiles = displayProfiles.slice(0, visibleCount);
  const hasMore = visibleCount < displayProfiles.length;
  const activeFilterCount = Object.values(filters).filter(v => v !== undefined && v !== '').length;

  // Stats
  const totalProfiles = allProfs.length;
  const verifiedProfiles = allProfs.filter(p => p.verified).length;
  const availableCities = useMemo(() => {
    return Array.from(new Set(allProfs.map(p => p.city).filter(Boolean).map(c => {
      const trimmed = c!.trim();
      return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
    }))).sort();
  }, [allProfs]);
  const citiesCount = availableCities.length;

  return (
    <div className="min-h-screen bg-surface bg-alpana">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-primary border-b border-border/10">
        <div className="absolute inset-0 bg-[url('/images/bengali_wedding_background.png')] bg-cover bg-center opacity-25 mix-blend-overlay" />
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-accent/30 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        </div>

        <div className="relative max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex items-center gap-2 text-sm text-white/70 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/community/matrimonial" className="hover:text-white transition-colors">Community</Link>
            <span>/</span>
            <span className="text-white font-medium">Matrimonial</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="animate-fade-in">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white leading-tight">
                বাঙালি বিবাহ
              </h1>
              <p className="mt-2 text-lg sm:text-xl text-white/90 font-bengali">
                Find Your Bengali Life Partner in Tamil Nadu
              </p>
              <p className="mt-1 text-white/60 text-sm">
                Trusted by Bengali families across Tamil Nadu for meaningful connections
              </p>
            </div>

            <div className="flex gap-3 animate-fade-in delay-200">
              {authLoading ? (
                <div className="h-11 w-40 bg-white/10 animate-pulse rounded-xl" />
              ) : !firebaseUser ? (
                <>
                  <Link href="/auth/register?redirect=/community/matrimonial">
                    <Button variant="secondary" size="lg" className="shadow-lg flex items-center gap-2">
                      <UserPlus className="w-5 h-5" /> Sign Up
                    </Button>
                  </Link>
                  <Link href="/auth/login?redirect=/community/matrimonial">
                    <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
                      Login
                    </Button>
                  </Link>
                </>
              ) : (!userProfile?.email_verified || !userProfile?.phone_verified) ? (
                <Link href="/profile">
                  <Button variant="secondary" size="lg" className="shadow-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" /> Verify Account
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/community/matrimonial/register">
                    <Button variant="secondary" size="lg" className="shadow-lg">
                      <Heart className="w-5 h-5" /> Register Free
                    </Button>
                  </Link>
                  <Link href="/community/matrimonial/dashboard">
                    <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
                      My Dashboard
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 flex flex-wrap gap-6 animate-fade-in delay-300">
            {[
              { icon: Users, label: 'Registered Profiles', value: hasProfile === null ? '-' : totalProfiles.toString() },
              { icon: CheckCircle2, label: 'Verified Profiles', value: hasProfile === null ? '-' : verifiedProfiles.toString() },
              { icon: MapPin, label: 'Cities Covered', value: hasProfile === null ? '-' : citiesCount.toString() },
              { icon: Star, label: 'Success Stories', value: '50+' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                <stat.icon className="w-5 h-5 text-accent-light" />
                <div>
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-white/60">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {hasProfile === null || authLoading ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl border border-border p-6">
                <Skeleton className="w-32 h-6 mb-4" />
                <div className="space-y-4">
                  <Skeleton className="w-full h-10 rounded-xl" />
                  <Skeleton className="w-full h-10 rounded-xl" />
                </div>
              </div>
            </div>
            <div className="lg:col-span-3 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-2xl border border-border p-6 text-center">
                    <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" />
                    <Skeleton className="w-48 h-6 mx-auto mb-2" />
                    <Skeleton className="w-full h-10 rounded-xl mt-4" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : !firebaseUser ? (
        <div className="max-w-4xl mx-auto px-4 py-16 animate-fade-in">
          <Card className="relative overflow-hidden border border-primary/20 shadow-xl bg-white/80 backdrop-blur-md p-8 sm:p-12 text-center">
            {/* Soft decorative background glow */}
            <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-accent/10 blur-3xl" />

            <div className="relative z-10 flex flex-col items-center">
              {/* Animated Lock Badge */}
              <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center mb-6 shadow-md ring-4 ring-primary/10 animate-bounce">
                <Lock className="w-8 h-8 text-primary" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold font-display text-text-primary mb-3">
                Unlock Matrimonial Profiles
              </h2>
              
              <p className="text-text-muted max-w-xl mx-auto mb-8 text-sm sm:text-base leading-relaxed">
                This matrimonial portal is exclusive to Bengali community members residing in Tamil Nadu. To protect the privacy of our brides and grooms, profile browsing is restricted to registered and verified members only.
              </p>

              {/* Feature Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-8 text-left">
                {[
                  { text: 'Browse 100+ verified profiles in Tamil Nadu', icon: <Search className="w-5 h-5 text-black" /> },
                  { text: 'Filter by caste, profession, education, and city', icon: <SlidersHorizontal className="w-5 h-5 text-black" /> },
                  { text: 'Send connection interests and chat directly', icon: <Mail className="w-5 h-5 text-black" /> },
                  { text: 'Safe & secure environment with admin verification', icon: <Lock className="w-5 h-5 text-black" /> },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-border/50">
                    <div className="shrink-0">{item.icon}</div>
                    <span className="text-xs sm:text-sm text-text-muted leading-snug">{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Call to Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md">
                <Link href="/auth/register?redirect=/community/matrimonial" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="w-full sm:px-8 shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center justify-center gap-2">
                    <UserPlus className="w-5 h-5" /> Sign Up Now
                  </Button>
                </Link>
                <Link href="/auth/login?redirect=/community/matrimonial" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:px-8 border-border text-text-primary hover:bg-surface">
                    Login to Account
                  </Button>
                </Link>
              </div>

              <p className="text-[11px] text-text-muted mt-6 max-w-xs">
                By registering, you agree to our terms of service and consent to email & phone verification.
              </p>
            </div>
          </Card>
        </div>
      ) : (!userProfile?.email_verified || !userProfile?.phone_verified) ? (
        <div className="max-w-4xl mx-auto px-4 py-16 animate-fade-in">
          <Card className="relative overflow-hidden border border-amber-200/60 shadow-xl bg-white/80 backdrop-blur-md p-8 sm:p-12 text-center animate-fade-in">
            {/* Soft decorative background glow */}
            <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-amber-100/30 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-orange-100/20 blur-3xl" />

            <div className="relative z-10 flex flex-col items-center">
              {/* Animated Warning Badge */}
              <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mb-6 shadow-md ring-4 ring-amber-500/10 animate-pulse">
                <AlertCircle className="w-8 h-8 text-amber-600" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold font-display text-text-primary mb-3">
                Verification Required
              </h2>
              
              <p className="text-text-muted max-w-xl mx-auto mb-8 text-sm sm:text-base leading-relaxed">
                To protect the privacy of our brides and grooms, both your <strong>Email ID</strong> and <strong>Phone Number</strong> must be verified before you can access the matrimonial section.
              </p>

              {/* Status List */}
              <div className="flex flex-col gap-3 max-w-md w-full mb-8 text-left mx-auto">
                <div className={`p-4 rounded-xl border flex items-center justify-between ${userProfile?.email_verified ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                  <span className="text-sm font-semibold flex items-center gap-2.5">
                    <Mail className="w-4 h-4" /> Email Address {userProfile?.email && `(${userProfile.email})`}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/55 shadow-sm border border-black/5">
                    {userProfile?.email_verified ? 'Verified' : 'Pending'}
                  </span>
                </div>
                <div className={`p-4 rounded-xl border flex items-center justify-between ${userProfile?.phone_verified ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                  <span className="text-sm font-semibold flex items-center gap-2.5">
                    <Phone className="w-4 h-4" /> Phone Number {userProfile?.phone && `(${userProfile.phone})`}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/55 shadow-sm border border-black/5">
                    {userProfile?.phone_verified ? 'Verified' : 'Pending'}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <Link href="/profile" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:px-8 shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center justify-center gap-2">
                  <ArrowRight className="w-5 h-5" /> Go to Profile to Verify
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      ) : !hasProfile ? (
        <div className="max-w-4xl mx-auto px-4 py-16 animate-fade-in">
          <Card className="relative overflow-hidden border border-primary/20 shadow-xl bg-white/80 backdrop-blur-md p-8 sm:p-12 text-center">
            {/* Soft decorative background glow */}
            <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-accent/10 blur-3xl" />

            <div className="relative z-10 flex flex-col items-center">
              {/* Animated Lock Badge */}
              <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center mb-6 shadow-md ring-4 ring-primary/10 animate-bounce">
                <Lock className="w-8 h-8 text-primary" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold font-display text-text-primary mb-3">
                Unlock Matrimonial Profiles
              </h2>
              
              <p className="text-text-muted max-w-xl mx-auto mb-8 text-sm sm:text-base leading-relaxed">
                This matrimonial portal is exclusive to Bengali community members residing in Tamil Nadu. To protect the privacy of our brides and grooms, profile browsing is restricted to registered members only.
              </p>

              {/* Feature Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-8 text-left">
                {[
                  { text: 'Browse 100+ verified profiles in Tamil Nadu', icon: <Search className="w-5 h-5 text-black" /> },
                  { text: 'Filter by caste, profession, education, and city', icon: <SlidersHorizontal className="w-5 h-5 text-black" /> },
                  { text: 'Send connection interests and chat directly', icon: <Mail className="w-5 h-5 text-black" /> },
                  { text: 'Safe & secure environment with admin verification', icon: <Lock className="w-5 h-5 text-black" /> },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-border/50">
                    <div className="shrink-0">{item.icon}</div>
                    <span className="text-xs sm:text-sm text-text-muted leading-snug">{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Call to Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md">
                <Link href="/community/matrimonial/register" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="w-full sm:px-8 shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                    <Heart className="w-5 h-5" /> Register Free Profile
                  </Button>
                </Link>
                <Link href="/community/matrimonial/dashboard" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:px-8 border-border text-text-primary hover:bg-surface">
                    Already registered? Dashboard
                  </Button>
                </Link>
              </div>

              <p className="text-[11px] text-text-muted mt-6 max-w-xs">
                By registering, you agree to our terms of service and consent to admin review of your profile details.
              </p>
            </div>
          </Card>
        </div>
      ) : (
        <>
          {/* Search & Filter Bar */}
          <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
            <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Search by name, ID (PB-0001), profession..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(9); }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>

                {/* Quick Filters */}
                <div className="hidden sm:block w-44">
                  <CustomSelect
                    value={filters.gender || ''}
                    onChange={(val) => updateFilter('gender', val)}
                    options={[
                      { value: '', label: 'All Genders' },
                      { value: 'male', label: 'Groom (Male)' },
                      { value: 'female', label: 'Bride (Female)' }
                    ]}
                    placeholder="All Genders"
                    searchable={false}
                  />
                </div>

                <div className="hidden sm:block w-48">
                  <CustomSelect
                    value={filters.city || ''}
                    onChange={(val) => updateFilter('city', val)}
                    options={[
                      { value: '', label: 'All Cities' },
                      ...availableCities.map(c => ({ value: c, label: c }))
                    ]}
                    placeholder="All Cities"
                    searchable={true}
                  />
                </div>

                {/* Sort */}
                <div className="hidden md:block w-48">
                  <CustomSelect
                    value={sort}
                    onChange={(val) => setSort(val as SortOption)}
                    options={[
                      { value: 'newest', label: 'Newest First' },
                      { value: 'age-low', label: 'Age: Low → High' },
                      { value: 'age-high', label: 'Age: High → Low' }
                    ]}
                    placeholder="Sort By"
                    searchable={false}
                  />
                </div>

                {/* Advanced Filters Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                    showFilters || activeFilterCount > 0
                      ? 'border-primary bg-primary-light text-primary'
                      : 'border-border text-text-muted hover:border-primary/50'
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span className="hidden sm:inline">Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Advanced Filter Panel */}
              {showFilters && (
                <div className="mt-3 p-4 bg-surface rounded-xl border border-border animate-slide-down">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-text-primary">Advanced Filters</h3>
                    <button onClick={clearFilters} className="text-xs text-primary hover:underline cursor-pointer">Clear All</button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {/* Gender - mobile only */}
                    <div className="sm:hidden space-y-1">
                      <label className="text-xs font-medium text-text-muted">Gender</label>
                      <CustomSelect
                        value={filters.gender || ''}
                        onChange={(val) => updateFilter('gender', val)}
                        options={[
                          { value: '', label: 'All' },
                          { value: 'male', label: 'Groom' },
                          { value: 'female', label: 'Bride' }
                        ]}
                        placeholder="All"
                        searchable={false}
                      />
                    </div>

                    {/* City - mobile only */}
                    <div className="sm:hidden space-y-1">
                      <label className="text-xs font-medium text-text-muted">City</label>
                      <CustomSelect
                        value={filters.city || ''}
                        onChange={(val) => updateFilter('city', val)}
                        options={[
                          { value: '', label: 'All Cities' },
                          ...availableCities.map(c => ({ value: c, label: c }))
                        ]}
                        placeholder="All Cities"
                        searchable={true}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-text-muted">Age Min</label>
                      <input type="number" min={18} max={60} placeholder="18" value={filters.ageMin || ''} onChange={(e) => updateFilter('ageMin', e.target.value ? Number(e.target.value) : undefined)} className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-text-muted">Age Max</label>
                      <input type="number" min={18} max={60} placeholder="40" value={filters.ageMax || ''} onChange={(e) => updateFilter('ageMax', e.target.value ? Number(e.target.value) : undefined)} className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-text-muted">Marital Status</label>
                      <CustomSelect
                        value={filters.maritalStatus || ''}
                        onChange={(val) => updateFilter('maritalStatus', val)}
                        options={[
                          { value: '', label: 'Any' },
                          ...MARITAL_STATUSES.map(s => ({ value: s, label: s }))
                        ]}
                        placeholder="Any"
                        searchable={false}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-text-muted">Religion</label>
                      <CustomSelect
                        value={filters.religion || ''}
                        onChange={(val) => updateFilter('religion', val)}
                        options={[
                          { value: '', label: 'Any' },
                          ...RELIGIONS.map(r => ({ value: r, label: r }))
                        ]}
                        placeholder="Any"
                        searchable={false}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-text-muted">Diet</label>
                      <CustomSelect
                        value={filters.diet || ''}
                        onChange={(val) => updateFilter('diet', val)}
                        options={[
                          { value: '', label: 'Any' },
                          ...DIET_TYPES.map(d => ({ value: d, label: d }))
                        ]}
                        placeholder="Any"
                        searchable={false}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Tab Switcher */}
            {myProfile && (
              <div className="flex items-center gap-1 mb-6 p-1 bg-surface rounded-xl border border-border w-fit">
                <button
                  onClick={() => { setActiveTab('browse'); setVisibleCount(9); }}
                  className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'browse'
                      ? 'bg-white text-primary shadow-sm border border-border'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  <Users className="w-4 h-4" /> Browse All
                </button>
                <button
                  onClick={() => { setActiveTab('matches'); setVisibleCount(9); }}
                  className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'matches'
                      ? 'bg-white text-primary shadow-sm border border-border'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  <Heart className="w-4 h-4" /> Find My Matches
                  {autoMatches.length > 0 && (
                    <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">
                      {autoMatches.length}
                    </span>
                  )}
                </button>
              </div>
            )}

            {/* Results count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-text-muted">
                {activeTab === 'matches' ? (
                  <>
                    Found <span className="font-semibold text-text-primary">{autoMatches.length}</span> mutual match{autoMatches.length !== 1 ? 'es' : ''}
                  </>
                ) : (
                  <>
                    Showing <span className="font-semibold text-text-primary">{Math.min(visibleCount, displayProfiles.length)}</span> of{' '}
                    <span className="font-semibold text-text-primary">{displayProfiles.length}</span> profiles
                  </>
                )}
              </p>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="text-sm text-primary hover:underline flex items-center gap-1 cursor-pointer">
                  <X className="w-3 h-3" /> Clear filters
                </button>
              )}
            </div>

            {/* Profile Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {visibleProfiles.map((profile) => (
                <Card key={profile.id} padding="none" className="rounded-[24px] overflow-hidden group flex flex-col justify-between hover:shadow-lg transition-all border border-gray-100 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] bg-white relative">
                  <div>
                    {/* Header Background & Centered Avatar */}
                    <div className="pt-6 pb-3 flex flex-col items-center justify-center bg-[#FFF5F2] relative">
                      <div className="relative">
                        <ProfileCardAvatar profile={profile} className="w-16 h-16 shadow-md rounded-[16px]" />
                        {profile.verified && (
                          <div className="absolute -bottom-1 -right-1 bg-[#0A6C4A] text-white rounded-full p-0.5 border-2 border-white shadow-sm flex items-center justify-center">
                            <CheckCircle2 className="w-3.5 h-3.5 fill-white text-[#0A6C4A]" />
                          </div>
                        )}
                      </div>
                      
                      {/* Name */}
                      <h3 className="text-lg font-bold text-gray-900 mt-3 font-display text-center leading-tight">
                        {profile.full_name}
                      </h3>

                      {/* Subtitle details */}
                      <div className="flex items-center justify-center gap-1.5 mt-1.5 flex-wrap text-xs text-text-muted">
                        <span className="bg-[#FFF0EB] text-[#A63A13] font-bold text-[10px] px-2 py-0.5 rounded border border-[#FBE0D6]">
                          {profile.profile_id}
                        </span>
                        <span>•</span>
                        <span>{profile.age} yrs</span>
                        {profile.height && (
                          <>
                            <span>•</span>
                            <span>{profile.height}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>{profile.city}</span>
                      </div>

                      {/* Info Tags Row */}
                      <div className="flex flex-wrap items-center justify-center gap-1 mt-3 px-3">
                        {profile.marital_status && (
                          <span className="text-[10px] font-semibold text-text-primary bg-surface border border-border px-2.5 py-1 rounded-full">
                            {profile.marital_status}
                          </span>
                        )}
                        {profile.complexion && (
                          <span className="text-[10px] font-semibold text-text-primary bg-surface border border-border px-2.5 py-1 rounded-full">
                            {profile.complexion}
                          </span>
                        )}
                        {profile.diet && (
                          <span className="text-[10px] font-semibold text-text-primary bg-surface border border-border px-2.5 py-1 rounded-full">
                            {profile.diet}
                          </span>
                        )}
                        {profile.religion && (
                          <span className="text-[10px] font-semibold text-text-primary bg-surface border border-border px-2.5 py-1 rounded-full">
                            {profile.religion}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 2x2 Details Grid */}
                    <div className="grid grid-cols-2 gap-y-4 gap-x-3 p-4.5 border-t border-gray-50">
                      {/* Education Column */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FFF0EB] text-[#A63A13] shrink-0">
                          <GraduationCap className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] text-[#8F9BB3] uppercase tracking-wider font-extrabold">Education</p>
                          <p className="text-xs font-bold text-gray-900 leading-tight mt-0.5 truncate">{profile.education}</p>
                          {profile.institution && <p className="text-[10px] text-[#8F9BB3] mt-0.5 truncate">{profile.institution}</p>}
                        </div>
                      </div>

                      {/* Profession Column */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FFF0EB] text-[#A63A13] shrink-0">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] text-[#8F9BB3] uppercase tracking-wider font-extrabold">Profession</p>
                          <p className="text-xs font-bold text-gray-900 leading-tight mt-0.5 truncate">{profile.profession}</p>
                          {profile.company && <p className="text-[10px] text-[#8F9BB3] mt-0.5 truncate">{profile.company}</p>}
                        </div>
                      </div>

                      {/* Income Column */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FFF0EB] text-[#A63A13] shrink-0">
                          <Banknote className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] text-[#8F9BB3] uppercase tracking-wider font-extrabold">Income</p>
                          <p className="text-xs font-bold text-gray-900 leading-tight mt-0.5 truncate">
                            {profile.annual_income && profile.annual_income !== 'Not Disclosed' ? profile.annual_income : 'Not Disclosed'}
                          </p>
                        </div>
                      </div>

                      {/* Hometown Column */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FFF0EB] text-[#A63A13] shrink-0">
                          <Building className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] text-[#8F9BB3] uppercase tracking-wider font-extrabold">Hometown</p>
                          <p className="text-xs font-bold text-gray-900 leading-tight mt-0.5 truncate">{profile.native_district || 'Kolkata'}</p>
                          <p className="text-[10px] text-[#8F9BB3] mt-0.5 truncate">West Bengal</p>
                        </div>
                      </div>
                    </div>

                    {/* About me excerpt */}
                    {profile.about_me && (
                      <div className="px-4.5 pb-4.5 pt-0">
                        <p className="text-[11px] text-text-muted italic line-clamp-2 border-l-2 border-primary/20 pl-2.5">
                          &ldquo;{profile.about_me}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Terracotta Footer Panel */}
                  <div className="bg-[#FFF0EB]/50 border-t border-dashed border-[#FBE0D6]/60 p-4.5 pt-3 pb-4 flex flex-col justify-between">
                    <p className="text-[10px] text-text-muted flex items-center justify-center gap-1 font-medium">
                      <Lock className="w-3 h-3 text-[#A63A13]" /> Express interest to exchange details via email
                    </p>
                    <Link href={`/community/matrimonial/${profile.id}`} className="mt-2.5 block w-full">
                      <button className="w-full bg-[#d85a30] hover:bg-[#c24f28] text-white font-bold py-2.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]">
                        <span>View Profile</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="text-center mt-8">
                <Button variant="outline" size="lg" onClick={() => setVisibleCount(prev => prev + 9)}>
                  Load More {activeTab === 'matches' ? 'Matches' : 'Profiles'} ({displayProfiles.length - visibleCount} remaining)
                </Button>
              </div>
            )}

            {/* Empty State */}
            {displayProfiles.length === 0 && (
              <div className="text-center py-20 animate-fade-in">
                <div className="w-24 h-24 mx-auto rounded-full bg-primary-light flex items-center justify-center mb-6">
                  <Heart className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold font-display mb-2">
                  {activeTab === 'matches' ? 'No mutual matches found yet' : 'No profiles found'}
                </h3>
                <p className="text-text-muted max-w-md mx-auto mb-6">
                  {activeTab === 'matches'
                    ? 'Update your partner preferences to find better matches, or browse all profiles manually.'
                    : 'Try adjusting your filters or search query. You can also register your own profile to get started.'
                  }
                </p>
                <div className="flex gap-3 justify-center">
                  {activeTab === 'matches' ? (
                    <Button variant="ghost" onClick={() => setActiveTab('browse')}>Browse All Profiles</Button>
                  ) : (
                    <Button variant="ghost" onClick={clearFilters}>Clear Filters</Button>
                  )}
                  <Link href="/community/matrimonial/register">
                    <Button variant="primary">Register Your Profile</Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Bottom CTA */}
            {filtered.length > 0 && (
              <div className="mt-12 bg-primary-light rounded-2xl p-8 text-center border border-border">
                <h3 className="text-2xl font-bold font-display mb-2">
                  Didn&apos;t find what you&apos;re looking for?
                </h3>
                <p className="text-text-muted mb-6 max-w-lg mx-auto">
                  Register your profile for free and let verified Bengali families in Tamil Nadu find you. Admin-verified profiles only.
                </p>
                <Link href="/community/matrimonial/register">
                  <Button variant="primary" size="lg">
                    <Heart className="w-5 h-5" /> Register Your Profile — It&apos;s Free
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
