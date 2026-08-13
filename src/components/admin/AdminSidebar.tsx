'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Crown, LogOut, Home, Shield, Users, Activity } from 'lucide-react';
import type { ModuleKey } from '@/types';

interface SidebarItem {
  key: string;
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface AdminSidebarProps {
  sidebarItems: SidebarItem[];
  profile: {
    full_name?: string;
    role?: string;
  };
  isSuperAdmin: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export function AdminSidebar({
  sidebarItems,
  profile,
  isSuperAdmin,
  onClose,
  onLogout,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div className="flex flex-col h-full bg-[#FAF0EC] border-r border-[#EADED9] text-[#85736E]">
      {/* Brand Logo Area */}
      <div className="h-20 flex items-center px-6 border-b border-[#EADED9] shrink-0">
        <Link href="/admin" className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="ProbasiBangali Logo" 
            className="w-9 h-9 object-contain"
          />
          <div>
            <h2 className="text-base font-extrabold text-[#D85A30] font-sans tracking-tight">ProbasiBangali</h2>
            <p className="text-[10px] text-[#85736E] font-bold uppercase tracking-wider">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* User Card */}
      {/* <div className="p-4 mx-4 mt-5 rounded-2xl bg-white border border-[#EADED9]/60 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#D85A30] flex items-center justify-center text-white text-base font-bold shrink-0 shadow-sm">
            {profile.full_name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-neutral-900 truncate leading-tight">{profile.full_name}</p>
            <div className="flex items-center gap-1 mt-0.5">
              {isSuperAdmin && <Crown className="w-3.5 h-3.5 text-[#F59E0B]" />}
              <span className="text-[10px] font-bold text-[#85736E] uppercase tracking-wider">
                {isSuperAdmin ? 'Super Admin' : 'Admin'}
              </span>
            </div>
          </div>
        </div>
      </div> */}

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto">
        {sidebarItems.map((item) => {
          let isActive = false;
          if (item.href.startsWith('/admin/users')) {
            const itemUrl = new URL(item.href, 'http://localhost');
            const itemTab = itemUrl.searchParams.get('tab');
            const currentTab = searchParams.get('tab') || 'users';
            isActive = pathname.startsWith('/admin/users') && itemTab === currentTab;
          } else {
            isActive = item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href);
          }

          return (
            <Link
              key={item.key}
              href={item.href}
              onClick={onClose}
              className={`
                flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ease-in-out whitespace-nowrap group
                ${isActive
                  ? 'bg-[#D85A30] text-white shadow-md shadow-[#D85A30]/10 scale-[1.01]'
                  : 'text-[#85736E] hover:text-[#D85A30] hover:bg-[#F3E6E0] border border-transparent'
                }
              `}
            >
              <span className={`transition-colors shrink-0 ${isActive ? 'text-white' : 'text-[#85736E] group-hover:text-[#D85A30]'}`}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Panel */}
      <div className="p-4 border-t border-[#EADED9] space-y-2.5">
        <Link
          href="/"
          className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold text-[#85736E] hover:text-[#D85A30] hover:bg-[#F3E6E0] transition-all group"
        >
          <Home className="w-4 h-4 transition-colors text-[#85736E] group-hover:text-[#D85A30]" />
          Back to Website
        </Link>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-all cursor-pointer group"
        >
          <LogOut className="w-4 h-4 transition-colors text-red-600 group-hover:text-red-700" />
          Logout
        </button>
      </div>
    </div>
  );
}
