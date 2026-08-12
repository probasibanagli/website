'use client';

import React, { useState } from 'react';
import { Home, Building, Building2, UtensilsCrossed, Stethoscope, Users, ImageOff } from 'lucide-react';

type PlaceType = 'stay' | 'pg' | 'hotel' | 'rental' | 'food' | 'restaurant' | 'sweets' | 'tiffin' | 'hospital' | 'community' | 'college';

interface PlaceImageProps {
  name: string;
  city?: string;
  type?: PlaceType;
  mapsUrl?: string;
  className?: string;
  alt?: string;
}

const TYPE_STYLES: Record<string, { gradient: string; icon: React.ReactNode }> = {
  stay: { gradient: 'from-blue-100 to-sky-50', icon: <Home className="w-8 h-8 text-blue-300" /> },
  pg: { gradient: 'from-blue-100 to-sky-50', icon: <Home className="w-8 h-8 text-blue-300" /> },
  hotel: { gradient: 'from-indigo-100 to-blue-50', icon: <Building className="w-8 h-8 text-indigo-300" /> },
  rental: { gradient: 'from-violet-100 to-purple-50', icon: <Building2 className="w-8 h-8 text-violet-300" /> },
  food: { gradient: 'from-orange-100 to-amber-50', icon: <UtensilsCrossed className="w-8 h-8 text-orange-300" /> },
  restaurant: { gradient: 'from-orange-100 to-amber-50', icon: <UtensilsCrossed className="w-8 h-8 text-orange-300" /> },
  sweets: { gradient: 'from-pink-100 to-rose-50', icon: <UtensilsCrossed className="w-8 h-8 text-pink-300" /> },
  tiffin: { gradient: 'from-amber-100 to-yellow-50', icon: <UtensilsCrossed className="w-8 h-8 text-amber-300" /> },
  hospital: { gradient: 'from-red-100 to-rose-50', icon: <Stethoscope className="w-8 h-8 text-red-300" /> },
  community: { gradient: 'from-indigo-100 to-blue-50', icon: <Users className="w-8 h-8 text-indigo-300" /> },
  college: { gradient: 'from-emerald-100 to-teal-50', icon: <Building className="w-8 h-8 text-emerald-300" /> },
};

/**
 * PlaceImage — shows a real Google Places photo with elegant fallback.
 *
 * Usage: <PlaceImage name="Kolkata Home PG" city="Chennai" type="pg" className="h-48" />
 */
export function PlaceImage({ name, city, type = 'stay', mapsUrl, className = 'h-48', alt }: PlaceImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const style = TYPE_STYLES[type] || TYPE_STYLES.stay;

  let imgSrc = `/api/public/place-photo?name=${encodeURIComponent(name)}${city ? `&city=${encodeURIComponent(city)}` : ''}`;
  if (mapsUrl) {
    imgSrc += `&mapsUrl=${encodeURIComponent(mapsUrl)}`;
  }

  return (
    <div className={`relative w-full overflow-hidden bg-gradient-to-br ${style.gradient} ${className}`}>
      {/* Skeleton / fallback layer (always behind the image) */}
      <div className="absolute inset-0 flex items-center justify-center">
        {status === 'loading' && (
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center animate-pulse">
              {style.icon}
            </div>
          </div>
        )}
        {status === 'error' && (
          <div className="flex flex-col items-center gap-1 opacity-60">
            {style.icon}
          </div>
        )}
      </div>

      {/* Actual image */}
      {status !== 'error' && (
        <img
          src={imgSrc}
          alt={alt || name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            status === 'loaded' ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          loading="lazy"
        />
      )}

      {/* Subtle bottom gradient for text readability */}
      {status === 'loaded' && (
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
      )}
    </div>
  );
}
