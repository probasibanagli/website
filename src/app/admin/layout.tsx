'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  LayoutDashboard, Home, UtensilsCrossed, Bus, AlertTriangle,
  Users, GraduationCap, FileText, UserCog, LogOut, Menu, X,
  ChevronRight, Crown, Shield, Heart, Activity, Droplets, Truck, Landmark, Scale
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { getAccessibleModules } from '@/lib/permissions';
import type { ModuleKey } from '@/types';
import { MODULE_LABELS } from '@/types';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';



const moduleIcons: Record<ModuleKey, React.ReactNode> = {
  stay: <Home className="w-4 h-4" />,
  food: <UtensilsCrossed className="w-4 h-4" />,
  emergency: <AlertTriangle className="w-4 h-4" />,
  community: <Users className="w-4 h-4" />,
  services: <GraduationCap className="w-4 h-4" />,
  blog: <FileText className="w-4 h-4" />,
  users: <UserCog className="w-4 h-4" />,
  matrimony: <Heart className="w-4 h-4" />,
  blood_bank: <Droplets className="w-4 h-4" />,
  events: <Activity className="w-4 h-4" />,
  ambulance: <Truck className="w-4 h-4" />,
  government_services: <Landmark className="w-4 h-4" />,
  legal: <Scale className="w-4 h-4" />,
  travel: <Bus className="w-4 h-4" />,
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { profile, loading, logOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mfaChecked, setMfaChecked] = useState(false);

  React.useEffect(() => {
    const isMfa = sessionStorage.getItem('mfa_verified') === 'true';
    if (!isMfa) {
      router.push('/auth/login');
    } else {
      setMfaChecked(true);
    }
  }, [router]);

  if (loading || !mfaChecked) {
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
    ...(isSuperAdmin ? [
      { key: 'admin-mgmt', label: 'Admin Management', href: '/admin/users?tab=admins', icon: <Shield className="w-4 h-4" /> },
      { key: 'user-mgmt', label: 'User Management', href: '/admin/users?tab=users', icon: <Users className="w-4 h-4" /> },
      { key: 'activity-log', label: 'Activity Tracking', href: '/admin/users?tab=activities', icon: <Activity className="w-4 h-4" /> },
    ] : []),
    ...(isSuperAdmin ? [] : accessibleModules
      .filter((mod) => mod !== 'users' && MODULE_LABELS[mod])
      .map((mod) => ({
        key: mod,
        label: MODULE_LABELS[mod],
        href: `/admin/${mod === 'blood_bank' ? 'blood-bank' : mod === 'government_services' ? 'government-services' : mod}`,
        icon: moduleIcons[mod],
      }))),
  ];

  const handleLogout = async () => {
    sessionStorage.removeItem('mfa_verified');
    await logOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#FAF0EC]/40 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col fixed inset-y-0 z-40">
        <AdminSidebar
          sidebarItems={sidebarItems}
          profile={profile}
          isSuperAdmin={isSuperAdmin}
          onClose={() => setSidebarOpen(false)}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white flex flex-col animate-slide-up">
            <AdminSidebar
              sidebarItems={sidebarItems}
              profile={profile}
              isSuperAdmin={isSuperAdmin}
              onClose={() => setSidebarOpen(false)}
              onLogout={handleLogout}
            />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 min-w-0">
        {/* Header (Search, Notifications & Profile) */}
        <AdminHeader
          profile={profile}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Page content */}
        <main className="p-4 lg:p-6">
          <div key={pathname} className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
