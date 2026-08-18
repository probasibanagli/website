'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Mail, MapPin } from 'lucide-react';
import { T } from '@/lib/contexts/LanguageContext';
import { usePathname } from 'next/navigation';
import localFont from 'next/font/local';

const samarkan = localFont({
  src: '../../../public/fonts/Samarkan.ttf',
  variable: '--font-samarkan'
});

export function Footer() {
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);
    }
    setMounted(true);
  }, []);

  // Don't show footer on admin pages (admin has its own layout)
  if (pathname?.startsWith('/admin')) return null;

  if (!mounted) {
    return <footer className="bg-text-primary text-white pt-16 pb-8 border-t-[6px] border-primary opacity-0 min-h-[300px]" />;
  }

  return (
    <footer className="bg-text-primary text-white pt-16 pb-8 border-t-[6px] border-primary transition-opacity duration-150 opacity-100">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & About */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group notranslate">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2 shadow-sm group-hover:scale-105 transition-transform duration-300">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <span className={`text-[36px] font-normal text-white ${samarkan.className} mt-1.5 leading-none tracking-wide`}>
                Probasi<span className="text-primary">Bangali</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs font-medium">
              <T>Helping Bengalis in Tamil Nadu feel at home. Find accommodation, authentic food, community, and emergency help seamlessly.</T>
            </p>
            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-primary" />
                <span><T>Operating across Tamil Nadu, India</T></span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:support@probasibangali.in" className="hover:text-white transition-colors">support@probasibangali.in</a>
              </div>
            </div>
          </div>

          {/* Spacer for desktop */}
          <div className="hidden lg:block lg:col-span-1"></div>

          {/* Explore */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-gray-500 mb-6"><T>Explore</T></h4>
            <ul className="space-y-4">
              <li><Link href="/explore/stay" className="text-sm text-gray-300 hover:text-primary transition-colors font-medium"><T>Stay & Accommodation</T></Link></li>
              <li><Link href="/explore/food" className="text-sm text-gray-300 hover:text-primary transition-colors font-medium"><T>Bengali Food</T></Link></li>
              <li><Link href="/explore/travel" className="text-sm text-gray-300 hover:text-primary transition-colors font-medium"><T>Travel & Transport</T></Link></li>
              <li><Link href="/blog" className="text-sm text-gray-300 hover:text-primary transition-colors font-medium"><T>Articles & Blog</T></Link></li>
            </ul>
          </div>

          {/* Community */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-gray-500 mb-6"><T>Community</T></h4>
            <ul className="space-y-4">
              <li><Link href="/community/groups" className="text-sm text-gray-300 hover:text-primary transition-colors font-medium"><T>WhatsApp Groups</T></Link></li>
              <li><Link href="/community/matrimonial" className="text-sm text-gray-300 hover:text-primary transition-colors font-medium"><T>Matrimonial</T></Link></li>
              <li><Link href="/community/events" className="text-sm text-gray-300 hover:text-primary transition-colors font-medium"><T>Events & Puja</T></Link></li>
              <li><Link href="/community/events" className="text-sm text-gray-300 hover:text-primary transition-colors font-medium"><T>Bengali Calendar</T></Link></li>
            </ul>
          </div>

          {/* Services & Emergency */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-gray-500 mb-6"><T>Services & Help</T></h4>
            <ul className="space-y-4">
              <li><Link href="/services/college" className="text-sm text-gray-300 hover:text-primary transition-colors font-medium"><T>College & School Finder</T></Link></li>
              <li><Link href="/services/government" className="text-sm text-gray-300 hover:text-primary transition-colors font-medium"><T>Government Services</T></Link></li>
              <li><Link href="/services/legal" className="text-sm text-gray-300 hover:text-primary transition-colors font-medium"><T>Free Legal Services</T></Link></li>
              <li className="pt-2">
                <Link href="/emergency/ambulance" className="inline-flex items-center gap-2 text-xs font-bold bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 px-3 py-1.5 rounded-full transition-all">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  <T>Emergency SOS</T>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 font-medium">
            © {new Date().getFullYear()} <T>ProbasiBangali.in — All rights reserved.</T>
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-gray-500 hover:text-gray-300 transition-colors"><T>Privacy Policy</T></Link>
            <Link href="/terms" className="text-xs text-gray-500 hover:text-gray-300 transition-colors"><T>Terms of Service</T></Link>
            <p className="text-xs text-gray-500 flex items-center gap-1.5 ml-4">
              <T>Made with</T> <Heart className="w-3.5 h-3.5 text-primary fill-primary" /> <T>for Bengalis</T>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
