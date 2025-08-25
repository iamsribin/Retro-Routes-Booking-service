import { BookingRepository } from "../../repositories/implementation/booking-repository";
import { generatePIN } from "../../utils/generatePIN";
import { IBookingService } from "../interfaces/i-booking-service";
import { BookingListDTO, CreateBookingResponseDTO } from "../../dto/booking.dto";
import { IResponse } from "../../types/common/response";
import { StatusCode } from "../../types/common/status-code";
import {
  CreateBookingReq,
  DriverAssignmentPayload,
  UpdateAcceptRideReq,
} from "../../types/booking/request";
import { findNearbyDrivers } from "../../utils/find-near-by-drivers";
import { DriverNotificationPayload } from "../../types/booking/driver-notification";
import { RabbitMQPublisher } from "../../events/publisher";

export class BookingService implements IBookingService {
  constructor(private _bookingRepo: BookingRepository) {}

  async createBooking(
    data: CreateBookingReq
  ): Promise<IResponse<CreateBookingResponseDTO>> {
    try {
      const drivers = await findNearbyDrivers(
        data.pickupLocation.latitude,
        data.pickupLocation.longitude,
        data.vehicleModel
      );

      if (!drivers.length) {
        return {
          status: StatusCode.NotFound,
          message: "No drivers available for this booking request",
        };
      }
      console.log("dataaa", data);

      const pin = generatePIN();
      const booking = await this._bookingRepo.createBooking(
        data,
        data.distanceInfo.distanceInKm,
        data.estimatedPrice,
        pin
      );

      // Generate unique request ID for idempotency
      const requestId = `booking_${booking._id}_${Date.now()}`;

      // Prepare payload for real-time service
      const notificationPayload: DriverNotificationPayload = {
        bookingId: booking._id.toString(),
        rideId: booking.rideId,
        requestId: requestId,
        user: {
          userId: booking.user.userId,
          userName: booking.user.userName,
          userNumber: booking.user.userNumber,
          userProfile: booking.user.userProfile,
        },
        pickupCoordinates: {
          latitude: booking.pickupCoordinates.latitude,
          longitude: booking.pickupCoordinates.longitude,
          address: booking.pickupCoordinates.address,
        },
        dropCoordinates: {
          latitude: booking.dropoffCoordinates.latitude,
          longitude: booking.dropoffCoordinates.longitude,
          address: booking.dropoffCoordinates.address,
        },
        distance: booking.distance,
        price: booking.price,
        estimatedDuration: booking.duration,
        pin: booking.pin,
        drivers: drivers,
        timeoutSeconds: 30,
        createdAt: new Date(),
      };

      console.log("sending request to realtiem", notificationPayload);
      await RabbitMQPublisher.publish("booking.request", notificationPayload);

      return {
        status: StatusCode.Created,
        message: "booking created successfully",
      };
    } catch (error) {
      console.error("Error creating booking", error);
      throw new Error(`Failed to create booking: ${(error as Error).message}`);
    }
  }

  async updateBooking(id: string, action: string): Promise<IResponse<null>> {
    try {
      const response = await this._bookingRepo.updateBookingStatus(id, action);
      if (!response) {
        return {
          status: StatusCode.Forbidden,
          message: "field unmatched",
        };
      }
      return {
        status: StatusCode.OK,
        message: "successfully updated",
      };
    } catch (error) {
      throw new Error(`Failed to update booking: ${(error as Error).message}`);
    }
  }

  async handleDriverAcceptance(data: DriverAssignmentPayload): Promise<void> {
    try {
      const response = await this._bookingRepo.updateAcceptedRide(data);
    } catch (error) {
      throw new Error(`Failed to update booking: ${(error as Error).message}`);
    }
  }

async fetchDriverBookingList(id: string): Promise<IResponse<BookingListDTO[]>> {
  try {    
    const response = await this._bookingRepo.fetchBookingListWithDriverId(id);

    const dtoList: BookingListDTO[] = response.map((booking) => ({
      _id: booking._id.toString(),
      pickupLocation: booking.pickupLocation,
      dropoffLocation: booking.dropoffLocation,
      distance: booking.distance || null,
      price: booking.price ?? null,
      date: booking.date,
      status: booking.status,
    }));

    return {
      status: StatusCode.OK,
      message: "Successfully fetched the booking list",
      data: dtoList,
    };
  } catch (error) {
    console.log("fetchDriverBookingList service", error);
    throw new Error(`Failed to fetch bookings: ${(error as Error).message}`);
  }
}


  async fetchDriverBookingDetails(id: string): Promise<IResponse<null>> {
    try {
      const response = await this._bookingRepo.fetchBookingListWithBookingId(
        id
      );
      return {
        status: StatusCode.OK,
        message: "successfully fetch booking details",
      };
    } catch (error) {
      console.log("fetchDriverBookingList service", error);
      throw new Error(`Failed fetch vehicles: ${(error as Error).message}`);
    }
  }

  async cancelRide(user_id: string, ride_id: string): Promise<IResponse<null>> {
    try {
      const response = await this._bookingRepo.cancelRide(user_id, ride_id);
      return {
        message: "successfully canceled",
        status: StatusCode.OK,
      };
    } catch (error) {
      console.log("fetchDriverBookingList service", error);
      throw new Error(`Failed fetch vehicles: ${(error as Error).message}`);
    }
  }
}
