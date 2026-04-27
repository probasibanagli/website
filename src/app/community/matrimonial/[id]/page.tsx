'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, MapPin, GraduationCap, Briefcase, CheckCircle2, Lock, Heart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { sampleMatrimonialProfiles } from '@/data/sample-data';

export default function MatrimonialDetailPage() {
  const params = useParams();
  const profile = sampleMatrimonialProfiles.find((p) => p.id === params.id);

  if (!profile) {
    return (<div className="min-h-screen flex items-center justify-center"><div className="text-center"><p className="text-5xl mb-4">💑</p><h2 className="text-2xl font-bold mb-2">Profile Not Found</h2><Link href="/community/matrimonial"><Button variant="primary">Back to Profiles</Button></Link></div></div>);
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/community/matrimonial" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to profiles
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card padding="lg">
              <div className="flex items-start gap-5">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-light to-accent-light flex items-center justify-center text-4xl shrink-0">
                  {profile.gender === 'male' ? '👨' : '👩'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold font-display">{profile.full_name}</h1>
                    {profile.verified && <CheckCircle2 className="w-5 h-5 text-accent" />}
                  </div>
                  <p className="text-text-muted mt-1">{profile.age} years old • {profile.gender}</p>
                  <div className="flex gap-2 mt-2">
                    {profile.verified ? <Badge variant="verified">Admin Verified</Badge> : <Badge variant="amber">Verification Pending</Badge>}
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-bold mb-4">Personal Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-primary" /><div><p className="text-text-muted">Current City</p><p className="font-medium">{profile.city}</p></div></div>
                <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-primary" /><div><p className="text-text-muted">Native District</p><p className="font-medium">{profile.native_district}</p></div></div>
                <div className="flex items-center gap-3"><GraduationCap className="w-4 h-4 text-primary" /><div><p className="text-text-muted">Education</p><p className="font-medium">{profile.education}</p></div></div>
                <div className="flex items-center gap-3"><Briefcase className="w-4 h-4 text-primary" /><div><p className="text-text-muted">Profession</p><p className="font-medium">{profile.profession}</p></div></div>
              </div>
            </Card>

            {profile.about_me && <Card><h3 className="text-lg font-bold mb-3">About Me</h3><p className="text-text-muted leading-relaxed">{profile.about_me}</p></Card>}
            {profile.partner_preference && <Card><h3 className="text-lg font-bold mb-3">Partner Preference</h3><p className="text-text-muted leading-relaxed">{profile.partner_preference}</p></Card>}
          </div>

          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-pink-50 to-white">
              <h3 className="text-lg font-bold mb-4">Contact Info</h3>
              <div className="relative">
                <div className="blur-md select-none space-y-2 text-sm"><p>📞 +91 98765 43210</p><p>✉️ name@example.com</p><p>💬 WhatsApp available</p></div>
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center gap-3 p-4">
                  <Lock className="w-8 h-8 text-primary" />
                  <p className="text-sm font-medium text-text-primary text-center">Login to view contact details</p>
                  <Link href="/auth/login"><Button variant="primary" size="sm">Login Now</Button></Link>
                </div>
              </div>
            </Card>
            <div className="space-y-3">
              <Button variant="primary" className="w-full"><Heart className="w-4 h-4" /> Send Interest</Button>
              <Button variant="outline" className="w-full"><MessageCircle className="w-4 h-4" /> WhatsApp</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
