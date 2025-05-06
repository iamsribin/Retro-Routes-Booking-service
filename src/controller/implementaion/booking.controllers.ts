import  BookingService  from '../../services/implementation/booking_service';
import { CreateBookingRequest, UpdateBookingRequest, ControllerResponse, CreateBookingResponse,IBookingController } from '../interfaces/IBookingController';

export default class BookingController implements IBookingController {
  private bookingService: BookingService;

  constructor(bookingService: BookingService) {
    this.bookingService = bookingService;
  }

  /**
   * Creates a new booking and finds nearby drivers
   * @param data - Booking details including user ID, locations, and vehicle model
   * @returns Promise resolving to booking details and nearby drivers or error response
   */
  async createBooking(data: CreateBookingRequest): Promise<ControllerResponse> {
    try {
      const { userId, pickupLocation, dropoffLocation, vehicleModel } = data;

      const booking = await this.bookingService.createBooking({
        userId,
        pickupLocation,
        dropoffLocation,
        vehicleModel,
      });

      const drivers = await this.bookingService.findNearbyDrivers(
        pickupLocation.latitude,
        pickupLocation.longitude,
        vehicleModel
      );

      const response: CreateBookingResponse = {
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

      return { message: 'Success', data: response };
    } catch (error) {
      return {
        message: `Error creating booking: ${(error as Error).message}`,
        status: 'Failed',
      };
    }
  }

  /**
   * Updates a booking's status
   * @param data - Object containing booking ID and action
   * @returns Promise resolving to updated booking or error response
   */
  async updateBooking(data: UpdateBookingRequest): Promise<ControllerResponse> {
    try {
      const response = await this.bookingService.updateBooking(data.id, data.action);
      return { message: 'Success', data: response };
    } catch (error) {
      return {
        message: `Error updating booking: ${(error as Error).message}`,
        status: 'Failed',
      };
    }
  }
}