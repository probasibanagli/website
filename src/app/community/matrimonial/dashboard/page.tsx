'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Heart, Star, Eye, Edit3, User, CheckCircle, Clock, XCircle,
  AlertTriangle, Users, MessageCircle, Trash2, ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import {
  getMyProfile, getInterestsSent, getInterestsReceived, getShortlist,
  getProfile, getViewCount, deleteMyProfile, toggleShortlist, getMedia
} from '@/lib/matrimony-service';
import type { MatrimonialProfile } from '@/types';

function ProfileCardAvatar({ profile, className = "w-12 h-12" }: { profile: any; className?: string }) {
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
      <div className={`${className} rounded-xl overflow-hidden shrink-0 border border-border shadow-sm`}>
        <img src={photoUrl} alt={profile.full_name} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className={`${className} rounded-xl flex items-center justify-center text-sm font-bold shrink-0 shadow-sm ${
      profile.gender === 'male' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'
    }`}>
      {profile.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
    </div>
  );
}

function ProfileMiniCard({ profile, action }: { profile: MatrimonialProfile; action?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-border/50 hover:border-primary/30 transition-all">
      <ProfileCardAvatar profile={profile} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-semibold truncate">{profile.full_name}</p>
          {profile.verified && <CheckCircle className="w-3 h-3 text-accent shrink-0" />}
        </div>
        <p className="text-xs text-text-muted">{profile.age} yrs • {profile.city} • {profile.profession}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {action}
        <Link href={`/community/matrimonial/${profile.id}`}>
          <Button variant="ghost" size="sm"><ExternalLink className="w-3.5 h-3.5" /></Button>
        </Link>
      </div>
    </div>
  );
}

export default function MatrimonialDashboard() {
  const [myProfile, setMyProfile] = useState<MatrimonialProfile | null>(null);
  const [interestsSent, setInterestsSent] = useState<MatrimonialProfile[]>([]);
  const [interestsReceived, setInterestsReceived] = useState<MatrimonialProfile[]>([]);
  const [shortlisted, setShortlisted] = useState<MatrimonialProfile[]>([]);
  const [viewCount, setViewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'received' | 'sent' | 'shortlist'>('received');

  useEffect(() => {
    const profile = getMyProfile();
    setMyProfile(profile);

    if (profile) {
      // Interests sent
      const sentInterests = getInterestsSent(profile.id);
      setInterestsSent(sentInterests.map(i => getProfile(i.toId)).filter(Boolean) as MatrimonialProfile[]);

      // Interests received
      const receivedInterests = getInterestsReceived(profile.id);
      setInterestsReceived(receivedInterests.map(i => getProfile(i.fromId)).filter(Boolean) as MatrimonialProfile[]);

      // Shortlist
      const shortlistIds = getShortlist();
      setShortlisted(shortlistIds.map(id => getProfile(id)).filter(Boolean) as MatrimonialProfile[]);

      // Views
      setViewCount(getViewCount(profile.id));
    }

    setLoading(false);
  }, []);

  const handleRemoveShortlist = (profileId: string) => {
    toggleShortlist(profileId);
    setShortlisted(prev => prev.filter(p => p.id !== profileId));
  };

  const handleDeleteProfile = () => {
    if (confirm('Are you sure you want to delete your matrimonial profile? This action cannot be undone.')) {
      deleteMyProfile();
      setMyProfile(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // No profile registered
  if (!myProfile) {
    return (
      <div className="min-h-screen bg-surface">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Link href="/community/matrimonial" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Matrimonial
          </Link>
          <div className="text-center py-16 animate-fade-in">
            <div className="w-24 h-24 mx-auto rounded-full bg-primary-light flex items-center justify-center mb-6">
              <Heart className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold font-display mb-3">Welcome to Matrimony Dashboard</h1>
            <p className="text-text-muted max-w-md mx-auto mb-8">
              You haven&apos;t registered your matrimonial profile yet. Register now to find your Bengali life partner in Tamil Nadu.
            </p>
            <Link href="/community/matrimonial/register">
              <Button variant="primary" size="lg">
                <Heart className="w-5 h-5" /> Register Your Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = {
    draft: { icon: Edit3, color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200', label: 'Draft', desc: 'Complete your profile and submit for review.' },
    pending: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Pending Review', desc: 'Your profile is being reviewed by our admin team.' },
    approved: { icon: CheckCircle, color: 'text-accent', bg: 'bg-accent-light', border: 'border-emerald-200', label: 'Approved & Live', desc: 'Your profile is live and visible to other members.' },
    verified: { icon: CheckCircle, color: 'text-accent', bg: 'bg-accent-light', border: 'border-emerald-200', label: 'Verified & Live', desc: 'Your profile is verified and visible to other members.' },
    rejected: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200', label: 'Rejected', desc: 'Your profile was rejected. Please update and resubmit.' },
    married: { icon: Heart, color: 'text-pink-500', bg: 'bg-pink-50', border: 'border-pink-200', label: 'Matched & Married', desc: 'Congratulations! Your profile has been retired from public view.' },
  };

  const status = statusConfig[myProfile.status || 'pending'];
  const StatusIcon = status.icon;

  const tabs = [
    { key: 'received' as const, label: 'Interests Received', count: interestsReceived.length, icon: Heart },
    { key: 'sent' as const, label: 'Interests Sent', count: interestsSent.length, icon: MessageCircle },
    { key: 'shortlist' as const, label: 'Shortlisted', count: shortlisted.length, icon: Star },
  ];

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        <Link href="/community/matrimonial" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Matrimonial
        </Link>

        <h1 className="text-3xl font-bold font-display mb-8">My Matrimony Dashboard</h1>

        {/* Profile Card */}
        <Card padding="lg" hover={false} className="mb-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent" />
          <div className="flex flex-col sm:flex-row items-start gap-5 pt-2">
            <ProfileCardAvatar profile={myProfile} className="w-20 h-20" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{myProfile.full_name}</h2>
                {myProfile.verified && <CheckCircle className="w-5 h-5 text-accent" />}
              </div>
              <p className="text-sm text-text-muted mt-0.5">
                {myProfile.age} yrs • {myProfile.height} • {myProfile.city} • {myProfile.profession}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="bengali">{myProfile.profile_id}</Badge>
                {myProfile.religion && <Badge variant="default">{myProfile.religion}</Badge>}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Link href="/community/matrimonial/edit">
                <Button variant="outline" size="sm"><Edit3 className="w-4 h-4" /> Edit</Button>
              </Link>
              <Link href={`/community/matrimonial/${myProfile.id}`}>
                <Button variant="primary" size="sm"><ExternalLink className="w-4 h-4" /> View</Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Status + Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Status */}
          <Card hover={false} className={`${status.bg} ${status.border} border`}>
            <div className="flex items-center gap-3">
              <StatusIcon className={`w-6 h-6 ${status.color}`} />
              <div>
                <p className={`text-sm font-bold ${status.color}`}>{status.label}</p>
                <p className="text-xs text-text-muted">{status.desc}</p>
              </div>
            </div>
          </Card>

          {/* Stats */}
          {[
            { icon: Eye, label: 'Profile Views', value: viewCount, color: 'text-blue-500' },
            { icon: Heart, label: 'Interests', value: interestsReceived.length, color: 'text-pink-500' },
            { icon: Star, label: 'Shortlisted', value: shortlisted.length, color: 'text-amber-500' },
          ].map(stat => (
            <Card key={stat.label} hover={false}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-text-muted">{stat.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 border border-border">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  activeTab === tab.key
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text-muted hover:text-text-primary hover:bg-surface'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center ${
                    activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-primary-light text-primary'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="space-y-3 animate-fade-in">
          {activeTab === 'received' && (
            interestsReceived.length > 0 ? (
              interestsReceived.map(p => (
                <ProfileMiniCard key={p.id} profile={p} action={
                  <Badge variant="bengali">Interested in you</Badge>
                } />
              ))
            ) : (
              <EmptyState icon={Heart} message="No interests received yet" sub="Your profile will attract interests once approved." />
            )
          )}

          {activeTab === 'sent' && (
            interestsSent.length > 0 ? (
              interestsSent.map(p => (
                <ProfileMiniCard key={p.id} profile={p} action={
                  <Badge variant="verified">Interest Sent</Badge>
                } />
              ))
            ) : (
              <EmptyState icon={MessageCircle} message="No interests sent yet" sub="Browse profiles and send interest to people you like." />
            )
          )}

          {activeTab === 'shortlist' && (
            shortlisted.length > 0 ? (
              shortlisted.map(p => (
                <ProfileMiniCard key={p.id} profile={p} action={
                  <button onClick={() => handleRemoveShortlist(p.id)} className="text-text-muted hover:text-red-500 transition-colors cursor-pointer p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                } />
              ))
            ) : (
              <EmptyState icon={Star} message="No profiles shortlisted" sub="Shortlist profiles you're interested in for easy access later." />
            )
          )}
        </div>

        {/* Danger Zone */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex items-center justify-between p-4 rounded-xl bg-red-50 border border-red-200">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm font-semibold text-red-700">Delete Profile</p>
                <p className="text-xs text-red-500">Permanently remove your matrimonial profile</p>
              </div>
            </div>
            <Button variant="danger" size="sm" onClick={handleDeleteProfile}>
              <Trash2 className="w-4 h-4" /> Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, message, sub }: { icon: React.ElementType; message: string; sub: string }) {
  return (
    <div className="text-center py-12 animate-fade-in">
      <div className="w-16 h-16 mx-auto rounded-full bg-surface border border-border flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-text-muted" />
      </div>
      <h3 className="text-lg font-bold mb-1">{message}</h3>
      <p className="text-sm text-text-muted">{sub}</p>
    </div>
  );
}
