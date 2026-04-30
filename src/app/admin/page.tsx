'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  Users, Home, UtensilsCrossed, FileText, AlertTriangle, TrendingUp,
  Activity, Crown,
} from 'lucide-react';

interface StatCard {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
}

export default function AdminDashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<StatCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const collections = [
          { name: 'users', label: 'Total Users', icon: <Users className="w-5 h-5" />, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { name: 'listings', label: 'Stay Listings', icon: <Home className="w-5 h-5" />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { name: 'food_listings', label: 'Food Listings', icon: <UtensilsCrossed className="w-5 h-5" />, color: 'text-orange-400', bg: 'bg-orange-500/10' },
          { name: 'hospitals', label: 'Hospitals', icon: <AlertTriangle className="w-5 h-5" />, color: 'text-red-400', bg: 'bg-red-500/10' },
          { name: 'blog_posts', label: 'Blog Posts', icon: <FileText className="w-5 h-5" />, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { name: 'community_groups', label: 'Community Groups', icon: <Users className="w-5 h-5" />, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
        ];

        const results: StatCard[] = [];
        for (const col of collections) {
          try {
            const snap = await getDocs(query(collection(db, col.name), limit(1000)));
            results.push({
              label: col.label,
              value: snap.size.toString(),
              icon: col.icon,
              color: col.color,
              bg: col.bg,
            });
          } catch {
            results.push({ label: col.label, value: '—', icon: col.icon, color: col.color, bg: col.bg });
          }
        }
        setStats(results);
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
          {profile?.role === 'superadmin' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider">
              <Crown className="w-3 h-3" /> Super Admin
            </span>
          )}
        </div>
        <p className="text-text-muted text-sm">
          Welcome back, {profile?.full_name?.split(' ')[0]}. Here&apos;s an overview of your platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-border animate-pulse">
                <div className="h-10 w-10 rounded-xl bg-surface mb-4" />
                <div className="h-6 w-16 bg-surface rounded mb-2" />
                <div className="h-4 w-24 bg-surface rounded" />
              </div>
            ))
          : stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-5 border border-border hover:border-primary/20 transition-all hover:shadow-lg group">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} mb-4 group-hover:scale-110 transition-transform`}>
                  {stat.icon}
                </div>
                <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                <p className="text-sm text-text-muted mt-1">{stat.label}</p>
              </div>
            ))}
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-text-primary">Platform Overview</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-text-muted">Your Role</span>
              <span className="text-sm font-medium text-text-primary capitalize">
                {profile?.role === 'superadmin' ? 'Super Admin' : profile?.role}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-text-muted">Platform Status</span>
              <span className="inline-flex items-center gap-1.5 text-sm text-accent">
                <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                Active
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-text-muted">Last Updated</span>
              <span className="text-sm text-text-muted">{new Date().toLocaleDateString('en-IN')}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Activity className="w-4 h-4 text-accent" />
            </div>
            <h3 className="text-sm font-semibold text-text-primary">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Add Stay', href: '/admin/stay', color: 'bg-primary/5 text-primary hover:bg-primary/10' },
              { label: 'Add Food', href: '/admin/food', color: 'bg-orange-500/10 text-orange-600 hover:bg-orange-500/20' },
              { label: 'Write Blog', href: '/admin/blog', color: 'bg-purple-500/10 text-purple-600 hover:bg-purple-500/20' },
              { label: 'Manage Users', href: '/admin/users', color: 'bg-accent/10 text-accent hover:bg-accent/20' },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors text-center ${action.color}`}
              >
                {action.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
