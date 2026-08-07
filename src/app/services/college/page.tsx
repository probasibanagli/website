'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, MapPin, Phone, GraduationCap, Globe, ExternalLink, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/card';
import { sampleColleges } from '@/data/sample-data';
import { CITIES, COLLEGE_TYPES } from '@/lib/constants';

export default function CollegePage() {
  const [type, setType] = useState('');
  const [city, setCity] = useState('');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return sampleColleges.filter((c) => {
      if (type && c.type !== type) return false;
      if (city && c.city !== city) return false;
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [type, city, search]);

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
            <Link href="/" className="hover:text-primary">Home</Link><span>/</span>
            <span className="text-text-primary font-medium">College Finder</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-text-primary">College Finder</h1>
          <p className="mt-2 text-text-muted">Find engineering, medical, arts, and management colleges in Tamil Nadu.</p>

          <div className="mt-6 flex flex-wrap gap-2">
            <button onClick={() => setType('')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${!type ? 'bg-primary text-white shadow-md' : 'bg-white border border-border hover:border-primary'}`}>All</button>
            {COLLEGE_TYPES.map((ct) => (
              <button key={ct} onClick={() => setType(ct)} className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all cursor-pointer ${type === ct ? 'bg-primary text-white shadow-md' : 'bg-white border border-border hover:border-primary'}`}>{ct}</button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search colleges..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <select value={city} onChange={(e) => setCity(e.target.value)} className="px-4 py-2.5 rounded-xl border border-border text-sm">
              <option value="">All Cities</option>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-text-muted text-sm font-medium">Loading colleges database...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((college) => {
                const theme = CATEGORY_THEMES[college.type || 'arts_science'] || CATEGORY_THEMES.arts_science;
                return (
                  <Card key={college.id} className="group flex flex-col justify-between hover:shadow-lg transition-all border border-border/80">
                    <div>
                      {/* Top Header */}
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-2xl ${theme.iconBg} flex items-center justify-center shrink-0`}>
                          <GraduationCap className={`w-6 h-6 ${theme.iconColor}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors leading-snug">
                            {college.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mt-1.5">
                            <Badge className={`${theme.bg} ${theme.text} hover:${theme.bg} border-transparent font-semibold capitalize text-xs`}>
                              {CATEGORY_LABELS[college.type || ''] || college.type}
                            </Badge>
                            {college.ranking !== undefined && college.ranking !== null && (
                              <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200/40 font-bold text-[10px] flex items-center gap-0.5 shadow-sm shrink-0">
                                🏆 Rank #{college.ranking}
                              </Badge>
                            )}
                            <span className="text-xs text-text-muted flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 shrink-0" />
                              {college.area}, {college.city}
                            </span>
                          </div>
                        </div>
                      </div>

                      {college.address && (
                        <p className="mt-4 text-xs text-text-muted leading-relaxed">
                          {college.address}
                        </p>
                      )}

                      {/* Associated Forums */}
                      {college.bengali_forums && college.bengali_forums.length > 0 && (
                        <div className="mt-4 bg-primary/5 p-3.5 rounded-2xl border border-primary/10">
                          <h4 className="text-xs font-bold text-primary mb-2 uppercase tracking-wider flex items-center gap-1.5">
                            👥 Bengali Forums & Communities
                          </h4>
                          <div className="space-y-2">
                            {college.bengali_forums.map((forum, idx) => (
                              <a
                                key={idx}
                                href={forum.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between text-sm font-semibold text-text-primary hover:text-primary transition-colors group/link"
                              >
                                <span className="truncate text-xs">{forum.name}</span>
                                <ExternalLink className="w-3.5 h-3.5 text-text-muted group-hover/link:text-primary transition-colors shrink-0" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Expandable Lecturers & Staff Section */}
                      <div className="mt-4 pt-1">
                        <Button
                          onClick={() => toggleExpand(college.id)}
                          variant="ghost"
                          className="w-full justify-between py-5 text-xs font-bold border border-border/60 hover:bg-surface rounded-xl cursor-pointer"
                        >
                          <span>Bengali Lecturers & Staff ({college.staff_contacts?.length || 0})</span>
                          {expandedColleges[college.id] ? <ChevronUp className="w-4.5 h-4.5 text-text-muted" /> : <ChevronDown className="w-4.5 h-4.5 text-text-muted" />}
                        </Button>

                        {expandedColleges[college.id] && (
                          <div className="mt-3 space-y-3 pt-3 border-t border-dashed border-border animate-slide-down">
                            {!user ? (
                              <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-2xl text-center">
                                <Lock className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                                <p className="text-xs font-bold text-amber-800">Registration Required</p>
                                <p className="text-xs text-amber-700/80 mt-1">Please login or register to view Bengali faculty contact details.</p>
                                <Link href="/auth/login" className="mt-3 block">
                                  <Button size="sm" variant="outline" className="w-full border-amber-300 text-amber-800 hover:bg-amber-100/50 font-semibold cursor-pointer">
                                    Login to Account <ArrowRight className="w-3.5 h-3.5 ml-1" />
                                  </Button>
                                </Link>
                              </div>
                            ) : !isVerified ? (
                              <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-2xl text-center">
                                <ShieldAlert className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                                <p className="text-xs font-bold text-amber-800">Verification Required</p>
                                <p className="text-xs text-amber-700/80 mt-1">Verify your phone and email to access direct contact details.</p>
                                <Button
                                  size="sm"
                                  onClick={() => setShowOtpModal(true)}
                                  className="w-full mt-3 bg-amber-600 text-white hover:bg-amber-700 font-semibold cursor-pointer border-transparent"
                                >
                                  Verify via OTP
                                </Button>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                {college.staff_contacts && college.staff_contacts.length > 0 ? (
                                  college.staff_contacts.map((contact, cIdx) => (
                                    <div key={cIdx} className="p-3 bg-surface rounded-xl border border-border/50 text-xs">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <p className="font-bold text-text-primary">{contact.name}</p>
                                          <p className="text-text-muted mt-0.5 capitalize">{contact.role} • {contact.department}</p>
                                        </div>
                                      </div>
                                      <div className="mt-2.5 flex flex-wrap gap-2">
                                        {contact.phone && (
                                          <a href={`tel:${contact.phone}`} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-border rounded-lg text-text-primary hover:text-primary hover:border-primary/30 transition-all font-semibold">
                                            <Phone className="w-3 h-3" /> Call
                                          </a>
                                        )}
                                        {contact.email && (
                                          <a href={`mailto:${contact.email}`} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-border rounded-lg text-text-primary hover:text-primary hover:border-primary/30 transition-all font-semibold">
                                            <Mail className="w-3 h-3" /> Email
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-xs text-text-muted text-center py-2">No Bengali lecturers or staff contacts listed.</p>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-border/80">
                      {college.phone && (
                        <a href={`tel:${college.phone}`} title="Call College">
                          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl hover:bg-surface border border-transparent hover:border-border">
                            <Phone className="w-4 h-4 text-text-muted" />
                          </Button>
                        </a>
                      )}
                      {college.website && (
                        <a href={college.website} target="_blank" rel="noopener noreferrer" title="Visit Website">
                          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl hover:bg-surface border border-transparent hover:border-border">
                            <Globe className="w-4 h-4 text-text-muted" />
                          </Button>
                        </a>
                      )}
                      {college.google_maps_url && (
                        <a href={college.google_maps_url} target="_blank" rel="noopener noreferrer" title="View Map Location">
                          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl hover:bg-surface border border-transparent hover:border-border">
                            <MapPin className="w-4 h-4 text-text-muted" />
                          </Button>
                        </a>
                      )}
                      <Link href={`/explore/travel`} className="ml-auto">
                        <Button variant="outline" size="sm" className="rounded-xl h-9 text-xs font-semibold hover:bg-surface">
                          <Navigation className="w-3.5 h-3.5 text-text-muted mr-1.5" /> How to reach
                        </Button>
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl border border-border mt-6">
                <p className="text-5xl mb-4">🎓</p>
                <h3 className="text-xl font-bold text-text-primary mb-2">No colleges found</h3>
                <p className="text-text-muted text-sm">Try using different search keywords or district filters.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
