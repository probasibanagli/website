'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Users, ExternalLink, Search, Globe, MapPin, Camera, MessageCircle, Briefcase, Send, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { sampleCommunityGroups } from '@/data/sample-data';
import { useFirestore } from '@/lib/hooks/useFirestore';
import { CommunityGroup } from '@/types';

/* ── Platform config — icons instead of emojis ── */
const PLATFORMS = [
  { key: 'instagram', label: 'Instagram', icon: <Camera className="w-5 h-5" />, color: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400', textColor: 'text-white', ringColor: 'ring-pink-300', badgeColor: 'bg-pink-50 text-pink-600' },
  { key: 'facebook', label: 'Facebook', icon: <BookOpen className="w-5 h-5" />, color: 'bg-gradient-to-br from-blue-600 to-blue-500', textColor: 'text-white', ringColor: 'ring-blue-300', badgeColor: 'bg-blue-50 text-blue-600' },
  { key: 'linkedin', label: 'LinkedIn', icon: <Briefcase className="w-5 h-5" />, color: 'bg-gradient-to-br from-blue-700 to-sky-600', textColor: 'text-white', ringColor: 'ring-sky-300', badgeColor: 'bg-sky-50 text-sky-600' },
  { key: 'website', label: 'Website', icon: <Globe className="w-5 h-5" />, color: 'bg-gradient-to-br from-emerald-500 to-teal-500', textColor: 'text-white', ringColor: 'ring-teal-300', badgeColor: 'bg-teal-50 text-teal-600' },
  { key: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle className="w-5 h-5" />, color: 'bg-gradient-to-br from-green-500 to-green-600', textColor: 'text-white', ringColor: 'ring-green-300', badgeColor: 'bg-green-50 text-green-600' },
  { key: 'telegram', label: 'Telegram', icon: <Send className="w-5 h-5" />, color: 'bg-gradient-to-br from-sky-400 to-blue-500', textColor: 'text-white', ringColor: 'ring-sky-300', badgeColor: 'bg-blue-50 text-blue-600' },
];

const REGIONS = [
  { key: 'tamil_nadu', label: 'Tamil Nadu' },
  { key: 'india', label: 'India' },
  { key: 'all', label: 'Worldwide' },
];

function getPlatformConfig(key: string) {
  return PLATFORMS.find(p => p.key === key) || PLATFORMS[0];
}

function getPlatformLink(group: typeof sampleCommunityGroups[0]) {
  if (group.platform === 'instagram' && group.instagram_url) return group.instagram_url;
  if (group.platform === 'facebook' && group.facebook_url) return group.facebook_url;
  if (group.platform === 'linkedin' && group.linkedin_url) return group.linkedin_url;
  if (group.platform === 'website' && group.website_url) return group.website_url;
  return group.join_url || '#';
}

function getPlatformButtonLabel(platform: string) {
  switch (platform) {
    case 'instagram': return 'Open';
    case 'facebook': return 'Open';
    case 'linkedin': return 'Open';
    case 'website': return 'Visit';
    case 'whatsapp': return 'Join';
    case 'telegram': return 'Join';
    default: return 'Open';
  }
}

export default function GroupsPage() {
  const { data: firestoreGroups, loading } = useFirestore<CommunityGroup>('community_groups');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [search, setSearch] = useState('');

  const combinedGroups = useMemo(() => {
    const firestoreIds = new Set(firestoreGroups.map((g) => g.id));
    const dedupedSample = sampleCommunityGroups.filter((g) => !firestoreIds.has(g.id));
    return [...firestoreGroups, ...dedupedSample];
  }, [firestoreGroups]);

  const filtered = useMemo(() => {
    return combinedGroups.filter((g) => {
      if (selectedPlatform && g.platform !== selectedPlatform) return false;
      if (selectedRegion && g.region !== selectedRegion) return false;
      if (search && !g.name.toLowerCase().includes(search.toLowerCase()) && !(g.description || '').toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [combinedGroups, selectedPlatform, selectedRegion, search]);

  const handlePlatformChange = (platform: string) => {
    setSelectedPlatform(platform === selectedPlatform ? '' : platform);
  };

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-3">
            <Link href="/" className="hover:text-primary">Home</Link><span>/</span>
            <span className="text-text-primary font-medium">Community Groups</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-text-primary">Community Groups</h1>
          <p className="mt-1 text-text-muted text-sm">Connect with Bengali communities across Tamil Nadu and beyond.</p>

          {/* Inline filter bar */}
          <div className="mt-5 flex flex-col gap-3">
            {/* Platform tabs */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedPlatform('')}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                  !selectedPlatform ? 'bg-primary text-white shadow-md' : 'bg-surface text-text-primary hover:bg-primary/5'
                }`}
              >
                <Globe className="w-3.5 h-3.5" /> All
              </button>
              {PLATFORMS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => handlePlatformChange(p.key)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                    selectedPlatform === p.key
                      ? `${p.color} ${p.textColor} shadow-md`
                      : 'bg-surface text-text-primary hover:bg-primary/5'
                  }`}
                >
                  {React.cloneElement(p.icon as React.ReactElement, { className: 'w-3.5 h-3.5' })}
                  {p.label}
                </button>
              ))}
            </div>

            {/* Region + Search */}
            <div className="flex flex-wrap items-center gap-2">
              {REGIONS.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setSelectedRegion(r.key === selectedRegion ? '' : r.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    selectedRegion === r.key
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-white border border-border text-text-muted hover:border-primary'
                  }`}
                >
                  {r.label}
                </button>
              ))}

              <div className="relative flex-1 min-w-[180px] max-w-xs ml-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search groups..." className="w-full pl-9 pr-3 py-2 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-sm text-text-muted mb-6">
          <span className="font-semibold text-text-primary">{filtered.length}</span> groups found
          {selectedPlatform && <> on <span className="font-semibold text-primary capitalize">{getPlatformConfig(selectedPlatform).label}</span></>}
          {selectedRegion && <> · <span className="font-medium">{REGIONS.find(r => r.key === selectedRegion)?.label}</span></>}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((group) => {
            const pConfig = getPlatformConfig(group.platform || 'whatsapp');
            const link = getPlatformLink(group);
            const buttonLabel = getPlatformButtonLabel(group.platform || 'whatsapp');

            return (
              <Card key={group.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                {/* Platform color strip */}
                <div className={`h-1 -mx-6 -mt-6 mb-4 ${pConfig.color}`} />

                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl ${pConfig.badgeColor} flex items-center justify-center shrink-0`}>
                    {React.cloneElement(pConfig.icon as React.ReactElement, { className: 'w-5 h-5' })}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-1">{group.name}</h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-surface text-text-muted uppercase tracking-wider">
                        {pConfig.label}
                      </span>
                      {group.city && <span className="text-xs text-text-muted flex items-center gap-1"><MapPin className="w-3 h-3" />{group.city}</span>}
                      {group.region && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface text-text-muted font-medium uppercase tracking-wider">
                          {group.region === 'tamil_nadu' ? 'TN' : group.region === 'india' ? 'India' : 'Global'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-text-muted mt-3 leading-relaxed line-clamp-2">{group.description}</p>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                  <div className="flex items-center gap-1.5 text-xs text-text-muted">
                    <Users className="w-3.5 h-3.5" />
                    {(group.member_count || 0).toLocaleString()} {group.platform === 'website' ? 'visitors' : 'members'}
                  </div>
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    <Button variant="primary" size="sm" className="h-8 px-3 text-xs">
                      {buttonLabel} <ExternalLink className="w-3 h-3" />
                    </Button>
                  </a>
                </div>
              </Card>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-text-muted/40" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">No groups found</h3>
            <p className="text-text-muted text-sm">Try selecting a different platform or region.</p>
          </div>
        )}
      </div>
    </div>
  );
}
