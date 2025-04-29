import BookingService from "../services/booking_service";

export default class BookingController {
  private bookingService: BookingService;

  constructor(bookingService: BookingService,) {
    this.bookingService = bookingService;
  }

  async createBooking(data: any) {
    try {
      const { userId, pickupLocation, dropoffLocation, vehicleModel } = data;

      // Create booking
      const booking = await this.bookingService.createBooking({
        userId,
        pickupLocation,
        dropoffLocation,
        vehicleModel,
      });

      // Find nearby drivers
      const drivers = await this.bookingService.findNearbyDrivers(
        pickupLocation.latitude,
        pickupLocation.longitude,
        vehicleModel
      );
      
return {
  nearbyDrivers: drivers,
  booking: {
    id: booking._id.toString(),
    ride_id: booking.ride_id,
    status: booking.status,
  },
  userPickupCoordinators: pickupLocation,
  userDropCoordinators: dropoffLocation,
  distance: booking.distance,
  price: booking.price,
};

    } catch (error) {
      console.error("Error creating booking:", error);
      return {
        message: `Error creating booking: ${(error as Error).message}`,
        status: "Failed",
      };
    }
  }

  async updateBooking(data: any){
    try {
    const response = await  this.bookingService.updateBooking(data.id, data.action);
    console.log("updateBooking res:",response);
    return response;
    
    } catch (error) {
      console.log(error);
      return {
        message: `Error updating booking: ${(error as Error).message}`,
        status: "Failed",
      };
    }
  }
}
