'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MapPin, Phone, MessageCircle, ArrowLeft, CheckCircle2, ExternalLink, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/card';
import { getWhatsAppUrl, getZomatoSearchUrl, getSwiggySearchUrl, getMagicpinSearchUrl, getEatsureSearchUrl, getUberEatsSearchUrl } from '@/lib/utils';
import { useFirestore } from '@/lib/hooks/useFirestore';
import { FoodListing } from '@/types';
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
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
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
      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      loading="lazy"
    />
  );
}

const FOOD_TYPE_LABELS: Record<string, string> = {
  restaurant: 'Restaurant',
  sweets: 'Sweets',
  tiffin: 'Tiffin',
  delivery: 'Delivery Partner',
};

export default function FoodDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { data: firestoreListings, loading } = useFirestore<FoodListing>('food_listings');
  const food = firestoreListings.find((f) => f.id === id);

  const FOOD_TYPE_LABELS: Record<string, string> = {
    restaurant: 'Restaurants',
    sweets: 'Sweets',
    tiffin: 'Tiffin',
    'delivery partner': 'Delivery Partner',
  };

  const DELIVERY_PARTNERS = [
    { key: 'zomato_url', label: 'Zomato', emoji: '🍕' },
    { key: 'swiggy_url', label: 'Swiggy', emoji: '🛵' },
    { key: 'magicpin_url', label: 'Magicpin', emoji: '⭐' },
    { key: 'dunzo_url', label: 'Dunzo', emoji: '🚲' },
    { key: 'eatsure_url', label: 'EatSure', emoji: '🍽️' },
    { key: 'uber_eats_url', label: 'Uber Eats', emoji: '🚕' },
  ] as const;

  const typeLabel = food?.type ? FOOD_TYPE_LABELS[food.type] ?? food.type : 'Food';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!food) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">🍛</p>
          <h2 className="text-2xl font-bold mb-2">Restaurant Not Found</h2>
          <Link href="/explore/food"><Button variant="primary">Back to Food</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/explore/food" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to food listings
        </Link>

        <div className="relative h-64 sm:h-80 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl flex items-center justify-center mb-8 overflow-hidden">
          <ListingCoverImage
            name={food.name}
            city={food.city}
            mapsUrl={food.google_maps_url}
            imageUrl={food.image_url}
            type={food.type}
            mapEmbedCode={food.map_embed_code}
            fallbackIcon={<span className="text-8xl opacity-20 select-none">🍽️</span>}
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge variant="amber">{typeLabel}</Badge>
            {food.verified && <Badge variant="verified"><CheckCircle2 className="w-3 h-3 mr-1" />Verified</Badge>}
            {food.bengali_friendly && <Badge variant="bengali">Bengali Friendly 🤝</Badge>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-3xl font-bold font-display">{food.name}</h1>
                {food.rating && (
                  <div className="flex items-center gap-1.5 bg-white border border-[#E4E9F2] px-3 py-1.5 rounded-full shadow-sm whitespace-nowrap">
                    <Star className="w-4 h-4 fill-[#B06000] text-[#B06000]" />
                    <span className="font-bold text-gray-900">{food.rating}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-text-muted"><MapPin className="w-4 h-4" />{food.address || `${food.area}, ${food.city}`}</div>
            </div>

            {food.specialties && food.specialties.length > 0 && (
            <Card>
              <h3 className="text-lg font-bold mb-3">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(food.specialties) ? food.specialties : String(food.specialties).split(',').map(s => s.trim())).filter(Boolean).map((s: string) => <Badge key={s} variant="bengali">{s}</Badge>)}
              </div>
            </Card>
            )}

            {food.google_maps_url && (
              <Card>
                <h3 className="text-lg font-bold mb-3">Location</h3>
                
                <div className="rounded-xl overflow-hidden border border-border h-64 bg-surface relative">
                  <MapEmbed 
                    name={food.name}
                    address={food.address}
                    area={food.area}
                    city={food.city}
                    googleMapsUrl={food.google_maps_url}
                    mapEmbedCode={food.map_embed_code}
                  />
                </div>

                <div className="mt-4">
                  <a href={food.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${food.name}, ${food.address ? `${food.address}, ` : ''}${food.area}, ${food.city}`)}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full"><MapPin className="w-4 h-4" /> Open in Google Maps</Button>
                  </a>
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-100">
              <h3 className="text-lg font-bold mb-4">Contact & Order</h3>
              <div className="space-y-3">
                {food.phone && <a href={`tel:${food.phone}`} className="block"><Button variant="primary" className="w-full h-12 text-base shadow-sm"><Phone className="w-4 h-4" /> Call to Order</Button></a>}
                {food.whatsapp && <a href={getWhatsAppUrl(food.whatsapp)} target="_blank" rel="noopener noreferrer" className="block"><Button variant="secondary" className="w-full h-12 text-base shadow-sm"><MessageCircle className="w-4 h-4" /> WhatsApp Chat</Button></a>}
                
                {DELIVERY_PARTNERS.some(p => (food as unknown as Record<string, unknown>)[p.key]) && (
                  <div className="pt-4 mt-4 border-t border-orange-100">
                    <p className="text-xs font-semibold text-orange-800 uppercase tracking-wider mb-3">Delivery Partner</p>
                    <div className="space-y-2">
                      {DELIVERY_PARTNERS.map((partner) => {
                        const url = (food as unknown as Record<string, unknown>)[partner.key] as string | undefined;
                        return url ? (
                          <a key={partner.key} href={url} target="_blank" rel="noopener noreferrer" className="block">
                            <Button variant="outline" className="w-full border-orange-100 hover:bg-orange-50 text-orange-700 hover:text-orange-800 transition-all font-semibold">
                              {partner.emoji} Order on {partner.label} <ExternalLink className="w-3 h-3 ml-auto" />
                            </Button>
                          </a>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

