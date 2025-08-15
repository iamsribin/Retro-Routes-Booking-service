import { BookingInterface, Coordinates, PricingInterface } from '../../interfaces/interface';
import { CreateBookingReq } from '../../types/booking/request';

export interface IBookingRepository {
  createBooking(
    data: CreateBookingReq,
    distanceKm: number,
    price: number,
    pin: number
  ): Promise<BookingInterface>;
  findBookingById(rideId: string): Promise<BookingInterface | null>;
  updateBookingStatus(id: string, status: string): Promise<BookingInterface | null>;
  confirmRide(pin: number): Promise<BookingInterface | null>;
  updateDriverCoordinates(rideId: string, coordinates: Coordinates): Promise<BookingInterface | null>;
}