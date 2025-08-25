
export interface BookingListDTO {
  _id: string;
  pickupLocation: string;
  dropoffLocation: string;
  distance: string | null;
  price: number | null;
  date: Date;
  status: string;
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