'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MapPin, Phone, MessageCircle, ArrowLeft, CheckCircle2, Bed, Users, IndianRupee, Shield, Home, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/card';
import { formatPrice, getWhatsAppUrl } from '@/lib/utils';
import { useFirestore } from '@/lib/hooks/useFirestore';
import { MapEmbed } from '@/components/ui/MapEmbed';

function ListingCoverImage({ name, city, mapsUrl, imageUrl, type, mapEmbedCode, fallbackIcon }: { 
  name: string; 
  city?: string; 
  mapsUrl?: string; 
  imageUrl?: string;
  type?: string;
  mapEmbedCode?: string;
  fallbackIcon: React.ReactNode;
}) {
  let extractUrl = mapsUrl || '';
  if (!extractUrl && mapEmbedCode) {
    const match = mapEmbedCode.match(/src="([^"]+)"/);
    if (match) extractUrl = match[1];
  }
  
  // Always try to fetch if we have name and city, even if URL is missing
  const imgSrc = imageUrl || (name && city ? `/api/public/place-photo?name=${encodeURIComponent(name)}&city=${encodeURIComponent(city || '')}&mapsUrl=${encodeURIComponent(extractUrl)}&v=4` : null);
  const [error, setError] = useState(false);

  React.useEffect(() => {
    setError(false);
  }, [imgSrc]);

  if (error || !imgSrc) {
    return (
      <div className="absolute inset-0 bg-primary-light flex items-center justify-center">
        <div className="text-primary opacity-40 scale-[3]">
          {fallbackIcon}
        </div>
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={name}
      onError={() => setError(true)}
      className="absolute inset-0 w-full h-full object-cover"
      loading="lazy"
    />
  );
}

export default function StayDetailPage() {
  const params = useParams();
  const { data: firestoreListings, loading } = useFirestore('listings');
  
  const combinedListings = firestoreListings;

  const listing: any = combinedListings.find((l: any) => l.id === params.id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
        <div className="relative h-64 sm:h-80 bg-primary-light rounded-2xl flex items-center justify-center mb-8 overflow-hidden border border-border/40 shadow-inner">
          <ListingCoverImage
            name={listing.name}
            city={listing.city}
            mapsUrl={listing.google_maps_url}
            imageUrl={listing.image_url}
            type={listing.accommodation_type?.toLowerCase() || listing.type}
            mapEmbedCode={listing.map_embed_code}
            fallbackIcon={<Home className="w-24 h-24" />}
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge variant={(listing.accommodation_type?.toLowerCase() || listing.type) as 'pg' | 'hotel' | 'rental'}>{(listing.accommodation_type || listing.type || 'STAY').toUpperCase()}</Badge>
            {listing.verified && <Badge variant="verified"><CheckCircle2 className="w-3 h-3 mr-1" /> Verified</Badge>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-3xl font-bold font-display text-text-primary">{listing.name}</h1>
                {listing.rating && (
                  <div className="flex items-center gap-1.5 bg-white border border-[#E4E9F2] px-3 py-1.5 rounded-full shadow-sm whitespace-nowrap">
                    <Star className="w-4 h-4 fill-[#B06000] text-[#B06000]" />
                    <span className="font-bold text-gray-900">{listing.rating}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-text-muted">
                <MapPin className="w-4 h-4" /> {listing.address || `${listing.area}, ${listing.city}`}
              </div>
            </div>

            <Card>
              <h3 className="text-lg font-bold mb-3">About this place</h3>
              <p className="text-text-muted leading-relaxed">{listing.description}</p>
            </Card>

            {(listing.room_type || listing.gender || listing.deposit_amount || listing.available_rooms) && (
            <Card>
              <h3 className="text-lg font-bold mb-4">Details</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {listing.room_type && <div className="flex items-center gap-3"><Bed className="w-5 h-5 text-primary" /><div><p className="text-xs text-text-muted">Room Type</p><p className="text-sm font-semibold capitalize">{listing.room_type}</p></div></div>}
                {listing.gender && <div className="flex items-center gap-3"><Users className="w-5 h-5 text-primary" /><div><p className="text-xs text-text-muted">For</p><p className="text-sm font-semibold capitalize">{listing.gender}</p></div></div>}
                {listing.deposit_amount !== undefined && <div className="flex items-center gap-3"><IndianRupee className="w-5 h-5 text-primary" /><div><p className="text-xs text-text-muted">Deposit</p><p className="text-sm font-semibold">{formatPrice(listing.deposit_amount)}</p></div></div>}
                {listing.available_rooms !== undefined && <div className="flex items-center gap-3"><Shield className="w-5 h-5 text-primary" /><div><p className="text-xs text-text-muted">Available Rooms</p><p className="text-sm font-semibold">{listing.available_rooms}</p></div></div>}
              </div>
            </Card>
            )}

            {((listing.amenities && listing.amenities.length > 0) || listing.bengali_food || listing.bengali_friendly) && (
            <Card>
              <h3 className="text-lg font-bold mb-3">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {(listing.amenities || []).map((a: string) => (
                  <Badge key={a} variant="teal">{a}</Badge>
                ))}
                {listing.bengali_food && <Badge variant="bengali">🍛 Bengali Food Available</Badge>}
                {listing.bengali_friendly && <Badge variant="bengali">🤝 Bengali-Friendly</Badge>}
              </div>
            </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="bg-primary-light border-primary/20">
              <p className="text-3xl font-bold text-primary">{formatPrice(listing.price_monthly || listing.price_per_month || listing.price_daily || 0)}</p>
              <p className="text-sm text-text-muted">{listing.price_daily ? 'per day' : 'per month'}</p>
              {listing.price_range && <p className="text-xs text-text-muted mt-1">{listing.price_range}</p>}
              <div className="mt-4 space-y-2">
                <p className="text-sm"><span className="font-medium">Contact:</span> {listing.contact_person_name || listing.owner_name}</p>
                {(listing.contact_phone || listing.owner_phone) && (
                  <p className="flex items-center gap-1.5 text-sm font-medium">
                    <Phone className="w-4 h-4 text-primary" /> +91 {listing.contact_phone || listing.owner_phone}
                    {listing.verified && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  </p>
                )}
              </div>
              <div className="mt-6 space-y-3">
                {(listing.contact_phone || listing.owner_phone) && (
                  <a href={`tel:${listing.contact_phone || listing.owner_phone}`}><Button variant="primary" className="w-full"><Phone className="w-4 h-4" /> Call Owner</Button></a>
                )}
                {(listing.contact_whatsapp || listing.owner_whatsapp) && (
                  <a href={getWhatsAppUrl(listing.contact_whatsapp || listing.owner_whatsapp, `Hi, I'm interested in "${listing.name}" from ProbasiBangali.in`)} target="_blank" rel="noopener noreferrer">
                    <Button variant="secondary" className="w-full mt-2"><MessageCircle className="w-4 h-4" /> WhatsApp</Button>
                  </a>
                )}
                <a href={listing.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${listing.name}, ${listing.address ? `${listing.address}, ` : ''}${listing.area}, ${listing.city}`)}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full mt-2"><MapPin className="w-4 h-4" /> Open in Google Maps</Button>
                </a>
              </div>
              
              <div className="mt-6 rounded-xl overflow-hidden border border-border h-48 bg-surface">
                <MapEmbed 
                  name={listing.name}
                  address={listing.address}
                  area={listing.area}
                  city={listing.city}
                  googleMapsUrl={listing.google_maps_url}
                  mapEmbedCode={listing.map_embed_code}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
