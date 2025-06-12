import { BookingInterface, Coordinates, PricingInterface } from '../../interfaces/interface';

export interface IBookingRepository {
  createBooking(
    data: {
      userId: string;
      pickupLocation: { address: string; latitude: number; longitude: number };
      dropoffLocation: { address: string; latitude: number; longitude: number };
      vehicleModel: string;
    },
    distanceKm: number,
    price: number,
    pin: number
  ): Promise<BookingInterface>;
  findBookingById(rideId: string): Promise<BookingInterface | null>;
  updateBookingStatus(id: string, status: string): Promise<BookingInterface | null>;
  confirmRide(pin: number): Promise<BookingInterface | null>;
  updateDriverCoordinates(rideId: string, coordinates: Coordinates): Promise<BookingInterface | null>;
  fetchVehicles(): Promise<PricingInterface[] | null>
}