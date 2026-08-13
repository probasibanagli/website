import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    console.warn('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not defined. Returning mock data for testing.');
    return NextResponse.json({
      status: 'OK',
      results: [
        {
          name: 'e-Seva Centre (Mock Result 1)',
          formatted_address: `123 Main Street, ${query}`,
          rating: 4.5,
          google_maps_url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
          location: { latitude: 13.0827, longitude: 80.2707 }
        },
        {
          name: 'Taluk Office e-Seva (Mock Result 2)',
          formatted_address: `456 Government Road, ${query}`,
          rating: 4.2,
          google_maps_url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
          location: { latitude: 13.0927, longitude: 80.2807 }
        }
      ]
    });
  }

  try {
    const googleApiUrl = 'https://places.googleapis.com/v1/places:searchText';
    
    const response = await fetch(googleApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating,places.googleMapsUri,places.location'
      },
      body: JSON.stringify({
        textQuery: query
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Google Maps API Error:', errorData);
      throw new Error(`Google Maps API responded with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Map the new API response format to the structure expected by our frontend
    const mappedResults = (data.places || []).map((place: any) => ({
      name: place.displayName?.text || 'Unknown Place',
      formatted_address: place.formattedAddress || 'No address provided',
      rating: place.rating,
      google_maps_url: place.googleMapsUri || (place.location ? `https://www.google.com/maps/search/?api=1&query=${place.location.latitude},${place.location.longitude}` : undefined),
      location: place.location
    }));
    
    return NextResponse.json({ results: mappedResults, status: 'OK' });
  } catch (error) {
    console.error('Error fetching places from Google Maps:', error);
    return NextResponse.json({ error: 'Failed to fetch places' }, { status: 500 });
  }
}
