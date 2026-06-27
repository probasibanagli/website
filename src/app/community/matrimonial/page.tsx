'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Link from 'next/link';
import {
  Search, MapPin, GraduationCap, Briefcase, CheckCircle2, Lock, Heart,
  SlidersHorizontal, X, ChevronDown, Users, Star, ArrowUpDown, Ruler,
  Utensils, User,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { sampleMatrimonialProfiles } from '@/data/sample-data';
import { CITIES, MARITAL_STATUSES, DIET_TYPES, EDUCATION_LEVELS, RELIGIONS } from '@/lib/constants';
import { getMyProfile, searchProfiles, sortProfiles, type MatrimonyFilters, type SortOption, getMedia } from '@/lib/matrimony-service';

function ProfileCardAvatar({ profile, className = "w-16 h-16" }: { profile: any; className?: string }) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadAvatar = async () => {
      if (profile.photos && Array.isArray(profile.photos)) {
        const key = profile.photos.find((k: string) => k);
        if (key) {
          const url = await getMedia(key);
          if (url) {
            setPhotoUrl(url);
          }
        }
      }
    };
    loadAvatar();
  }, [profile.photos]);

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
        ? 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600'
        : 'bg-gradient-to-br from-pink-100 to-pink-200 text-pink-600'
    }`}>
      {profile.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
    </div>
  );
}

export default function MatrimonialPage() {
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);

  useEffect(() => {
    setHasProfile(!!getMyProfile());
  }, []);

  const [filters, setFilters] = useState<MatrimonyFilters>({});
  const [sort, setSort] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(9);

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
    const results = searchProfiles({ ...filters, searchQuery });
    return sortProfiles(results, sort);
  }, [filters, searchQuery, sort]);

  const visibleProfiles = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const activeFilterCount = Object.values(filters).filter(v => v !== undefined && v !== '').length;

  // Stats
  const totalProfiles = sampleMatrimonialProfiles.length;
  const verifiedProfiles = sampleMatrimonialProfiles.filter(p => p.verified).length;
  const citiesCount = new Set(sampleMatrimonialProfiles.map(p => p.city)).size;

  return (
    <div className="min-h-screen bg-surface bg-alpana">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-[#7a2d14] border-b border-border/10">
        <div className="absolute inset-0 bg-[url('/images/bengali_wedding_background.png')] bg-cover bg-center opacity-25 mix-blend-overlay" />
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-accent/30 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
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
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 flex flex-wrap gap-6 animate-fade-in delay-300">
            {[
              { icon: Users, label: 'Registered Profiles', value: totalProfiles.toString() },
              { icon: CheckCircle2, label: 'Verified Profiles', value: verifiedProfiles.toString() },
              { icon: MapPin, label: 'Cities Covered', value: citiesCount.toString() },
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

      {hasProfile === null ? (
        <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center gap-4">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-text-muted">Loading profile status...</p>
        </div>
      ) : !hasProfile ? (
        <div className="max-w-4xl mx-auto px-4 py-16 animate-fade-in">
          <Card className="relative overflow-hidden border border-primary/20 shadow-xl bg-white/80 backdrop-blur-md p-8 sm:p-12 text-center">
            {/* Soft decorative background glow */}
            <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-accent/10 blur-3xl" />

            <div className="relative z-10 flex flex-col items-center">
              {/* Animated Lock Badge */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-light to-accent-light flex items-center justify-center mb-6 shadow-md ring-4 ring-primary/10 animate-bounce">
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
                  { text: 'Browse 100+ verified profiles in Tamil Nadu', icon: '🔍' },
                  { text: 'Filter by caste, profession, education, and city', icon: '🏛️' },
                  { text: 'Send connection interests and chat directly', icon: '📩' },
                  { text: 'Safe & secure environment with admin verification', icon: '🔒' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-surface border border-border/50">
                    <span className="text-lg shrink-0">{item.icon}</span>
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
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
                <select
                  value={filters.gender || ''}
                  onChange={(e) => updateFilter('gender', e.target.value)}
                  className="hidden sm:block px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
                >
                  <option value="">All Genders</option>
                  <option value="male">Groom (Male)</option>
                  <option value="female">Bride (Female)</option>
                </select>

                <select
                  value={filters.city || ''}
                  onChange={(e) => updateFilter('city', e.target.value)}
                  className="hidden sm:block px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
                >
                  <option value="">All Cities</option>
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>

                {/* Sort */}
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="hidden md:block px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="age-low">Age: Low → High</option>
                  <option value="age-high">Age: High → Low</option>
                </select>

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
                      <select value={filters.gender || ''} onChange={(e) => updateFilter('gender', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border text-sm">
                        <option value="">All</option>
                        <option value="male">Groom</option>
                        <option value="female">Bride</option>
                      </select>
                    </div>

                    {/* City - mobile only */}
                    <div className="sm:hidden space-y-1">
                      <label className="text-xs font-medium text-text-muted">City</label>
                      <select value={filters.city || ''} onChange={(e) => updateFilter('city', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border text-sm">
                        <option value="">All Cities</option>
                        {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-text-muted">Age Min</label>
                      <input type="number" min={18} max={60} placeholder="18" value={filters.ageMin || ''} onChange={(e) => updateFilter('ageMin', e.target.value ? Number(e.target.value) : undefined)} className="w-full px-3 py-2 rounded-lg border border-border text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-text-muted">Age Max</label>
                      <input type="number" min={18} max={60} placeholder="40" value={filters.ageMax || ''} onChange={(e) => updateFilter('ageMax', e.target.value ? Number(e.target.value) : undefined)} className="w-full px-3 py-2 rounded-lg border border-border text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-text-muted">Marital Status</label>
                      <select value={filters.maritalStatus || ''} onChange={(e) => updateFilter('maritalStatus', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border text-sm">
                        <option value="">Any</option>
                        {MARITAL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-text-muted">Religion</label>
                      <select value={filters.religion || ''} onChange={(e) => updateFilter('religion', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border text-sm">
                        <option value="">Any</option>
                        {RELIGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-text-muted">Diet</label>
                      <select value={filters.diet || ''} onChange={(e) => updateFilter('diet', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border text-sm">
                        <option value="">Any</option>
                        {DIET_TYPES.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Results count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-text-muted">
                Showing <span className="font-semibold text-text-primary">{Math.min(visibleCount, filtered.length)}</span> of{' '}
                <span className="font-semibold text-text-primary">{filtered.length}</span> profiles
              </p>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="text-sm text-primary hover:underline flex items-center gap-1 cursor-pointer">
                  <X className="w-3 h-3" /> Clear filters
                </button>
              )}
            </div>

            {/* Profile Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleProfiles.map((profile) => (
                <Card key={profile.id} className="group relative overflow-hidden">
                  {/* Top accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent" />

                  <div className="pt-2">
                    {/* Header */}
                    <div className="flex items-start gap-4">
                      <ProfileCardAvatar profile={profile} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-lg font-bold text-text-primary truncate">{profile.full_name}</h3>
                          {profile.verified && <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />}
                        </div>
                        <p className="text-sm text-text-muted">
                          {profile.age} yrs{profile.height ? ` • ${profile.height}` : ''} • {profile.city}
                        </p>
                        <p className="text-xs text-primary font-medium mt-0.5">{profile.profile_id}</p>
                      </div>
                    </div>

                    {/* Info pills */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {profile.marital_status && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-surface text-text-muted border border-border">
                          <User className="w-3 h-3 mr-1" />{profile.marital_status}
                        </span>
                      )}
                      {profile.complexion && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-surface text-text-muted border border-border">
                          {profile.complexion}
                        </span>
                      )}
                      {profile.diet && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-surface text-text-muted border border-border">
                          <Utensils className="w-3 h-3 mr-1" />{profile.diet}
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="mt-3 space-y-1.5">
                      <div className="flex items-center gap-2 text-sm text-text-muted">
                        <GraduationCap className="w-4 h-4 flex-shrink-0 text-primary/70" />
                        <span className="truncate">{profile.education}{profile.institution ? ` — ${profile.institution}` : ''}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-text-muted">
                        <Briefcase className="w-4 h-4 flex-shrink-0 text-primary/70" />
                        <span className="truncate">{profile.profession}{profile.company ? ` at ${profile.company}` : ''}</span>
                      </div>
                      {profile.annual_income && profile.annual_income !== 'Not Disclosed' && (
                        <div className="flex items-center gap-2 text-sm text-text-muted">
                          <span className="w-4 h-4 flex-shrink-0 text-center text-primary/70 text-xs font-bold">₹</span>
                          <span>{profile.annual_income}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-text-muted">
                        <MapPin className="w-4 h-4 flex-shrink-0 text-primary/70" />
                        <span>From {profile.native_district}, West Bengal</span>
                      </div>
                    </div>

                    {/* About excerpt */}
                    {profile.about_me && (
                      <p className="mt-3 text-sm text-text-muted italic line-clamp-2 border-l-2 border-primary/20 pl-3">
                        &ldquo;{profile.about_me}&rdquo;
                      </p>
                    )}

                    {/* Footer */}
                    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                      <div className="flex gap-1.5">
                        {profile.verified && <Badge variant="verified">✓ Verified</Badge>}
                        {!profile.verified && <Badge variant="amber">Pending</Badge>}
                        {profile.religion && <Badge variant="default">{profile.religion}</Badge>}
                      </div>
                      <Link href={`/community/matrimonial/${profile.id}`}>
                        <Button variant="primary" size="sm">View Profile</Button>
                      </Link>
                    </div>

                    {/* Contact blur */}
                    <div className="mt-3 relative">
                      <div className="blur-sm select-none text-sm text-text-muted">📞 98765XXXXX • ✉️ email@hidden.com</div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Link href="/auth/login">
                          <Badge variant="bengali" className="cursor-pointer">
                            <Lock className="w-3 h-3 mr-1" /> Login to view contact
                          </Badge>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="text-center mt-8">
                <Button variant="outline" size="lg" onClick={() => setVisibleCount(prev => prev + 9)}>
                  Load More Profiles ({filtered.length - visibleCount} remaining)
                </Button>
              </div>
            )}

            {/* Empty State */}
            {filtered.length === 0 && (
              <div className="text-center py-20 animate-fade-in">
                <div className="w-24 h-24 mx-auto rounded-full bg-primary-light flex items-center justify-center mb-6">
                  <Heart className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold font-display mb-2">No profiles found</h3>
                <p className="text-text-muted max-w-md mx-auto mb-6">
                  Try adjusting your filters or search query. You can also register your own profile to get started.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button variant="ghost" onClick={clearFilters}>Clear Filters</Button>
                  <Link href="/community/matrimonial/register">
                    <Button variant="primary">Register Your Profile</Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Bottom CTA */}
            {filtered.length > 0 && (
              <div className="mt-12 bg-gradient-to-r from-primary-light via-white to-accent-light rounded-2xl p-8 text-center border border-border">
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
