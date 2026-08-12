import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    console.error('GOOGLE_MAPS_API_KEY is not defined in environment variables.');
    return NextResponse.json({ error: 'Google Maps API key is not configured' }, { status: 500 });
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
