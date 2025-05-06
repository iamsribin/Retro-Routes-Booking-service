import  BookingRepository  from '../../repositories/implementation/booking_repository';
import redisClient from '../../config/redis.config';
import { PricingService } from './pricing_service';
import { getDistance } from 'geolib';
import { generatePIN } from '../../utils/generatePIN';
import { CreateBookingRequest, DriverDetails } from '../../controller/interfaces/IBookingController';
import { BookingInterface } from '../../interfaces/interface';
import { IBookingService } from '../interfaces/IBookingService';

export default class BookingService implements IBookingService {
  private PricingService: PricingService;
  private bookingRepo: BookingRepository;

  constructor(pricingService: PricingService, bookingRepo: BookingRepository) {
    this.PricingService = pricingService;
    this.bookingRepo = bookingRepo;
  }

  /**
   * Creates a new booking with calculated price and caches it in Redis
   * @param data - Booking details including user ID, locations, and vehicle model
   * @returns Promise resolving to the created booking
   */
  async createBooking(data: CreateBookingRequest): Promise<BookingInterface> {
    try {
      const distanceMeters = getDistance(
        {
          latitude: data.pickupLocation.latitude,
          longitude: data.pickupLocation.longitude,
        },
        {
          latitude: data.dropoffLocation.latitude,
          longitude: data.dropoffLocation.longitude,
        }
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

      return booking;
    } catch (error) {
      throw new Error(`Failed to create booking: ${(error as Error).message}`);
    }
  }

  /**
   * Finds nearby drivers matching the vehicle model within 5km
   * @param latitude - Pickup location latitude
   * @param longitude - Pickup location longitude
   * @param vehicleModel - Vehicle model to match
   * @returns Promise resolving to sorted list of nearby drivers
   */
  async findNearbyDrivers(latitude: number, longitude: number, vehicleModel: string): Promise<DriverDetails[]> {
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

      const driverDetails: DriverDetails[] = [];

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
        }
      }

      return driverDetails.sort((a, b) => {
        if (a.distance !== b.distance) return a.distance - b.distance;
        if (a.rating !== b.rating) return b.rating - a.rating;
        return a.cancelCount - b.cancelCount;
      });
    } catch (error) {
      throw new Error(`Failed to find nearby drivers: ${(error as Error).message}`);
    }
  }

  /**
   * Updates a booking's status
   * @param id - Booking ID
   * @param action - New status
   * @returns Promise resolving to the updated booking or null
   */
  async updateBooking(id: string, action: string): Promise<BookingInterface | null> {
    try {
      return await this.bookingRepo.updateBookingStatus(id, action);
    } catch (error) {
      throw new Error(`Failed to update booking: ${(error as Error).message}`);
    }
  }
}