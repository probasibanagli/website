'use client';

import React from 'react';
import Link from 'next/link';
import { T } from '@/lib/contexts/LanguageContext';
import { ArrowRight, Home, UtensilsCrossed, Bus, Users, Heart, Calendar, CalendarDays, GraduationCap, Landmark, Hospital, Droplets, Siren, Phone, MapPin, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function HomePage() {
  return (
    <div className="overflow-hidden bg-alpana">
      {/* ====== HERO SECTION ====== */}
      <section className="relative bg-white/90 pt-10 pb-20 sm:pt-12 sm:pb-24 lg:pt-16 lg:pb-32 border-b border-border/50">
        {/* Decorative blobs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

        <div className="relative max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
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
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 ring-8 ring-primary-light/20 bg-white animate-dance">
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
      <section id="explore-services" className="py-12 lg:py-16 bg-[#FDFCFB] relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div className="max-w-2xl">
              <Badge variant="bengali" className="mb-3 shadow-sm"><T>Explore</T></Badge>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-text-primary tracking-tight">
                <T>Everything You Need</T>
              </h2>
              <p className="mt-3 text-base text-text-muted">
                <T>From finding a Bengali-friendly PG to authentic fish curry — we&apos;ve got you covered with curated directories.</T>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                icon: <Home className="w-6 h-6" />, title: 'Stay & Accommodation', desc: 'Find Bengali-friendly PGs, hotels, and service apartments.', 
                href: '/explore/stay', theme: 'from-blue-500/10 to-blue-500/5', iconColor: 'text-blue-600', borderColor: 'group-hover:border-blue-200' 
              },
              { 
                icon: <UtensilsCrossed className="w-6 h-6" />, title: 'Bengali Food & Sweets', desc: 'Discover restaurants, sweet shops, and tiffin services.', 
                href: '/explore/food', theme: 'from-orange-500/10 to-orange-500/5', iconColor: 'text-orange-600', borderColor: 'group-hover:border-orange-200' 
              },
              { 
                icon: <Bus className="w-6 h-6" />, title: 'Travel & Transport', desc: 'Plan routes with bus, metro, auto, and cab options.', 
                href: '/explore/travel', theme: 'from-emerald-500/10 to-emerald-500/5', iconColor: 'text-emerald-600', borderColor: 'group-hover:border-emerald-200' 
              },
              { 
                icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>, 
                title: 'Articles & Blog', desc: 'Read guides, stories, and tips for living in Tamil Nadu.', 
                href: '/blog', theme: 'from-purple-500/10 to-purple-500/5', iconColor: 'text-purple-600', borderColor: 'group-hover:border-purple-200' 
              },
            ].map((item, idx) => (
              <Link key={item.title} href={item.href} className="group block">
                <div className={`h-full relative overflow-hidden rounded-2xl bg-white border border-border/80 shadow-sm hover:shadow-md transition-all duration-300 ${item.borderColor}`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.theme} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  <div className="relative p-6 flex flex-col h-full">
                    <div className={`w-12 h-12 rounded-xl bg-white shadow-sm border border-border/50 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 ${item.iconColor}`}>
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-bold text-text-primary mb-2 tracking-tight"><T>{item.title}</T></h3>
                    <p className="text-sm text-text-muted leading-relaxed mb-6 flex-1"><T>{item.desc}</T></p>
                    <div className="flex items-center gap-2 mt-auto">
                      <span className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">
                        <T>Explore</T>
                      </span>
                      <div className="w-6 h-6 rounded-full bg-surface group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-all duration-300 transform group-hover:translate-x-1">
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ====== EMERGENCY STRIP ====== */}
      <section className="bg-gradient-to-br from-[#801310] via-[#9E1814] to-[#B81D18] py-12 lg:py-16 relative overflow-hidden">
        {/* Dynamic Abstract Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-white/10 blur-[120px]" />
          <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-black/20 blur-[100px]" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA3KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40 mix-blend-overlay" />
        </div>

        <div className="relative max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal direction="up">
          <Badge variant="outline" className="mb-4 border-white/30 text-white bg-white/10 backdrop-blur-md px-3 py-1 text-xs">
            <T>24/7 Support</T>
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mb-3 tracking-tight drop-shadow-sm">
            <T>Emergency Services</T>
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-10 text-base font-medium leading-relaxed">
            <T>Immediate help when you need it most — find verified hospitals, blood banks, and emergency ambulance contacts instantly.</T>
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { icon: <Hospital className="w-6 h-6" />, label: 'Hospitals & Clinics', href: '/emergency/hospitals', glow: 'group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]' },
              { icon: <Droplets className="w-6 h-6" />, label: 'Blood Donation', href: '/emergency/blood', glow: 'group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]' },
              { icon: <Siren className="w-6 h-6" />, label: 'Ambulance', href: '/emergency/ambulance', glow: 'group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]' },
              { icon: <Phone className="w-6 h-6" />, label: 'SOS Button', href: '/emergency/ambulance', special: true, glow: 'group-hover:shadow-[0_0_30px_rgba(255,0,0,0.5)]' },
            ].map((item, idx) => (
              <Link key={item.label} href={item.href} className="block group">
                <div className={`flex flex-col items-center justify-center h-full gap-3 px-4 py-6 rounded-2xl transition-all duration-300 transform group-hover:-translate-y-1 border ${item.special
                    ? 'bg-gradient-to-b from-red-500 to-red-700 border-red-400 text-white shadow-xl'
                    : 'bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-md shadow-lg'
                  } ${item.glow}`}>
                  <div className={`p-3 rounded-full ${item.special ? 'bg-white/20' : 'bg-white/10'} transition-transform duration-300 group-hover:scale-110`}>
                    {item.icon}
                  </div>
                  <span className="text-sm font-bold tracking-wide"><T>{item.label}</T></span>
                </div>
              </Link>
            ))}
          </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ====== COMMUNITY SECTION ====== */}
      <section className="py-12 lg:py-16 bg-white relative overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
        
        <div className="relative max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
          <div className="flex flex-col items-center text-center mb-10 lg:mb-12">
            <Badge variant="teal" className="mb-3 shadow-sm px-3 py-1 rounded-full"><T>Community</T></Badge>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-text-primary tracking-tight">
              <T>Connect with Your People</T>
            </h2>
            <p className="mt-3 text-base text-text-muted max-w-2xl">
              <T>Join groups, find your life partner, celebrate festivals together, and build lifelong relationships within the community.</T>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Users className="w-6 h-6" />, title: 'Community Groups', desc: 'Join WhatsApp, Telegram & Facebook groups for daily discussions and help.', href: '/community/groups', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'group-hover:border-indigo-200', glow: 'group-hover:shadow-[0_10px_30px_-10px_rgba(79,70,229,0.2)]' },
              { icon: <Heart className="w-6 h-6" />, title: 'Matrimonial', desc: 'Find your Bengali life partner currently residing or working in Tamil Nadu.', href: '/community/matrimonial', color: 'text-pink-600', bg: 'bg-pink-50', border: 'group-hover:border-pink-200', glow: 'group-hover:shadow-[0_10px_30px_-10px_rgba(236,72,153,0.2)]' },
              { icon: <Calendar className="w-6 h-6" />, title: 'Events & Festivals', desc: 'Discover Durga Puja, Saraswati Puja, and local community meetups.', href: '/community/events', color: 'text-amber-600', bg: 'bg-amber-50', border: 'group-hover:border-amber-200', glow: 'group-hover:shadow-[0_10px_30px_-10px_rgba(245,158,11,0.2)]' },
              { icon: <CalendarDays className="w-6 h-6" />, title: 'Bengali Calendar', desc: 'View current Bengali dates, tithi, and digital Panjika online instantly.', href: '/community/events', color: 'text-teal-600', bg: 'bg-teal-50', border: 'group-hover:border-teal-200', glow: 'group-hover:shadow-[0_10px_30px_-10px_rgba(20,184,166,0.2)]' },
            ].map((item, idx) => (
              <Link key={item.title} href={item.href} className="group">
                <div className={`h-full bg-white rounded-2xl p-6 border border-border/60 transition-all duration-300 transform group-hover:-translate-y-1 ${item.border} ${item.glow}`}>
                  <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold text-text-primary mb-2"><T>{item.title}</T></h3>
                  <p className="text-sm text-text-muted leading-relaxed mb-5"><T>{item.desc}</T></p>
                  
                  <div className="flex items-center text-xs font-bold text-text-primary group-hover:text-primary transition-colors mt-auto">
                    <span className="mr-1.5"><T>Learn More</T></span>
                    <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ====== SERVICES SECTION ====== */}
      <section className="py-12 lg:py-16 bg-surface/30 relative">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
          <div className="text-center mb-10 lg:mb-12">
            <Badge variant="teal" className="mb-3 shadow-sm px-3 py-1 rounded-full"><T>Services</T></Badge>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-text-primary tracking-tight">
              <T>Essential Services</T>
            </h2>
            <p className="mt-3 text-base text-text-muted max-w-2xl mx-auto">
              <T>Navigate life in Tamil Nadu with integrated tools for education, government, and legal support.</T>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { 
                icon: <GraduationCap className="w-6 h-6" />, title: 'College & School Finder', 
                desc: 'Search engineering, medical, arts, and management colleges as well as top schools across Tamil Nadu. Includes integrated travel planner.', 
                href: '/services/college', color: 'text-indigo-600', bg: 'bg-indigo-50', hoverBorder: 'group-hover:border-indigo-500', btnHover: 'group-hover:bg-indigo-600'
              },
              { 
                icon: <Landmark className="w-6 h-6" />, title: 'Government Services', 
                desc: 'Quick access to Aadhaar, Ration Card, Passport, Health Schemes and more Tamil Nadu government portals.', 
                href: '/services/government', color: 'text-emerald-600', bg: 'bg-emerald-50', hoverBorder: 'group-hover:border-emerald-500', btnHover: 'group-hover:bg-emerald-600'
              },
              { 
                icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>, 
                title: 'Free Legal Services', 
                desc: 'Access official legal aid, NALSA helpline, find nearby Legal Services Authority centres, and understand your rights as a migrant.', 
                href: '/services/legal', color: 'text-orange-600', bg: 'bg-orange-50', hoverBorder: 'group-hover:border-orange-500', btnHover: 'group-hover:bg-orange-600'
              },
            ].map((item) => (
              <Link key={item.title} href={item.href} className="group block h-full">
                <div className={`h-full flex flex-col bg-white rounded-2xl p-6 border border-border/80 shadow-sm hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1 relative overflow-hidden`}>
                  <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}>
                    {item.icon}
                  </div>
                  
                  <h3 className="text-lg font-bold text-text-primary mb-2">
                    <T>{item.title}</T>
                  </h3>
                  
                  <p className="text-sm text-text-muted leading-relaxed mb-6 flex-1">
                    <T>{item.desc}</T>
                  </p>
                  
                  <div className="mt-auto">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border border-border/60 text-text-primary transition-all duration-300 ${item.btnHover} group-hover:text-white group-hover:border-transparent`}>
                      <T>Explore</T>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          </ScrollReveal>
        </div>
      </section>


      {/* ====== CTA SECTION ====== */}
      <section className="py-20 bg-accent-light">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <ScrollReveal direction="up">
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
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
