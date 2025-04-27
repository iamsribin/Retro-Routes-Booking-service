import BookingService from '../services/booking_service';
import {Socket } from 'socket.io-client';

export default class BookingController {
  private BookingService: BookingService;
  private socket: Socket;

  constructor(BookingService: BookingService, socket: Socket) {
    this.BookingService = BookingService;
    this.socket = socket;
  }

  async createBooking(data: any) {
    try {
      const { userId, pickupLocation, dropoffLocation, vehicleModel } = data;

      const booking = await this.BookingService.createBooking({
        userId,
        pickupLocation,
        dropoffLocation,
        vehicleModel,
      });

      const drivers = await this.BookingService.findNearbyDrivers(
        pickupLocation.latitude,
        pickupLocation.longitude,
        vehicleModel
      );

      if (!drivers.length) {
        await this.BookingService.updateBooking(booking.id,'Cancelled' );

        this.socket.emit('rideStatus', {
          bookingId: booking.bookingId,
          status: 'Failed',
          message: 'No drivers available',
        }, `user:${userId}`);
        return { ...booking, message: 'No drivers available', status: 'Failed' };
      } 

      for (const driver of drivers) {
        const accepted = await this.sendRideRequest(driver.driverId, {
          bookingId: booking.bookingId,
          userId,
          pickup: pickupLocation.address,
          dropoff: dropoffLocation.address,
          customer: { name: 'Customer', location: [pickupLocation.longitude, pickupLocation.latitude] },
          vehicleModel,
        });

        if (accepted) {
          const updatedBooking = await this.BookingService.updateBooking(booking.id,'Accepted');

          this.socket.emit('rideStatus', {
            bookingId: booking.bookingId,
            status: 'Accepted',
            driverId: driver.driverId,
          }, `user:${userId}`);

          return updatedBooking;
        }
      }

     //'Pending', 'Accepted', 'Confirmed', 'Completed', 'Cancelled'
      await this.BookingService.updateBooking(booking.id,'Cancelled');

      this.socket.emit('rideStatus', {
        bookingId: booking.bookingId,
        status: 'Failed',
        message: 'No driver accepted',
      }, `user:${userId}`);

      return { ...booking, message: 'No driver accepted the ride', status: 'Failed' };

    } catch (error) {
      return { message: `Error creating booking: ${(error as Error).message}`, status: 'Failed' };
    }
  }

  private async sendRideRequest(driverId: string, rideData: any): Promise<boolean> {
    return false;
  }
}