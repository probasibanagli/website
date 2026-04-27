import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-text-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-lg bengali-text">
                প
              </div>
              <span className="text-lg font-bold">
                Probasi<span className="text-primary">Bangali</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Helping Bengalis in Tamil Nadu feel at home. Find accommodation, food, community, and emergency help — all in one place.
            </p>
            <p className="text-xs text-gray-500 italic font-display">
              &ldquo;Helping You Feel at Home, Anywhere&rdquo;
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Explore</h4>
            <ul className="space-y-2.5">
              <li><Link href="/explore/stay" className="text-sm text-gray-300 hover:text-primary transition-colors">Stay & Accommodation</Link></li>
              <li><Link href="/explore/food" className="text-sm text-gray-300 hover:text-primary transition-colors">Bengali Food</Link></li>
              <li><Link href="/explore/travel" className="text-sm text-gray-300 hover:text-primary transition-colors">Travel & Transport</Link></li>
              <li><Link href="/blog" className="text-sm text-gray-300 hover:text-primary transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Community & Emergency */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Community</h4>
            <ul className="space-y-2.5">
              <li><Link href="/community/groups" className="text-sm text-gray-300 hover:text-primary transition-colors">Community Groups</Link></li>
              <li><Link href="/community/matrimonial" className="text-sm text-gray-300 hover:text-primary transition-colors">Matrimonial</Link></li>
              <li><Link href="/community/events" className="text-sm text-gray-300 hover:text-primary transition-colors">Events & Festivals</Link></li>
              <li><Link href="/emergency/hospitals" className="text-sm text-gray-300 hover:text-primary transition-colors">Hospitals</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              <li><Link href="/services/college" className="text-sm text-gray-300 hover:text-primary transition-colors">College Finder</Link></li>
              <li><Link href="/services/government" className="text-sm text-gray-300 hover:text-primary transition-colors">Government Services</Link></li>
              <li><Link href="/emergency/ambulance" className="text-sm text-gray-300 hover:text-primary transition-colors">Emergency SOS</Link></li>
              <li><Link href="/auth/login" className="text-sm text-gray-300 hover:text-primary transition-colors">Login / Register</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} ProbasiBangali.in — All rights reserved.
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-primary fill-primary" /> for Bengalis in Tamil Nadu
          </p>
        </div>
      </div>
    </footer>
  );
}
