'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MapPin, Phone, MessageCircle, ArrowLeft, CheckCircle2, Bed, Users, IndianRupee, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { sampleStayListings } from '@/data/sample-data';
import { formatPrice, getWhatsAppUrl } from '@/lib/utils';

export default function StayDetailPage() {
  const params = useParams();
  const listing = sampleStayListings.find((l) => l.id === params.id);

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">🏠</p>
          <h2 className="text-2xl font-bold mb-2">Listing Not Found</h2>
          <Link href="/explore/stay"><Button variant="primary">Back to Listings</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/explore/stay" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to listings
        </Link>

        {/* Image */}
        <div className="relative h-64 sm:h-80 bg-gradient-to-br from-primary-light to-accent-light rounded-2xl flex items-center justify-center mb-8 overflow-hidden">
          <span className="text-8xl opacity-20">{listing.type === 'pg' ? '🏠' : listing.type === 'hotel' ? '🏨' : '🏘️'}</span>
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge variant={listing.type as 'pg' | 'hotel' | 'rental'}>{listing.type.toUpperCase()}</Badge>
            {listing.verified && <Badge variant="verified"><CheckCircle2 className="w-3 h-3 mr-1" /> Verified</Badge>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold font-display text-text-primary">{listing.name}</h1>
              <div className="flex items-center gap-1.5 mt-2 text-text-muted">
                <MapPin className="w-4 h-4" /> {listing.address || `${listing.area}, ${listing.city}`}
              </div>
            </div>

            <Card>
              <h3 className="text-lg font-bold mb-3">About this place</h3>
              <p className="text-text-muted leading-relaxed">{listing.description}</p>
            </Card>

            <Card>
              <h3 className="text-lg font-bold mb-4">Details</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3"><Bed className="w-5 h-5 text-primary" /><div><p className="text-xs text-text-muted">Room Type</p><p className="text-sm font-semibold capitalize">{listing.room_type}</p></div></div>
                <div className="flex items-center gap-3"><Users className="w-5 h-5 text-primary" /><div><p className="text-xs text-text-muted">For</p><p className="text-sm font-semibold capitalize">{listing.gender}</p></div></div>
                <div className="flex items-center gap-3"><IndianRupee className="w-5 h-5 text-primary" /><div><p className="text-xs text-text-muted">Deposit</p><p className="text-sm font-semibold">{formatPrice(listing.deposit_amount || 0)}</p></div></div>
                <div className="flex items-center gap-3"><Shield className="w-5 h-5 text-primary" /><div><p className="text-xs text-text-muted">Available Rooms</p><p className="text-sm font-semibold">{listing.available_rooms}</p></div></div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-bold mb-3">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {listing.amenities.map((a) => (
                  <Badge key={a} variant="teal">{a}</Badge>
                ))}
                {listing.bengali_food && <Badge variant="bengali">🍛 Bengali Food Available</Badge>}
                {listing.bengali_friendly && <Badge variant="bengali">🤝 Bengali-Friendly</Badge>}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-primary-light to-white border-primary/20">
              <p className="text-3xl font-bold text-primary">{formatPrice(listing.price_per_month || 0)}</p>
              <p className="text-sm text-text-muted">per month</p>
              <div className="mt-4 space-y-2">
                <p className="text-sm"><span className="font-medium">Owner:</span> {listing.owner_name}</p>
              </div>
              <div className="mt-6 space-y-3">
                <a href={`tel:${listing.owner_phone}`}><Button variant="primary" className="w-full"><Phone className="w-4 h-4" /> Call Owner</Button></a>
                {listing.owner_whatsapp && (
                  <a href={getWhatsAppUrl(listing.owner_whatsapp, `Hi, I'm interested in "${listing.name}" from ProbasiBangali.in`)} target="_blank" rel="noopener noreferrer">
                    <Button variant="secondary" className="w-full mt-2"><MessageCircle className="w-4 h-4" /> WhatsApp</Button>
                  </a>
                )}
                {listing.google_maps_url && (
                  <a href={listing.google_maps_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full mt-2"><MapPin className="w-4 h-4" /> Open in Maps</Button>
                  </a>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
