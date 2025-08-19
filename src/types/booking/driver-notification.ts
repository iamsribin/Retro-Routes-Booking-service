import { Coordinates } from "../../interfaces/interface";
import { DriverDetails } from "../../utils/find-near-by-drivers";

export interface DriverNotificationPayload {
  bookingId: string;
  requestId?:string;
  rideId: string;
  user: {
    userId: string;
    userName: string;
    userNumber: string;
    userProfile: string;
  };
  pickupCoordinates: Coordinates;
  dropCoordinates: Coordinates;
  distance: string;
  price: number;
  pin: number;
  drivers: DriverDetails[];
  timeoutSeconds?: number;
  estimatedDuration:string;
  createdAt?: Date
}
