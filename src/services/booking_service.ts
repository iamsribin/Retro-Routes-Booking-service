import BookingRepository from '../repositories/booking.repository';
import redisClient from '../config/redis.config';
import { PricingService } from './pricing_service';
import { getDistance } from 'geolib'; 
import { generatePIN } from '../utils/genaratePIN';

export default class BookingService {
  private PricingService: PricingService;
  private bookingRepo: BookingRepository;

  constructor(pricingService:PricingService,bookingRepo:BookingRepository) {
    this.PricingService = pricingService;
    this.bookingRepo = bookingRepo;
  }

  async createBooking(data: {
    userId: string;
    pickupLocation: { address: string; latitude: number; longitude: number };
    dropoffLocation: { address: string; latitude: number; longitude: number };
    vehicleModel: string;
  }): Promise<{ id: string; bookingId: string; status: string; message?: string }> {

    try {
      const distanceMeters = getDistance(
        { latitude: data.pickupLocation.latitude, longitude: data.pickupLocation.longitude },
        { latitude: data.dropoffLocation.latitude, longitude: data.dropoffLocation.longitude }
      );

      const distanceKm = distanceMeters / 1000;
  
      const price = await this.PricingService.getPrice(distanceKm, data.vehicleModel);
      const pin = generatePIN();
  
      const booking = await this.bookingRepo.createBooking(data, distanceKm, price, pin);
  
      await redisClient.setEx(
        `booking:${booking.id}`,
        3600,
        JSON.stringify({
          status: 'Pending',
          userId: data.userId,
          pickupLocation: data.pickupLocation,
          dropoffLocation: data.dropoffLocation,
          vehicleModel: data.vehicleModel,
          price,
        })
      );
  
      return {
        id: booking._id.toString(), 
        bookingId: booking.ride_id,
        status: 'Pending',
        message: 'Booking created',
      };
    } catch (error) {
      throw new Error(`Failed to create booking: ${(error as Error).message}`);
    }
  }

  async findNearbyDrivers(latitude: number, longitude: number, vehicleModel: string): Promise<any[]> {
    try {

      const drivers = (await redisClient.sendCommand([
        'GEORADIUS',
        'driver:locations',
        longitude.toString(),
        latitude.toString(),
        '5000',
        'm',
        'WITHDIST',
      ])) as Array<[string, string]>;
  
      console.log('Raw geoRadius response:', JSON.stringify(drivers, null, 2));
  
      const driverDetails: any[] = [];
  
      for (const [driverId, distance] of drivers) {
        const driverDetailsKey = `onlineDriver:details:${driverId}`;
        const driverData = await redisClient.get(driverDetailsKey);
  
        if (driverData) {
          const parsedDriver = JSON.parse(driverData);
  
          if (parsedDriver.vehicleModel === vehicleModel) {
            driverDetails.push({
              driverId,
              distance: parseFloat(distance),
              rating: parsedDriver.rating,
              cancelCount: parsedDriver.cancelCount,
            });
          }
        } else {
          console.log(`No details found for driver ${driverId}`);
        }
      }
  
      return driverDetails.sort((a, b) => {
        if (a.distance !== b.distance) return a.distance - b.distance;
        if (a.rating !== b.rating) return b.rating - a.rating;
        return a.cancelCount - b.cancelCount;
      });

    } catch (error) {
      console.error('Error in findNearbyDrivers:', error);
      throw new Error(`Failed to find nearby drivers: ${(error as Error).message}`);
    }
  }
  

  async updateBooking(id:string, action: string ) {
    try {
      return await this.bookingRepo.updateBookingStatus(id,action);
    } catch (error) {
      throw new Error(`Failed to update booking: ${(error as Error).message}`);
    }
  }
}