'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Home, UtensilsCrossed, Bus, AlertTriangle,
  Users, GraduationCap, FileText, UserCog, LogOut, Menu, X,
  ChevronRight, Crown, Shield, Heart
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { getAccessibleModules } from '@/lib/permissions';
import type { ModuleKey } from '@/types';
import { MODULE_LABELS } from '@/types';

const moduleIcons: Record<ModuleKey, React.ReactNode> = {
  stay: <Home className="w-4 h-4" />,
  food: <UtensilsCrossed className="w-4 h-4" />,
  travel: <Bus className="w-4 h-4" />,
  emergency: <AlertTriangle className="w-4 h-4" />,
  community: <Users className="w-4 h-4" />,
  services: <GraduationCap className="w-4 h-4" />,
  blog: <FileText className="w-4 h-4" />,
  users: <UserCog className="w-4 h-4" />,
  matrimony: <Heart className="w-4 h-4 text-pink-500 animate-pulse" />,
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, loading, logOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-text-muted text-sm">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!profile || (profile.role !== 'admin' && profile.role !== 'superadmin')) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">Access Denied</h1>
          <p className="text-text-muted mb-6">You don&apos;t have permission to access the admin panel.</p>
          <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-medium transition-colors">
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const isSuperAdmin = profile.role === 'superadmin';
  const accessibleModules = getAccessibleModules(profile.role, profile.permissions);

  const sidebarItems: { key: string; label: string; href: string; icon: React.ReactNode }[] = [
    { key: 'dashboard', label: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    ...accessibleModules.map((mod) => ({
      key: mod,
      label: MODULE_LABELS[mod],
      href: `/admin/${mod}`,
      icon: moduleIcons[mod],
    })),
  ];

  const handleLogout = async () => {
    await logOut();
    router.push('/');
  };

  const SidebarContent = () => (
    <>
      {/* Logo area */}
      <div className="p-5 border-b border-border">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-sm">
            PB
          </div>
          <div>
            <h2 className="text-sm font-bold text-text-primary">ProbasiBangali</h2>
            <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* User card */}
      <div className="p-4 mx-3 mt-4 rounded-xl bg-surface border border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold shrink-0">
            {profile.full_name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text-primary truncate">{profile.full_name}</p>
            <div className="flex items-center gap-1.5">
              {isSuperAdmin && <Crown className="w-3 h-3 text-amber-500" />}
              <span className="text-[10px] font-medium text-text-muted uppercase tracking-wider">
                {isSuperAdmin ? 'Super Admin' : 'Admin'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-3 space-y-0.5 mt-2 overflow-y-auto">
        {sidebarItems.map((item) => {
          const isActive = item.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${isActive
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-text-muted hover:text-primary hover:bg-surface border border-transparent'
                }
              `}
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="w-3.5 h-3.5" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-border space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-muted hover:text-primary hover:bg-surface transition-all"
        >
          <Home className="w-4 h-4" />
          Back to Website
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col bg-white border-r border-border fixed inset-y-0 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white flex flex-col animate-slide-up">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-14 bg-white/80 backdrop-blur-xl border-b border-border flex items-center px-4 lg:px-6 gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl text-text-muted hover:text-primary hover:bg-surface transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <Link
            href="/"
            className="text-xs font-medium text-text-muted hover:text-primary transition-colors"
          >
            ← Back to site
          </Link>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
