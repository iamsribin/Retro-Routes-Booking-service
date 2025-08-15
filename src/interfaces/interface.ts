import mongoose, { Document, Schema } from 'mongoose';

// Interfaces
export interface Coordinates {
  latitude: number;
  longitude: number;
  address: string;
}

export interface PricingConfig {
  basePrice: number;
  pricePerKm: number;
  minDistanceKm: number;
}

export interface BookingInterface extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  rideId: string;

  user: {
    userId: string;
    userName: string;
    userNumber: string;
    userProfile: string;
  };

  driver: {
    driverId: string;
    driverName: string;
    driverNumber: string;
    driverProfile: string;
  };

  pickupCoordinates: Coordinates;
  dropoffCoordinates: Coordinates;

  pickupLocation: string;
  dropoffLocation: string;

  driverCoordinates: Coordinates;

  distance: string;
  duration: string;
  vehicleModel: string;
  price: number;
  date: Date;
  status: 'Pending' | 'Accepted' | 'Confirmed' | 'Completed' | 'Cancelled';
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


export interface PricingInterface  extends Document{
  vehicleModel: string;
  image: string;
  minDistanceKm: string;
  basePrice: number;
  pricePerKm: number;
  eta: string;
  features: string[];
  updatedBy?: string;
  updatedAt?: Date;
}
