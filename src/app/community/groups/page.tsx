'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { MapPin, Users, Globe, ArrowRight, ExternalLink, Search, Building, Globe2 } from 'lucide-react';
import { FaWhatsapp, FaFacebook, FaDiscord, FaTelegram, FaLink } from 'react-icons/fa';
import { Skeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  { key: 'whatsapp', label: 'WhatsApp', icon: <FaWhatsapp className="w-5 h-5" />, color: 'bg-green-500', ringColor: 'ring-green-500', textColor: 'text-green-700' },
  { key: 'facebook', label: 'Facebook', icon: <FaFacebook className="w-5 h-5" />, color: 'bg-blue-600', ringColor: 'ring-blue-600', textColor: 'text-blue-700' },
  { key: 'discord', label: 'Discord', icon: <FaDiscord className="w-5 h-5" />, color: 'bg-indigo-500', ringColor: 'ring-indigo-500', textColor: 'text-indigo-700' },
  { key: 'telegram', label: 'Telegram', icon: <FaTelegram className="w-5 h-5" />, color: 'bg-sky-500', ringColor: 'ring-sky-500', textColor: 'text-sky-700' },
  { key: 'website', label: 'Website', icon: <FaLink className="w-5 h-5" />, color: 'bg-slate-700', ringColor: 'ring-slate-700', textColor: 'text-slate-800' },
];

const REGIONS = [
  { key: 'tamil_nadu', label: 'Tamil Nadu', icon: <Building className="w-3.5 h-3.5" /> },
  { key: 'india', label: 'India', icon: <Globe className="w-3.5 h-3.5" /> },
  { key: 'all', label: 'Global / All', icon: <Globe2 className="w-3.5 h-3.5" /> },
];

function getPlatformConfig(key: string) {
  const normalizedKey = (key || '').toLowerCase();
  if (!normalizedKey) return PLATFORMS[0]; // Empty defaults to WhatsApp
  return PLATFORMS.find(p => p.key === normalizedKey) || PLATFORMS.find(p => p.key === 'website') || PLATFORMS[0];
}

function getPlatformLink(group: CommunityGroup) {
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

  const combinedGroups = firestoreGroups;

  const filtered = useMemo(() => {
    return combinedGroups.filter((g) => {
      // Handle platform filtering (default to website if not explicitly supported, but whatsapp if empty)
      const rawPlatform = (g.platform || '').toLowerCase();
      let groupPlatform = 'website';
      if (!rawPlatform) {
        groupPlatform = 'whatsapp';
      } else if (PLATFORMS.some(p => p.key === rawPlatform)) {
        groupPlatform = rawPlatform;
      }
      if (selectedPlatform && groupPlatform !== selectedPlatform) return false;
      
      // Handle region filtering (normalize spaces and cases)
      if (selectedRegion && selectedRegion !== 'all') {
        const groupRegion = (g.region || '').toLowerCase().replace(/\s+/g, '_');
        if (groupRegion !== selectedRegion) return false;
      }

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
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                      ? `${p.color} text-white border-transparent shadow-sm ring-1 ring-offset-1 ring-offset-surface ${p.ringColor}`
                      : 'bg-white text-text-primary border-border hover:border-primary/40'
                  }`}
                >
                  <span className="text-lg">{p.icon}</span>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>

            {/* Regions & Search */}
            <div className="flex flex-col md:flex-row flex-wrap items-start md:items-center gap-3 relative z-20 mt-4">
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
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-sm text-text-muted mb-6">
          <span className="font-semibold text-text-primary">{filtered.length}</span> groups found
          {selectedPlatform && <> on <span className="font-semibold text-primary capitalize">{getPlatformConfig(selectedPlatform).label}</span></>}
          {selectedRegion && <> · <span className="font-medium">{REGIONS.find(r => r.key === selectedRegion)?.label}</span></>}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-[24px] border border-border overflow-hidden">
                <Skeleton className="w-full h-40" />
                <div className="p-6 space-y-3">
                  <div className="flex gap-2">
                    <Skeleton className="w-20 h-5 rounded-md" />
                    <Skeleton className="w-24 h-5 rounded-md" />
                  </div>
                  <Skeleton className="w-full h-6" />
                  <div className="flex gap-4">
                    <Skeleton className="w-16 h-4" />
                    <Skeleton className="w-24 h-4" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            filtered.map((group) => {
            const pConfig = getPlatformConfig(group.platform || 'whatsapp');
            const link = getPlatformLink(group);

            let secondaryLabel = 'Website';
            let secondaryIcon = <Globe className="w-4 h-4" />;
            let secondaryHref = link;

            if (group.website_url) {
              secondaryLabel = 'Website';
              secondaryIcon = <FaLink className="w-4 h-4" />;
              secondaryHref = group.website_url;
            } else if (group.facebook_url) {
              secondaryLabel = 'Facebook';
              secondaryIcon = <FaFacebook className="w-4 h-4" />;
              secondaryHref = group.facebook_url;
            } else if (group.instagram_url) {
              secondaryLabel = 'Instagram';
              secondaryIcon = <ExternalLink className="w-4 h-4" />;
              secondaryHref = group.instagram_url;
            } else {
              secondaryLabel = 'Link';
              secondaryIcon = <ExternalLink className="w-4 h-4" />;
              secondaryHref = link;
            }

             return (
               <Card key={group.id} padding="none" className="rounded-[24px] overflow-hidden group flex flex-col h-full bg-white border border-gray-100 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] relative">
                 {/* Image Banner */}
                 <a href={link} target="_blank" rel="noopener noreferrer" className="block relative h-56 bg-slate-50 overflow-hidden">
                   {group.image_url ? (
                     <img src={group.image_url} alt={group.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                   ) : (
                     <>
                       <div className={`absolute inset-0 w-full h-full ${pConfig.color} opacity-10 transition-transform duration-500`}></div>
                       <div className="absolute inset-0 w-full h-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                         <div className={`w-24 h-24 rounded-2xl flex items-center justify-center ${pConfig.color} shadow-lg`}>
                           <span className="text-white transform scale-150">{pConfig.icon}</span>
                         </div>
                       </div>
                     </>
                   )}
                 </a>

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
          })
          )}
        </div>

        {filtered.length === 0 && !loading && (
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
