'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, Phone, Globe } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

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
  const [lang, setLang] = useState<'en' | 'bn'>('en');

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
                  {link.label}
                  <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', activeDropdown === link.label && 'rotate-180')} />
                </button>
                {activeDropdown === link.label && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-2xl shadow-xl border border-border py-2 animate-fade-in">
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
                )}
              </div>
            ))}
            <Link href="/blog" className="px-3 py-2 text-sm font-medium text-text-primary hover:text-primary transition-colors rounded-lg hover:bg-surface">
              Blog
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-muted hover:text-primary border border-border rounded-full hover:border-primary transition-all cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang === 'en' ? 'বাংলা' : 'EN'}
            </button>

            <Link href="/emergency/ambulance">
              <Button variant="danger" size="sm" className="hidden sm:inline-flex animate-pulse-glow">
                <Phone className="w-3.5 h-3.5" />
                Emergency
              </Button>
            </Link>

            <Link href="/auth/login">
              <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                Login
              </Button>
            </Link>

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
              <Link href="/auth/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">Login</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
