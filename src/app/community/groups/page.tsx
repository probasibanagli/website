'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Users, ExternalLink, Search, Globe, MapPin, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { sampleCommunityGroups } from '@/data/sample-data';
import { useFirestore } from '@/lib/hooks/useFirestore';
import { CommunityGroup } from '@/types';

/* ── Platform config ── */
const PLATFORMS = [
  { key: 'instagram', label: 'Instagram', icon: '📷', color: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400', textColor: 'text-white', ringColor: 'ring-pink-300', badgeColor: 'bg-pink-100 text-pink-700' },
  { key: 'facebook', label: 'Facebook', icon: '👤', color: 'bg-gradient-to-br from-blue-600 to-blue-500', textColor: 'text-white', ringColor: 'ring-blue-300', badgeColor: 'bg-indigo-100 text-indigo-700' },
  { key: 'linkedin', label: 'LinkedIn', icon: '💼', color: 'bg-gradient-to-br from-blue-700 to-sky-600', textColor: 'text-white', ringColor: 'ring-sky-300', badgeColor: 'bg-sky-100 text-sky-700' },
  { key: 'website', label: 'Website', icon: '🌐', color: 'bg-gradient-to-br from-emerald-500 to-teal-500', textColor: 'text-white', ringColor: 'ring-teal-300', badgeColor: 'bg-teal-100 text-teal-700' },
  { key: 'whatsapp', label: 'WhatsApp', icon: '💬', color: 'bg-gradient-to-br from-green-500 to-green-600', textColor: 'text-white', ringColor: 'ring-green-300', badgeColor: 'bg-green-100 text-green-700' },
  { key: 'telegram', label: 'Telegram', icon: '✈️', color: 'bg-gradient-to-br from-sky-400 to-blue-500', textColor: 'text-white', ringColor: 'ring-sky-300', badgeColor: 'bg-blue-100 text-blue-700' },
];

const REGIONS = [
  { key: 'tamil_nadu', label: 'Tamil Nadu', icon: '🏛️' },
  { key: 'india', label: 'India', icon: '🇮🇳' },
  { key: 'all', label: 'All / Worldwide', icon: '🌍' },
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
    case 'instagram': return 'Open Instagram';
    case 'facebook': return 'Open Facebook';
    case 'linkedin': return 'Open LinkedIn';
    case 'website': return 'Visit Website';
    case 'whatsapp': return 'Join WhatsApp';
    case 'telegram': return 'Join Telegram';
    default: return 'Open Link';
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
    setSelectedRegion('');
  };

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
            <Link href="/" className="hover:text-primary">Home</Link><span>/</span>
            <span className="text-text-primary font-medium">Community Groups</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-text-primary">Community Groups</h1>
          <p className="mt-2 text-text-muted">Connect with Bengali communities across Tamil Nadu, India, and worldwide.</p>

          {/* ── STEP 1: Platform Selection ── */}
          <div className="mt-6 p-5 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl border border-primary/10">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> Step 1 — Choose Platform
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {PLATFORMS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => handlePlatformChange(p.key)}
                  className={`relative flex flex-col items-center gap-2 px-4 py-4 rounded-2xl text-sm font-semibold transition-all cursor-pointer border-2 ${
                    selectedPlatform === p.key
                      ? `${p.color} ${p.textColor} border-transparent shadow-lg scale-[1.03] ring-2 ${p.ringColor}`
                      : 'bg-white text-text-primary border-border hover:border-primary/40 hover:shadow-md'
                  }`}
                >
                  <span className="text-2xl">{p.icon}</span>
                  <span>{p.label}</span>
                  {selectedPlatform === p.key && (
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white rounded-full shadow flex items-center justify-center text-[10px]">✓</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── STEP 2: Region Scope (shown after platform selected) ── */}
          {selectedPlatform && (
            <div className="mt-3 p-5 bg-white rounded-2xl border border-border animate-fade-in">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Step 2 — Select Region
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedRegion('')}
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    !selectedRegion
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-surface text-text-primary border border-border hover:border-primary'
                  }`}
                >
                  All Regions
                </button>
                {REGIONS.map((r) => (
                  <button
                    key={r.key}
                    onClick={() => setSelectedRegion(r.key === selectedRegion ? '' : r.key)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                      selectedRegion === r.key
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-surface text-text-primary border border-border hover:border-primary'
                    }`}
                  >
                    <span>{r.icon}</span> {r.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search */}
          <div className="mt-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search groups..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
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
              <Card key={group.id} className="group overflow-hidden">
                {/* Platform color strip */}
                <div className={`h-1.5 -mx-6 -mt-6 mb-4 ${pConfig.color}`} />

                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${pConfig.badgeColor} flex items-center justify-center text-xl shrink-0`}>
                    {pConfig.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors">{group.name}</h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge variant={group.platform === 'whatsapp' ? 'teal' : group.platform === 'instagram' ? 'bengali' : 'default'}>
                        {pConfig.label}
                      </Badge>
                      {group.city && <span className="text-xs text-text-muted flex items-center gap-1"><MapPin className="w-3 h-3" />{group.city}</span>}
                      {group.region && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface text-text-muted font-medium uppercase tracking-wider">
                          {group.region === 'tamil_nadu' ? '🏛️ TN' : group.region === 'india' ? '🇮🇳 India' : '🌍 Global'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-text-muted mt-3 leading-relaxed">{group.description}</p>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-1.5 text-sm text-text-muted">
                    <Users className="w-4 h-4" />
                    {(group.member_count || 0).toLocaleString()} {group.platform === 'website' ? 'visitors' : 'members'}
                  </div>
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    <Button variant="primary" size="sm">
                      {buttonLabel} <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  </a>
                </div>
              </Card>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">👥</p>
            <h3 className="text-xl font-bold mb-2">No groups found</h3>
            <p className="text-text-muted">Try selecting a different platform or region.</p>
          </div>
        )}
      </div>
    </div>
  );
}
