'use client';

import React from 'react';
import Link from 'next/link';
import { T } from '@/lib/contexts/LanguageContext';
import {
  ArrowRight, Home, UtensilsCrossed, Bus, Hospital, Users,
  Phone, MapPin, Droplets, Siren, Stethoscope, Search,
  Star, CheckCircle2, Building, Wifi, Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PlaceImage } from '@/components/ui/PlaceImage';
import { sampleStayListings, sampleFoodListings } from '@/data/sample-data';
import { formatPrice } from '@/lib/utils';

/* ── Quick access category data ── */
const CATEGORIES = [
  {
    title: 'Stay & Accommodation',
    desc: 'PGs, hotels & rentals',
    href: '/explore/stay',
    icon: <Home className="w-6 h-6" />,
    color: 'from-blue-600 to-indigo-700',
    imageName: 'PG accommodation hostel',
    imageCity: 'Chennai',
  },
  {
    title: 'Bengali Food',
    desc: 'Restaurants & tiffin',
    href: '/explore/food',
    icon: <UtensilsCrossed className="w-6 h-6" />,
    color: 'from-orange-500 to-red-600',
    imageName: 'Bengali restaurant food',
    imageCity: 'Chennai',
  },
  {
    title: 'Travel & Transport',
    desc: 'Bus, metro & cab routes',
    href: '/explore/travel',
    icon: <Bus className="w-6 h-6" />,
    color: 'from-emerald-500 to-teal-600',
    imageName: 'Chennai metro bus station',
    imageCity: 'Chennai',
  },
  {
    title: 'Hospitals',
    desc: 'Emergency & specialists',
    href: '/emergency/hospitals',
    icon: <Hospital className="w-6 h-6" />,
    color: 'from-red-500 to-rose-600',
    imageName: 'Hospital emergency',
    imageCity: 'Chennai',
  },
  {
    title: 'Community Groups',
    desc: 'WhatsApp, Telegram & more',
    href: '/community/groups',
    icon: <Users className="w-6 h-6" />,
    color: 'from-violet-500 to-purple-600',
    imageName: 'Community gathering Bengali',
    imageCity: 'Tamil Nadu',
  },
  {
    title: 'Emergency Help',
    desc: 'Ambulance, blood & SOS',
    href: '/emergency/ambulance',
    icon: <Siren className="w-6 h-6" />,
    color: 'from-rose-600 to-red-700',
    imageName: 'Ambulance emergency services',
    imageCity: 'Chennai',
  },
];

/* ── Get featured listings ── */
const featuredStays = sampleStayListings.filter(l => l.verified).slice(0, 3);
const featuredFood = sampleFoodListings.filter(f => f.verified).slice(0, 3);

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* ====== HERO SECTION ====== */}
      <section className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-20 sm:py-28 lg:py-36 overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }} />
        </div>
        {/* Accent glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold font-display text-white leading-tight animate-fade-in">
            <T>Your Bengali</T>{' '}
            <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
              <T>Guide</T>
            </span>
            <br />
            <T>in Tamil Nadu</T>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed animate-fade-in delay-100">
            <T>Find accommodation, food, hospitals, transport & community — everything a Bengali needs in Tamil Nadu, in one place.</T>
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in delay-200">
            <Link href="/explore/stay">
              <Button variant="primary" size="lg">
                <Search className="w-5 h-5" /> <T>Find Accommodation</T>
              </Button>
            </Link>
            <Link href="/explore/food">
              <Button variant="outline" size="lg" className="border-slate-500 text-white hover:bg-white/10">
                <UtensilsCrossed className="w-5 h-5" /> <T>Find Bengali Food</T>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ====== QUICK ACCESS GRID ====== */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-text-primary">
              <T>What do you need?</T>
            </h2>
            <p className="mt-2 text-text-muted">
              <T>Quick access to everything — tap to explore</T>
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {CATEGORIES.map((cat) => (
              <Link key={cat.title} href={cat.href} className="group">
                <div className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                  {/* Image */}
                  <PlaceImage
                    name={cat.imageName}
                    city={cat.imageCity}
                    type="stay"
                    className="h-36 sm:h-44"
                  />
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10 group-hover:from-black/80 transition-all" />
                  {/* Icon badge */}
                  <div className={`absolute top-3 left-3 w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} text-white flex items-center justify-center shadow-lg`}>
                    {cat.icon}
                  </div>
                  {/* Text */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold text-sm sm:text-base">
                      <T>{cat.title}</T>
                    </h3>
                    <p className="text-white/70 text-xs sm:text-sm mt-0.5">
                      <T>{cat.desc}</T>
                    </p>
                  </div>
                  {/* Arrow */}
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ====== EMERGENCY STRIP ====== */}
      <section className="bg-gradient-to-r from-red-600 to-rose-700 py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-white">
                <T>Emergency?</T>
              </h2>
              <p className="text-red-100 text-sm mt-1">
                <T>Immediate help — hospitals, ambulance, blood banks</T>
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                { icon: <Stethoscope className="w-5 h-5" />, label: 'Hospitals', href: '/emergency/hospitals' },
                { icon: <Droplets className="w-5 h-5" />, label: 'Blood Help', href: '/emergency/blood' },
                { icon: <Siren className="w-5 h-5" />, label: 'Ambulance', href: '/emergency/ambulance' },
              ].map((item) => (
                <Link key={item.label} href={item.href}>
                  <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white backdrop-blur-sm transition-all font-medium text-sm cursor-pointer">
                    {item.icon}
                    <T>{item.label}</T>
                  </button>
                </Link>
              ))}
              <a href="tel:108">
                <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-red-600 font-bold text-sm hover:bg-red-50 transition-all shadow-lg cursor-pointer">
                  <Phone className="w-5 h-5" />
                  <T>Call 108</T>
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ====== FEATURED STAYS ====== */}
      <section className="py-16 lg:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-text-primary">
                <T>Popular Stays</T>
              </h2>
              <p className="mt-1 text-text-muted text-sm">
                <T>Verified accommodation options</T>
              </p>
            </div>
            <Link href="/explore/stay">
              <Button variant="outline" size="sm">
                <T>View all</T> <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredStays.map((listing) => (
              <Link key={listing.id} href={`/explore/stay/${listing.id}`}>
                <Card padding="none" className="overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <PlaceImage
                    name={listing.name}
                    city={listing.city}
                    type={listing.type as 'pg' | 'hotel' | 'rental'}
                    mapsUrl={listing.google_maps_url}
                    className="h-44"
                  />
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-1">
                          {listing.name}
                        </h3>
                        <div className="flex items-center gap-1 mt-1 text-xs text-text-muted">
                          <MapPin className="w-3 h-3" />
                          {listing.area}, {listing.city}
                        </div>
                      </div>
                      {listing.verified && (
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-1" />
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1 mt-3">
                      {(listing.amenities || []).slice(0, 3).map((a) => (
                        <span key={a} className="px-2 py-0.5 bg-surface rounded-md text-[11px] text-text-muted">
                          {a}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                      <div>
                        <span className="text-lg font-bold text-primary">{formatPrice(listing.price_per_month || 0)}</span>
                        <span className="text-xs text-text-muted ml-1">/mo</span>
                      </div>
                      <span className="text-xs font-medium text-text-muted uppercase tracking-wider px-2 py-1 bg-surface rounded-lg">
                        {listing.type}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ====== FEATURED FOOD ====== */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-text-primary">
                <T>Popular Restaurants</T>
              </h2>
              <p className="mt-1 text-text-muted text-sm">
                <T>Eat well, eat local</T>
              </p>
            </div>
            <Link href="/explore/food">
              <Button variant="outline" size="sm">
                <T>View all</T> <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredFood.map((food) => (
              <Link key={food.id} href={`/explore/food/${food.id}`}>
                <Card padding="none" className="overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <PlaceImage
                    name={food.name}
                    city={food.city}
                    type={(food.type as 'restaurant' | 'sweets' | 'tiffin') || 'restaurant'}
                    mapsUrl={food.google_maps_url}
                    className="h-40"
                  />
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-1">
                          {food.name}
                        </h3>
                        <div className="flex items-center gap-1 mt-1 text-xs text-text-muted">
                          <MapPin className="w-3 h-3" />
                          {food.area}, {food.city}
                        </div>
                      </div>
                      {food.verified && (
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-1" />
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {(food.specialties || []).slice(0, 3).map((s) => (
                        <span key={s} className="px-2 py-0.5 bg-surface rounded-md text-[11px] text-text-muted">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
