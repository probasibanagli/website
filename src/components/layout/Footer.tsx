'use client';

import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { T } from '@/lib/contexts/LanguageContext';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();

  // Don't show footer on admin pages (admin has its own layout)
  if (pathname?.startsWith('/admin')) return null;
  return (
    <footer className="bg-text-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
              <span className="text-xl font-bold">
                Probasi<span className="text-primary">Bangali</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              <T>Helping Bengalis in Tamil Nadu feel at home. Find accommodation, food, community, and emergency help — all in one place.</T>
            </p>
            <p className="text-xs text-gray-500 italic font-display">
              &ldquo;<T>Helping You Feel at Home, Anywhere</T>&rdquo;
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4"><T>Explore</T></h4>
            <ul className="space-y-2.5">
              <li><Link href="/explore/stay" className="text-sm text-gray-300 hover:text-primary transition-colors"><T>Stay & Accommodation</T></Link></li>
              <li><Link href="/explore/food" className="text-sm text-gray-300 hover:text-primary transition-colors"><T>Bengali Food</T></Link></li>
              <li><Link href="/explore/travel" className="text-sm text-gray-300 hover:text-primary transition-colors"><T>Travel & Transport</T></Link></li>
              <li><Link href="/blog" className="text-sm text-gray-300 hover:text-primary transition-colors"><T>Blog</T></Link></li>
            </ul>
          </div>

          {/* Community & Emergency */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4"><T>Community</T></h4>
            <ul className="space-y-2.5">
              <li><Link href="/community/groups" className="text-sm text-gray-300 hover:text-primary transition-colors"><T>Community Groups</T></Link></li>
              <li><Link href="/community/matrimonial" className="text-sm text-gray-300 hover:text-primary transition-colors"><T>Matrimonial</T></Link></li>
              <li><Link href="/community/events" className="text-sm text-gray-300 hover:text-primary transition-colors"><T>Events & Festivals</T></Link></li>
              <li><Link href="/emergency/hospitals" className="text-sm text-gray-300 hover:text-primary transition-colors"><T>Hospitals</T></Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4"><T>Quick Links</T></h4>
            <ul className="space-y-2.5">
              <li><Link href="/services/college" className="text-sm text-gray-300 hover:text-primary transition-colors"><T>College Finder</T></Link></li>
              <li><Link href="/services/government" className="text-sm text-gray-300 hover:text-primary transition-colors"><T>Government Services</T></Link></li>
              <li><Link href="/emergency/ambulance" className="text-sm text-gray-300 hover:text-primary transition-colors"><T>Emergency SOS</T></Link></li>
              <li><Link href="/auth/login" className="text-sm text-gray-300 hover:text-primary transition-colors"><T>Login / Register</T></Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} <T>ProbasiBangali.in — All rights reserved.</T>
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <T>Made with</T> <Heart className="w-3 h-3 text-primary fill-primary" /> <T>for Bengalis in Tamil Nadu</T>
          </p>
        </div>
      </div>
    </footer>
  );
}
