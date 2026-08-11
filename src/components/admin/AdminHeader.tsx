'use client';

import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface AdminHeaderProps {
  profile: {
    full_name?: string;
    role?: string;
  } | null;
  onMenuClick: () => void;
}

export function AdminHeader({ profile, onMenuClick }: AdminHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get('search') || '';
  const [localSearch, setLocalSearch] = React.useState(currentSearch);

  React.useEffect(() => {
    setLocalSearch(searchParams.get('search') || '');
  }, [searchParams]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);
    
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <header className="sticky top-0 z-30 h-20 bg-[#FAF0EC] border-b border-[#EADED9]/50 flex items-center justify-between px-4 lg:px-6 gap-4 font-sans">
      {/* Mobile Hamburger Menu Trigger */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl text-neutral-500 hover:text-[#D85A30] hover:bg-white transition-all cursor-pointer shadow-sm border border-neutral-200/40"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search Input */}
      <div className="relative w-full max-w-xs">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
          <Search className="w-4 h-4" />
        </span>
        <input
          type="text"
          placeholder="Search..."
          value={localSearch}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2.5 rounded-full border border-neutral-200/50 bg-white text-sm text-[#85736E] placeholder-[#85736E]/60 focus:outline-none focus:ring-2 focus:ring-[#D85A30]/50 shadow-sm"
        />
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-5">
        <button className="relative p-2 text-neutral-500 hover:text-[#D85A30] transition-colors bg-white rounded-full border border-neutral-200/40 shadow-sm">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
        </button>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-neutral-900 leading-tight">
              {profile?.full_name || 'Admin User'}
            </p>
            <p className="text-[10px] font-bold text-[#85736E] uppercase tracking-wider">
              {profile?.role === 'superadmin' ? 'Super Administrator' : 'Administrator'}
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#D85A30] flex items-center justify-center text-white text-sm font-bold shadow-sm">
            {profile?.full_name?.charAt(0).toUpperCase() || 'A'}
          </div>
        </div>
      </div>
    </header>
  );
}
