
export interface BookingListDTO {
  _id: string;
  pickupLocation: string;
  dropoffLocation: string;
  distance: string | null;
  price: number | null;
  date: Date;
  status: string;
}

// src/dto/booking/booking-response.dto.ts
export interface BookingDetailsDto {
  id: string;

  user: {
    userId: string;
    userName: string;
    userNumber?: string;
  };

  driver?: {
    driverId: string;
    driverName: string;
    driverNumber: string;
  };

  pickupLocation: string;
  dropoffLocation: string;
  pickupCoordinates: {
    latitude: number;
    longitude: number;
  };
  dropoffCoordinates: {
    latitude: number;
    longitude: number;
  };

  status: string;
  price?: number;
  date: string;
  paymentMode?: string;
  pin?: number;
  feedback?: string;
  rating?: number;

  distance?: string;
  duration?: string;
  vehicleModel?: string;
}


export interface CreateBookingResponseDTO {
    userData: {
    userId: string;
    userName: string;
    userNumber: string;
    userProfile: string;
  };
  booking: { id: string; rideId: string; status: string };
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