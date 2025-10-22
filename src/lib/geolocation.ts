export interface Coordinates {
  latitude: number;
  longitude: number;
}

const SPM = {
  latitude: 28.448002743026226,
  longitude: 77.09921455975022,
};
const JC = {
  latitude: 28.405074663351474,
  longitude: 77.06046136788333,
};

const OFFICE_LOCATIONS: Coordinates[] = [SPM, JC];

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
  location?: string;
  error?: string;
}> {
  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
      });
    });

    const userLocation: Coordinates = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };

    const spmDistance = getDistanceInMeters(OFFICE_LOCATIONS[0], userLocation);
    const jcDistance = getDistanceInMeters(OFFICE_LOCATIONS[1], userLocation);

    const isSPM = spmDistance <= ALLOWED_RADIUS_METERS;
    const isJC = jcDistance <= ALLOWED_RADIUS_METERS;
    console.log(isJC);

    return {
      allowed: isSPM || isJC,
      location: isSPM ? "SPM" : isJC ? "JC" : undefined,
    };
  } catch (error: any) {
    return {
      allowed: false,
      error: error.message || "Location access denied",
    };
  }
}
