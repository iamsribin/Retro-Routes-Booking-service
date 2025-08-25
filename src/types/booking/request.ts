import { Coordinates } from "../../interfaces/interface";

export interface CreateBookingReq {
  userId: string;
  userName: string;
  mobile: number;
  profile: string | null;
  pickupLocation: { address: string; latitude: number; longitude: number };
  dropOffLocation: { address: string; latitude: number; longitude: number };
  vehicleModel: string;
  estimatedPrice: number;
  estimatedDuration: string;
  distanceInfo: {
    distance: number;
    distanceInKm: number;
  };
}

export interface UpdateBookingReq {
  id: string;
  action: string;
}

export interface UpdateAcceptRideReq {
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

export interface DriverAssignmentPayload {
  bookingId: string;
  rideId: string;
  driver: {
    driverId: string;
    driverName: string;
    driverNumber: string;
    driverProfile: string;
  };
  driverCoordinates: Coordinates
}