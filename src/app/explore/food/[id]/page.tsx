'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MapPin, Phone, MessageCircle, ArrowLeft, CheckCircle2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/card';
import { sampleFoodListings } from '@/data/sample-data';
import { getWhatsAppUrl, getZomatoSearchUrl, getSwiggySearchUrl, getMagicpinSearchUrl, getEatsureSearchUrl, getUberEatsSearchUrl } from '@/lib/utils';

const FOOD_TYPE_LABELS: Record<string, string> = {
  restaurant: 'Restaurant',
  sweets: 'Sweets',
  tiffin: 'Tiffin',
  delivery: 'Delivery Partner',
};

export default function FoodDetailPage() {
  const params = useParams();
  const food = sampleFoodListings.find((f) => f.id === params.id);

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

        <div className="relative h-64 sm:h-80 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl flex items-center justify-center mb-8">
          <span className="text-8xl opacity-20">🍽️</span>
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge variant="amber">{FOOD_TYPE_LABELS[food.type as string] || food.type}</Badge>
            {food.verified && <Badge variant="verified"><CheckCircle2 className="w-3 h-3 mr-1" />Verified</Badge>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold font-display">{food.name}</h1>
              <div className="flex items-center gap-1.5 mt-2 text-text-muted"><MapPin className="w-4 h-4" />{food.address || `${food.area}, ${food.city}`}</div>
            </div>

            <Card>
              <h3 className="text-lg font-bold mb-3">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {food.specialties.map((s) => <Badge key={s} variant="bengali">{s}</Badge>)}
              </div>
            </Card>

            {food.google_maps_url && (
              <Card>
                <h3 className="text-lg font-bold mb-3">Location</h3>
                <div className="h-48 bg-surface rounded-xl flex items-center justify-center border border-border">
                  <a href={food.google_maps_url} target="_blank" rel="noopener noreferrer" className="text-primary font-medium flex items-center gap-2">
                    <MapPin className="w-5 h-5" /> Open in Google Maps
                  </a>
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-orange-50 to-white">
              <h3 className="text-lg font-bold mb-4">Contact & Order</h3>
              <div className="space-y-3">
                {food.phone && <a href={`tel:${food.phone}`}><Button variant="primary" className="w-full"><Phone className="w-4 h-4" /> Call</Button></a>}
                {food.whatsapp && <a href={getWhatsAppUrl(food.whatsapp)} target="_blank" rel="noopener noreferrer"><Button variant="secondary" className="w-full mt-2"><MessageCircle className="w-4 h-4" /> WhatsApp</Button></a>}
                {food.zomato_url && <a href={getZomatoSearchUrl(food.name, food.city)} target="_blank" rel="noopener noreferrer"><Button variant="outline" className="w-full mt-2">🍕 Order on Zomato <ExternalLink className="w-3 h-3" /></Button></a>}
                {food.swiggy_url && <a href={getSwiggySearchUrl(food.name, food.city)} target="_blank" rel="noopener noreferrer"><Button variant="outline" className="w-full mt-2">🛵 Order on Swiggy <ExternalLink className="w-3 h-3" /></Button></a>}
                {food.magicpin_url && <a href={getMagicpinSearchUrl(food.name, food.city)} target="_blank" rel="noopener noreferrer"><Button variant="outline" className="w-full mt-2">✨ Open Magicpin <ExternalLink className="w-3 h-3" /></Button></a>}
                {food.eatsure_url && <a href={getEatsureSearchUrl(food.name)} target="_blank" rel="noopener noreferrer"><Button variant="outline" className="w-full mt-2">🍱 Open EatSure <ExternalLink className="w-3 h-3" /></Button></a>}
                {food.uber_eats_url && <a href={getUberEatsSearchUrl(food.name, food.city)} target="_blank" rel="noopener noreferrer"><Button variant="outline" className="w-full mt-2">🚗 Open Uber Eats <ExternalLink className="w-3 h-3" /></Button></a>}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
