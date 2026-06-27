'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Check, 
  X, 
  Trash2, 
  Heart, 
  Clock, 
  UserCheck, 
  Search, 
  Camera, 
  Video, 
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { 
  getAllProfiles, 
  adminUpdateProfileStatus, 
  adminDeleteProfile,
  getMedia
} from '@/lib/matrimony-service';
import type { MatrimonialProfile } from '@/types';

export default function MatrimonialAdminPage() {
  const [profiles, setProfiles] = useState<MatrimonialProfile[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'archived'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<MatrimonialProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mediaUrls, setMediaUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = () => {
    setLoading(true);
    const all = getAllProfiles();
    setProfiles(all);
    setLoading(false);
  };

  // Load media files from IndexedDB for selected profile
  useEffect(() => {
    if (!selectedProfile) return;
    
    const loadMediaUrls = async () => {
      const urls: Record<string, string> = {};
      
      // Load photos
      if (selectedProfile.photos && Array.isArray(selectedProfile.photos)) {
        for (let i = 0; i < selectedProfile.photos.length; i++) {
          const key = `profile_${selectedProfile.id}_photo_${i}`;
          const url = await getMedia(key);
          if (url) urls[key] = url;
        }
      }
      
      // Load video
      if (selectedProfile.video) {
        const key = `profile_${selectedProfile.id}_video`;
        const url = await getMedia(key);
        if (url) urls[key] = url;
      }
      
      setMediaUrls(urls);
    };

    loadMediaUrls();
  }, [selectedProfile]);

  const handleVerify = (id: string) => {
    adminUpdateProfileStatus(id, 'verified');
    loadProfiles();
    if (selectedProfile?.id === id) {
      setSelectedProfile(prev => prev ? { ...prev, status: 'verified', published: true } : null);
    }
  };

  const handleReject = (id: string) => {
    adminUpdateProfileStatus(id, 'rejected');
    loadProfiles();
    if (selectedProfile?.id === id) {
      setSelectedProfile(prev => prev ? { ...prev, status: 'rejected', published: false } : null);
    }
  };

  const handleMatchedAndMarried = (id: string) => {
    adminUpdateProfileStatus(id, 'married');
    loadProfiles();
    if (selectedProfile?.id === id) {
      setSelectedProfile(prev => prev ? { ...prev, status: 'married', published: false } : null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to permanently delete this profile?')) {
      adminDeleteProfile(id);
      setSelectedProfile(null);
      loadProfiles();
    }
  };

  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      // Filter by tab
      const status = p.status || 'pending';
      if (activeTab === 'pending' && status !== 'pending') return false;
      if (activeTab === 'active' && status !== 'verified' && status !== 'approved') return false;
      if (activeTab === 'archived' && status !== 'rejected' && status !== 'married') return false;

      // Filter by search query
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        return (
          p.full_name?.toLowerCase().includes(q) ||
          p.profile_id?.toLowerCase().includes(q) ||
          p.city?.toLowerCase().includes(q) ||
          p.profession?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [profiles, activeTab, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            💖 Matrimonial Moderation
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Review new profile applications, verify profiles, and manage matched couples.
          </p>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white p-4 rounded-2xl border border-border">
        {/* Tab Controls */}
        <div className="flex gap-2 flex-wrap">
          {[
            { key: 'pending', label: 'Pending Review', icon: Clock, count: profiles.filter(p => (p.status || 'pending') === 'pending').length },
            { key: 'active', label: 'Active Profiles', icon: UserCheck, count: profiles.filter(p => p.status === 'verified' || p.status === 'approved').length },
            { key: 'archived', label: 'Matched / Archived', icon: Heart, count: profiles.filter(p => p.status === 'rejected' || p.status === 'married').length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key as any);
                  setSelectedProfile(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-pink-500 text-white shadow-md'
                    : 'bg-surface hover:bg-pink-50 hover:text-pink-600 text-text-primary border border-border/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-pink-100 text-pink-700'}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative flex-1 md:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search profiles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border text-xs focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all bg-surface"
          />
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile List Panel */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-sm font-bold text-text-primary px-1">
            Profiles ({filteredProfiles.length})
          </h2>

          <div className="space-y-3 overflow-y-auto max-h-[600px] pr-1">
            {filteredProfiles.map((p) => {
              const isSelected = selectedProfile?.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProfile(p)}
                  className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'border-pink-500 ring-2 ring-pink-500/10 bg-pink-50/10'
                      : 'border-border bg-white hover:border-pink-500/40 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-text-primary text-sm">{p.full_name}</h4>
                      <p className="text-[10px] text-pink-600 font-bold mt-0.5">{p.profile_id || 'ID Pending'}</p>
                    </div>
                    <Badge variant={p.gender === 'male' ? 'pg' : 'bengali'} className="text-[9px] px-2">
                      {p.gender === 'male' ? 'Groom' : 'Bride'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-y-1 text-xs text-text-muted mt-3 pt-3 border-t border-border/60">
                    <p>Age: <span className="font-semibold text-text-primary">{p.age || '—'} yrs</span></p>
                    <p>City: <span className="font-semibold text-text-primary">{p.city || '—'}</span></p>
                    <p className="col-span-2 truncate">Profession: <span className="font-semibold text-text-primary">{p.profession || '—'}</span></p>
                  </div>
                </div>
              );
            })}

            {filteredProfiles.length === 0 && (
              <div className="text-center py-10 bg-white border border-dashed border-border rounded-2xl">
                <p className="text-3xl mb-2">🔎</p>
                <p className="text-xs text-text-muted">No matrimonial profiles match this selection.</p>
              </div>
            )}
          </div>
        </div>

        {/* Profile Detail Moderation Panel */}
        <div className="lg:col-span-2">
          {selectedProfile ? (
            <Card className="p-6 space-y-6 bg-white border-border">
              {/* Profile Card Header */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 pb-4 border-b border-border">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-pink-50 flex items-center justify-center text-pink-500 font-bold text-xl border border-pink-100">
                    {selectedProfile.full_name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text-primary">{selectedProfile.full_name}</h3>
                    <p className="text-xs text-pink-600 font-bold mt-0.5">{selectedProfile.profile_id}</p>
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      <Badge variant="default" className="text-[10px]">
                        Status: {selectedProfile.status || 'pending'}
                      </Badge>
                      {selectedProfile.published && (
                        <Badge variant="verified" className="text-[10px]">
                          Publicly Published
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Moderation Button Group */}
                <div className="flex flex-wrap gap-2 self-start">
                  {(selectedProfile.status === 'pending' || selectedProfile.status === 'rejected') && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleVerify(selectedProfile.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white border-none flex items-center gap-1.5 text-xs px-3.5 py-2 cursor-pointer shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve & Publish
                    </Button>
                  )}
                  {selectedProfile.status === 'pending' && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleReject(selectedProfile.id)}
                      className="flex items-center gap-1.5 text-xs px-3.5 py-2 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" /> Reject Application
                    </Button>
                  )}
                  {(selectedProfile.status === 'approved' || selectedProfile.status === 'verified') && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleMatchedAndMarried(selectedProfile.id)}
                      className="bg-pink-500 hover:bg-pink-600 text-white border-none flex items-center gap-1.5 text-xs px-3.5 py-2 cursor-pointer shadow-sm animate-pulse"
                    >
                      <Heart className="w-3.5 h-3.5 fill-current" /> Mark Matched & Married
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(selectedProfile.id)}
                    className="text-red-500 hover:bg-red-50 hover:text-red-700 flex items-center gap-1.5 text-xs px-3.5 py-2 cursor-pointer border border-red-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete Profile
                  </Button>
                </div>
              </div>

              {/* Media Section: Photos & Videos */}
              <div>
                <h4 className="font-bold text-text-primary text-sm mb-3 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-pink-500" /> Uploaded Photos & Video Review
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Photo list */}
                  <div className="md:col-span-2 grid grid-cols-5 gap-2">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const photoKey = `profile_${selectedProfile.id}_photo_${i}`;
                      const photoUrl = mediaUrls[photoKey];
                      
                      return (
                        <div key={i} className="aspect-square bg-surface border border-border rounded-xl flex items-center justify-center relative overflow-hidden group">
                          {photoUrl ? (
                            <>
                              <img src={photoUrl} alt={`Photo ${i+1}`} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                <a href={photoUrl} target="_blank" rel="noopener noreferrer" className="p-1 rounded bg-white text-text-primary hover:text-pink-500">
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            </>
                          ) : (
                            <div className="text-center text-text-muted">
                              <Camera className="w-5 h-5 mx-auto mb-1 opacity-40" />
                              <span className="text-[8px] font-medium block">Photo {i+1}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Video component */}
                  <div className="md:col-span-1 border border-border rounded-xl bg-surface p-3 flex flex-col justify-center items-center aspect-video md:aspect-auto">
                    {mediaUrls[`profile_${selectedProfile.id}_video`] ? (
                      <div className="w-full h-full flex flex-col justify-between">
                        <div className="flex-1 w-full bg-black rounded-lg overflow-hidden flex items-center justify-center">
                          <video 
                            src={mediaUrls[`profile_${selectedProfile.id}_video`]} 
                            controls 
                            className="w-full h-full max-h-40 object-contain"
                          />
                        </div>
                        <p className="text-[10px] text-text-muted text-center mt-2 font-medium flex items-center justify-center gap-1">
                          <Video className="w-3 h-3 text-pink-500" /> Video Uploaded
                        </p>
                      </div>
                    ) : (
                      <div className="text-center text-text-muted py-4">
                        <Video className="w-6 h-6 mx-auto mb-2 opacity-40" />
                        <p className="text-[10px] font-semibold">No Video Uploaded</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Details Block */}
              <div className="bg-surface rounded-2xl p-5 space-y-4">
                <h4 className="font-bold text-text-primary text-sm border-b border-border/80 pb-2">
                  Profile Details Review
                </h4>
                
                {[
                  { title: 'Personal Details', items: [
                    ['Name', selectedProfile.full_name], ['Gender', selectedProfile.gender], ['DOB', selectedProfile.date_of_birth],
                    ['Age', selectedProfile.age ? `${selectedProfile.age} yrs` : null], ['Height', selectedProfile.height], ['Weight', selectedProfile.weight],
                    ['City', selectedProfile.city], ['Native', selectedProfile.native_district], ['Marital Status', selectedProfile.marital_status]
                  ]},
                  { title: 'Education & Profession', items: [
                    ['Education', selectedProfile.education], ['Field of Study', selectedProfile.field_of_study], ['Institution', selectedProfile.institution],
                    ['Profession', selectedProfile.profession], ['Company', selectedProfile.company], ['Work City', selectedProfile.work_city],
                    ['Annual Income', selectedProfile.annual_income]
                  ]},
                  { title: 'Religion & Lifestyle', items: [
                    ['Religion', selectedProfile.religion], ['Sub-caste', selectedProfile.sub_caste], ['Diet', selectedProfile.diet],
                    ['Smoking', selectedProfile.smoking], ['Drinking', selectedProfile.drinking]
                  ]}
                ].map((section) => (
                  <div key={section.title} className="space-y-2">
                    <h5 className="text-xs font-bold text-pink-600 uppercase tracking-wider">{section.title}</h5>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-xs">
                      {section.items.map(([label, value]) => (
                        <div key={label as string} className="p-2 bg-white rounded-lg border border-border/40">
                          <span className="text-text-muted block text-[10px] uppercase font-semibold">{label as string}</span>
                          <span className="font-medium text-text-primary text-xs mt-0.5 block truncate">{(value as string) || '—'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* About Me & Partner Preferences text areas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-3 bg-white border border-border/60 rounded-xl">
                    <h5 className="text-xs font-bold text-pink-600 mb-1.5">About Me</h5>
                    <p className="text-xs text-text-muted leading-relaxed whitespace-pre-line bg-surface p-2.5 rounded-lg border border-border/30">
                      {selectedProfile.about_me || 'No description provided.'}
                    </p>
                  </div>
                  <div className="p-3 bg-white border border-border/60 rounded-xl">
                    <h5 className="text-xs font-bold text-pink-600 mb-1.5">Partner Preferences</h5>
                    <p className="text-xs text-text-muted leading-relaxed whitespace-pre-line bg-surface p-2.5 rounded-lg border border-border/30">
                      {selectedProfile.partner_preference || 'No partner preferences specified.'}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center p-8 bg-white border border-border rounded-3xl">
              <div className="text-center max-w-sm">
                <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-500 mx-auto mb-4 border border-pink-100 shadow-sm">
                  <Heart className="w-8 h-8 fill-current" />
                </div>
                <h3 className="text-lg font-bold text-text-primary">No Profile Selected</h3>
                <p className="text-xs text-text-muted mt-2">
                  Select a profile from the left sidebar to perform moderation, verify, reject, mark matched/married, or review upload files.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
