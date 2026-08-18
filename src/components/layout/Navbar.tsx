'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { T } from '@/lib/contexts/LanguageContext';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu, X, ChevronDown, Phone, Globe, User, Shield, LogOut, Home, Users, Heart, Calendar, PlusCircle, Droplets, Ambulance, GraduationCap, Building, Bus, Gift, Info, Scale, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth/AuthContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import localFont from 'next/font/local';

const samarkan = localFont({
  src: '../../../public/fonts/Samarkan.ttf',
  display: 'swap',
});

const navLinks = [
  {
    label: 'Explore',
    children: [
      { label: 'Stay & Accommodation', href: '/explore/stay', icon: <Home className="w-4 h-4" /> },
      { label: 'Bengali Food', href: '/explore/food', icon: <Gift className="w-4 h-4" /> },
      { label: 'Travel & Transport', href: '/explore/travel', icon: <Bus className="w-4 h-4" /> },
    ],
  },
  {
    label: 'Community',
    children: [
      { label: 'Community Groups', href: '/community/groups', icon: <Users className="w-4 h-4" /> },
      { label: 'Matrimonial', href: '/community/matrimonial', icon: <Heart className="w-4 h-4" /> },
      { label: 'Events & Festivals', href: '/community/events', icon: <Calendar className="w-4 h-4" /> },
    ],
  },
  {
    label: 'Emergency',
    children: [
      { label: 'Hospitals', href: '/emergency/hospitals', icon: <PlusCircle className="w-4 h-4" /> },
      { label: 'Blood Help', href: '/emergency/blood', icon: <Droplets className="w-4 h-4" /> },
      { label: 'Ambulance & SOS', href: '/emergency/ambulance', icon: <Ambulance className="w-4 h-4" /> },
    ],
  },
  {
    label: 'Services',
    children: [
      { label: 'College/School Finder', href: '/services/college', icon: <GraduationCap className="w-4 h-4" /> },
      { label: 'Government Services', href: '/services/government', icon: <Building className="w-4 h-4" /> },
      { label: 'Legal Services', href: '/services/legal', icon: <Scale className="w-4 h-4" /> },
    ],
  },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { language, setLanguage, isMounted } = useLanguage();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileExpandedCategory, setMobileExpandedCategory] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { firebaseUser, profile, loading, logOut } = useAuth();

  React.useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  const isLoggedIn = !!firebaseUser && !!profile;
  const isAdmin = profile?.role === 'admin' || profile?.role === 'superadmin';

  const handleLogout = async () => {
    await logOut();
    setUserMenuOpen(false);
    router.push('/');
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (pathname !== href) {
      router.push(href);
    }
  };

  // Don't show navbar on admin pages (admin has its own layout)
  if (pathname.startsWith('/admin')) return null;

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-border">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group notranslate shrink-0">
              <img src="/logo.png" alt="ProbasiBangali Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain group-hover:scale-105 transition-transform" />
              <span className={`text-[22px] sm:text-[32px] font-normal text-text-primary ${samarkan.className} mt-1 sm:mt-1.5 leading-none`}>
                Probasi<span className="text-primary">Bangali</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {/* <Link
                href="/"
                onClick={(e) => handleLinkClick(e, '/')}
                className="px-3 py-2 text-sm font-medium text-text-primary hover:text-primary transition-colors rounded-lg hover:bg-surface"
              >
                <T>Home</T>
              </Link> */}
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative group"
                >
                  <button suppressHydrationWarning className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-text-primary hover:text-primary transition-colors rounded-lg hover:bg-surface cursor-pointer">
                    <T>{link.label}</T>
                    <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
                  </button>
                  <div className="absolute top-full left-0 pt-1 w-64 bg-transparent opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-opacity duration-300">
                    <div className="bg-white rounded-2xl shadow-xl border border-border py-2 animate-fade-in">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={(e) => handleLinkClick(e, child.href)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary hover:bg-surface hover:text-primary transition-colors"
                        >
                          <span className="text-lg">{child.icon}</span>
                          <T>{child.label}</T>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              <Link
                href="/blog"
                onClick={(e) => handleLinkClick(e, '/blog')}
                className="px-3 py-2 text-sm font-medium text-text-primary hover:text-primary transition-colors rounded-lg hover:bg-surface"
              >
                <T>Blog</T>
              </Link>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Language Switcher */}
              <div className="relative shrink-0">
                <button
                  suppressHydrationWarning
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3.5 py-1.5 text-[10px] sm:text-xs font-bold text-primary bg-primary/10 hover:bg-primary/15 border-2 border-primary/25 hover:border-primary/50 rounded-full transition-all cursor-pointer shadow-sm notranslate"
                  title="Switch Language / ভাষা পরিবর্তন করুন"
                >
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Globe className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </div>
                  <span className="font-extrabold tracking-wide max-w-[40px] sm:max-w-none truncate">
                    {!isMounted ? 'EN' : language === 'en' ? 'English' : language === 'bn' ? 'বাংলা' : 'தமிழ்'}
                  </span>
                  <ChevronDown className={cn("w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary transition-transform duration-200", langMenuOpen && "rotate-180")} />
                </button>

                {langMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-44 bg-white rounded-2xl shadow-2xl border border-primary/20 py-1.5 z-50 animate-fade-in divide-y divide-border/40">
                    <div className="px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-text-muted">
                      Select Language
                    </div>
                    <div className="py-1">
                      {[
                        { code: 'en', native: 'English (EN)' },
                        { code: 'bn', native: 'বাংলা (Bengali)' },
                        { code: 'ta', native: 'தமிழ் (Tamil)' },
                      ].map((l) => (
                        <button
                          key={l.code}
                          onClick={() => {
                            setLanguage(l.code as 'en' | 'bn' | 'ta');
                            setLangMenuOpen(false);
                          }}
                          className={cn(
                            "w-full flex items-center justify-between px-3.5 py-2.5 text-xs transition-colors notranslate cursor-pointer",
                            language === l.code
                              ? "bg-primary/10 text-primary font-extrabold"
                              : "text-text-primary hover:bg-surface"
                          )}
                        >
                          <span>{l.native}</span>
                          {language === l.code && <Check className="w-4 h-4 text-primary shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>


              {/* Auth section */}
              {!mounted || loading ? (
                <div className="w-8 h-8 rounded-full bg-surface animate-pulse hidden sm:block" />
              ) : isLoggedIn ? (
                <div className="relative hidden sm:block">
                  <button
                    suppressHydrationWarning
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-full border border-border hover:border-primary/40 transition-all cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
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
                          <T>{profile.role === 'superadmin' ? 'Super Admin' : profile.role}</T>
                        </span>
                      </div>

                      <Link
                        href="/profile"
                        onClick={(e) => {
                          handleLinkClick(e, '/profile');
                          setUserMenuOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary hover:bg-surface transition-colors"
                      >
                        <User className="w-4 h-4" /> <T>My Profile</T>
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={(e) => {
                            handleLinkClick(e, '/admin');
                            setUserMenuOpen(false);
                          }}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary hover:bg-surface transition-colors"
                        >
                          <Shield className="w-4 h-4" /> <T>Admin Panel</T>
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50/50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> <T>Logout</T>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href={`/auth/login${pathname && pathname !== '/' ? `?redirect=${encodeURIComponent(pathname)}` : ''}`}>
                    <Button variant="ghost" size="sm"><T>Login</T></Button>
                  </Link>
                  <Link href={`/auth/register${pathname && pathname !== '/' ? `?redirect=${encodeURIComponent(pathname)}` : ''}`}>
                    <Button variant="primary" size="sm"><T>Register</T></Button>
                  </Link>
                </div>
              )}

              <Link href="/emergency/ambulance">
                <Button variant="danger" size="sm" className="hidden sm:inline-flex animate-pulse-glow bg-[#B81D18] hover:bg-[#9E1814] text-white" suppressHydrationWarning>
                  <Phone className="w-3.5 h-3.5" />
                  <T>Emergency</T>
                </Button>
              </Link>

              {/* Mobile Menu Toggle */}
              <div className="lg:hidden">
                <button suppressHydrationWarning onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-md text-text-primary">
                  {mobileOpen ? <X /> : <Menu />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile Menu Drawer */}
      <div className={cn(
        "lg:hidden fixed top-0 right-0 bottom-0 w-[280px] bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out flex flex-col overflow-hidden",
        mobileOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex items-center justify-between px-4 h-16 border-b border-border">
          <span className="font-bold text-text-primary text-lg">Menu</span>
          <button onClick={() => setMobileOpen(false)} className="p-2 rounded-md text-text-primary hover:bg-surface">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Language Switcher */}
        <div className="px-4 py-3 bg-primary/5 border-b border-border">
          <p className="text-[10px] font-extrabold text-primary uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-primary" /> Language / ভাষা / மொழி
          </p>
          <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-xl border border-primary/20 shadow-sm notranslate">
            {[
              { code: 'en', label: 'English' },
              { code: 'bn', label: 'বাংলা' },
              { code: 'ta', label: 'தமிழ்' },
            ].map((l) => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code as 'en' | 'bn' | 'ta')}
                className={cn(
                  "py-2 text-xs font-extrabold rounded-lg transition-all cursor-pointer text-center",
                  language === l.code
                    ? "bg-primary text-white shadow-sm"
                    : "text-text-primary hover:bg-surface"
                )}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-4 px-4 space-y-4">
          <div className="border-b border-border/60 pb-2">
            <Link
              href="/"
              onClick={(e) => {
                handleLinkClick(e, '/');
                setMobileOpen(false);
              }}
              className="flex items-center gap-3 py-3 px-2 text-text-primary font-bold text-lg hover:text-primary transition-colors"
            >
              <T>Home</T>
            </Link>
          </div>
          {navLinks.map((link) => (
            <div key={link.label} className="border-b border-border/60 pb-2">
              <button
                onClick={() => setMobileExpandedCategory(mobileExpandedCategory === link.label ? null : link.label)}
                className="w-full flex items-center justify-between py-2 text-text-primary font-bold text-lg"
              >
                <T>{link.label}</T>
                <ChevronDown className={cn("w-5 h-5 transition-transform", mobileExpandedCategory === link.label && "rotate-180 text-primary")} />
              </button>
              
              <div className={cn(
                "overflow-hidden transition-all duration-300",
                mobileExpandedCategory === link.label ? "max-h-64 opacity-100 mt-2" : "max-h-0 opacity-0"
              )}>
                {link.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={(e) => {
                      handleLinkClick(e, child.href);
                      setMobileOpen(false);
                    }}
                    className="flex items-center gap-3 py-3 px-2 text-text-muted hover:bg-surface hover:text-primary rounded-xl transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {child.icon}
                    </div>
                    <span className="font-medium"><T>{child.label}</T></span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <div className="pt-2">
            <Link
              href="/blog"
              onClick={(e) => {
                handleLinkClick(e, '/blog');
                setMobileOpen(false);
              }}
              className="flex items-center gap-3 py-3 px-2 text-text-primary font-bold text-lg hover:text-primary transition-colors"
            >
              <T>Blog</T>
            </Link>
          </div>
        </div>
        
        {/* Mobile Menu Footer */}
        <div className="p-4 border-t border-border bg-surface/50">
          <Link href="/emergency/ambulance" onClick={() => setMobileOpen(false)}>
            <Button variant="danger" className="w-full bg-[#B81D18] hover:bg-[#9E1814] text-white shadow-md">
              <Phone className="w-4 h-4 mr-2" />
              <T>Call Emergency</T>
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
