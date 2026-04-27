'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Users, ExternalLink, Search, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { sampleCommunityGroups } from '@/data/sample-data';
import { CITIES } from '@/lib/constants';

const platformIcons: Record<string, string> = { whatsapp: '💬', telegram: '✈️', facebook: '👤', instagram: '📷' };
const platformColors: Record<string, string> = { whatsapp: 'bg-green-100 text-green-700', telegram: 'bg-blue-100 text-blue-700', facebook: 'bg-indigo-100 text-indigo-700', instagram: 'bg-pink-100 text-pink-700' };

export default function GroupsPage() {
  const [city, setCity] = useState('');
  const [platform, setPlatform] = useState('');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return sampleCommunityGroups.filter((g) => {
      if (city && g.city !== city) return false;
      if (platform && g.platform !== platform) return false;
      if (search && !g.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [city, platform, search]);

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
            <Link href="/" className="hover:text-primary">Home</Link><span>/</span>
            <span className="text-text-primary font-medium">Community Groups</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-text-primary">Community Groups</h1>
          <p className="mt-2 text-text-muted">Connect with Bengali communities across Tamil Nadu.</p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search groups..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <select value={city} onChange={(e) => setCity(e.target.value)} className="px-4 py-2.5 rounded-xl border border-border text-sm cursor-pointer">
              <option value="">All Cities</option>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="px-4 py-2.5 rounded-xl border border-border text-sm cursor-pointer">
              <option value="">All Platforms</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="telegram">Telegram</option>
              <option value="facebook">Facebook</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((group) => (
            <Card key={group.id} className="group">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl ${platformColors[group.platform || 'whatsapp']} flex items-center justify-center text-xl shrink-0`}>
                  {platformIcons[group.platform || 'whatsapp']}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors">{group.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <Badge variant={group.platform === 'whatsapp' ? 'teal' : group.platform === 'telegram' ? 'default' : 'bengali'}>{group.platform}</Badge>
                    {group.city && <span className="text-xs text-text-muted">{group.city}</span>}
                  </div>
                </div>
              </div>
              <p className="text-sm text-text-muted mt-3 leading-relaxed">{group.description}</p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-1.5 text-sm text-text-muted">
                  <Users className="w-4 h-4" />
                  {group.member_count} members
                </div>
                {group.join_url && (
                  <a href={group.join_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="primary" size="sm">Join Group <ExternalLink className="w-3.5 h-3.5" /></Button>
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
        {filtered.length === 0 && (<div className="text-center py-20"><p className="text-5xl mb-4">👥</p><h3 className="text-xl font-bold mb-2">No groups found</h3><p className="text-text-muted">Try different filters.</p></div>)}
      </div>
    </div>
  );
}
