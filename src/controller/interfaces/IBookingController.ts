import { BookingInterface, Coordinates } from '../../interfaces/interface';

export interface CreateBookingRequest {
  userId: string;
  pickupLocation: { address: string; latitude: number; longitude: number };
  dropoffLocation: { address: string; latitude: number; longitude: number };
  vehicleModel: string;
}

export interface UpdateBookingRequest {
  id: string;
  action: string;
}

export interface ControllerResponse {
  message: string;
  data?: any;
  status?:string,
}

export interface DriverDetails {
  driverId: string;
  distance: number;
  rating: number;
  cancelCount: number;
}

export interface CreateBookingResponse {
  nearbyDrivers: DriverDetails[];
  booking: {
    id: string;
    ride_id: string;
    status: string;
  };
  userPickupCoordinators: Coordinates;
  userDropCoordinators: Coordinates;
  distance: string;
  price: number;
}

export interface IBookingController {
  createBooking(data: CreateBookingRequest): Promise<ControllerResponse>;
  updateBooking(data: UpdateBookingRequest): Promise<ControllerResponse>;
}