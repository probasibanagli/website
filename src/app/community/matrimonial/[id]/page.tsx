'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, MapPin, GraduationCap, Briefcase, CheckCircle2, Lock, Heart,
  MessageCircle, Star, Share2, Flag, User, Users, BookOpen, Utensils,
  Ruler, Droplets, Phone, Mail, Sparkles, ChevronRight, Eye, Video, UserPlus, ArrowRight, AlertCircle, Globe,
  Loader2, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/card';
import {
  getProfile, getAllProfiles, recordView, getViewCount,
  isShortlisted, toggleShortlist, hasInterest, sendInterest, getMyProfile, getMedia
} from '@/lib/matrimony-service';
import type { MatrimonialProfile } from '@/types';
import { useAuth } from '@/lib/auth/AuthContext';
import { calculateMatchPercentage, type MatchResult } from '@/lib/match-utils';

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
      <div>
        <p className="text-xs text-text-muted">{label}</p>
        <p className="text-sm font-medium text-text-primary">{value}</p>
      </div>
    </div>
  );
}

function SectionCard({ title, icon: Icon, children, className }: { title: string; icon: React.ElementType; children: React.ReactNode; className?: string }) {
  return (
    <Card hover={false} className={className}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
      {children}
    </Card>
  );
}

export default function MatrimonialDetailPage() {
  const { firebaseUser, profile: userProfile, loading: authLoading } = useAuth();
  const params = useParams();
  const [profile, setProfile] = useState<MatrimonialProfile | undefined>(undefined);
  const [shortlisted, setShortlisted] = useState(false);
  const [interestSent, setInterestSent] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [myProfileData, setMyProfileData] = useState<MatrimonialProfile | null>(null);
  const [sendingInterest, setSendingInterest] = useState(false);
  const [interestMessage, setInterestMessage] = useState('');

  // Media states
  const [photoPreviews, setPhotoPreviews] = useState<(string | null)[]>([null, null, null, null, null]);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);

  const [similarProfiles, setSimilarProfiles] = useState<MatrimonialProfile[]>([]);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);

  useEffect(() => {
    let mounted = true;
    const id = params.id as string;
    
    const loadProfileData = async () => {
      try {
        const p = await getProfile(id);
        if (!mounted) return;
        setProfile(p);
        
        let myProfile = firebaseUser ? await getMyProfile(firebaseUser.uid) : null;
        if (!mounted) return;
        setHasProfile(!!myProfile);
        setMyProfileData(myProfile);

        if (p) {
          await recordView(id);
          const views = await getViewCount(id);
          if (!mounted) return;
          setViewCount(views);
          
          if (myProfile) {
            const isShort = await isShortlisted(myProfile.id, id);
            const hasInt = await hasInterest(myProfile.id, id);
            if (!mounted) return;
            setShortlisted(isShort);
            setInterestSent(hasInt);
            
            if (myProfile.id !== p.id) {
              setMatchResult(calculateMatchPercentage(myProfile, p));
            }
          }

          const allProfiles = await getAllProfiles();
          if (mounted) {
            const similar = allProfiles
              .filter(op => op.id !== p.id && op.published && (op.city === p.city || Math.abs((op.age || 0) - (p.age || 0)) <= 5))
              .slice(0, 3);
            setSimilarProfiles(similar);
          }

          // Load media from Firestore / Storage URLs
          const previews: (string | null)[] = [null, null, null, null, null];
          let hasAnyPhoto = false;
          if (p.photos && Array.isArray(p.photos)) {
            for (let i = 0; i < 5; i++) {
              const key = p.photos[i];
              if (key) {
                const url = await getMedia(key);
                if (url) {
                  previews[i] = url;
                  hasAnyPhoto = true;
                }
              }
            }
          }
          if (!mounted) return;
          setPhotoPreviews(previews);

          const firstPhotoIdx = previews.findIndex(url => url !== null);
          if (firstPhotoIdx !== -1) {
            setActivePhotoIndex(firstPhotoIdx);
          }

          if (p.video) {
            const vUrl = await getMedia(p.video);
            if (vUrl && mounted) setVideoPreview(vUrl);
          }
        }
      } catch (error) {
        console.error("Error loading profile details:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (!authLoading) {
      loadProfileData();
    }
    
    return () => { mounted = false; };
  }, [params.id, firebaseUser, authLoading]);

  if (loading || hasProfile === null || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface animate-fade-in">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!firebaseUser) {
    return (
      <div className="min-h-screen bg-surface">
        {/* Mock Hero Banner */}
        <div className="bg-gradient-to-r from-primary via-primary-dark to-[#7a2d14] py-6">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/community/matrimonial" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" /> Back to profiles
            </Link>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 -mt-8 pb-12 animate-fade-in">
          <Card className="relative overflow-hidden border border-primary/20 shadow-xl bg-white/95 backdrop-blur-md p-8 sm:p-12 text-center">
            <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-accent/10 blur-3xl" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-light to-accent-light flex items-center justify-center mb-6 shadow-md ring-4 ring-primary/10 animate-bounce">
                <Lock className="w-8 h-8 text-primary" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold font-display text-text-primary mb-3">
                Profile is Locked
              </h2>
              
              <p className="text-text-muted max-w-xl mx-auto mb-8 text-sm sm:text-base leading-relaxed">
                To protect the privacy of our members, you must sign up and verify your credentials to view full profile details, family backgrounds, and partner preferences.
              </p>

              {/* Call to Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md">
                <Link href="/auth/register" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="w-full sm:px-8 shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center justify-center gap-2">
                    <UserPlus className="w-5 h-5" /> Sign Up Now
                  </Button>
                </Link>
                <Link href="/community/matrimonial" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:px-8 border-border text-text-primary hover:bg-surface">
                    Cancel & Go Back
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!userProfile?.email_verified || !userProfile?.phone_verified) {
    return (
      <div className="min-h-screen bg-surface">
        {/* Mock Hero Banner */}
        <div className="bg-gradient-to-r from-primary via-primary-dark to-[#7a2d14] py-6">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/community/matrimonial" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" /> Back to profiles
            </Link>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 -mt-8 pb-12 animate-fade-in">
          <Card className="relative overflow-hidden border border-amber-200/60 shadow-xl bg-white/95 backdrop-blur-md p-8 sm:p-12 text-center">
            <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-amber-100/30 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-orange-100/20 blur-3xl" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mb-6 shadow-md ring-4 ring-amber-500/10 animate-pulse">
                <AlertCircle className="w-8 h-8 text-amber-600" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold font-display text-text-primary mb-3">
                Verification Required
              </h2>
              
              <p className="text-text-muted max-w-xl mx-auto mb-8 text-sm sm:text-base leading-relaxed">
                Both your Email ID and Phone Number must be verified to view matrimonial profile details.
              </p>

              {/* Status List */}
              <div className="flex flex-col gap-3 max-w-md w-full mb-8 text-left mx-auto">
                <div className={`p-4 rounded-xl border flex items-center justify-between ${userProfile?.email_verified ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                  <span className="text-sm font-semibold flex items-center gap-2.5">
                    <Mail className="w-4 h-4" /> Email Address
                  </span>
                  <span>{userProfile?.email_verified ? 'Verified' : 'Pending'}</span>
                </div>
                <div className={`p-4 rounded-xl border flex items-center justify-between ${userProfile?.phone_verified ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                  <span className="text-sm font-semibold flex items-center gap-2.5">
                    <Phone className="w-4 h-4" /> Phone Number
                  </span>
                  <span>{userProfile?.phone_verified ? 'Verified' : 'Pending'}</span>
                </div>
              </div>

              {/* Call to Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md">
                <Link href="/profile" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="w-full sm:px-8 shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center justify-center gap-2">
                    <ArrowRight className="w-5 h-5" /> Go to Profile to Verify
                  </Button>
                </Link>
                <Link href="/community/matrimonial" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:px-8 border-border text-text-primary hover:bg-surface">
                    Cancel & Go Back
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!hasProfile) {
    return (
      <div className="min-h-screen bg-surface">
        {/* Mock Hero Banner */}
        <div className="bg-gradient-to-r from-primary via-primary-dark to-[#7a2d14] py-6">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/community/matrimonial" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" /> Back to profiles
            </Link>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 -mt-8 pb-12 animate-fade-in">
          <Card className="relative overflow-hidden border border-primary/20 shadow-xl bg-white/95 backdrop-blur-md p-8 sm:p-12 text-center">
            <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-accent/10 blur-3xl" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-light to-accent-light flex items-center justify-center mb-6 shadow-md ring-4 ring-primary/10 animate-bounce">
                <Lock className="w-8 h-8 text-primary" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold font-display text-text-primary mb-3">
                Profile is Locked
              </h2>
              
              <p className="text-text-muted max-w-xl mx-auto mb-8 text-sm sm:text-base leading-relaxed">
                To protect the privacy of our members, you must register your own matrimonial profile to view full profile details, family backgrounds, partner preferences, and direct contact details.
              </p>

              {/* Call to Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md">
                <Link href="/community/matrimonial/register" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="w-full sm:px-8 shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                    <Heart className="w-5 h-5" /> Register Free Profile
                  </Button>
                </Link>
                <Link href="/community/matrimonial" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:px-8 border-border text-text-primary hover:bg-surface">
                    Cancel & Go Back
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 mx-auto rounded-full bg-primary-light flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold font-display mb-2">Profile Not Found</h2>
          <p className="text-text-muted mb-6">This profile may have been removed or is no longer available.</p>
          <Link href="/community/matrimonial">
            <Button variant="primary">Browse Profiles</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleShortlist = async () => {
    if (!myProfileData || !profile) return;
    await toggleShortlist(myProfileData.id, profile.id);
    const result = await isShortlisted(myProfileData.id, profile.id);
    setShortlisted(result);
  };

  const handleSendInterest = async () => {
    if (!myProfileData || !profile) {
      alert('Please register your profile first to send interest.');
      return;
    }

    // Save locally first
    await sendInterest(myProfileData.id, profile.id);
    setInterestSent(true);
    setSendingInterest(true);
    setInterestMessage('');

    // Send email notification
    try {
      const res = await fetch('/api/matrimony/send-interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: profile.email,
          senderName: myProfileData.full_name,
          senderProfileId: myProfileData.profile_id,
          senderPhone: myProfileData.phone,
          senderEmail: myProfileData.email,
          senderSocialHandle: myProfileData.social_handle,
          senderProfession: myProfileData.profession,
          senderAge: myProfileData.age,
          senderCity: myProfileData.city,
          senderProfilePageId: myProfileData.id,
        }),
      });
      const data = await res.json();
      if (data.success && data.emailSent) {
        setInterestMessage('🎉 Interest sent! Your profile details have been emailed directly to this member.');
      } else if (data.success && data.reason === 'SMTP not configured') {
        setInterestMessage('✅ Interest expressed & recorded! (Add GMAIL_EMAIL & GMAIL_PASSWORD in .env.local to enable live email delivery).');
      } else if (data.success) {
        setInterestMessage('✅ Interest expressed & recorded! Email delivery failed.');
      } else {
        setInterestMessage('Interest recorded locally.');
      }
    } catch {
      setInterestMessage('Interest recorded. Email notification service offline.');
    } finally {
      setSendingInterest(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface bg-alpana">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary via-primary-dark to-[#7a2d14] py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/community/matrimonial" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to profiles
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header Card */}
            <Card padding="lg" hover={false} className="relative overflow-hidden border border-primary/10">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent" />
              
              {photoPreviews.some(photo => photo !== null) ? (
                <div className="flex flex-col md:flex-row gap-6 pt-2">
                  {/* Photo Gallery Column */}
                  <div className="w-full md:w-56 shrink-0 flex flex-col items-center">
                    <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden bg-surface border border-border relative group shadow-sm">
                      <img 
                        src={photoPreviews[activePhotoIndex] || ''} 
                        alt={profile.full_name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {profile.verified && (
                        <div className="absolute top-3 left-3 bg-accent text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase shadow flex items-center gap-1">
                          ✓ Verified
                        </div>
                      )}
                    </div>
                    
                    {/* Thumbnails strip */}
                    <div className="flex gap-1.5 mt-2 justify-center max-w-full overflow-x-auto py-1">
                      {photoPreviews.map((photo, idx) => {
                        if (!photo) return null;
                        return (
                          <button
                            key={idx}
                            onClick={() => setActivePhotoIndex(idx)}
                            className={`w-9 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                              activePhotoIndex === idx ? 'border-primary scale-105 shadow-sm' : 'border-transparent opacity-75 hover:opacity-100'
                            }`}
                          >
                            <img src={photo} alt="" className="w-full h-full object-cover" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Profile Header Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-2xl sm:text-3xl font-bold font-display">{profile.full_name}</h1>
                        {profile.verified && <CheckCircle2 className="w-6 h-6 text-accent" />}
                      </div>
                      <p className="text-text-muted mt-1">
                        {profile.age} years old • {profile.gender === 'male' ? 'Male' : 'Female'} • {profile.city}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {profile.verified ? <Badge variant="verified">Admin Verified</Badge> : <Badge variant="amber">Verification Pending</Badge>}
                        {profile.profile_id && <Badge variant="bengali">{profile.profile_id}</Badge>}
                        {profile.religion && <Badge variant="default">{profile.religion}</Badge>}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-4 text-xs text-text-muted border-t border-border/50 pt-3">
                      <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-primary/70" /> {viewCount} views</span>
                      <span>Member since {new Date(profile.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-start gap-5 pt-2">
                  <div className={`w-24 h-24 sm:w-28 sm:h-36 rounded-2xl flex flex-col items-center justify-center text-3xl font-bold shrink-0 relative overflow-hidden bg-gradient-to-br ${
                    profile.gender === 'male'
                      ? 'from-blue-50 via-blue-100 to-blue-200 text-blue-600'
                      : 'from-pink-50 via-pink-100 to-pink-200 text-pink-600'
                  } border border-dashed border-primary/20`}>
                    <div className="absolute inset-1 border border-primary/5 rounded-xl" />
                    <span className="text-4xl font-display">{profile.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
                    <span className="text-[10px] uppercase tracking-wider text-text-muted mt-2">No Photo</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-2xl sm:text-3xl font-bold font-display">{profile.full_name}</h1>
                      {profile.verified && <CheckCircle2 className="w-6 h-6 text-accent" />}
                    </div>
                    <p className="text-text-muted mt-1">
                      {profile.age} years old • {profile.gender === 'male' ? 'Male' : 'Female'} • {profile.city}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {profile.verified ? <Badge variant="verified">Admin Verified</Badge> : <Badge variant="amber">Verification Pending</Badge>}
                      {profile.profile_id && <Badge variant="bengali">{profile.profile_id}</Badge>}
                      {profile.religion && <Badge variant="default">{profile.religion}</Badge>}
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-xs text-text-muted">
                      <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-primary/70" /> {viewCount} views</span>
                      <span>Member since {new Date(profile.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Facts Strip */}
              <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-border/40">
                {[
                  profile.height && `📏 ${profile.height}`,
                  profile.weight && `⚖️ ${profile.weight}`,
                  profile.complexion && `🎨 ${profile.complexion}`,
                  profile.marital_status && `💍 ${profile.marital_status}`,
                  profile.diet && `🍽️ ${profile.diet}`,
                  profile.blood_group && `🩸 ${profile.blood_group}`,
                ].filter(Boolean).map((fact) => (
                  <span key={fact} className="px-3 py-1.5 rounded-full text-xs font-medium bg-surface border border-border">
                    {fact}
                  </span>
                ))}
              </div>
            </Card>

            {/* Personal Information */}
            <SectionCard title="Personal Information" icon={User}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                <InfoRow icon={User} label="Full Name" value={profile.full_name} />
                <InfoRow icon={User} label="Age" value={profile.age ? `${profile.age} years` : undefined} />
                <InfoRow icon={Ruler} label="Height" value={profile.height} />
                <InfoRow icon={User} label="Weight" value={profile.weight} />
                <InfoRow icon={User} label="Complexion" value={profile.complexion} />
                <InfoRow icon={Droplets} label="Blood Group" value={profile.blood_group} />
                <InfoRow icon={User} label="Marital Status" value={profile.marital_status} />
                <InfoRow icon={User} label="Mother Tongue" value={profile.mother_tongue} />
                <InfoRow icon={MapPin} label="Current City" value={profile.city} />
                <InfoRow icon={MapPin} label="Native District (WB)" value={profile.native_district} />
              </div>
            </SectionCard>

            {/* Family Background */}
            {(profile.father_name || profile.mother_name || profile.family_type) && (
              <SectionCard title="Family Background" icon={Users}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                  <InfoRow icon={User} label="Father's Name" value={profile.father_name} />
                  <InfoRow icon={Briefcase} label="Father's Occupation" value={profile.father_occupation} />
                  <InfoRow icon={User} label="Mother's Name" value={profile.mother_name} />
                  <InfoRow icon={Briefcase} label="Mother's Occupation" value={profile.mother_occupation} />
                  <InfoRow icon={Users} label="Siblings" value={profile.siblings} />
                  <InfoRow icon={Users} label="Family Type" value={profile.family_type} />
                  <InfoRow icon={Users} label="Family Values" value={profile.family_values} />
                  <InfoRow icon={Users} label="Family Status" value={profile.family_status} />
                </div>
              </SectionCard>
            )}

            {/* Education & Career */}
            <SectionCard title="Education & Career" icon={GraduationCap}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                <InfoRow icon={GraduationCap} label="Education" value={profile.education} />
                <InfoRow icon={BookOpen} label="Field of Study" value={profile.field_of_study} />
                <InfoRow icon={GraduationCap} label="Institution" value={profile.institution} />
                <InfoRow icon={Briefcase} label="Profession" value={profile.profession} />
                <InfoRow icon={Briefcase} label="Company" value={profile.company} />
                <InfoRow icon={Briefcase} label="Annual Income" value={profile.annual_income} />
                <InfoRow icon={MapPin} label="Work City" value={profile.work_city} />
              </div>
            </SectionCard>

            {/* Religious & Cultural */}
            {(profile.religion || profile.caste || profile.sub_caste || profile.gotra || profile.raasi || profile.star) && (
              <SectionCard title="Religious & Cultural" icon={BookOpen}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                  <InfoRow icon={BookOpen} label="Religion" value={profile.religion} />
                  <InfoRow icon={BookOpen} label="Caste" value={profile.caste} />
                  <InfoRow icon={BookOpen} label="Sub-Caste" value={profile.sub_caste} />
                  {profile.religion === 'Hindu' && (
                    <>
                      <InfoRow icon={BookOpen} label="Gotra" value={profile.gotra} />
                      <InfoRow icon={BookOpen} label="Raasi (Zodiac Sign)" value={profile.raasi} />
                      <InfoRow icon={BookOpen} label="Star (Nakshatra)" value={profile.star} />
                    </>
                  )}
                  <InfoRow icon={BookOpen} label="Manglik" value={profile.manglik} />
                </div>
              </SectionCard>
            )}

            {/* Lifestyle & Interests */}
            {(profile.diet || profile.smoking || profile.hobbies) && (
              <SectionCard title="Lifestyle & Interests" icon={Utensils}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 mb-4">
                  <InfoRow icon={Utensils} label="Diet" value={profile.diet} />
                  <InfoRow icon={User} label="Smoking" value={profile.smoking} />
                  <InfoRow icon={User} label="Drinking" value={profile.drinking} />
                </div>
                {profile.hobbies && profile.hobbies.length > 0 && (
                  <div>
                    <p className="text-xs text-text-muted mb-2">Hobbies & Interests</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.hobbies.map(hobby => (
                        <span key={hobby} className="px-3 py-1 rounded-full text-xs font-medium bg-primary-light text-primary border border-primary/10">
                          {hobby}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </SectionCard>
            )}

            {/* About Me */}
            {profile.about_me && (
              <Card hover={false}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-accent-light flex items-center justify-center">
                    <Heart className="w-4 h-4 text-accent" />
                  </div>
                  <h3 className="text-lg font-bold">About Me</h3>
                </div>
                <div className="border-l-3 border-primary/30 pl-4">
                  <p className="text-text-muted leading-relaxed italic">&ldquo;{profile.about_me}&rdquo;</p>
                </div>
              </Card>
            )}

            {/* Intro Video Card */}
            {videoPreview && (
              <Card hover={false} className="overflow-hidden border border-primary/10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                    <Video className="w-4 h-4 text-red-500" />
                  </div>
                  <h3 className="text-lg font-bold">Intro Video</h3>
                </div>
                <div className="max-w-md mx-auto aspect-video rounded-2xl overflow-hidden bg-black border border-border shadow-inner relative group">
                  <video 
                    src={videoPreview} 
                    controls 
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-xs text-text-muted text-center mt-2.5">
                  🎥 Listen to {profile.full_name}&apos;s personal introduction
                </p>
              </Card>
            )}

            {/* Partner Preference */}
            {(profile.partner_preference || profile.pref_age_min) && (
              <SectionCard title="Partner Preference" icon={Sparkles}>
                {profile.partner_preference && (
                  <p className="text-text-muted leading-relaxed mb-4 italic">&ldquo;{profile.partner_preference}&rdquo;</p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                  {(profile.pref_age_min || profile.pref_age_max) && (
                    <InfoRow icon={User} label="Preferred Age" value={`${profile.pref_age_min || '—'} to ${profile.pref_age_max || '—'} years`} />
                  )}
                  {(profile.pref_height_min || profile.pref_height_max) && (
                    <InfoRow icon={Ruler} label="Preferred Height" value={`${profile.pref_height_min || '—'} to ${profile.pref_height_max || '—'}`} />
                  )}
                  <InfoRow icon={GraduationCap} label="Preferred Education" value={profile.pref_education} />
                  <InfoRow icon={Briefcase} label="Preferred Profession" value={profile.pref_profession} />
                  <InfoRow icon={MapPin} label="Preferred City" value={profile.pref_city} />
                  <InfoRow icon={Utensils} label="Preferred Diet" value={profile.pref_diet} />
                  <InfoRow icon={User} label="Preferred Marital Status" value={profile.pref_marital_status} />
                </div>
              </SectionCard>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Match Percentage Card */}
            {matchResult && matchResult.percentage > 0 && (
              <Card hover={false} className="relative overflow-hidden border border-primary/10">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-amber-400 to-red-400" />
                <div className="flex items-center gap-4 pt-1">
                  {/* Circular Progress */}
                  <div className="relative w-20 h-20 shrink-0">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke={matchResult.percentage >= 75 ? '#22c55e' : matchResult.percentage >= 50 ? '#f59e0b' : '#9ca3af'}
                        strokeWidth="3"
                        strokeDasharray={`${matchResult.percentage}, 100`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-lg font-bold ${
                        matchResult.percentage >= 75 ? 'text-green-600' : matchResult.percentage >= 50 ? 'text-amber-600' : 'text-gray-500'
                      }`}>
                        {matchResult.percentage}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text-primary">Profile Match</h3>
                    <p className="text-xs text-text-muted mt-0.5">
                      {matchResult.percentage >= 75 ? 'Great match!' : matchResult.percentage >= 50 ? 'Good match' : 'Partial match'}
                    </p>
                  </div>
                </div>
                {/* Criteria Breakdown */}
                <div className="mt-4 space-y-1.5">
                  {matchResult.criteria.map(c => (
                    <div key={c.key} className="flex items-center justify-between text-xs">
                      <span className="text-text-muted">{c.label}</span>
                      <span className={`font-semibold ${c.matched ? 'text-green-600' : 'text-red-400'}`}>
                        {c.matched ? '✓ Match' : '✗ No match'}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Contact Card */}
            <Card hover={false} className="bg-gradient-to-br from-pink-50 to-white sticky top-4">
              <h3 className="text-lg font-bold mb-4">Contact Information</h3>
              <div className="space-y-3 text-sm text-text-primary">
                {profile.phone && (
                  <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary shrink-0" /> {profile.phone}</p>
                )}
                {profile.email && (
                  <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary shrink-0" /> {profile.email}</p>
                )}
                {profile.social_handle && (
                  <p className="flex items-center gap-2"><Globe className="w-4 h-4 text-primary shrink-0" /> {profile.social_handle}</p>
                )}
                {!profile.phone && !profile.email && !profile.social_handle && (
                  <p className="text-xs text-text-muted italic">No contact details provided.</p>
                )}
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                variant="primary"
                className="w-full"
                onClick={handleSendInterest}
                disabled={interestSent || sendingInterest}
              >
                {sendingInterest ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                ) : interestSent ? (
                  <><CheckCircle className="w-4 h-4" /> Interest Sent ✓</>
                ) : (
                  <><Heart className="w-4 h-4" /> Send Interest</>
                )}
              </Button>
              {interestMessage && (
                <p className={`text-xs text-center px-2 py-1.5 rounded-lg ${
                  interestMessage.includes('emailed') ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  {interestMessage}
                </p>
              )}
              <Button
                variant={shortlisted ? 'secondary' : 'outline'}
                className="w-full"
                onClick={handleShortlist}
              >
                <Star className={`w-4 h-4 ${shortlisted ? 'fill-current' : ''}`} />
                {shortlisted ? 'Shortlisted ✓' : 'Add to Shortlist'}
              </Button>
              <Button variant="ghost" className="w-full text-text-muted">
                <Share2 className="w-4 h-4" /> Share Profile
              </Button>
              <Button variant="ghost" className="w-full text-text-muted text-xs">
                <Flag className="w-3 h-3" /> Report
              </Button>
            </div>

            {/* Similar Profiles */}
            {similarProfiles.length > 0 && (
              <Card hover={false}>
                <h3 className="text-sm font-bold mb-3">Similar Profiles</h3>
                <div className="space-y-3">
                  {similarProfiles.map(p => (
                    <Link key={p.id} href={`/community/matrimonial/${p.id}`} className="flex items-center gap-3 group">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                        p.gender === 'male' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'
                      }`}>
                        {p.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{p.full_name}</p>
                        <p className="text-xs text-text-muted">{p.age} yrs • {p.city}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
                    </Link>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
