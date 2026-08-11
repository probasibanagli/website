import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

/**
 * GET /api/public/place-photo?name=...&city=...&mapsUrl=...
 *
 * Fetches a photo for a place from Google Places API.
 * Uses Firestore for persistent caching of the photo URL (which redirects to Google's CDN).
 */

const CACHE_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days

function getCacheKey(name: string, city: string, mapsUrl?: string | null): string {
  // Create a clean, alphanumeric document ID for Firestore
  // Use name + city + mapsUrl as cache key to ensure uniqueness
  // Added _v2 to invalidate old cached random images from before the fallback was disabled
  const docId = `${name}_${city || ''}_${mapsUrl || ''}_v2`.toLowerCase().replace(/[^a-z0-9]/g, '_');
  return docId.substring(0, 100); // Limit length and sanitize
}

async function extractQueryFromMapsUrl(url: string | null): Promise<string | null> {
  if (!url) return null;
  try {
    let finalUrl = url;
    
    // If it's a shortlink, resolve it first
    if (url.includes('maps.app.goo.gl') || url.includes('goo.gl/maps')) {
      try {
        const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
        finalUrl = res.url;
      } catch (e) {
        // Fallback to original url on fetch error
      }
    }

    const parsed = new URL(finalUrl);
    const q = parsed.searchParams.get('q');
    if (q) return q;

    // Handle /maps/place/Place+Name/...
    const match = parsed.pathname.match(/\/maps\/place\/([^/]+)/);
    if (match && match[1]) {
      const placeName = decodeURIComponent(match[1].replace(/\+/g, ' '));
      return placeName;
    }
    
    // If no clear query could be extracted, return the final URL
    return finalUrl;
  } catch (e) {
    // Ignore invalid URLs
  }
  return null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  const city = searchParams.get('city');
  const mapsUrl = searchParams.get('mapsUrl');

  if (!name) {
    return NextResponse.json({ error: 'Missing name parameter' }, { status: 400 });
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey || apiKey === 'mock-api-key') {
    return new NextResponse(null, { status: 204 });
  }

  const cacheKey = getCacheKey(name, city || '', mapsUrl);
  const cacheRef = adminDb.collection('place_photos').doc(cacheKey);

  try {
    // 1. Check Firestore cache
    const cacheDoc = await cacheRef.get();
    if (cacheDoc.exists) {
      const data = cacheDoc.data();
      if (data && Date.now() - (data.fetchedAt || 0) < CACHE_TTL) {
        if (!data.photoUrl) {
          return new NextResponse(null, { status: 204 });
        }
        return NextResponse.redirect(data.photoUrl, { 
          status: 302, 
          headers: { 'Cache-Control': 'public, max-age=604800, immutable' } 
        });
      }
    }

    // 2. Not cached or expired — fetch from Google Places API (New)
    const mapsQuery = await extractQueryFromMapsUrl(mapsUrl);
    const queryText = (mapsQuery && !mapsQuery.startsWith('http') ? (city ? `${mapsQuery}, ${city}` : mapsQuery) : mapsQuery);
    
    // If we couldn't extract a valid query from a maps URL, don't fallback to a generic name search
    // to prevent showing random/unrelated images.
    if (!queryText) {
      await cacheRef.set({ name, city: city || '', photoUrl: null, fetchedAt: Date.now() });
      return new NextResponse(null, { status: 204 });
    }
    
    const searchUrl = 'https://places.googleapis.com/v1/places:searchText';
    const searchRes = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.photos'
      },
      body: JSON.stringify({
        textQuery: queryText
      })
    });

    if (!searchRes.ok) {
      const errText = await searchRes.text();
      console.warn(`Google Places API v1 returned HTTP ${searchRes.status}:`, errText);
      return new NextResponse(null, { status: 204 });
    }

    const searchData = await searchRes.json();

    if (!searchData.places?.length || !searchData.places[0].photos?.length) {
      // Clean query with no results or no photos - safe to cache
      await cacheRef.set({
        name,
        city: city || '',
        photoUrl: null,
        fetchedAt: Date.now(),
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      return new NextResponse(null, { status: 204 });
    }

    const photoObj = searchData.places[0].photos[0];
    const photoName = photoObj.name; // Format: "places/PLACE_ID/photos/PHOTO_REF"

    // Build the photo URL (Google will redirect to the actual image media stream)
    const photoUrl = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=600&key=${apiKey}`;

    // 3. Cache the success in Firestore
    await cacheRef.set({
      name,
      city: city || '',
      photoUrl,
      placeId: searchData.places[0].id,
      fetchedAt: Date.now(),
      updatedAt: new Date().toISOString()
    }, { merge: true });

    // Return redirect to the photo
    return NextResponse.redirect(photoUrl, {
      status: 302,
      headers: {
        'Cache-Control': 'public, max-age=604800, immutable',
      },
    });
  } catch (error) {
    console.error('Place photo error:', error);
    return new NextResponse(null, { status: 204 });
  }
}
