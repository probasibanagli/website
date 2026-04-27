'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Navigation, Bus, Train, Car, Bike, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { TAMIL_WORDS } from '@/lib/constants';

const transportModes = [
  { id: 'bus', label: 'Bus', icon: <Bus className="w-5 h-5" /> },
  { id: 'metro', label: 'Metro', icon: <Train className="w-5 h-5" /> },
  { id: 'auto', label: 'Auto', icon: <Car className="w-5 h-5" /> },
  { id: 'cab', label: 'Cab', icon: <Car className="w-5 h-5" /> },
  { id: 'bike', label: 'Bike Taxi', icon: <Bike className="w-5 h-5" /> },
];

const cabApps = [
  { name: 'Rapido', url: 'https://www.rapido.bike', color: 'bg-yellow-100 text-yellow-700' },
  { name: 'Ola', url: 'https://www.olacabs.com', color: 'bg-green-100 text-green-700' },
  { name: 'Uber', url: 'https://www.uber.com', color: 'bg-gray-900 text-white' },
  { name: 'Google Maps', url: 'https://maps.google.com', color: 'bg-blue-100 text-blue-700' },
];

export default function TravelPage() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [mode, setMode] = useState('bus');

  const getGoogleMapsDirections = () => {
    if (from && to) {
      const travelMode = mode === 'bus' || mode === 'metro' ? 'transit' : 'driving';
      return `https://www.google.com/maps/dir/${encodeURIComponent(from)}/${encodeURIComponent(to)}/@13.0827,80.2707,12z/data=!4m2!4m1!3e${mode === 'bus' || mode === 'metro' ? '3' : '0'}`;
    }
    return '#';
  };

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
            <Link href="/" className="hover:text-primary">Home</Link><span>/</span>
            <span className="text-text-primary font-medium">Travel & Transport</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-text-primary">Travel & Transport</h1>
          <p className="mt-2 text-text-muted">Plan your route with bus, metro, auto, and cab options in Tamil Nadu.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Route Planner */}
          <div className="lg:col-span-2 space-y-6">
            <Card padding="lg">
              <h2 className="text-xl font-bold mb-6">Route Planner</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">From</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                    <input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Enter starting point..." className="w-full pl-10 pr-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">To</label>
                  <div className="relative">
                    <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
                    <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="Enter destination..." className="w-full pl-10 pr-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-text-primary mb-3">Transport Mode</label>
                <div className="flex flex-wrap gap-2">
                  {transportModes.map((m) => (
                    <button key={m.id} onClick={() => setMode(m.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${mode === m.id ? 'bg-primary text-white shadow-md' : 'bg-white border border-border hover:border-primary'}`}>
                      {m.icon} {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <a href={getGoogleMapsDirections()} target="_blank" rel="noopener noreferrer">
                  <Button variant="primary" size="lg" className="w-full" disabled={!from || !to}>
                    <Navigation className="w-5 h-5" /> Get Directions
                  </Button>
                </a>
              </div>
            </Card>

            {/* Chennai Transport Info */}
            <Card>
              <h3 className="text-lg font-bold mb-4">Chennai Transport Guide</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: 'MTC Bus', desc: 'Metropolitan Transport Corp — covers all of Chennai. Fare: ₹5-₹30', color: 'bg-green-50 text-green-700' },
                  { title: 'Chennai Metro', desc: '2 lines covering major areas. Fare: ₹10-₹60', color: 'bg-blue-50 text-blue-700' },
                  { title: 'MRTS', desc: 'Beach to Velachery elevated rail. Fare: ₹5-₹15', color: 'bg-purple-50 text-purple-700' },
                  { title: 'Suburban Train', desc: 'Southern Railway suburban. Cheapest option.', color: 'bg-amber-50 text-amber-700' },
                ].map((t) => (
                  <div key={t.title} className={`p-4 rounded-xl ${t.color}`}>
                    <h4 className="font-bold text-sm">{t.title}</h4>
                    <p className="text-xs mt-1 opacity-80">{t.desc}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Cab Apps */}
            <Card>
              <h3 className="text-lg font-bold mb-4">Book a Ride</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {cabApps.map((app) => (
                  <a key={app.name} href={app.url} target="_blank" rel="noopener noreferrer"
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl ${app.color} hover:scale-105 transition-transform`}>
                    <span className="text-sm font-bold">{app.name}</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                  </a>
                ))}
              </div>
            </Card>
          </div>

          {/* Tamil Words Helper */}
          <div>
            <Card className="sticky top-20">
              <h3 className="text-lg font-bold mb-4">🗣️ Tamil Word Helper</h3>
              <p className="text-sm text-text-muted mb-4">Common Tamil words you&apos;ll need while traveling:</p>
              <div className="space-y-3">
                {TAMIL_WORDS.map((word) => (
                  <div key={word.tamil} className="flex items-start gap-3 p-3 bg-surface rounded-xl">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-primary">{word.tamil}</p>
                      <p className="text-xs text-text-muted">{word.meaning}</p>
                    </div>
                    <span className="text-xs text-text-muted bengali-text">{word.script}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
