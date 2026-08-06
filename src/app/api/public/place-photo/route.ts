import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

/**
 * GET /api/public/place-photo?name=...&city=...&mapsUrl=...
 *
 * Fetches a photo for a place from Google Places API.
 * Uses Firestore for persistent caching of the photo URL (which redirects to Google's CDN).
 */

const CACHE_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days

function getCacheKey(name: string, city: string): string {
  // Create a clean, alphanumeric document ID for Firestore
  const key = `${name.toLowerCase().trim()}_${city.toLowerCase().trim()}`;
  return key.replace(/[^a-z0-9_]/g, '_').substring(0, 100); // Limit length and sanitize
}

// Optional: Extract place ID or better search query from Maps URL if provided
function extractQueryFromMapsUrl(url: string | null): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const q = parsed.searchParams.get('q');
    if (q) return q;
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

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey || apiKey === 'mock-api-key') {
    return new NextResponse(null, { status: 204 });
  }

  const cacheKey = getCacheKey(name, city || '');
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

    // 2. Not cached or expired — fetch from Google Places API
    const mapsQuery = extractQueryFromMapsUrl(mapsUrl);
    const query = mapsQuery || (city ? `${name}, ${city}` : name);
    
    const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=photos,name,place_id&key=${apiKey}`;

    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (
      searchData.status !== 'OK' ||
      !searchData.candidates?.length ||
      !searchData.candidates[0].photos?.length
    ) {
      // No photo found — cache the miss in Firestore
      await cacheRef.set({
        name,
        city: city || '',
        photoUrl: null,
        fetchedAt: Date.now(),
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      return new NextResponse(null, { status: 204 });
    }

    const photoReference = searchData.candidates[0].photos[0].photo_reference;

    // Build the photo URL (Google will redirect to the actual image)
    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photo_reference=${photoReference}&key=${apiKey}`;

    // 3. Cache the success in Firestore
    await cacheRef.set({
      name,
      city: city || '',
      photoUrl,
      placeId: searchData.candidates[0].place_id,
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
