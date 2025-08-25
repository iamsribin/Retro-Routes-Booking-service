import {
  DRIVER_DETAILS_PREFIX,
  GEO_KEY,
  getDriverDetails,
  redis,
} from "../config/redis.config";

export interface DriverDetails {
  driverId: string;
  distance: number;
  rating: number;
  cancelCount: number;
  score: number;
  vehicleModel?: string;
  vehicleNumber?: string;
  driverName?: string;
  driverPhoto?: string;
  phoneNumber?: string;
}

export async function findNearbyDrivers(
  latitude: number,
  longitude: number,
  vehicleModel: string
): Promise<DriverDetails[]> {
  try {
    console.log("reached here...");

    // 1️⃣ Get drivers within 5km radius using GEOSEARCH
    const drivers = (await redis.georadius(
      GEO_KEY,
      longitude,
      latitude,
      5000,
      "m",
      "WITHDIST"
    )) as Array<[string, string]>;

    if (!drivers.length) return [];

    // 2️⃣ Prepare all keys for bulk MGET
    const keys = drivers.map(
      ([driverId]) => `${DRIVER_DETAILS_PREFIX}${driverId}`
    );
    console.log(keys[0]);
    const data = await getDriverDetails(keys[0]);
    console.log("ddaara", data);

    const driverDataList = await redis.mget(keys);
    console.log("driverDataList", driverDataList);

    const driverDetails: DriverDetails[] = [];

    // 3️⃣ Loop through and calculate scores
    drivers.forEach(([driverId, distanceStr], index) => {
      const driverData = driverDataList[index];
      if (!driverData) return;

      const parsedDriver = JSON.parse(driverData);
      // ✅ Ensure vehicle matches
      if (parsedDriver.vehicleModel !== vehicleModel) return;

      const distance = parseFloat(distanceStr); // meters
      const rating = parsedDriver.rating || 0; // 0–5
      const cancelCount = parsedDriver.cancelledRides || 0;
      const driverName = parsedDriver.name;
      const vehicleNumber = parsedDriver.vehicleNumber;
      const driverPhoto = parsedDriver.driverPhoto;
      const phoneNumber = parsedDriver.driverNumber;
      
      // 4️⃣ Normalize values
      const normalizedRating = Math.min(rating / 5, 1); // 0–1
      const normalizedDistance = Math.min(distance / 5000, 1); // 0–1 (cap at 5km)
      const normalizedCancel = Math.min(cancelCount / 10, 1); // 0–1 (cap at 10 cancels)

      // 5️⃣ Weighted scoring (sum = 1.0)
      const score =
        normalizedRating * 0.6 + // 60% weight → rating
        (1 - normalizedCancel) * 0.25 + // 25% weight → cancellations
        (1 - normalizedDistance) * 0.15; // 15% weight → distance

      driverDetails.push({
        driverId,
        distance,
        phoneNumber,
        driverName,
        driverPhoto,
        vehicleModel,
        vehicleNumber,
        rating,
        cancelCount,
        score,
      });
    });

    // 6️⃣ Sort by score (highest first)
    return driverDetails.sort((a, b) => b.score - a.score);
  } catch (error) {
    console.log("error", error);

    throw new Error(
      `Failed to find nearby drivers: ${(error as Error).message}`
    );
  }
}
