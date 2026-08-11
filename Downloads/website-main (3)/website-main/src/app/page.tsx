'use client';

import React from 'react';
import Link from 'next/link';
import { T } from '@/lib/contexts/LanguageContext';
import { ArrowRight, Home, UtensilsCrossed, Bus, Users, Heart, Calendar, GraduationCap, Landmark, Hospital, Droplets, Siren, Phone, MapPin, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';

export default function HomePage() {
  return (
    <div className="overflow-hidden bg-alpana">
      {/* ====== HERO SECTION ====== */}
      <section className="relative bg-gradient-to-br from-white/90 via-primary-light/40 to-accent-light/30 py-20 sm:py-24 lg:py-32 border-b border-border/50">
        {/* Decorative blobs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            
            {/* Text Column */}
            <div className="flex-1 text-center lg:text-left space-y-6 animate-fade-in">
              <Badge variant="teal" className="inline-flex">
                <T>Bengali community platform for Tamil Nadu</T>
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display text-text-primary leading-tight animate-fade-in delay-100">
                <T>Feel at</T> <em className="text-primary not-italic"><T>Home</T></em>,<br />
                <T>Wherever You Are</T>
              </h1>

              <p className="text-lg text-text-muted max-w-2xl mx-auto lg:mx-0 leading-relaxed animate-fade-in delay-200">
                <T>Find Bengali food, safe accommodation, travel help, and community connections — built for Bengalis living in Tamil Nadu.</T>
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4 animate-fade-in delay-300">
                <Link href="/explore/stay">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-md">
                    <T>Explore Services</T> <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/community/groups">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/80">
                    <T>Join Community</T>
                  </Button>
                </Link>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 gap-3 max-w-md pt-4 animate-fade-in delay-400">
                {[
                  { icon: <MapPin className="w-4 h-4" />, label: '4+ Cities', color: 'text-primary' },
                  { icon: <Zap className="w-4 h-4" />, label: '6 Core Services', color: 'text-accent' },
                  { icon: <Shield className="w-4 h-4" />, label: '24/7 Emergency', color: 'text-red-500' },
                  { icon: <Heart className="w-4 h-4" />, label: 'Free Basic Access', color: 'text-purple-500' },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/95 border border-border/85 shadow-sm">
                    <span className={stat.color}>{stat.icon}</span>
                    <span className="text-xs font-semibold text-text-primary"><T>{stat.label}</T></span>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Column */}
            <div className="flex-1 w-full max-w-md lg:max-w-lg animate-fade-in delay-200">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 ring-8 ring-primary-light/20 bg-white">
                <img 
                  src="/images/bengali_culture_hero.png" 
                  alt="Bengali Culture in Tamil Nadu" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ====== EXPLORE SECTION ====== */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge variant="bengali" className="mb-4"><T>Explore</T></Badge>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-text-primary">
              <T>Everything You Need</T>
            </h2>
            <p className="mt-3 text-text-muted max-w-xl mx-auto">
              <T>From finding a Bengali-friendly PG to authentic fish curry — we&apos;ve got you covered.</T>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Home className="w-7 h-7" />, title: 'Stay & Accommodation', desc: 'Find Bengali-friendly PGs, hotels, and rental houses across Tamil Nadu cities.', href: '/explore/stay', color: 'bg-blue-50 text-blue-600', borderColor: 'hover:border-blue-300' },
              { icon: <UtensilsCrossed className="w-7 h-7" />, title: 'Bengali Food & Sweets', desc: 'Discover Bengali restaurants, sweet shops, tiffin services, and delivery partners.', href: '/explore/food', color: 'bg-orange-50 text-orange-600', borderColor: 'hover:border-orange-300' },
              { icon: <Bus className="w-7 h-7" />, title: 'Travel & Transport', desc: 'Plan your route with bus, metro, auto, and cab options. Common Tamil words included.', href: '/explore/travel', color: 'bg-green-50 text-green-600', borderColor: 'hover:border-green-300' },
            ].map((item) => (
              <Link key={item.title} href={item.href}>
                <Card className={`h-full border-2 border-transparent ${item.borderColor} transition-all group`}>
                  <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-2"><T>{item.title}</T></h3>
                  <p className="text-sm text-text-muted leading-relaxed mb-4"><T>{item.desc}</T></p>
                  <span className="text-sm font-semibold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                    <T>View</T> <ArrowRight className="w-4 h-4" />
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ====== EMERGENCY STRIP ====== */}
      <section className="bg-gradient-to-r from-primary to-primary-dark py-14 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mb-3">
            <T>Emergency Services</T>
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-10">
            <T>Immediate help when you need it most — hospitals, blood banks, and emergency contacts.</T>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { icon: <Hospital className="w-6 h-6" />, label: 'Hospitals', href: '/emergency/hospitals' },
              { icon: <Droplets className="w-6 h-6" />, label: 'Blood Help', href: '/emergency/blood' },
              { icon: <Siren className="w-6 h-6" />, label: 'Ambulance', href: '/emergency/ambulance' },
              { icon: <Phone className="w-6 h-6" />, label: 'SOS Button', href: '/emergency/ambulance', special: true },
            ].map((item) => (
              <Link key={item.label} href={item.href}>
                <div className={`flex flex-col items-center gap-3 px-4 py-5 rounded-2xl transition-all cursor-pointer ${item.special
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:scale-105'
                    : 'bg-white/15 hover:bg-white/25 text-white backdrop-blur-sm'
                  }`}>
                  {item.icon}
                  <span className="text-sm font-semibold"><T>{item.label}</T></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ====== COMMUNITY SECTION ====== */}
      <section className="py-20 lg:py-28 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge variant="teal" className="mb-4"><T>Community</T></Badge>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-text-primary">
              <T>Connect with Your People</T>
            </h2>
            <p className="mt-3 text-text-muted max-w-xl mx-auto">
              <T>Join groups, find life partners, celebrate festivals, and stay connected.</T>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Users className="w-7 h-7" />, title: 'Community Groups', desc: 'WhatsApp, Telegram & Facebook groups for Bengalis.', href: '/community/groups', color: 'bg-indigo-50 text-indigo-600' },
              { icon: <Heart className="w-7 h-7" />, title: 'Matrimonial', desc: 'Find your Bengali life partner in Tamil Nadu.', href: '/community/matrimonial', color: 'bg-pink-50 text-pink-600' },
              { icon: <Calendar className="w-7 h-7" />, title: 'Events & Festivals', desc: 'Durga Puja, Saraswati Puja & community meetups.', href: '/community/events', color: 'bg-amber-50 text-amber-600' },
              { icon: <span className="text-2xl bengali-text">📅</span>, title: 'Bengali Calendar', desc: 'View Bengali dates and Panjika online.', href: '/community/events', color: 'bg-teal-50 text-teal-600' },
            ].map((item) => (
              <Link key={item.title} href={item.href}>
                <Card className="h-full text-center group border-2 border-transparent hover:border-accent/30 transition-all">
                  <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold text-text-primary mb-2"><T>{item.title}</T></h3>
                  <p className="text-sm text-text-muted"><T>{item.desc}</T></p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ====== SERVICES SECTION ====== */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge variant="bengali" className="mb-4">Services</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-text-primary">
              Campus & Government Help
            </h2>
            <p className="mt-3 text-text-muted max-w-xl mx-auto">
              Find colleges and access government services easily.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              { icon: <GraduationCap className="w-8 h-8" />, title: 'College Finder', desc: 'Search engineering, medical, arts, and management colleges across Tamil Nadu. Includes integrated travel planner.', href: '/services/college', color: 'from-blue-500 to-indigo-600' },
              { icon: <Landmark className="w-8 h-8" />, title: 'Government Services', desc: 'Quick access to Aadhaar, Ration Card, Passport, Health Schemes and more Tamil Nadu government portals.', href: '/services/government', color: 'from-emerald-500 to-teal-600' },
            ].map((item) => (
              <Link key={item.title} href={item.href}>
                <Card className="h-full group border-2 border-transparent hover:border-primary/20 transition-all relative overflow-hidden" padding="lg">
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.color} opacity-10 rounded-bl-full group-hover:opacity-20 transition-opacity`} />
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-2">{item.title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed mb-4">{item.desc}</p>
                  <span className="text-sm font-semibold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                    Explore <ArrowRight className="w-4 h-4" />
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* ====== CTA SECTION ====== */}
      <section className="py-20 bg-gradient-to-br from-accent-light via-white to-primary-light">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-text-primary mb-4">
            <T>Join the ProbasiBangali Community</T>
          </h2>
          <p className="text-text-muted mb-8 max-w-lg mx-auto">
            <T>Whether you&apos;re a student, professional, or family — connect with fellow Bengalis and make Tamil Nadu feel like home.</T>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/register">
              <Button variant="primary" size="lg">
                <T>Create Free Account</T> <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/community/groups">
              <Button variant="secondary" size="lg">
                <T>Browse Community Groups</T>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
