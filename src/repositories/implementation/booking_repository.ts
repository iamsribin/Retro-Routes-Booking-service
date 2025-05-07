import bookingModel from "../../model/booking.model";
import { BookingInterface } from "../../interfaces/interface";
export default class BookingRepository {

  async createBooking(
    data: {
      userId: string;
      pickupLocation: { address: string; latitude: number; longitude: number };
      dropoffLocation: { address: string; latitude: number; longitude: number };
      vehicleModel: string;
    },
    distanceKm: number,
    price: number,
    pin: number
  ): Promise<BookingInterface> {
    try {

      console.log("data:",data);
      console.log("distanceKm:",distanceKm,);
      console.log("price:",price,);
      console.log("pin:",pin,);
      

      const response = await bookingModel.create({
        user_id: data.userId,
        ride_id: `ride_${Date.now()}`,
        pickupCoordinates: {
          latitude: data.pickupLocation.latitude,
          longitude: data.pickupLocation.longitude,
        },
        dropoffCoordinates: {
          latitude: data.dropoffLocation.latitude,
          longitude: data.dropoffLocation.longitude,
        },
        pickupLocation: data.pickupLocation.address,
        dropoffLocation: data.dropoffLocation.address,
        vehicleModel: data.vehicleModel,
        status: 'Pending',
        distance: distanceKm,
        price,
        pin,
      });
  
      return response;
    } catch (error) {
      console.log(error);
      throw new Error(`Failed to create booking: ${(error as Error).message}`);
    }
  }
  

  async findBookingById(rideId: string): Promise<BookingInterface | null> {
    try {
      return await bookingModel.findOne({ ride_id: rideId });
    } catch (error) {
      throw new Error(`Failed to find booking: ${(error as Error).message}`);
    }
  }

  async updateBookingStatus(
    id:string,
    status: string,
  ): Promise<BookingInterface | null> {
    try {
      return await bookingModel.findByIdAndUpdate(
        id,
        { status},
        { new: true }
      );
    } catch (error) {
      throw new Error(
        `Failed to update booking status: ${(error as Error).message}`
      );
    }
  }

  async confirmRide(pin: number): Promise<BookingInterface | null> {
    try {
      return await bookingModel.findOneAndUpdate(
        { pin, status: "Accepted" },
        { status: "Confirmed" },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Failed to confirm ride: ${(error as Error).message}`);
    }
  }

  async updateDriverCoordinates(
    rideId: string,
    coordinates: { latitude: number; longitude: number }
  ): Promise<BookingInterface | null> {
    try {
      return await bookingModel.findOneAndUpdate(
        { ride_id: rideId },
        { driverCoordinates: coordinates },
        { new: true }
      );
    } catch (error) {
      throw new Error(
        `Failed to update driver coordinates: ${(error as Error).message}`
      );
    }
  }
}
