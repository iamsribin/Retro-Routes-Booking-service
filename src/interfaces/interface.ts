import mongoose, { Document, Schema } from 'mongoose';


// Interfaces
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface PricingConfig {
  basePrice: number;
  pricePerKm: number;
  minDistanceKm: number;
}

export interface BookingInterface extends Document {
  ride_id: string;
  driver_id?: string;
  user_id: string;
  pickupCoordinates: Coordinates;
  dropoffCoordinates: Coordinates;
  pickupLocation: string;
  dropoffLocation: string;
  driverCoordinates?: Coordinates;
  distance: string;
  duration: string;
  vehicleModel: string;
  price: number;
  date: Date;
  status: string;
  pin: number;
  paymentMode: string;
  feedback?: string;
  rating?: number;
}

export interface DriverInterface extends Document {
  driverId: string;
  isAvailable: boolean;
  vehicleModel: string;
  rating: number;
  cancelCount: number;
  location: Coordinates;
}