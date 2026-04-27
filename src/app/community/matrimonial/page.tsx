'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, MapPin, GraduationCap, Briefcase, CheckCircle2, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { sampleMatrimonialProfiles } from '@/data/sample-data';
import { CITIES } from '@/lib/constants';

export default function MatrimonialPage() {
  const [gender, setGender] = useState('');
  const [city, setCity] = useState('');

  const filtered = useMemo(() => {
    return sampleMatrimonialProfiles.filter((p) => {
      if (!p.published) return false;
      if (gender && p.gender !== gender) return false;
      if (city && p.city !== city) return false;
      return true;
    });
  }, [gender, city]);

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
            <Link href="/" className="hover:text-primary">Home</Link><span>/</span>
            <span className="text-text-primary font-medium">Matrimonial</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold font-display text-text-primary">Matrimonial</h1>
              <p className="mt-2 text-text-muted">Find your Bengali life partner in Tamil Nadu.</p>
            </div>
            <Link href="/community/matrimonial/register">
              <Button variant="primary">Register Profile</Button>
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <select value={gender} onChange={(e) => setGender(e.target.value)} className="px-4 py-2.5 rounded-xl border border-border text-sm">
              <option value="">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <select value={city} onChange={(e) => setCity(e.target.value)} className="px-4 py-2.5 rounded-xl border border-border text-sm">
              <option value="">All Cities</option>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((profile) => (
            <Card key={profile.id} className="group">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-light to-accent-light flex items-center justify-center text-2xl shrink-0">
                  {profile.gender === 'male' ? '👨' : '👩'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-text-primary">{profile.full_name}</h3>
                    {profile.verified && <CheckCircle2 className="w-4 h-4 text-accent" />}
                  </div>
                  <p className="text-sm text-text-muted">{profile.age} yrs • {profile.city}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <GraduationCap className="w-4 h-4 flex-shrink-0" /> {profile.education}
                </div>
                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <Briefcase className="w-4 h-4 flex-shrink-0" /> {profile.profession}
                </div>
                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <MapPin className="w-4 h-4 flex-shrink-0" /> From {profile.native_district}
                </div>
              </div>

              {profile.about_me && (
                <p className="mt-3 text-sm text-text-muted italic line-clamp-2">&ldquo;{profile.about_me}&rdquo;</p>
              )}

              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <div className="flex gap-2">
                  {profile.verified && <Badge variant="verified">Verified</Badge>}
                  {!profile.verified && <Badge variant="amber">Pending</Badge>}
                </div>
                <Link href={`/community/matrimonial/${profile.id}`}>
                  <Button variant="primary" size="sm">View Profile</Button>
                </Link>
              </div>

              {/* Contact blur overlay */}
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
            </Card>
          ))}
        </div>
        {filtered.length === 0 && (<div className="text-center py-20"><p className="text-5xl mb-4">💑</p><h3 className="text-xl font-bold mb-2">No profiles found</h3><p className="text-text-muted">Try different filters or <Link href="/community/matrimonial/register" className="text-primary underline">register your profile</Link>.</p></div>)}
      </div>
    </div>
  );
}
