import bookingModel from "../../model/booking.model";
import { PricingModel } from "../../model/pricing.model";
import { BookingInterface, PricingInterface } from "../../interfaces/interface";
import { CreateBookingRequest, requestUpdateAcceptRide } from "../../controller/interfaces/IBookingController";
import { IBookingRepository } from "../interfaces/IBookingRepo";
import { mongo } from "mongoose";

export default class BookingRepository implements IBookingRepository {

async createBooking(
  data: CreateBookingRequest,
  distanceKm: number,
  price: number,
  pin: number
): Promise<BookingInterface> {
  try {
    console.log("data========", data);
    console.log("other==", { distanceKm, pin, price });

    const response = await bookingModel.create({
      ride_id: `ride_${Date.now()}`,

      user: {
        user_id: data.userId,
        userName: data.userName,
        userNumber: data.userNumber,
        userProfile: data.userProfile 
      },

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
      duration: data.duration,
      distance: data.distanceInfo?.distance || `${distanceKm} km`,
      price,
      pin,
      status: "Pending",
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
    id: string,
    status: string
  ): Promise<BookingInterface | null> {
    try {
      return await bookingModel.findByIdAndUpdate(
        id,
        { status },
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

  async fetchVehicles(): Promise<PricingInterface[] | []> {
    try {
      const data = await PricingModel.find();
      return data;
    } catch (error) {
      throw new Error(`Failed fetch vehicles: ${(error as Error).message}`);
    }
  }

async updateAcceptedRide(
  data: requestUpdateAcceptRide
): Promise<BookingInterface | null> {
  try {
    console.log("data---=", data);

    const updatedBooking = await bookingModel.findByIdAndUpdate(
      data.bookingId,
      {
        $set: {
          driver: {
            driver_id: data.driverDetails.driverId,
            driverName: data.driverDetails.driverName,
            driverNumber: data.driverDetails.mobile,
            driverProfile: data.driverDetails.driverImage,
          },
          driverCoordinates: {
            latitude: parseFloat(data.driverCoordinates.latitude),
            longitude: parseFloat(data.driverCoordinates.longitude),
          },
          status: "Accepted",
        },
      },
      { new: true } 
    );

    console.log("updatedBooking response==", updatedBooking);
    return updatedBooking;
  } catch (error) {
    throw new Error(
      `Failed to update booking status: ${(error as Error).message}`
    );
  }
}


async fetchBookingListWithDriverId(id:mongo.ObjectId) {
  try {
    console.log("driverId===", id);

    const response = await bookingModel.find({ 'driver.driver_id': id.toString() });

    return response;
  } catch (error) {
    console.log("error==", error);

    throw new Error(`Failed to fetch bookings: ${(error as Error).message}`);
  }
}

async fetchBookingListWithBookingId(id:mongo.ObjectId){
    try {
    console.log("bookingId ===", id);

    const response = await bookingModel.findById(id);

    return response;
  } catch (error) {
    console.log("error==", error);

    throw new Error(`Failed to fetch bookings: ${(error as Error).message}`);
  }
}

async cancelRide(user_id: string, ride_id: string) {
  try {    
    const response = await bookingModel.findOneAndUpdate(
      { 
        ride_id: ride_id,
        'user.user_id': user_id,
        status: { $ne: 'Cancelled' } 
      },
      { $set: { status: 'Cancelled' } },
      { new: true } 
    );
    console.log("cancelRide res===",response);

    if (!response) {
      throw new Error('Ride not found or already cancelled');
    }

    return response;
  } catch (error) {
    console.log("cancelRide error==", error);
    throw new Error(`Failed to cancel ride: ${(error as Error).message}`);
  }
}


}
