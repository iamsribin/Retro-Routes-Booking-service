import { BookingInterface, Coordinates, PricingInterface } from '../../interfaces/interface';
import { CreateBookingRequest, DriverDetails, requestUpdateAcceptRide } from '../../controller/interfaces/IBookingController';

export interface ServiceResponse {
  message: string;
  data?: any;
}

export interface IBookingService {
  createBooking(data: CreateBookingRequest): Promise<BookingInterface>;
  updateBooking(id: string, action: string): Promise<BookingInterface | null>;
  updateAcceptedRide(data:requestUpdateAcceptRide): Promise<BookingInterface | null>
  fetchVehicles(): Promise<PricingInterface[] | []>
}