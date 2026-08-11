'use client';

import React, { useState, useEffect } from 'react';

interface MapEmbedProps {
  name: string;
  address?: string;
  area: string;
  city: string;
  googleMapsUrl?: string;
  mapEmbedCode?: string;
  className?: string;
}

export function MapEmbed({ name, address, area, city, googleMapsUrl, mapEmbedCode, className }: MapEmbedProps) {
  const [embedSrc, setEmbedSrc] = useState<string | null>(null);
  const [mapQuery, setMapQuery] = useState<string>(
    encodeURIComponent(`${name}, ${address ? `${address}, ` : ''}${area}, ${city}`)
  );

  useEffect(() => {
    async function resolveUrl() {
      // 1. If we have exact embed code, use it!
      if (mapEmbedCode) {
        const srcMatch = mapEmbedCode.match(/src="([^"]+)"/);
        if (srcMatch && srcMatch[1]) {
          setEmbedSrc(srcMatch[1]);
          return;
        }
      }

      if (!googleMapsUrl) return;
      
      // If it's already a full URL with coordinates, just parse it
      const match = googleMapsUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (match) {
        setMapQuery(`${match[1]},${match[2]}`);
        return;
      }

      // If it's a shortlink, resolve it via our API
      if (googleMapsUrl.includes('goo.gl')) {
        try {
          const res = await fetch(`/api/resolve-maps?url=${encodeURIComponent(googleMapsUrl)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.resolvedUrl) {
              const resolvedMatch = data.resolvedUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
              if (resolvedMatch) {
                setMapQuery(`${resolvedMatch[1]},${resolvedMatch[2]}`);
              }
            }
          }
        } catch (error) {
          console.error("Failed to resolve map shortlink", error);
        }
      }
    }
    resolveUrl();
  }, [googleMapsUrl, name, address, area, city]);

  return (
    <iframe 
      width="100%" 
      height="100%" 
      frameBorder="0" 
      scrolling="no" 
      marginHeight={0} 
      marginWidth={0} 
      src={embedSrc || `https://maps.google.com/maps?q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
      title="Location Map"
      className={className || "w-full h-full grayscale-[20%] contrast-125 opacity-90 hover:opacity-100 transition-opacity"}
    />
  );
}
