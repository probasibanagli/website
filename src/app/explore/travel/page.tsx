'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Navigation,
  Bus,
  Train,
  Car,
  Bike,
  ExternalLink,
  Loader2,
  AlertCircle,
  Search,
  Megaphone,
  Map,
  ArrowRight,
  Clock,
  CreditCard,
  ArrowUpDown,
  CheckCircle2,
  Compass,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import { TAMIL_WORDS } from '@/lib/constants';
import { checkRouteAvailability, RouteResponse, TransportCategory, PrivateMode } from '@/lib/routingService';
import {
  METRO_STATIONS,
  getMetroTimings,
  LOCAL_TRAINS,
  MTC_BUSES,
  OUTSTATION_DESTINATIONS,
  ONE_WAY_TAXI_PROVIDERS
} from '@/data/transport-data';

type AppTab = 'planner' | 'metro' | 'train' | 'bus' | 'private' | 'timetable' | 'outstation';

export default function TravelPage() {
  const [activeTab, setActiveTab] = useState<AppTab>('planner');

  // 1. General Route Planner State
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [category, setCategory] = useState<TransportCategory>('public');
  const [plannerPrivateMode, setPlannerPrivateMode] = useState<PrivateMode>('ola');
  const [isLoading, setIsLoading] = useState(false);
  const [routeResult, setRouteResult] = useState<RouteResponse | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // 2. Metro Module State
  const [metroFrom, setMetroFrom] = useState('');
  const [metroTo, setMetroTo] = useState('');

  // 3. Local Train State
  const [trainFrom, setTrainFrom] = useState('');
  const [trainTo, setTrainTo] = useState('');
  const [trainSearchQuery, setTrainSearchQuery] = useState('');

  // 4. MTC Bus State
  const [busSearch, setBusSearch] = useState('');
  const [busFromFilter, setBusFromFilter] = useState('');
  const [busToFilter, setBusToFilter] = useState('');

  // 5. Private Operator State
  const [privateFrom, setPrivateFrom] = useState('');
  const [privateTo, setPrivateTo] = useState('');
  const [selectedPrivateOperator, setSelectedPrivateOperator] = useState<string>('ola');
  const [privateModeResult, setPrivateModeResult] = useState<RouteResponse | null>(null);
  const [isPrivateLoading, setIsPrivateLoading] = useState(false);

  // 6. Timetable Module State
  const [timetableCategory, setTimetableCategory] = useState<'city' | 'state'>('city');
  // Within City State
  const [cityFrom, setCityFrom] = useState('');
  const [cityTo, setCityTo] = useState('');
  const [cityTransportType, setCityTransportType] = useState<'public' | 'private'>('public');
  // Within State State
  const [stateFrom, setStateFrom] = useState('');
  const [stateTo, setStateTo] = useState('');
  const [stateTransportType, setStateTransportType] = useState<'srtc' | 'redbus' | 'train' | 'redtaxi' | 'oneway'>('srtc');

  useEffect(() => {
    // Detect if user is on a mobile device to correctly format deep links
    const handle = requestAnimationFrame(() => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  // Clear route result when planner inputs change
  useEffect(() => {
    setRouteResult(null);
  }, [from, to, category, plannerPrivateMode]);

  const handleGetRoute = async () => {
    setIsLoading(true);
    setRouteResult(null);
    try {
      const res = await checkRouteAvailability(from, to, category, plannerPrivateMode, isMobile);
      setRouteResult(res);
    } catch (error) {
      setRouteResult({ isValid: false, message: 'An error occurred while fetching the route.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to handle Private Operator route calculation
  const handlePrivateOperatorSearch = async () => {
    if (!privateFrom.trim() || !privateTo.trim()) return;
    setIsPrivateLoading(true);
    setPrivateModeResult(null);
    try {
      let mappedMode: PrivateMode = 'ola';
      if (selectedPrivateOperator === 'uber') mappedMode = 'uber';
      if (selectedPrivateOperator === 'rapido') mappedMode = 'rapido';

      const res = await checkRouteAvailability(privateFrom, privateTo, 'private', mappedMode, isMobile);

      // Customize name for App Auto / Namma Yatri
      if (selectedPrivateOperator === 'appauto' && res.isValid) {
        res.modeUsed = 'App Auto (Ola/Uber Auto)';
      } else if (selectedPrivateOperator === 'nammayatri' && res.isValid) {
        res.modeUsed = 'Namma Yatri';
        res.url = 'https://nammayatri.in/';
      }
      setPrivateModeResult(res);
    } catch (error) {
      setPrivateModeResult({ isValid: false, message: 'Failed to calculate private operator fare.' });
    } finally {
      setIsPrivateLoading(false);
    }
  };

  // Get active Metro timings
  const activeMetroTimings = metroFrom && metroTo ? getMetroTimings(metroFrom, metroTo) : null;

  // Filter Local Trains
  const filteredTrains = LOCAL_TRAINS.filter(train => {
    const matchesFrom = trainFrom ? train.from === trainFrom : true;
    const matchesTo = trainTo ? train.to === trainTo : true;
    const matchesSearch = trainSearchQuery
      ? train.name.toLowerCase().includes(trainSearchQuery.toLowerCase()) || train.number.includes(trainSearchQuery)
      : true;
    return matchesFrom && matchesTo && matchesSearch;
  });

  // Filter MTC Buses
  const filteredBuses = MTC_BUSES.filter(bus => {
    const matchesSearch = busSearch
      ? bus.number.toLowerCase().includes(busSearch.toLowerCase()) ||
      bus.from.toLowerCase().includes(busSearch.toLowerCase()) ||
      bus.to.toLowerCase().includes(busSearch.toLowerCase())
      : true;
    const matchesFromFilter = busFromFilter
      ? bus.stops.some(stop => stop.toLowerCase().includes(busFromFilter.toLowerCase())) || bus.from.toLowerCase().includes(busFromFilter.toLowerCase())
      : true;
    const matchesToFilter = busToFilter
      ? bus.stops.some(stop => stop.toLowerCase().includes(busToFilter.toLowerCase())) || bus.to.toLowerCase().includes(busToFilter.toLowerCase())
      : true;
    return matchesSearch && matchesFromFilter && matchesToFilter;
  });

  // Unique Train Stations lists
  const trainOrigins = Array.from(new Set(LOCAL_TRAINS.map(t => t.from))).sort();
  const trainDestinations = Array.from(new Set(LOCAL_TRAINS.map(t => t.to))).sort();

  return (
    <div className="min-h-screen bg-surface">
      {/* Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-white to-accent/5 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link><span>/</span>
            <span className="text-text-primary font-medium">Travel & Transport</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black font-display text-text-primary tracking-tight">
            Chennai Transport <span className="text-primary">Guide</span>
          </h1>
          <p className="mt-3 text-lg text-text-muted max-w-2xl">
            Check metro timings, local train time charts, MTC bus timetables, private ride booking, and outstation travel flows.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl border border-border shadow-sm">
          {[
            { id: 'planner', label: 'Route Planner', icon: <Compass className="w-4 h-4" /> },
            { id: 'metro', label: 'Chennai Metro', icon: <Train className="w-4 h-4 text-blue-500" /> },
            { id: 'train', label: 'Suburban Trains', icon: <Train className="w-4 h-4 text-amber-500" /> },
            { id: 'bus', label: 'MTC Bus Directory', icon: <Bus className="w-4 h-4 text-green-500" /> },
            { id: 'private', label: 'Private Operators', icon: <Car className="w-4 h-4 text-emerald-500" /> },
            { id: 'timetable', label: 'State & City Timetables', icon: <Clock className="w-4 h-4 text-purple-500" /> },
            { id: 'outstation', label: 'Outstation Travel', icon: <Map className="w-4 h-4 text-indigo-500" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AppTab)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === tab.id
                  ? 'bg-primary text-white shadow-md'
                  : 'text-text-muted hover:bg-surface hover:text-text-primary'
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left/Middle Content Area based on Selected Tab */}
          <div className="lg:col-span-2 space-y-6">

            {/* 1. ROUTE PLANNER TAB */}
            {activeTab === 'planner' && (
              <Card padding="lg" className="border-primary/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2 text-text-primary">
                    <Compass className="w-6 h-6 text-primary" /> Route Planner
                  </h2>
                  <Badge variant="outline" className="text-primary border-primary/25 bg-primary/5">Real-time geocoding</Badge>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">From</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-green-500" />
                      <input
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        placeholder="Enter starting point (e.g. Egmore Railway Station)..."
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-surface/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">To</label>
                    <div className="relative">
                      <Navigation className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-red-500" />
                      <input
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        placeholder="Enter destination (e.g. Chennai Airport)..."
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-surface/50"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-semibold text-text-primary mb-3">Transport Category</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: 'public', label: 'Public Transport', icon: <Bus className="w-5 h-5" />, desc: 'Metro, Suburban Train, MTC Bus' },
                      { id: 'private', label: 'Private Booking', icon: <Car className="w-5 h-5" />, desc: 'Ola, Uber, Rapido Cab/Auto/Bike' }
                    ].map((c) => (
                      <div
                        key={c.id}
                        onClick={() => setCategory(c.id as TransportCategory)}
                        className={`flex flex-col p-4 rounded-xl border-2 transition-all cursor-pointer ${category === c.id
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-border bg-white hover:border-gray-300'
                          }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className={category === c.id ? 'text-primary' : 'text-text-muted'}>
                            {c.icon}
                          </div>
                          <span className={`font-bold ${category === c.id ? 'text-primary' : 'text-text-primary'}`}>
                            {c.label}
                          </span>
                        </div>
                        <span className="text-xs text-text-muted ml-7">{c.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {category === 'private' && (
                  <div className="mt-4 p-4 bg-surface rounded-xl border border-border">
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Select Ride-Hailing Provider</label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'ola', label: 'Ola', color: 'bg-green-100 text-green-700 hover:bg-green-200' },
                        { id: 'uber', label: 'Uber', color: 'bg-gray-900 text-white hover:bg-gray-800' },
                        { id: 'rapido', label: 'Rapido', color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' }
                      ].map((m) => {
                        const isSelected = plannerPrivateMode === m.id;
                        return (
                          <button
                            key={m.id}
                            onClick={() => setPlannerPrivateMode(m.id as PrivateMode)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${isSelected
                                ? `${m.color} ring-2 ring-offset-2 ring-primary/50`
                                : 'bg-white border border-border text-text-muted hover:border-gray-400'
                              }`}
                          >
                            {m.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full shadow-lg"
                    disabled={!from || !to || isLoading}
                    onClick={handleGetRoute}
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation className="w-5 h-5" />}
                    {isLoading ? 'Finding Best Route...' : 'Get Route & Check Availability'}
                  </Button>
                </div>

                {routeResult && !routeResult.isValid && (
                  <div className="mt-4 p-4 bg-red-50 text-red-800 rounded-xl border border-red-200 flex flex-col gap-3 items-start animate-fade-in">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600 animate-pulse" />
                      <p className="font-semibold text-sm">{routeResult.message}</p>
                    </div>
                    {category === 'public' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white hover:bg-red-50 text-red-700 border-red-200 hover:border-red-300"
                        onClick={() => setCategory('private')}
                      >
                        <Car className="w-4 h-4 mr-2" /> Switch to Private Cabs
                      </Button>
                    )}
                  </div>
                )}

                {routeResult && routeResult.isValid && (
                  <div className="mt-6 p-5 bg-emerald-50/60 rounded-2xl border border-emerald-200 animate-fade-in">
                    <h3 className="text-sm font-bold text-emerald-800 mb-4 border-b border-emerald-200/50 pb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Route Calculated Successfully
                    </h3>
                    <div className="grid grid-cols-3 gap-4 mb-5">
                      <div className="flex flex-col bg-white p-3 rounded-xl border border-emerald-100 shadow-sm">
                        <span className="text-xs text-emerald-600 font-semibold mb-0.5">Est. Time</span>
                        <span className="font-black text-lg text-emerald-950">{routeResult.estimatedTime}</span>
                      </div>
                      <div className="flex flex-col bg-white p-3 rounded-xl border border-emerald-100 shadow-sm">
                        <span className="text-xs text-emerald-600 font-semibold mb-0.5">Road Distance</span>
                        <span className="font-black text-lg text-emerald-950">{routeResult.estimatedDistance}</span>
                      </div>
                      <div className="flex flex-col bg-white p-3 rounded-xl border border-emerald-100 shadow-sm">
                        <span className="text-xs text-emerald-600 font-semibold mb-0.5">Recommended Mode</span>
                        <span className="font-black text-sm text-emerald-950 truncate mt-1">{routeResult.modeUsed}</span>
                      </div>
                    </div>
                    <a href={routeResult.url} target="_blank" rel="noopener noreferrer" className="block">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md border-transparent">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        {category === 'public' ? 'Open Directions in Google Maps' : `Confirm Booking on ${routeResult.modeUsed}`}
                      </Button>
                    </a>
                  </div>
                )}
              </Card>
            )}

            {/* 2. CHENNAI METRO TAB */}
            {activeTab === 'metro' && (
              <Card padding="lg" className="border-blue-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2 text-text-primary">
                    <Train className="w-6 h-6 text-blue-500" /> Chennai Metro timing Lookup
                  </h2>
                  <a
                    href="https://chennaimetrorail.org/travel-information/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold transition-all border border-blue-100"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Official Metro Timing Page
                  </a>
                </div>

                <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 mb-6">
                  <p className="text-sm text-blue-800 font-medium">
                    Chennai Metro operates Green and Blue lines connecting Washermanpet to Airport and Central to St. Thomas Mount. Peak frequency is every 5 minutes.
                  </p>
                </div>

                {/* Station Selection Dropdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">From Station</label>
                    <select
                      value={metroFrom}
                      onChange={(e) => setMetroFrom(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
                    >
                      <option value="">Select origin station...</option>
                      {METRO_STATIONS.map((station) => (
                        <option key={station.id} value={station.id}>
                          {station.name} ({station.line} Line)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">To Station</label>
                    <select
                      value={metroTo}
                      onChange={(e) => setMetroTo(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
                    >
                      <option value="">Select destination station...</option>
                      {METRO_STATIONS.map((station) => (
                        <option key={station.id} value={station.id}>
                          {station.name} ({station.line} Line)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Timing & Route Results */}
                {activeMetroTimings ? (
                  <div className="space-y-6 border border-blue-100 p-5 rounded-2xl bg-white shadow-sm">
                    <div className="flex flex-wrap items-center justify-between border-b border-gray-100 pb-3 gap-2">
                      <div>
                        <span className="text-xs text-text-muted font-semibold uppercase tracking-wider block">Metro Route</span>
                        <span className="font-bold text-lg text-text-primary">{activeMetroTimings.from} ➔ {activeMetroTimings.to}</span>
                      </div>
                      <Badge className="bg-blue-600 text-white font-bold px-3 py-1 rounded-full">{activeMetroTimings.line}</Badge>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex flex-col items-center text-center">
                        <Clock className="w-5 h-5 text-blue-500 mb-1" />
                        <span className="text-xs text-text-muted">Travel Time</span>
                        <span className="font-bold text-text-primary text-sm mt-0.5">{activeMetroTimings.duration}</span>
                      </div>
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex flex-col items-center text-center">
                        <CreditCard className="w-5 h-5 text-blue-500 mb-1" />
                        <span className="text-xs text-text-muted">Ticket Fare</span>
                        <span className="font-bold text-text-primary text-sm mt-0.5">₹{activeMetroTimings.fare}</span>
                      </div>
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex flex-col items-center text-center">
                        <Navigation className="w-5 h-5 text-blue-500 mb-1" />
                        <span className="text-xs text-text-muted">Stations</span>
                        <span className="font-bold text-text-primary text-sm mt-0.5">{activeMetroTimings.stopsCount} stops</span>
                      </div>
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex flex-col items-center text-center">
                        <Clock className="w-5 h-5 text-blue-500 mb-1" />
                        <span className="text-xs text-text-muted">Operating Hours</span>
                        <span className="font-bold text-text-primary text-xs mt-0.5">05:00 AM - 11:00 PM</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Transit Interval & Frequency</h4>
                      <p className="text-sm text-text-primary font-medium">{activeMetroTimings.frequency}</p>
                    </div>

                    {/* Visual Route Timeline */}
                    <div>
                      <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Station Stops Track</h4>
                      <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-blue-300">
                        {activeMetroTimings.route.map((stationName, idx) => {
                          const isTransfer = stationName === 'Alandur' || stationName === 'Chennai Central';
                          return (
                            <div key={idx} className="relative flex items-center gap-2">
                              <span className={`absolute -left-5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${idx === 0
                                  ? 'border-green-500'
                                  : idx === activeMetroTimings.route.length - 1
                                    ? 'border-red-500'
                                    : isTransfer
                                      ? 'border-purple-500'
                                      : 'border-blue-400'
                                }`} />
                              <span className={`text-sm ${idx === 0 || idx === activeMetroTimings.route.length - 1 || isTransfer
                                  ? 'font-bold text-text-primary'
                                  : 'text-text-muted'
                                }`}>
                                {stationName}
                                {isTransfer && idx !== 0 && idx !== activeMetroTimings.route.length - 1 && (
                                  <span className="text-xs text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded ml-2 font-semibold">Transfer Point</span>
                                )}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <Train className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="font-bold text-slate-800 text-base">Select Route Stations</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Choose "From" and "To" stations above to view live metro timings, fare estimations, and route timelines.
                    </p>
                  </div>
                )}
              </Card>
            )}

            {/* 3. SUBURBAN TRAIN TAB */}
            {activeTab === 'train' && (
              <Card padding="lg" className="border-amber-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2 text-text-primary">
                    <Train className="w-6 h-6 text-amber-500" /> Suburban Train Time Chart
                  </h2>
                  <a
                    href="https://whereismytrain.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-amber-50 text-amber-800 hover:bg-amber-100 rounded-xl text-xs font-bold transition-all border border-amber-100 shadow-sm"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-amber-700" /> "Where Is My Train" Web Search
                  </a>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1">From Station</label>
                    <select
                      value={trainFrom}
                      onChange={(e) => setTrainFrom(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-border text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 bg-white"
                    >
                      <option value="">All Origins</option>
                      {trainOrigins.map((station) => (
                        <option key={station} value={station}>{station}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1">To Station</label>
                    <select
                      value={trainTo}
                      onChange={(e) => setTrainTo(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-border text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 bg-white"
                    >
                      <option value="">All Destinations</option>
                      {trainDestinations.map((station) => (
                        <option key={station} value={station}>{station}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Search Train</label>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                      <input
                        type="text"
                        placeholder="Train name or number..."
                        value={trainSearchQuery}
                        onChange={(e) => setTrainSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 rounded-lg border border-border text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Train Schedule Table */}
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full border-collapse text-left text-sm bg-white">
                    <thead className="bg-slate-50 border-b border-border">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-text-primary text-xs uppercase tracking-wider">Train No</th>
                        <th className="px-4 py-3 font-semibold text-text-primary text-xs uppercase tracking-wider">Train Name</th>
                        <th className="px-4 py-3 font-semibold text-text-primary text-xs uppercase tracking-wider">Route</th>
                        <th className="px-4 py-3 font-semibold text-text-primary text-xs uppercase tracking-wider">Departure</th>
                        <th className="px-4 py-3 font-semibold text-text-primary text-xs uppercase tracking-wider">Arrival</th>
                        <th className="px-4 py-3 font-semibold text-text-primary text-xs uppercase tracking-wider">Runs</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredTrains.length > 0 ? (
                        filteredTrains.map((train) => (
                          <tr key={train.number} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-4 py-3.5 font-bold text-xs text-amber-700 bg-amber-50/20">{train.number}</td>
                            <td className="px-4 py-3.5 font-semibold text-text-primary">
                              <div className="flex flex-col">
                                <span>{train.name}</span>
                                <span className="text-[10px] text-text-muted font-normal mt-0.5">{train.type}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3.5 text-xs text-text-primary">
                              <div className="flex items-center gap-1">
                                <span>{train.from}</span>
                                <ArrowRight className="w-3.5 h-3.5 text-text-muted" />
                                <span>{train.to}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3.5 font-bold text-xs text-text-primary">{train.departure}</td>
                            <td className="px-4 py-3.5 font-bold text-xs text-text-primary">{train.arrival}</td>
                            <td className="px-4 py-3.5 text-xs">
                              <Badge variant="outline" className="text-emerald-700 border-emerald-100 bg-emerald-50 text-[10px] font-semibold">
                                {train.frequency}
                              </Badge>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-text-muted text-xs">
                            No suburban train schedules matched your search criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* 4. MTC BUS TAB */}
            {activeTab === 'bus' && (
              <Card padding="lg" className="border-green-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2 text-text-primary">
                    <Bus className="w-6 h-6 text-green-500" /> MTC Bus Directory & Timetables
                  </h2>
                  <a
                    href="https://chalo.com/app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-xl text-xs font-bold transition-all border border-green-100 shadow-sm"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Download Chalo App for Live Tracking
                  </a>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="relative col-span-1 sm:col-span-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type="text"
                      placeholder="Search bus number or destination..."
                      value={busSearch}
                      onChange={(e) => setBusSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Passes Through / From</label>
                    <input
                      type="text"
                      placeholder="e.g. Guindy"
                      value={busFromFilter}
                      onChange={(e) => setBusFromFilter(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border text-xs focus:outline-none focus:ring-2 focus:ring-green-500/20 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Heading Toward / To</label>
                    <input
                      type="text"
                      placeholder="e.g. Tambaram"
                      value={busToFilter}
                      onChange={(e) => setBusToFilter(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border text-xs focus:outline-none focus:ring-2 focus:ring-green-500/20 bg-white"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs font-bold py-2 border-dashed border-gray-300"
                      onClick={() => {
                        setBusSearch('');
                        setBusFromFilter('');
                        setBusToFilter('');
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                </div>

                {/* Bus List */}
                <div className="space-y-4">
                  {filteredBuses.length > 0 ? (
                    filteredBuses.map((bus) => (
                      <div key={bus.number} className="border border-border p-5 rounded-2xl bg-white hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-3 border-b border-slate-50 pb-2">
                          <div className="flex items-center gap-2">
                            <div className="bg-green-600 text-white text-base font-black px-3.5 py-1.5 rounded-xl shadow-sm tracking-wide">
                              {bus.number}
                            </div>
                            <span className="font-bold text-text-primary text-sm">
                              {bus.from} ➔ {bus.to}
                            </span>
                          </div>
                          <Badge variant="secondary" className="bg-green-50 text-green-700 text-xs font-semibold px-2 py-0.5 rounded">
                            {bus.frequency}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-xs text-text-muted mb-3.5 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          <div>
                            <span className="font-semibold text-text-primary block">First Bus departure</span>
                            <span>{bus.firstBus}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-text-primary block">Last Bus departure</span>
                            <span>{bus.lastBus}</span>
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1.5">Key Route Stops</span>
                          <div className="flex flex-wrap gap-1.5">
                            {bus.stops.map((stop, i) => (
                              <Badge key={i} variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 text-[10px] font-medium">
                                {stop}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <Bus className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <h3 className="font-bold text-slate-800 text-base">No Buses Found</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Try searching for another route number, or broaden your "Passes Through" / "Heading Toward" filters.
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* 5. PRIVATE OPERATOR MODULE */}
            {activeTab === 'private' && (
              <Card padding="lg" className="border-emerald-200">
                <div className="flex items-center justify-between mb-6 border-b border-slate-50 pb-3">
                  <h2 className="text-2xl font-bold flex items-center gap-2 text-text-primary">
                    <Car className="w-6 h-6 text-emerald-500" /> Private Operator Booker
                  </h2>
                  <Badge variant="outline" className="text-emerald-700 border-emerald-100 bg-emerald-50 font-bold">App Integrations</Badge>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">From Location</label>
                      <input
                        type="text"
                        value={privateFrom}
                        onChange={(e) => setPrivateFrom(e.target.value)}
                        placeholder="Enter starting spot (e.g. Guindy)..."
                        className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">To Location</label>
                      <input
                        type="text"
                        value={privateTo}
                        onChange={(e) => setPrivateTo(e.target.value)}
                        placeholder="Enter destination (e.g. Central)..."
                        className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-3">Travel Mode Option</label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                      {[
                        { id: 'ola', name: 'Ola', desc: 'Auto/Cab booking', url: 'https://book.olacabs.com/' },
                        { id: 'uber', name: 'Uber', desc: 'Fast ride bookings', url: 'https://m.uber.com/' },
                        { id: 'rapido', name: 'Rapido', desc: 'Bike taxi, cabs', url: 'https://www.rapido.bike/' },
                        { id: 'appauto', name: 'App Auto', desc: 'Local Autos', url: 'https://m.uber.com/' },
                        { id: 'nammayatri', name: 'Namma Yatri', desc: 'Direct Auto/Cab', url: 'https://nammayatri.in/' }
                      ].map((op) => (
                        <button
                          key={op.id}
                          onClick={() => setSelectedPrivateOperator(op.id)}
                          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${selectedPrivateOperator === op.id
                              ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20'
                              : 'border-border bg-white hover:border-gray-300'
                            }`}
                        >
                          <span className="font-bold text-sm text-text-primary">{op.name}</span>
                          <span className="text-[9px] text-text-muted mt-0.5">{op.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md font-bold mt-2"
                    disabled={!privateFrom || !privateTo || isPrivateLoading}
                    onClick={handlePrivateOperatorSearch}
                  >
                    {isPrivateLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation className="w-4 h-4 mr-1.5" />}
                    {isPrivateLoading ? 'Calculating route...' : 'Show Operator Availability & Fare'}
                  </Button>
                </div>

                {privateModeResult && privateModeResult.isValid && (
                  <div className="p-5 bg-slate-50 rounded-2xl border border-border animate-fade-in">
                    <h3 className="text-sm font-bold text-text-primary mb-3">Operator Route availability Details</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                        <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block">Estimated Distance</span>
                        <span className="font-extrabold text-base text-text-primary">{privateModeResult.estimatedDistance}</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                        <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block">Estimated Time</span>
                        <span className="font-extrabold text-base text-text-primary">{privateModeResult.estimatedTime}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      <p className="text-xs text-text-muted font-medium">
                        Redirection matches: Clicking the booking button will launch the selected operator platform. Available for cabs and autos on this route.
                      </p>
                      <a href={privateModeResult.url} target="_blank" rel="noopener noreferrer">
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md font-bold border-transparent">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Redirect to Book {selectedPrivateOperator === 'nammayatri' ? 'Namma Yatri' : selectedPrivateOperator === 'appauto' ? 'App Auto' : selectedPrivateOperator.toUpperCase()}
                        </Button>
                      </a>
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* 6. TIMETABLE MODULE (NEW) */}
            {activeTab === 'timetable' && (
              <div className="space-y-6">
                <Card padding="lg" className="border-purple-200">
                  <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-3">
                    <h2 className="text-2xl font-bold flex items-center gap-2 text-text-primary">
                      <Clock className="w-6 h-6 text-purple-500" /> State & City Timetables
                    </h2>
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                      <button
                        onClick={() => setTimetableCategory('city')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${timetableCategory === 'city' ? 'bg-white text-purple-700 shadow-sm' : 'text-text-muted'
                          }`}
                      >
                        Within the City
                      </button>
                      <button
                        onClick={() => setTimetableCategory('state')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${timetableCategory === 'state' ? 'bg-white text-purple-700 shadow-sm' : 'text-text-muted'
                          }`}
                      >
                        Within the State
                      </button>
                    </div>
                  </div>

                  {/* TIMETABLE CATEGORY A: WITHIN THE CITY */}
                  {timetableCategory === 'city' && (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-text-primary mb-1.5">From Station / Area</label>
                          <input
                            type="text"
                            value={cityFrom}
                            onChange={(e) => setCityFrom(e.target.value)}
                            placeholder="Enter city starting point (e.g. Beach)..."
                            className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-text-primary mb-1.5">To Station / Area</label>
                          <input
                            type="text"
                            value={cityTo}
                            onChange={(e) => setCityTo(e.target.value)}
                            placeholder="Enter city destination (e.g. Guindy)..."
                            className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-text-primary mb-3">Transport Type</label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => setCityTransportType('public')}
                            className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border font-bold transition-all cursor-pointer ${cityTransportType === 'public'
                                ? 'border-purple-600 bg-purple-50 text-purple-700 ring-2 ring-purple-500/10'
                                : 'border-border bg-white text-text-muted hover:border-gray-300'
                              }`}
                          >
                            <Bus className="w-4 h-4" /> Public (Metro / Train / Bus)
                          </button>
                          <button
                            onClick={() => setCityTransportType('private')}
                            className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border font-bold transition-all cursor-pointer ${cityTransportType === 'private'
                                ? 'border-purple-600 bg-purple-50 text-purple-700 ring-2 ring-purple-500/10'
                                : 'border-border bg-white text-text-muted hover:border-gray-300'
                              }`}
                          >
                            <Car className="w-4 h-4" /> Private (Ola / Uber / Autos)
                          </button>
                        </div>
                      </div>

                      {/* Display relevant timetable information */}
                      {cityFrom && cityTo && (
                        <div className="mt-4 p-5 bg-purple-50/30 rounded-2xl border border-purple-100/50 space-y-4">
                          <h3 className="text-sm font-bold text-purple-950 flex items-center gap-1">
                            <span>Schedules matching:</span>
                            <span className="text-purple-700 font-extrabold">{cityFrom} ➔ {cityTo}</span>
                          </h3>

                          {cityTransportType === 'public' ? (
                            <div className="space-y-3">
                              {/* Metro Check */}
                              <div className="p-4 bg-white rounded-xl border border-border shadow-sm">
                                <h4 className="font-bold text-xs text-blue-600 uppercase tracking-wider mb-1">Recommended Chennai Metro Route</h4>
                                <p className="text-sm text-text-primary font-medium">Use Metro Timing tab to check specific Blue or Green line connectivity and view exact fares.</p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mt-2.5 text-xs text-blue-600 border-blue-200 hover:bg-blue-50/50"
                                  onClick={() => setActiveTab('metro')}
                                >
                                  Open Metro Lookup
                                </Button>
                              </div>

                              {/* Train Check */}
                              <div className="p-4 bg-white rounded-xl border border-border shadow-sm">
                                <h4 className="font-bold text-xs text-amber-700 uppercase tracking-wider mb-1">Suburban Rail Schedules</h4>
                                <p className="text-sm text-text-primary">Regular locals operate between central terminals on South & West lines.</p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mt-2.5 text-xs text-amber-700 border-amber-200 hover:bg-amber-50/50"
                                  onClick={() => setActiveTab('train')}
                                >
                                  Open Suburban Directory
                                </Button>
                              </div>

                              {/* MTC Bus Check */}
                              <div className="p-4 bg-white rounded-xl border border-border shadow-sm">
                                <h4 className="font-bold text-xs text-green-700 uppercase tracking-wider mb-1">MTC Buses on Route</h4>
                                <p className="text-sm text-text-primary">Buses like 18A, 21G, 102 connect central hubs. Frequency ranges 10-15 mins.</p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mt-2.5 text-xs text-green-700 border-green-200 hover:bg-green-50/50"
                                  onClick={() => setActiveTab('bus')}
                                >
                                  Open MTC Bus Search
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="p-4 bg-white rounded-xl border border-border shadow-sm">
                                <h4 className="font-bold text-xs text-emerald-600 uppercase tracking-wider mb-2">Available Ride-Hailing Booking Apps</h4>
                                <div className="grid grid-cols-2 gap-2 text-xs text-text-primary">
                                  <a href="https://book.olacabs.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-emerald-600">
                                    <ExternalLink className="w-3.5 h-3.5 text-emerald-500" /> Ola Auto & Cab
                                  </a>
                                  <a href="https://m.uber.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-emerald-600">
                                    <ExternalLink className="w-3.5 h-3.5 text-emerald-500" /> Uber Auto & Ride
                                  </a>
                                  <a href="https://www.rapido.bike/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-emerald-600">
                                    <ExternalLink className="w-3.5 h-3.5 text-emerald-500" /> Rapido Bike & Cab
                                  </a>
                                  <a href="https://nammayatri.in/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-emerald-600">
                                    <ExternalLink className="w-3.5 h-3.5 text-emerald-500" /> Namma Yatri Auto
                                  </a>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TIMETABLE CATEGORY B: WITHIN THE STATE */}
                  {timetableCategory === 'state' && (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-text-primary mb-1.5">From City</label>
                          <input
                            type="text"
                            value={stateFrom}
                            onChange={(e) => setStateFrom(e.target.value)}
                            placeholder="Starting city (e.g. Chennai)..."
                            className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-text-primary mb-1.5">To Destination City</label>
                          <input
                            type="text"
                            value={stateTo}
                            onChange={(e) => setStateTo(e.target.value)}
                            placeholder="Destination city (e.g. Pondicherry)..."
                            className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 bg-white"
                          />
                        </div>
                      </div>

                      {/* State Transport Options */}
                      <div>
                        <label className="block text-sm font-semibold text-text-primary mb-3">State Transport Mode Selection</label>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                          {[
                            { id: 'srtc', label: 'SRTC Bus', desc: 'Govt SETC' },
                            { id: 'redbus', label: 'RedBus', desc: 'Private Bus' },
                            { id: 'train', label: 'Train (IR)', desc: 'Railways' },
                            { id: 'redtaxi', label: 'RedTaxi', desc: 'Local App' },
                            { id: 'oneway', label: 'One-Way Cab', desc: 'Intercity drop' }
                          ].map((opt) => (
                            <button
                              key={opt.id}
                              onClick={() => setStateTransportType(opt.id as any)}
                              className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${stateTransportType === opt.id
                                  ? 'border-purple-600 bg-purple-50 text-purple-700 ring-2 ring-purple-500/10'
                                  : 'border-border bg-white hover:border-gray-300'
                                }`}
                            >
                              <span className="font-bold text-xs">{opt.label}</span>
                              <span className="text-[9px] text-text-muted mt-0.5">{opt.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Dynamic Timetable details based on selected route and mode */}
                      {stateFrom && stateTo && (
                        <div className="mt-4 p-5 bg-slate-50 rounded-2xl border border-border space-y-4">
                          <div className="flex items-center justify-between border-b border-gray-200/60 pb-3">
                            <h3 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                              <span>Intercity schedules:</span>
                              <span className="text-purple-700">{stateFrom} ➔ {stateTo}</span>
                            </h3>
                            <Badge className="bg-purple-600 text-white font-bold text-xs uppercase px-2 py-0.5 rounded">
                              {stateTransportType === 'srtc' ? 'SETC Bus' : stateTransportType.toUpperCase()}
                            </Badge>
                          </div>

                          {/* Mode specific timetable renderings */}
                          {stateTransportType === 'srtc' && (
                            <div className="space-y-3 text-sm text-text-primary">
                              <p className="font-semibold">SETC & TNSTC (State Road Transport Corporation) Services:</p>
                              <div className="bg-white p-3 rounded-xl border border-slate-100 text-xs space-y-2">
                                <div>• <strong>Frequent Departures:</strong> Premium AC Sleeper & Ultra Deluxe buses from CMBT/Kilambakkam.</div>
                                <div>• <strong>First Bus:</strong> departures start early 05:00 AM, with overnight schedules hourly.</div>
                                <div>• <strong>Average Cost:</strong> ₹250 to ₹700 depending on bus tier.</div>
                              </div>
                              <a href="https://www.tnesevai.tn.gov.in/" target="_blank" rel="noopener noreferrer" className="block">
                                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm">
                                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Book on State TNSTC Portal
                                </Button>
                              </a>
                            </div>
                          )}

                          {stateTransportType === 'redbus' && (
                            <div className="space-y-3 text-sm text-text-primary">
                              <p className="font-semibold">Private Multi-Operator Booking (RedBus):</p>
                              <p className="text-xs text-text-muted">Explore AC Sleeper, Semi-Sleeper, and Seater schedules from operators like Parveen, SRM, and SRS Travels.</p>
                              <a href={`https://www.redbus.in/bus-tickets/${stateFrom.toLowerCase()}-to-${stateTo.toLowerCase()}`} target="_blank" rel="noopener noreferrer" className="block">
                                <Button className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm">
                                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Search schedules on RedBus
                                </Button>
                              </a>
                            </div>
                          )}

                          {stateTransportType === 'train' && (
                            <div className="space-y-3 text-sm text-text-primary">
                              <p className="font-semibold">Indian Railways Intercity Express Timings:</p>
                              <div className="bg-white p-3.5 rounded-xl border border-slate-100 text-xs space-y-2">
                                <div>• <strong>Daily Express / Shatabdi / Vande Bharat:</strong> Runs from Chennai Central & Egmore.</div>
                                <div>• <strong>Train Numbers:</strong> Shatabdi (12007), Vande Bharat (20607), Kovai Express (12675).</div>
                                <div>• <strong>Advance booking:</strong> Highly recommended via IRCTC.</div>
                              </div>
                              <a href="https://www.irctc.co.in/" target="_blank" rel="noopener noreferrer" className="block">
                                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm">
                                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Search Seats on IRCTC Portal
                                </Button>
                              </a>
                            </div>
                          )}

                          {stateTransportType === 'redtaxi' && (
                            <div className="space-y-3 text-sm text-text-primary">
                              <p className="font-semibold">RedTaxi Outstation Booking:</p>
                              <p className="text-xs text-text-muted">RedTaxi operates heavily inside Tamil Nadu (Coimbatore, Salem, Trichy, Chennai, Madurai) with reliable, upfront outstation pricing.</p>
                              <a href="https://www.redtaxi.co.in/" target="_blank" rel="noopener noreferrer" className="block">
                                <Button className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm">
                                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Visit RedTaxi Website
                                </Button>
                              </a>
                            </div>
                          )}

                          {stateTransportType === 'oneway' && (
                            <div className="space-y-4">
                              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                                <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                  <CheckCircle2 className="w-4 h-4" /> One-Way taxi services availability (Intercity Drop)
                                </h4>
                                <p className="text-xs text-emerald-950 font-medium">
                                  One-way outstation taxi drops are fully available from Chennai to anywhere in Tamil Nadu, Pondicherry, and Bangalore. You are charged strictly for the distance traveled one-way.
                                </p>
                              </div>

                              <div className="space-y-3">
                                <span className="text-xs font-bold text-text-primary uppercase tracking-wider block">Recommended Providers</span>
                                {ONE_WAY_TAXI_PROVIDERS.map((provider) => (
                                  <div key={provider.name} className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                      <span className="font-bold text-sm text-text-primary block">{provider.name}</span>
                                      <p className="text-xs text-text-muted mt-0.5">{provider.desc}</p>
                                      <div className="flex flex-wrap gap-2.5 mt-2">
                                        <Badge variant="outline" className="text-green-700 bg-green-50 border-green-100 text-[10px]">{provider.baseRate}</Badge>
                                        <Badge variant="outline" className="text-blue-700 bg-blue-50 border-blue-100 text-[10px]">{provider.tollPolicy}</Badge>
                                      </div>
                                    </div>
                                    <a href={provider.url} target="_blank" rel="noopener noreferrer" className="sm:self-center">
                                      <Button variant="outline" size="sm" className="text-xs py-1.5 border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                                        Book Drop
                                      </Button>
                                    </a>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* 7. OUTSTATION TRAVEL TAB */}
            {activeTab === 'outstation' && (
              <div className="space-y-6">
                <Card padding="lg" className="border-indigo-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Map className="w-6 h-6 text-indigo-500" />
                    <h2 className="text-2xl font-bold text-text-primary">Outstation Travel Escapes</h2>
                  </div>
                  <p className="text-sm text-text-muted mb-6">
                    Ready to leave the city? Here are 12 popular outstation destinations from Chennai, featuring distance, timings, and custom booking redirections.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {OUTSTATION_DESTINATIONS.map((dest) => (
                      <div
                        key={dest.name}
                        className={`flex flex-col p-5 rounded-2xl ${dest.color} border transition-all hover:shadow-md hover:-translate-y-1`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-black">{dest.name}</h3>
                          <Badge variant="secondary" className="bg-white/70 font-semibold text-xs border-transparent">
                            {dest.distance} • {dest.duration}
                          </Badge>
                        </div>

                        <div className="space-y-2 text-xs opacity-90 mt-1 pb-4 flex-1">
                          <div>
                            <strong className="block text-[10px] uppercase font-bold tracking-wider opacity-60">Train Options</strong>
                            <span>{dest.trainDetails}</span>
                          </div>
                          <div>
                            <strong className="block text-[10px] uppercase font-bold tracking-wider opacity-60">Bus Options</strong>
                            <span>{dest.busDetails}</span>
                          </div>
                          {dest.flightDetails && (
                            <div>
                              <strong className="block text-[10px] uppercase font-bold tracking-wider opacity-60">Flight Options</strong>
                              <span>{dest.flightDetails}</span>
                            </div>
                          )}
                          <div>
                            <strong className="block text-[10px] uppercase font-bold tracking-wider opacity-60">One-Way Taxi Option</strong>
                            <span>{dest.taxiDetails}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 border-t border-black/5 pt-3 mt-auto">
                          <a href={dest.trainLink} target="_blank" rel="noopener noreferrer">
                            <Badge variant="outline" className="bg-white/40 border-black/10 text-black text-[10px] hover:bg-white flex items-center gap-0.5">
                              IRCTC <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                            </Badge>
                          </a>
                          <a href={dest.busLink} target="_blank" rel="noopener noreferrer">
                            <Badge variant="outline" className="bg-white/40 border-black/10 text-black text-[10px] hover:bg-white flex items-center gap-0.5">
                              RedBus <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                            </Badge>
                          </a>
                          <a href={dest.taxiLink} target="_blank" rel="noopener noreferrer">
                            <Badge variant="outline" className="bg-white/40 border-black/10 text-black text-[10px] hover:bg-white flex items-center gap-0.5">
                              DropTaxi <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                            </Badge>
                          </a>
                          {dest.flightLink && (
                            <a href={dest.flightLink} target="_blank" rel="noopener noreferrer">
                              <Badge variant="outline" className="bg-white/40 border-black/10 text-black text-[10px] hover:bg-white flex items-center gap-0.5">
                                Flights <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                              </Badge>
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* General transport card guide underneath */}
            <Card>
              <h3 className="text-lg font-bold mb-4">Chennai Transit Quick Links</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: 'MTC Bus (Chalo)', desc: 'Metropolitan Transport Corp — covers Chennai metro area. Fare: ₹5-₹30', color: 'bg-green-50 text-green-700 border-green-100', url: 'https://chalo.com/app/' },
                  { title: 'Chennai Metro Timing', desc: '2 lines covering central networks. Fare: ₹10-₹60', color: 'bg-blue-50 text-blue-700 border-blue-100', url: 'https://chennaimetrorail.org/travel-information/' },
                  { title: 'MRTS Suburban Rail', desc: 'Beach to Velachery elevated loop. Fare: ₹5-₹15', color: 'bg-purple-50 text-purple-700 border-purple-100', url: 'https://whereismytrain.com/' },
                  { title: 'Suburban Train App', desc: 'Southern Railway suburban. Cheapest transit.', color: 'bg-amber-50 text-amber-700 border-amber-100', url: 'https://whereismytrain.com/' },
                ].map((t) => {
                  const content = (
                    <>
                      <h4 className="font-bold text-sm flex items-center gap-1.5">
                        {t.title} <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                      </h4>
                      <p className="text-xs mt-1 opacity-80">{t.desc}</p>
                    </>
                  );
                  return (
                    <a
                      key={t.title}
                      href={t.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block p-4 rounded-xl border hover:scale-[1.02] transition-transform cursor-pointer ${t.color}`}
                    >
                      {content}
                    </a>
                  );
                })}
              </div>
            </Card>

            {/* Cab Apps Shortcut */}
            <Card>
              <h3 className="text-lg font-bold mb-4">Quick Cab Booking Redirection</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { name: 'Ola Cab', url: 'https://book.olacabs.com', color: 'bg-green-100 text-green-800' },
                  { name: 'Uber Passenger', url: 'https://m.uber.com', color: 'bg-gray-900 text-white' },
                  { name: 'Rapido Bike', url: 'https://www.rapido.bike', color: 'bg-yellow-100 text-yellow-800' },
                  { name: 'Namma Yatri', url: 'https://nammayatri.in', color: 'bg-orange-100 text-orange-800' },
                ].map((app) => (
                  <a key={app.name} href={app.url} target="_blank" rel="noopener noreferrer"
                    className={`flex flex-col items-center justify-center gap-1 p-4 rounded-xl ${app.color} hover:scale-105 transition-transform`}>
                    <span className="text-sm font-bold">{app.name}</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </a>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column: Tamil Words Helper */}
          <div className="space-y-6">
            <Card className="sticky top-20">
              <h3 className="text-lg font-bold mb-4 inline-flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-primary animate-bounce" /> Tamil Word Helper
              </h3>
              <p className="text-sm text-text-muted mb-4">Common Tamil words you&apos;ll need while traveling:</p>
              <div className="space-y-3">
                {TAMIL_WORDS.map((word) => (
                  <div key={word.tamil} className="flex items-start gap-3 p-3 bg-surface rounded-xl hover:bg-primary/5 transition-all">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-primary">{word.tamil}</p>
                      <p className="text-xs text-text-muted">{word.meaning}</p>
                    </div>
                    <span className="text-xs text-text-muted font-bold font-tamil">{word.script}</span>
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
