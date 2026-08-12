'use client';
export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  Users, Home, UtensilsCrossed, FileText, AlertTriangle, TrendingUp,
  Activity, Crown, ShieldCheck, Plus, Bell, Search, MessageSquare, Heart, Shield, Loader2,
  Bus, GraduationCap, Droplets, Truck
} from 'lucide-react';

interface StatCard {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  badge?: string;
  bgImage?: boolean;
}

interface ActivityLog {
  id: string;
  event: string;
  time: string;
  type: 'user' | 'listing' | 'system' | 'blog';
  initials: string;
  color: string;
}

export default function AdminDashboard() {
  const { profile, firebaseUser } = useAuth();
  const searchParams = useSearchParams();
  const searchVal = searchParams.get('search') || '';
  const [stats, setStats] = useState<StatCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'week' | 'month'>('month');
  const [showFlowerModal, setShowFlowerModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [signupStats, setSignupStats] = useState({ total: 0, pending: 0 });
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState(0);
  const [emergencyAlertsCount, setEmergencyAlertsCount] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Simulated activity matching design mockup
  const [recentLogs, setRecentLogs] = useState<ActivityLog[]>([
    { id: '1', event: 'User #4291 verified phone number', time: '2 mins ago', type: 'user', initials: 'U', color: 'bg-emerald-100 text-emerald-600' },
    { id: '2', event: 'New PG added in Guindy', time: '15 mins ago', type: 'listing', initials: 'P', color: 'bg-orange-100 text-orange-600' },
    { id: '3', event: 'Blog post "Kolkata Food Guide" published', time: '1 hour ago', type: 'blog', initials: 'B', color: 'bg-purple-100 text-purple-600' },
    { id: '4', event: 'Emergency listing "Hospital Oxygen" updated', time: '3 hours ago', type: 'system', initials: 'E', color: 'bg-rose-100 text-rose-600' },
  ]);

  useEffect(() => {
    async function loadStats() {
      try {
        const allCollections = [
          { name: 'users', label: 'Total Users & Admins', icon: <Users className="w-5 h-5" />, color: 'text-[#D85A30]', bg: 'bg-[#FAF0EC]', badge: '12%', bgImage: true },
          { name: 'listings', label: 'Stays & Accommodations', icon: <Home className="w-5 h-5" />, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { name: 'food_listings', label: 'Bengali Food & Sweets', icon: <UtensilsCrossed className="w-5 h-5" />, color: 'text-orange-500', bg: 'bg-orange-50' },
          { name: 'hospitals', label: 'Hospital Management', icon: <AlertTriangle className="w-5 h-5" />, color: 'text-rose-500', bg: 'bg-rose-50' },
          { name: 'community_groups', label: 'Community Groups', icon: <Users className="w-5 h-5" />, color: 'text-teal-500', bg: 'bg-teal-50' },
          { name: 'colleges', label: 'Campus & Government', icon: <GraduationCap className="w-5 h-5" />, color: 'text-cyan-500', bg: 'bg-cyan-50' },
          { name: 'blog_posts', label: 'Blog Posts', icon: <FileText className="w-5 h-5" />, color: 'text-purple-500', bg: 'bg-purple-50' },
          { name: 'matrimonial_profiles', label: 'Matrimonial', icon: <Heart className="w-5 h-5" />, color: 'text-pink-500', bg: 'bg-pink-50' },
          { name: 'blood_banks', label: 'Blood Banks', icon: <Droplets className="w-5 h-5" />, color: 'text-red-500', bg: 'bg-red-50' },
          { name: 'ambulances', label: 'Ambulance Directory', icon: <Truck className="w-5 h-5" />, color: 'text-indigo-500', bg: 'bg-indigo-50' },
        ];
        
        const collections = profile?.role === 'superadmin' 
          ? allCollections.filter(c => c.name === 'users')
          : allCollections.filter(c => c.name !== 'users');

        const results: StatCard[] = [];
        for (const col of collections) {
          try {
            let count = 0;
            if (col.name === 'users') {
              const token = firebaseUser ? await firebaseUser.getIdToken() : 'mock-bypass-token';
              const res = await fetch('/api/admin/users', {
                headers: { 'Authorization': `Bearer ${token}` }
              });
              if (res.ok) {
                const data = await res.json();
                count = data.users?.length || 0;
              } else {
                throw new Error('Failed to fetch users');
              }
            } else {
              const snap = await getDocs(query(collection(db, col.name), limit(1000)));
              count = snap.size;
            }
            results.push({
              label: col.label,
              value: count.toLocaleString('en-IN'),
              icon: col.icon,
              color: col.color,
              bg: col.bg,
              badge: col.badge,
              bgImage: col.bgImage
            });
          } catch {
            results.push({ label: col.label, value: '—', icon: col.icon, color: col.color, bg: col.bg, badge: col.badge });
          }
        }

        // Fetch directory visitor analytics from server-side API (bypasses Firestore Security Rules)
        try {
          const token = firebaseUser && typeof firebaseUser.getIdToken === 'function'
            ? await firebaseUser.getIdToken()
            : 'temp_token';
            
          const res = await fetch('/api/admin/visitor-analytics', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (res.ok) {
            const data = await res.json();
            results.push({
              label: 'Registered Members',
              value: (data.registeredMembers ?? 0).toLocaleString('en-IN'),
              icon: <ShieldCheck className="w-5 h-5" />,
              color: 'text-amber-500',
              bg: 'bg-amber-50'
            });
            
            results.push({
              label: 'New Visitors',
              value: (data.newVisitors ?? 0).toLocaleString('en-IN'),
              icon: <Activity className="w-5 h-5" />,
              color: 'text-blue-500',
              bg: 'bg-blue-50'
            });
          } else {
            throw new Error('Backend fetch failed');
          }
        } catch (e) {
          console.warn("API visitor stats failed, falling back to local client-side query:", e);
          try {
            const [usersSnap, otpsSnap] = await Promise.all([
              getDocs(collection(db, 'users')),
              getDocs(collection(db, 'otps'))
            ]);
            
            const usersList = usersSnap.docs.map(doc => doc.data());
            const registeredPhones = new Set(usersList.map(u => u.phone?.trim()).filter(Boolean));
            const registeredEmails = new Set(usersList.map(u => u.email?.trim().toLowerCase()).filter(Boolean));
            
            let regMembers = 0;
            let newVisitors = 0;
            
            const uniqueVisitors = new Map<string, { phone?: string, email?: string }>();
            otpsSnap.docs.forEach(doc => {
              const data = doc.data();
              if (data.verified) {
                const phone = data.phone?.trim();
                const email = data.email?.trim().toLowerCase();
                if (phone) {
                  uniqueVisitors.set(phone, { phone, email });
                } else if (email) {
                  uniqueVisitors.set(email, { phone, email });
                }
              }
            });
            
            uniqueVisitors.forEach(v => {
              const isRegPhone = v.phone && registeredPhones.has(v.phone);
              const isRegEmail = v.email && registeredEmails.has(v.email);
              if (isRegPhone || isRegEmail) {
                regMembers++;
              } else {
                newVisitors++;
              }
            });
            
            results.push({
              label: 'Registered Members',
              value: regMembers.toLocaleString('en-IN'),
              icon: <ShieldCheck className="w-5 h-5" />,
              color: 'text-[#85736E]',
              bg: 'bg-neutral-50'
            });
            
            results.push({
              label: 'New Visitors',
              value: newVisitors.toLocaleString('en-IN'),
              icon: <Activity className="w-5 h-5" />,
              color: 'text-amber-500',
              bg: 'bg-amber-50'
            });
          } catch (fallbackErr) {
            console.error("Firestore stats query failed:", fallbackErr);
            results.push({ label: 'Registered Members', value: '—', icon: <ShieldCheck className="w-5 h-5" />, color: 'text-amber-500', bg: 'bg-amber-50' });
            results.push({ label: 'New Visitors', value: '—', icon: <Activity className="w-5 h-5" />, color: 'text-blue-500', bg: 'bg-blue-50' });
          }
        }

        // Fetch recent activity logs from backend
        let realLogs: ActivityLog[] = [];
        try {
          const token = firebaseUser && typeof firebaseUser.getIdToken === 'function'
            ? await firebaseUser.getIdToken()
            : 'temp_token';
          const res = await fetch('/api/admin/activities', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.logs && Array.isArray(data.logs) && data.logs.length > 0) {
              realLogs = data.logs.map((log: any, idx: number) => {
                const perf = log.performed_by || 'Admin';
                const action = log.action || 'updated system';
                const initials = perf.charAt(0).toUpperCase();
                
                let color = 'bg-amber-100 text-amber-600';
                if (action.toLowerCase().includes('user') || action.toLowerCase().includes('admin')) {
                  color = 'bg-emerald-100 text-emerald-600';
                } else if (action.toLowerCase().includes('stay') || action.toLowerCase().includes('accommodation')) {
                  color = 'bg-orange-100 text-orange-600';
                } else if (action.toLowerCase().includes('blog')) {
                  color = 'bg-purple-100 text-purple-600';
                }
                
                let relativeTime = 'Just now';
                if (log.timestamp) {
                  const diffMs = Date.now() - new Date(log.timestamp).getTime();
                  const diffMins = Math.floor(diffMs / 60000);
                  const diffHours = Math.floor(diffMins / 60);
                  const diffDays = Math.floor(diffHours / 24);
                  
                  if (diffMins < 1) relativeTime = 'Just now';
                  else if (diffMins < 60) relativeTime = `${diffMins} mins ago`;
                  else if (diffHours < 24) relativeTime = `${diffHours} hours ago`;
                  else relativeTime = `${diffDays} days ago`;
                }
                
                return {
                  id: log.id || String(idx),
                  event: `${perf} ${action}${log.details ? `: ${log.details}` : ''}`,
                  time: relativeTime,
                  type: action.toLowerCase().includes('user') ? 'user' : 'system',
                  initials,
                  color
                };
              });
            }
          }
        } catch (activityErr) {
          console.warn("Failed to load activity logs from backend:", activityErr);
        }

        // If the activities collection has no events, construct events from other collections
        if (realLogs.length === 0) {
          try {
            const [usersRes, staysSnap, blogsSnap] = await Promise.all([
              (async () => {
                const token = firebaseUser ? await firebaseUser.getIdToken() : 'temp';
                const res = await fetch('/api/admin/users', { headers: { 'Authorization': `Bearer ${token}` } });
                return res.ok ? await res.json() : { users: [] };
              })(),
              getDocs(collection(db, 'listings')),
              getDocs(collection(db, 'blog_posts'))
            ]);

            const userList = (usersRes.users || []) as any[];
            const stayList = staysSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];
            const blogList = blogsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];

            const items: { event: string; timestamp: Date; initials: string; color: string }[] = [];

            userList.forEach(u => {
              const name = u.full_name || u.email || 'New Member';
              const createdDate = u.created_at ? new Date(u.created_at) : new Date();
              items.push({
                event: `User "${name}" joined the platform`,
                timestamp: createdDate,
                initials: 'U',
                color: 'bg-emerald-100 text-emerald-600'
              });
            });

            stayList.forEach(s => {
              const title = s.name || s.title || 'New Stay';
              const createdDate = s.createdAt ? new Date(s.createdAt) : (s.created_at ? new Date(s.created_at) : new Date());
              items.push({
                event: `New Accommodation "${title}" added`,
                timestamp: createdDate,
                initials: 'P',
                color: 'bg-orange-100 text-orange-600'
              });
            });

            blogList.forEach(b => {
              const title = b.title || 'New Post';
              const createdDate = b.createdAt ? new Date(b.createdAt) : (b.created_at ? new Date(b.created_at) : new Date());
              items.push({
                event: `Blog post "${title}" published`,
                timestamp: createdDate,
                initials: 'B',
                color: 'bg-purple-100 text-purple-600'
              });
            });

            items.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

            realLogs = items.slice(0, 10).map((item, idx) => {
              const diffMs = Date.now() - item.timestamp.getTime();
              const diffMins = Math.floor(diffMs / 60000);
              const diffHours = Math.floor(diffMins / 60);
              const diffDays = Math.floor(diffHours / 24);
              
              let relativeTime = 'Just now';
              if (diffMins < 1) relativeTime = 'Just now';
              else if (diffMins < 60) relativeTime = `${diffMins} mins ago`;
              else if (diffHours < 24) relativeTime = `${diffHours} hours ago`;
              else relativeTime = `${diffDays} days ago`;

              return {
                id: `dynamic-${idx}`,
                event: item.event,
                time: relativeTime,
                type: item.initials === 'U' ? 'user' : 'system',
                initials: item.initials,
                color: item.color
              };
            });
          } catch (e) {
            console.error("Failed to construct fallback dynamic logs:", e);
          }
        }

        // Calculate dynamic signup queue count
        try {
          const token = firebaseUser ? await firebaseUser.getIdToken() : 'temp';
          const usersRes = await fetch('/api/admin/users', { headers: { 'Authorization': `Bearer ${token}` } });
          if (usersRes.ok) {
            const data = await usersRes.json();
            const list = data.users || [];
            const unverifiedUsersCount = list.filter((u: any) => !u.email_verified && !u.phone_verified).length;
            setSignupStats({ total: list.length, pending: unverifiedUsersCount });
          }
        } catch (e) {
          console.warn("Failed to calculate signup queue:", e);
        }

        // Calculate dynamic pending queue count
        try {
          const [matSnap, blogSnap, staySnap] = await Promise.all([
            getDocs(collection(db, 'matrimonial_profiles')),
            getDocs(collection(db, 'blog_posts')),
            getDocs(collection(db, 'listings'))
          ]);

          const matPending = matSnap.docs.filter(d => (d.data().status || 'pending') === 'pending').length;
          const blogPending = blogSnap.docs.filter(d => !d.data().published && d.data().status === 'pending').length;
          const stayPending = staySnap.docs.filter(d => d.data().status === 'pending' || d.data().approved === false).length;

          setPendingApprovalsCount(matPending + blogPending + stayPending);
        } catch (e) {
          console.warn("Failed to calculate pending queue:", e);
        }

        // Calculate dynamic emergencies count
        try {
          const hospSnap = await getDocs(collection(db, 'hospitals'));
          setEmergencyAlertsCount(hospSnap.size);
        } catch (e) {
          console.warn("Failed to calculate emergency count:", e);
        }

        if (realLogs.length > 0) {
          setRecentLogs(realLogs);
        }

        setStats(results);
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    }
    if (profile) loadStats();
  }, [profile, firebaseUser]);

  return (
    <div className="space-y-8 max-w-[1536px] mx-auto px-1 font-sans">


      {/* Welcome Title */}
      <div>
        <div className="flex items-center gap-3.5 mb-1.5">
          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Dashboard</h1>
          {profile?.role === 'superadmin' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold uppercase tracking-wider shadow-sm">
              <Crown className="w-3 h-3 text-amber-500" /> Super Admin
            </span>
          )}
        </div>
        <p className="text-neutral-500 text-sm">
          Welcome back, {profile?.full_name?.split(' ')[0] || 'Admin'}. Here’s a live overview of your platform today.
        </p>
      </div>

      {/* Stats Cards: Metrics Center & System Status Grid Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Metrics Center card */}
        <div className="lg:col-span-1">
          <div 
            onClick={() => setShowFlowerModal(true)}
            className="relative w-full h-36 bg-[#FAF0EC]/60 hover:bg-[#FAF0EC] rounded-2xl p-5 border border-[#D85A30]/30 shadow-sm overflow-hidden flex flex-col justify-between cursor-pointer hover:shadow-md transition-all duration-300 group hover:-translate-y-0.5"
          >
            <div className="absolute right-0 bottom-0 w-16 h-16 bg-[#FAF0EC] rounded-tl-full opacity-70 pointer-events-none" />
            <div className="flex justify-between items-start">
              <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center text-[#D85A30] shadow-sm shrink-0 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5 animate-pulse" />
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#D85A30]/10 text-[#D85A30] text-[10px] font-bold">
                View All
              </span>
            </div>
            <div className="mt-4">
              <p className="text-xs font-bold text-[#D85A30] uppercase tracking-wider">Metrics Center</p>
              <p className="text-sm font-extrabold text-neutral-900 tracking-tight mt-1 flex items-center gap-1">
                Bloom All Features ↗
              </p>
            </div>
          </div>
        </div>

        {/* Column 2 & 3: System Status & Action Tasks */}
        <div className="lg:col-span-2 bg-white/50 rounded-2xl p-5 border border-[#EADED9]/60 shadow-sm flex flex-col justify-between h-36 select-none">
          <div className="flex justify-between items-center border-b border-[#EADED9]/50 pb-2 shrink-0">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              System Status & Active Queue
            </h3>
            <span className="text-[10px] font-bold text-neutral-500 font-mono">
              Live updates
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 h-full items-center py-1 mt-1">
            {/* Status Item 1: User Signups */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-[#85736E] uppercase leading-none">New Signups</p>
                <p className="text-xs font-extrabold text-neutral-950 mt-1">
                  {signupStats.total} ({signupStats.pending} pending)
                </p>
              </div>
            </div>

            {/* Status Item 2: Approvals Queue */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Plus className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-[#85736E] uppercase leading-none">Pending Queue</p>
                <p className="text-xs font-extrabold text-amber-700 mt-1">
                  {pendingApprovalsCount} reviews
                </p>
              </div>
            </div>

            {/* Status Item 3: Emergency Queue */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-[#85736E] uppercase leading-none">Emergency Info</p>
                <p className="text-xs font-extrabold text-neutral-950 mt-1">
                  {emergencyAlertsCount} services
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Flower Popup Modal */}
      {showFlowerModal && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Transparent Backdrop with blur */}
          <div 
            className="absolute inset-0 bg-[#FAF0EC]/70 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setShowFlowerModal(false)}
          />
          
          {/* Radial Flower bloom container */}
          <div className="relative w-full max-w-5xl h-[650px] flex items-center justify-center overflow-visible select-none animate-fade-in">
            {/* Close button */}
            <button 
              onClick={() => setShowFlowerModal(false)}
              className="absolute top-4 right-4 z-40 px-4 py-2 bg-white/95 hover:bg-white border border-[#EADED9] text-text-muted hover:text-text-primary rounded-2xl shadow-lg transition-all active:scale-95 cursor-pointer font-bold text-xs"
            >
              Close [X]
            </button>

            {/* Center Summary Disk / Core of the Flower */}
            <div className="relative w-64 h-36 bg-white/95 backdrop-blur-md rounded-3xl border border-[#EADED9] shadow-xl flex flex-col items-center justify-center z-30 transition-all duration-500 scale-100 hover:scale-95 hover:border-[#D85A30]/50">
              <div className="w-12 h-12 rounded-full bg-[#FAF0EC] flex items-center justify-center text-[#D85A30] shadow-inner mb-2.5">
                <TrendingUp className="w-5 h-5 animate-pulse" />
              </div>
              <span className="text-sm font-extrabold text-neutral-950 font-sans tracking-tight">Metrics Center</span>
              <span className="text-[9px] font-bold text-[#85736E] uppercase tracking-widest mt-1 bg-[#FAF0EC] px-2.5 py-1 rounded-full border border-[#EADED9]/40">
                All Modules Analytics
              </span>
            </div>

            {/* Radial Petals (Bloomed automatically in modal state) */}
            {stats.map((stat, i) => {
              const angle = (i * 360) / stats.length;
              const angleRad = (angle * Math.PI) / 180;
              // Radius is 250px
              const r = 250;
              const x = Math.round(r * Math.cos(angleRad));
              const y = Math.round(r * Math.sin(angleRad));

              return (
                <div
                  key={stat.label}
                  style={{
                    '--tx': `${x}px`,
                    '--ty': `${y}px`,
                  } as React.CSSProperties}
                  className="absolute w-44 h-24 bg-white/95 border border-[#EADED9]/60 shadow-lg rounded-2xl p-3 flex flex-col justify-between transition-all duration-700 ease-out z-10 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 opacity-100 scale-100 translate-x-[calc(-50%+var(--tx))] translate-y-[calc(-50%+var(--ty))] hover:border-[#D85A30] hover:z-20 hover:scale-105"
                >
                  <div className="flex justify-between items-start">
                    <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color} shadow-sm shrink-0`}>
                      {stat.icon}
                    </div>
                    {stat.badge && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[9px] font-bold">
                        ↗ {stat.badge}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-[9px] font-extrabold text-[#85736E] uppercase tracking-wider truncate" title={stat.label}>
                      {stat.label}
                    </p>
                    <p className="text-lg font-black text-neutral-950 leading-none mt-0.5">
                      {stat.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>,
        document.body
      )}


      {/* Bottom Section: Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick Actions Card Grid */}
        <div className="lg:col-span-2">
          <div>
            <h3 className="text-base font-bold text-neutral-900 tracking-tight mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {
                (profile?.role === 'superadmin' ? [
                  { label: 'Admin Management', href: '/admin/users?tab=admins', icon: <Shield className="w-4 h-4" />, highlight: true },
                  { label: 'User Management', href: '/admin/users?tab=users', icon: <Users className="w-4 h-4" />, highlight: true },
                  { label: 'Activity Logs', href: '/admin/users?tab=activities', icon: <Activity className="w-4 h-4" />, highlight: true },
              ] : [
                { label: 'Stay Directory', href: '/admin/stay', icon: <Home className="w-4 h-4" /> },
                { label: 'Food Directory', href: '/admin/food', icon: <UtensilsCrossed className="w-4 h-4" /> },
                { label: 'Hospital Info', href: '/admin/emergency', icon: <AlertTriangle className="w-4 h-4" /> },
                { label: 'Community', href: '/admin/community', icon: <Users className="w-4 h-4" /> },
                { label: 'Campus & Gov', href: '/admin/services', icon: <GraduationCap className="w-4 h-4" /> },
                { label: 'Write Blog', href: '/admin/blog', icon: <FileText className="w-4 h-4" /> },
                { label: 'Matrimonial', href: '/admin/matrimony', icon: <Heart className="w-4 h-4" /> },
                { label: 'Blood Banks', href: '/admin/blood-bank', icon: <Droplets className="w-4 h-4" /> },
                { label: 'Ambulances', href: '/admin/ambulance', icon: <Truck className="w-4 h-4" /> },
              ]).map((action: any) => {
                const colorClass = action.highlight 
                  ? 'bg-[#D85A30] text-white hover:bg-[#c24e25]' 
                  : 'bg-white/50 text-neutral-800 hover:bg-neutral-50/80 border border-[#EADED9]/60';
                return (
                  <a
                    key={action.label}
                    href={action.href}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl shadow-sm text-center font-bold text-[11px] transition-all duration-300 active:scale-[0.98] cursor-pointer min-h-[72px] ${colorClass}`}
                  >
                    <div className="mb-1.5 shrink-0">
                      {action.icon}
                    </div>
                    <span className="leading-tight">{action.label}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Activity Timeline Feed */}
        <div className="lg:col-span-1 bg-white/50 rounded-2xl p-6 border border-[#EADED9]/60 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-neutral-900 tracking-tight">Recent Activity</h3>
            {/* <a href="/admin/users?tab=activities" className="text-xs font-bold text-[#D85A30] hover:underline">
              View All
            </a> */}
          </div>

          <div className="space-y-3.5">
            {(() => {
              const filteredLogs = recentLogs.filter(log => {
                if (!searchVal) return true;
                const q = searchVal.toLowerCase();
                return log.event.toLowerCase().includes(q) || log.time.toLowerCase().includes(q);
              });
              const visibleLogs = showAllActivities ? filteredLogs : filteredLogs.slice(0, 4);

              return (
                <>
                  {visibleLogs.map((log) => (
                    <div 
                      key={log.id} 
                      className="flex items-center gap-3.5 p-3 rounded-xl border border-neutral-100 bg-neutral-50/50 hover:bg-neutral-50 transition-colors"
                    >
                      {/* Round icon label with initials */}
                      <div className={`w-8 h-8 rounded-full ${log.color} flex items-center justify-center text-xs font-extrabold shrink-0 shadow-sm`}>
                        {log.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-neutral-800 truncate">
                          {log.event}
                        </p>
                        <p className="text-[10px] font-semibold text-[#85736E] mt-0.5">
                          {log.time}
                        </p>
                      </div>
                    </div>
                  ))}

                  {filteredLogs.length > 4 && (
                    <button
                      onClick={() => setShowAllActivities(!showAllActivities)}
                      className="w-full mt-3 py-2 text-xs font-bold text-center border border-dashed border-[#EADED9] text-[#D85A30] bg-[#FAF0EC]/30 rounded-xl hover:bg-[#FAF0EC]/60 transition-colors cursor-pointer"
                    >
                      {showAllActivities ? 'See Less ↑' : 'See More ↓'}
                    </button>
                  )}
                </>
              );
            })()}
          </div>
        </div>

      </div>

    </div>
  );
}

// Simple internal ClockIcon inline for layout compatibility
function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
