export type TransportCategory = 'public' | 'private';
export type PrivateMode = 'ola' | 'uber' | 'rapido';

export interface RouteResponse {
  isValid: boolean;
  message?: string;
  url?: string;
  estimatedTime?: string;
  estimatedDistance?: string;
  modeUsed?: string;
}

// Haversine formula to calculate straight-line distance between two points
const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

export const checkRouteAvailability = async (
  from: string,
  to: string,
  category: TransportCategory,
  privateMode?: PrivateMode,
  isMobile: boolean = false
): Promise<RouteResponse> => {
  if (!from.trim() || !to.trim()) {
    return { isValid: false, message: 'Please enter both starting point and destination.' };
  }

  try {
    // 1. Geocode "from" location using OpenStreetMap's Nominatim (Free API)
    const fromRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(from)}&limit=1`, {
      headers: { 'Accept-Language': 'en-US,en;q=0.9' }
    });
    const fromData = await fromRes.json();
    
    // 2. Geocode "to" location
    const toRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(to)}&limit=1`, {
      headers: { 'Accept-Language': 'en-US,en;q=0.9' }
    });
    const toData = await toRes.json();

    if (!fromData || fromData.length === 0) {
      return { isValid: false, message: `Could not find starting point: ${from}` };
    }
    if (!toData || toData.length === 0) {
      return { isValid: false, message: `Could not find destination: ${to}` };
    }

    const fromCoords = { lat: parseFloat(fromData[0].lat), lon: parseFloat(fromData[0].lon) };
    const toCoords = { lat: parseFloat(toData[0].lat), lon: parseFloat(toData[0].lon) };

    // 3. Calculate Distance
    const straightLineDistance = getDistanceFromLatLonInKm(fromCoords.lat, fromCoords.lon, toCoords.lat, toCoords.lon);
    
    // Add a 35% multiplier to account for road detours and real-world routing
    const roadDistance = straightLineDistance * 1.35;

    // Validate distance for public transport
    if (category === 'public') {
      if (roadDistance < 1) {
        return {
          isValid: false,
          message: 'Distance is too short for public transport. Consider walking or using private transport.'
        };
      }
      if (roadDistance > 500) {
        return {
          isValid: false,
          message: 'Public transport routing is not available for very long distances here. Consider train or flight.'
        };
      }
    }

    // 4. Calculate Duration
    // Base speed assumptions (in km/h) depending on mode and traffic
    let averageSpeedKmh = 35; // Default for Private (Cab/Auto)

    if (category === 'public') {
      averageSpeedKmh = 20; // Slower due to stops and waiting
    } else if (privateMode === 'rapido') {
      averageSpeedKmh = 40; // Faster in traffic
    }

    const durationHours = roadDistance / averageSpeedKmh;
    const durationMinutes = Math.round(durationHours * 60);

    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    let timeString = '';
    if (hours > 0) timeString += `${hours} hr `;
    timeString += `${minutes} mins`;

    // 5. Generate URLs and final response
    if (category === 'public') {
      return {
        isValid: true,
        url: `https://www.google.com/maps/dir/${fromCoords.lat},${fromCoords.lon}/${toCoords.lat},${toCoords.lon}/@${fromCoords.lat},${fromCoords.lon},12z/data=!4m2!4m1!3e3`,
        estimatedTime: timeString,
        estimatedDistance: `${roadDistance.toFixed(1)} km`,
        modeUsed: 'Transit (Bus/Metro/Train)'
      };
    } else {
      let bookingUrl = '';
      let modeName = '';
      
      const fromName = encodeURIComponent(from);
      const toName = encodeURIComponent(to);

      if (privateMode === 'uber') {
        // Uber's universal link automatically opens app on mobile, and website on desktop
        // Note: We URL-encode the square brackets to ensure the app parses the coordinates correctly
        bookingUrl = `https://m.uber.com/ul/?action=setPickup&client_id=passenger_app&pickup%5Blatitude%5D=${fromCoords.lat}&pickup%5Blongitude%5D=${fromCoords.lon}&pickup%5Bnickname%5D=${fromName}&dropoff%5Blatitude%5D=${toCoords.lat}&dropoff%5Blongitude%5D=${toCoords.lon}&dropoff%5Bnickname%5D=${toName}`;
        modeName = 'Uber';
      } else if (privateMode === 'ola') {
        if (isMobile) {
          bookingUrl = `olacabs://app/launch?lat=${fromCoords.lat}&lng=${fromCoords.lon}&pickup_name=${fromName}&drop_lat=${toCoords.lat}&drop_lng=${toCoords.lon}&drop_name=${toName}`;
        } else {
          bookingUrl = `https://book.olacabs.com/?lat=${fromCoords.lat}&lng=${fromCoords.lon}&pickup_name=${fromName}&drop_lat=${toCoords.lat}&drop_lng=${toCoords.lon}&drop_name=${toName}`;
        }
        modeName = 'Ola';
      } else if (privateMode === 'rapido') {
        if (isMobile) {
          bookingUrl = `intent://#Intent;scheme=rapido;package=com.rapido.passenger;end`;
        } else {
          bookingUrl = `https://www.rapido.bike/`;
        }
        modeName = 'Rapido';
      } else {
        bookingUrl = `https://www.google.com/maps/dir/${fromCoords.lat},${fromCoords.lon}/${toCoords.lat},${toCoords.lon}/@${fromCoords.lat},${fromCoords.lon},12z/data=!4m2!4m1!3e0`;
        modeName = 'Private Transport';
      }

      return {
        isValid: true,
        url: bookingUrl,
        estimatedTime: timeString,
        estimatedDistance: `${roadDistance.toFixed(1)} km`,
        modeUsed: modeName
      };
    }

  } catch (error) {
    console.error("Routing error:", error);
    return {
      isValid: false,
      message: 'Failed to fetch accurate route information. Please check your network connection.'
    };
  }
};
