'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Users, ExternalLink, Search, Globe, MapPin, ChevronDown, ArrowRight, Camera, Briefcase, MessageCircle, Send, Building, Map, Globe2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { sampleCommunityGroups } from '@/data/sample-data';
import { useFirestore } from '@/lib/hooks/useFirestore';
import { CommunityGroup } from '@/types';

// Custom inline SVG icons since older version of lucide-react might not export Facebook/Instagram
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

/* ── Platform config ── */
const PLATFORMS = [
  { key: 'instagram', label: 'Instagram', icon: <Camera className="w-4 h-4" />, color: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400', textColor: 'text-white', ringColor: 'ring-pink-300', badgeColor: 'bg-pink-100 text-pink-700' },
  { key: 'facebook', label: 'Facebook', icon: <Users className="w-4 h-4" />, color: 'bg-gradient-to-br from-blue-600 to-blue-500', textColor: 'text-white', ringColor: 'ring-blue-300', badgeColor: 'bg-indigo-100 text-indigo-700' },
  { key: 'linkedin', label: 'LinkedIn', icon: <Briefcase className="w-4 h-4" />, color: 'bg-gradient-to-br from-blue-700 to-sky-600', textColor: 'text-white', ringColor: 'ring-sky-300', badgeColor: 'bg-sky-100 text-sky-700' },
  { key: 'website', label: 'Website', icon: <Globe className="w-4 h-4" />, color: 'bg-gradient-to-br from-emerald-500 to-teal-500', textColor: 'text-white', ringColor: 'ring-teal-300', badgeColor: 'bg-teal-100 text-teal-700' },
  { key: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle className="w-4 h-4" />, color: 'bg-gradient-to-br from-green-500 to-green-600', textColor: 'text-white', ringColor: 'ring-green-300', badgeColor: 'bg-green-100 text-green-700' },
  { key: 'telegram', label: 'Telegram', icon: <Send className="w-4 h-4" />, color: 'bg-gradient-to-br from-sky-400 to-blue-500', textColor: 'text-white', ringColor: 'ring-sky-300', badgeColor: 'bg-blue-100 text-blue-700' },
];

const REGIONS = [
  { key: 'tamil_nadu', label: 'Tamil Nadu', icon: <Building className="w-3.5 h-3.5" /> },
  { key: 'india', label: 'India', icon: <Map className="w-3.5 h-3.5" /> },
  { key: 'all', label: 'Global / All', icon: <Globe2 className="w-3.5 h-3.5" /> },
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

          {/* ── Filters ── */}
          <div className="mt-6 flex flex-col gap-4">
            {/* Platforms */}
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => handlePlatformChange(p.key)}
                  className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer border ${
                    selectedPlatform === p.key
                      ? `${p.color} ${p.textColor} border-transparent shadow-sm ring-1 ring-offset-1 ring-offset-surface ${p.ringColor}`
                      : 'bg-white text-text-primary border-border hover:border-primary/40'
                  }`}
                >
                  <span className="text-lg">{p.icon}</span>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>

            {/* Regions & Search */}
            {selectedPlatform && (
              <div className="flex flex-col md:flex-row flex-wrap items-start md:items-center gap-3 animate-fade-in relative z-20">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search groups..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedRegion('')}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                      !selectedRegion
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-white text-text-primary border border-border hover:border-primary'
                    }`}
                  >
                    All Regions
                  </button>
                  {REGIONS.map((r) => (
                    <button
                      key={r.key}
                      onClick={() => setSelectedRegion(r.key === selectedRegion ? '' : r.key)}
                      className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                        selectedRegion === r.key
                          ? 'bg-primary text-white shadow-sm'
                          : 'bg-white text-text-primary border border-border hover:border-primary'
                      }`}
                    >
                      <span>{r.icon}</span> {r.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
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

            let secondaryLabel = 'Website';
            let secondaryIcon = <Globe className="w-4 h-4" />;
            let secondaryHref = link;

            if (group.website_url) {
              secondaryLabel = 'Website';
              secondaryIcon = <Globe className="w-4 h-4" />;
              secondaryHref = group.website_url;
            } else if (group.facebook_url) {
              secondaryLabel = 'Facebook';
              secondaryIcon = <FacebookIcon className="w-4 h-4" />;
              secondaryHref = group.facebook_url;
            } else if (group.instagram_url) {
              secondaryLabel = 'Instagram';
              secondaryIcon = <InstagramIcon className="w-4 h-4" />;
              secondaryHref = group.instagram_url;
            } else {
              secondaryLabel = 'Link';
              secondaryIcon = <ExternalLink className="w-4 h-4" />;
              secondaryHref = link;
            }

             return (
               <Card key={group.id} padding="none" className="rounded-[24px] overflow-hidden group flex flex-col h-full bg-white border border-gray-100 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] relative">
                 {/* Image Banner */}
                 <div className="relative h-56 bg-slate-100 overflow-hidden">
                   {group.image_url ? (
                     <img src={group.image_url} alt={group.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                   ) : (
                     <div className={`w-full h-full ${pConfig.color} opacity-10 flex items-center justify-center group-hover:scale-105 transition-transform duration-500`}>
                       <span className="text-7xl opacity-30">{pConfig.icon}</span>
                     </div>
                   )}
                 </div>

                 <div className="bg-white rounded-t-[28px] p-6 relative z-10 -mt-6 flex-grow flex flex-col justify-between">
                   <div className="flex-1 flex flex-col">
                     <p className="text-[12px] text-[#0A6C4A] font-extrabold tracking-widest mb-2 flex items-center gap-1.5 uppercase">
                       {group.category || pConfig.label} • {group.region === 'tamil_nadu' ? 'TAMIL NADU' : group.region === 'india' ? 'INDIA' : 'GLOBAL'}
                     </p>

                     {/* Title */}
                     <h3 className="text-xl font-bold font-display text-gray-900 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                       {group.name}
                     </h3>
                     
                     {/* Info Row (Location & Members) */}
                     <div className="flex items-center gap-4 mt-4 flex-wrap text-sm text-[#8F9BB3]">
                       <div className="flex items-center gap-1.5 font-semibold">
                         <MapPin className="w-4 h-4 text-[#8F9BB3] shrink-0" />
                         <span>{group.city || 'Chennai'}</span>
                       </div>
                       <span>•</span>
                       <div className="flex items-center gap-1.5 font-semibold">
                         <Users className="w-4 h-4 text-[#8F9BB3] shrink-0" />
                         <span>{group.member_count ? `${group.member_count.toLocaleString()}` : '1.2k'} Members</span>
                       </div>
                     </div>
                     
                     <p className="text-sm text-text-muted mt-4 leading-relaxed line-clamp-3 flex-grow">{group.description}</p>
                   </div>

                   {/* Side-by-Side Action Buttons */}
                   <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
                     <a href={link} target="_blank" rel="noopener noreferrer" className="flex-1">
                       <button className="w-full bg-[#d85a30] hover:bg-[#c24f28] text-white font-bold py-2.5 px-4 rounded-xl text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-[0.98]">
                         <span>Join Group</span>
                         <ArrowRight className="w-4 h-4" />
                       </button>
                     </a>
                     
                     <a href={secondaryHref} target="_blank" rel="noopener noreferrer" className="flex-1">
                       <button className="w-full bg-white hover:bg-slate-50 border border-[#E4E9F2] text-[#d85a30] font-bold py-2.5 px-4 rounded-xl text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-[0.98]">
                         {secondaryIcon}
                         <span>{secondaryLabel}</span>
                       </button>
                     </a>
                   </div>
                 </div>
               </Card>
             );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Users className="w-12 h-12 mx-auto text-text-muted mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">No groups found</h3>
            <p className="text-text-muted">Try selecting a different platform or region.</p>
          </div>
        )}
      </div>
    </div>
  );
}
