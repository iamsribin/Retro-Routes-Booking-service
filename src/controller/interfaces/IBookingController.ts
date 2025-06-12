import { BookingInterface, Coordinates } from "../../interfaces/interface";

export interface CreateBookingRequest {
  userId: string;
  userName: string;
  userNumber: number;
  userProfile: string | null;
  pickupLocation: { address: string; latitude: number; longitude: number };
  dropoffLocation: { address: string; latitude: number; longitude: number };
  vehicleModel: string;
  duration: string;
  distance: string;
  price: number;
  distanceInfo: {
    distance: number;
    distanceInKm: number;
  };
}

export interface UpdateBookingRequest {
  id: string;
  action: string;
}

export interface ControllerResponse {
  message: string;
  data?: any;
  status?: string;
}

export interface DriverDetails {
  driverId: string;
  distance: number;
  rating: number;
  cancelCount: number;
}

export interface CreateBookingResponse {
    userData: {
    user_id: string;
    userName: string;
    userNumber: string;
    userProfile: string;
  };
  booking: { id: string; ride_id: string; status: string };
  userPickupCoordinators: {
    address: string;
    latitude: number;
    longitude: number;
  };
  userDropCoordinators: {
    address: string;
    latitude: number;
    longitude: number;
  };
  distance: string;
  price: number;
  duration: string;
  pin: number;
  message?: string;
}
export interface requestUpdateAcceptRide {
  ride_id: string;
  bookingId:string;
  action:string;
  driverCoordinates: {
    longitude: string;
    latitude: string;
  };
  driverDetails: {
    mobile: number;
    driverImage: string;
    driverName:string;
    driverId: string;
    cancelledRides: number;
    vehicleModel: string;
    rating: number;
    number: number;
    color: string;
  };
}

export interface IBookingController {
  createBooking(data: CreateBookingRequest): Promise<ControllerResponse>;
  updateBooking(data: UpdateBookingRequest): Promise<ControllerResponse>;
  updateAcceptedRide(
    data: requestUpdateAcceptRide
  ): Promise<ControllerResponse>;
  fetchVehicles(): Promise<ControllerResponse>;
}
