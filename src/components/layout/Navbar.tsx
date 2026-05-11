'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { T } from '@/lib/contexts/LanguageContext';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu, X, ChevronDown, Phone, Globe, User, Shield, LogOut, Home, Users, Heart, Calendar, PlusCircle, Droplets, LifeBuoy, GraduationCap, Building, Bus, Gift, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth/AuthContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { PageSkeleton } from '@/components/ui/Skeleton';

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
      { label: 'Ambulance & SOS', href: '/emergency/ambulance', icon: <LifeBuoy className="w-4 h-4" /> },
    ],
  },
  {
    label: 'Services',
    children: [
      { label: 'College Finder', href: '/services/college', icon: <GraduationCap className="w-4 h-4" /> },
      { label: 'Government Services', href: '/services/government', icon: <Building className="w-4 h-4" /> },
    ],
  },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (pathname !== href) {
      setIsLoading(true);
      router.push(href);
    }
  };

  React.useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  return (
    <>
      {isLoading && <PageSkeleton />}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group notranslate">
              <img src="/logo.png" alt="ProbasiBangali Logo" className="w-10 h-10 object-contain group-hover:scale-105 transition-transform" />
              <span className="text-xl font-bold text-text-primary hidden sm:block tracking-tight">
                Probasi<span className="text-primary">Bangali</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative group"
                >
                  <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-text-primary hover:text-primary transition-colors rounded-lg hover:bg-surface cursor-pointer">
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
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-text-muted hover:text-primary border border-border rounded-full hover:border-primary transition-all cursor-pointer bg-white notranslate"
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
                          "w-full text-left px-4 py-2 text-sm hover:bg-surface transition-colors notranslate",
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
                  <Link href="/auth/login">
                    <Button variant="ghost" size="sm"><T>Login</T></Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button variant="primary" size="sm"><T>Register</T></Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <div className="lg:hidden">
                <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-md text-text-primary">
                  {mobileOpen ? <X /> : <Menu />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileOpen && (
            <div className="lg:hidden absolute top-16 left-0 w-full bg-white shadow-lg py-4 animate-fade-in-down">
              {navLinks.map((link) => (
                <div key={link.label} className="px-4 py-2">
                  <p className="font-semibold text-text-primary mb-2"><T>{link.label}</T></p>
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={(e) => {
                        handleLinkClick(e, child.href);
                        setMobileOpen(false);
                      }}
                      className="flex items-center gap-3 py-2 text-text-muted hover:text-primary"
                    >
                      {child.icon}
                      <T>{child.label}</T>
                    </Link>
                  ))}
                </div>
              ))}
              <div className="px-4 py-2 border-t border-border mt-2">
                <Link
                  href="/blog"
                  onClick={(e) => {
                    handleLinkClick(e, '/blog');
                    setMobileOpen(false);
                  }}
                  className="block py-2 text-text-muted hover:text-primary"
                >
                  <T>Blog</T>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
