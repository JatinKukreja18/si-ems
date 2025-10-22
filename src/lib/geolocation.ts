export interface Coordinates {
  latitude: number;
  longitude: number;
}

const OFFICE_LOCATION: Coordinates = {
  latitude: 28.448002743026226,
  longitude: 77.09921455975022,
};

const ALLOWED_RADIUS_METERS = 150;

// Haversine formula to calculate distance
function getDistanceInMeters(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (coord1.latitude * Math.PI) / 180;
  const φ2 = (coord2.latitude * Math.PI) / 180;
  const Δφ = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export async function checkLocationPermission(): Promise<{
  allowed: boolean;
  distance?: number;
  error?: string;
}> {
  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
      });
    });
    console.log(position);

    const userLocation: Coordinates = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };

    const distance = getDistanceInMeters(OFFICE_LOCATION, userLocation);

    return {
      allowed: distance <= ALLOWED_RADIUS_METERS,
      distance: Math.round(distance),
    };
  } catch (error: any) {
    return {
      allowed: false,
      error: error.message || "Location access denied",
    };
  }
}
