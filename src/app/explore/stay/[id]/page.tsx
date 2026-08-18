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
      <div className="absolute inset-0 bg-gradient-to-br from-primary-light to-accent-light flex items-center justify-center">
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
        {/* Header Info */}
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href="/explore/stay" className="inline-flex items-center justify-center p-2.5 rounded-full hover:bg-surface text-text-muted hover:text-primary transition-colors border border-border/50 bg-white shadow-sm -mt-1">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-text-primary">{listing.name}</h1>
            </div>
            {listing.rating && (
              <div className="flex items-center gap-1.5 bg-white border border-[#E4E9F2] px-3 py-1.5 rounded-full shadow-sm whitespace-nowrap text-sm">
                <Star className="w-4 h-4 fill-[#B06000] text-[#B06000]" />
                <span className="font-bold text-gray-900">{listing.rating}</span>
              </div>
            )}
          </div>
        </div>

        {/* Image & Map row (75% Image / 25% Map) */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8 w-full">
          <div className="relative w-full lg:w-[calc(75%-12px)] lg:flex-none h-48 sm:h-56 lg:h-64 bg-gradient-to-br from-primary-light to-accent-light rounded-2xl flex items-center justify-center overflow-hidden border border-border/40 shadow-inner">
            <ListingCoverImage
              name={listing.name}
              city={listing.city}
              mapsUrl={listing.google_maps_url}
              imageUrl={listing.image_url}
              type={listing.accommodation_type?.toLowerCase() || listing.type}
              mapEmbedCode={listing.map_embed_code}
              fallbackIcon={<Home className="w-20 h-20" />}
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge variant={(listing.accommodation_type?.toLowerCase() || listing.type) as 'pg' | 'hotel' | 'rental'}>{(listing.accommodation_type || listing.type || 'STAY').toUpperCase()}</Badge>
              {listing.verified && <Badge variant="verified"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Verified</Badge>}
            </div>
          </div>
          <div className="w-full lg:w-[calc(25%-4px)] lg:flex-none rounded-2xl overflow-hidden border border-border h-48 sm:h-56 lg:h-64 bg-surface">
            <MapEmbed 
              name={listing.name}
              address={listing.address}
              area={listing.area}
              city={listing.city}
              googleMapsUrl={listing.google_maps_url}
              mapEmbedCode={listing.map_embed_code}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start mb-8">
          {/* Column 1: About */}
          <Card className="p-5 flex flex-col h-full">
            <div>
              <h3 className="text-lg font-bold mb-3">About this place</h3>
              <p className="text-sm text-text-muted leading-relaxed break-words whitespace-pre-wrap">{listing.description}</p>
            </div>
          </Card>

          {/* Column 2: Details & Amenities */}
          <div className="space-y-4">
            {(listing.room_type || listing.gender || listing.deposit_amount || listing.available_rooms) && (
              <Card className="p-4">
                <h3 className="text-sm font-bold mb-3 text-text-primary">Details</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {listing.room_type && <div className="flex items-center gap-2"><Bed className="w-4 h-4 text-primary" /><span className="font-semibold capitalize truncate">{listing.room_type}</span></div>}
                  {listing.gender && <div className="flex items-center gap-2"><Users className="w-4 h-4 text-primary" /><span className="font-semibold capitalize truncate">{listing.gender}</span></div>}
                  {listing.deposit_amount !== undefined && <div className="flex items-center gap-2"><IndianRupee className="w-4 h-4 text-primary" /><span className="font-semibold truncate">Dep: {formatPrice(listing.deposit_amount)}</span></div>}
                  {listing.available_rooms !== undefined && <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /><span className="font-semibold truncate">Rooms: {listing.available_rooms}</span></div>}
                </div>
              </Card>
            )}

            {((listing.amenities && listing.amenities.length > 0) || listing.bengali_food || listing.bengali_friendly) && (
              <Card className="p-4">
                <h3 className="text-sm font-bold mb-3 text-text-primary">Amenities</h3>
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

          {/* Column 3: Pricing & Contact Actions */}
          <Card className="bg-gradient-to-br from-primary-light to-white border-primary/20 p-6 space-y-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="text-3xl font-bold text-primary">{formatPrice(listing.price_monthly || listing.price_per_month || listing.price_daily || 0)}</p>
                  <p className="text-sm text-text-muted">{listing.price_daily ? 'per day' : 'per month'}</p>
                  {listing.price_range && <p className="text-xs text-text-muted mt-1">{listing.price_range}</p>}
                </div>
                <div className="text-right text-sm">
                  <p className="font-semibold text-text-primary">{listing.contact_person_name || listing.owner_name}</p>
                  {(listing.contact_phone || listing.owner_phone) && (
                    <p className="flex items-center justify-end gap-1 mt-1.5 font-medium text-text-muted">
                      <Phone className="w-4 h-4 text-primary" /> {listing.contact_phone || listing.owner_phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-2 mt-6 text-sm text-text-muted bg-surface/60 p-3 rounded-lg border border-border/50 max-h-32 overflow-y-auto">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" /> 
                <span className="leading-snug break-all">{listing.address || `${listing.area}, ${listing.city}`}{listing.pincode ? `, ${listing.pincode}` : ''}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full mt-auto">
              {(listing.contact_phone || listing.owner_phone) && (
                <a href={`tel:${listing.contact_phone || listing.owner_phone}`} className="flex items-center justify-center gap-2 flex-1 min-w-0 h-12 bg-primary text-white hover:bg-primary-dark font-semibold rounded-xl shadow-sm transition-all whitespace-nowrap px-4">
                  <Phone className="w-4 h-4" /> Call Owner
                </a>
              )}
              {(listing.contact_whatsapp || listing.owner_whatsapp) && (
                <a href={getWhatsAppUrl(listing.contact_whatsapp || listing.owner_whatsapp, `Hi, I'm interested in "${listing.name}" from ProbasiBangali.in`)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 flex-1 min-w-0 h-12 bg-accent text-white hover:bg-emerald-700 font-semibold rounded-xl shadow-sm transition-all whitespace-nowrap px-4">
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
