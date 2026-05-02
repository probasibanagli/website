'use client';

import React, { useState } from 'react';
import Link from 'next/link';
<<<<<<< HEAD
import { T } from '@/lib/contexts/LanguageContext';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu, X, ChevronDown, Phone, Globe, User, Shield, LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
=======
import { Menu, X, ChevronDown, Phone, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
>>>>>>> origin/main
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth/AuthContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';

const navLinks = [
  {
    label: 'Explore',
    children: [
      { label: 'Stay & Accommodation', href: '/explore/stay', icon: '🏠' },
      { label: 'Bengali Food', href: '/explore/food', icon: '🍛' },
      { label: 'Travel & Transport', href: '/explore/travel', icon: '🚌' },
    ],
  },
  {
    label: 'Community',
    children: [
      { label: 'Community Groups', href: '/community/groups', icon: '👥' },
      { label: 'Matrimonial', href: '/community/matrimonial', icon: '💑' },
      { label: 'Events & Festivals', href: '/community/events', icon: '🎉' },
    ],
  },
  {
    label: 'Emergency',
    children: [
      { label: 'Hospitals', href: '/emergency/hospitals', icon: '🏥' },
      { label: 'Blood Help', href: '/emergency/blood', icon: '🩸' },
      { label: 'Ambulance & SOS', href: '/emergency/ambulance', icon: '🚑' },
    ],
  },
  {
    label: 'Services',
    children: [
      { label: 'College Finder', href: '/services/college', icon: '🎓' },
      { label: 'Government Services', href: '/services/government', icon: '🏛️' },
    ],
  },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { firebaseUser, profile, loading, logOut } = useAuth();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Don't show navbar on admin pages (admin has its own layout)
  if (pathname.startsWith('/admin')) return null;

  const isLoggedIn = !!firebaseUser && !!profile;
  const isAdmin = profile?.role === 'admin' || profile?.role === 'superadmin';

  const handleLogout = async () => {
    await logOut();
    setUserMenuOpen(false);
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-lg bengali-text group-hover:scale-105 transition-transform">
              প
            </div>
            <span className="text-lg font-bold text-text-primary hidden sm:block">
              Probasi<span className="text-primary">Bangali</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-text-primary hover:text-primary transition-colors rounded-lg hover:bg-surface cursor-pointer">
                  <T>{link.label}</T>
                  <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', activeDropdown === link.label && 'rotate-180')} />
                </button>
                {activeDropdown === link.label && (
<<<<<<< HEAD
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-2xl shadow-xl border border-border py-2 animate-fade-in">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary hover:bg-surface hover:text-primary transition-colors"
                      >
                        <span className="text-lg">{child.icon}</span>
                        <T>{child.label}</T>
                      </Link>
                    ))}
=======
                  <div className="absolute top-full left-0 pt-2 w-64">
                    <div className="bg-white rounded-2xl shadow-xl border border-border py-2 animate-fade-in">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary hover:bg-surface hover:text-primary transition-colors"
                        >
                          <span className="text-lg">{child.icon}</span>
                          {child.label}
                        </Link>
                      ))}
                    </div>
>>>>>>> origin/main
                  </div>
                )}
              </div>
            ))}
            <Link href="/blog" className="px-3 py-2 text-sm font-medium text-text-primary hover:text-primary transition-colors rounded-lg hover:bg-surface">
              <T>Blog</T>
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-text-muted hover:text-primary border border-border rounded-full hover:border-primary transition-all cursor-pointer bg-white"
              >
                <Globe className="w-3.5 h-3.5" />
                {language === 'en' ? 'EN' : language === 'bn' ? 'বাংলা' : 'தமிழ்'}
                <ChevronDown className={cn('w-3 h-3 transition-transform', langMenuOpen && 'rotate-180')} />
              </button>

              {langMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-border py-1 z-50 animate-fade-in">
                  {[
                    { code: 'en', label: 'English', native: 'EN' },
                    { code: 'bn', label: 'Bengali', native: 'বাংলা' },
                    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
                  ].map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code as any);
                        setLangMenuOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2 text-sm hover:bg-surface transition-colors",
                        language === l.code ? "text-primary font-bold" : "text-text-primary"
                      )}
                    >
                      {l.native}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link href="/emergency/ambulance">
              <Button variant="danger" size="sm" className="hidden sm:inline-flex animate-pulse-glow">
                <Phone className="w-3.5 h-3.5" />
                <T>Emergency</T>
              </Button>
            </Link>

            {/* Auth section */}
            {!mounted || loading ? (
              <div className="w-8 h-8 rounded-full bg-surface animate-pulse hidden sm:block" />
            ) : isLoggedIn ? (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-full border border-border hover:border-primary/40 transition-all cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
                    {profile.full_name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-text-primary max-w-[100px] truncate">
                    {profile.full_name?.split(' ')[0]}
                  </span>
                  <ChevronDown className={cn('w-3.5 h-3.5 text-text-muted transition-transform', userMenuOpen && 'rotate-180')} />
                </button>

                {userMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-border py-2 animate-fade-in z-50">
                    <div className="px-4 py-2 border-b border-border mb-1">
                      <p className="text-sm font-semibold text-text-primary">{profile.full_name}</p>
                      <p className="text-xs text-text-muted">{profile.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-primary/10 text-primary capitalize">
                        {profile.role === 'superadmin' ? 'Super Admin' : profile.role}
                      </span>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary hover:bg-surface transition-colors"
                    >
                      <User className="w-4 h-4" /> My Profile
                    </Link>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary hover:bg-surface transition-colors"
                      >
                        <Shield className="w-4 h-4" /> Admin Panel
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login">
                <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                  Login
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-surface transition-colors cursor-pointer"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-border animate-slide-up">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <div key={link.label}>
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider px-3 py-2">{link.label}</p>
                {link.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-text-primary hover:bg-surface rounded-xl transition-colors"
                  >
                    <span>{child.icon}</span>
                    {child.label}
                  </Link>
                ))}
              </div>
            ))}
            <Link href="/blog" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm text-text-primary hover:bg-surface rounded-xl">
              📖 Blog
            </Link>
            <div className="flex gap-2 pt-3 border-t border-border">
              <Link href="/emergency/ambulance" className="flex-1" onClick={() => setMobileOpen(false)}>
                <Button variant="danger" size="sm" className="w-full">
                  <Phone className="w-3.5 h-3.5" /> Emergency
                </Button>
              </Link>
              {isLoggedIn ? (
                <div className="flex-1 flex gap-2">
                  <Link href="/profile" className="flex-1" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">Profile</Button>
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" className="flex-1" onClick={() => setMobileOpen(false)}>
                      <Button variant="primary" size="sm" className="w-full">Admin</Button>
                    </Link>
                  )}
                </div>
              ) : (
                <Link href="/auth/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">Login</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
