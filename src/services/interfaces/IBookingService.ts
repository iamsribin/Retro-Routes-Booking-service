import { BookingInterface, Coordinates } from '../../interfaces/interface';
import { CreateBookingRequest, DriverDetails } from '../../controller/interfaces/IBookingController';

export interface ServiceResponse {
  message: string;
  data?: any;
}

export interface IBookingService {
  createBooking(data: CreateBookingRequest): Promise<BookingInterface>;
  findNearbyDrivers(latitude: number, longitude: number, vehicleModel: string): Promise<DriverDetails[]>;
  updateBooking(id: string, action: string): Promise<BookingInterface | null>;
}