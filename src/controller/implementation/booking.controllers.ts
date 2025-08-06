import { mongo } from "mongoose";
import {BookingService} from "../../services/implementation/booking_service";
import {
  CreateBookingRequest,
  UpdateBookingRequest,
  ControllerResponse,
  CreateBookingResponse,
  IBookingController,
  requestUpdateAcceptRide,
} from "../interfaces/IBookingController";

export class BookingController implements IBookingController {
  private bookingService: BookingService;

  constructor(bookingService: BookingService) {
    this.bookingService = bookingService;
  }

  async createBooking(data: CreateBookingRequest): Promise<ControllerResponse> {
    try {
      const {
        userId,
        userName,
        pickupLocation,
        dropoffLocation,
        vehicleModel,
        duration,
        price,
        distance,
        distanceInfo,
        userNumber,
        userProfile,
      } = data;

      const booking = await this.bookingService.createBooking({
        userId,
        userName,
        userNumber,
        userProfile,
        pickupLocation,
        dropoffLocation,
        vehicleModel,
        duration,
        price,
        distance,
        distanceInfo,
      });

      const response: CreateBookingResponse = {
        userData: {
          user_id: booking.user.user_id,
          userName: booking.user.userName,
          userNumber: booking.user.userNumber,
          userProfile: booking.user.userProfile,
        },
        booking: {
          id: booking._id.toString(),
          ride_id: booking.ride_id,
          status: booking.status,
        },
        userPickupCoordinators: pickupLocation,
        userDropCoordinators: dropoffLocation,
        distance: booking.distance,
        price: booking.price,
        duration: booking.duration,
        pin: booking.pin,
      };

      return { message: "Success", data: response };
    } catch (error) {
      return {
        message: `Error creating booking: ${(error as Error).message}`,
        status: "Failed",
      };
    }
  }

  async updateBooking(data: UpdateBookingRequest): Promise<ControllerResponse> {
    try {
      // const response = await this.bookingService.updateBooking(
      //   data.id,
      //   data.action
      // );
      return { message: "Success", data: { name: "sribin", age: 909 } };
    } catch (error) {
      console.log("error", error);

      return {
        message: `Error updating booking: ${(error as Error).message}`,
        status: "Failed",
      };
    }
  }

  async updateAcceptedRide(
    data: requestUpdateAcceptRide
  ): Promise<ControllerResponse> {
    try {
      const response = await this.bookingService.updateAcceptedRide(data);

      return { message: "Success", data: response };
    } catch (error) {
      return {
        message: `Error updating booking: ${(error as Error).message}`,
        status: "Failed",
      };
    }
  }

  async fetchVehicles(): Promise<ControllerResponse> {
    try {
      const response = await this.bookingService.fetchVehicles();
      console.log("responseresponse", response);

      return { message: "Success", data: response };
    } catch (error) {
      return {
        message: `Error get vehicles: ${(error as Error).message}`,
        status: "Failed",
      };
    }
  }

  async fetchDriverBookingList(id: mongo.ObjectId) {
    try {
      const data = await this.bookingService.fetchDriverBookingList(id);
      console.log("data====", data);

      return {
        status: "Success",
        data,
      };
    } catch (error) {
      console.log(error);
      return {
        status: "Failed",
        data: "failed to fetch booking list",
      };
    }
  }

  async fetchDriverBookingDetails(id: mongo.ObjectId) {
    try {
      const data = await this.bookingService.fetchDriverBookingDetails(id);

      return {
        status: "Success",
        data,
      };
    } catch (error) {
      console.log(error);
      return {
        status: "Failed",
        data: "failed to fetch booking list",
      };
    }
  }

  async cancelRide(request: { userId: string; ride_id: string }) {
    try {
      const data = await this.bookingService.cancelRide(
        request.userId,
        request.ride_id
      );

      return {
        status: "Success",
        data,
      };
    } catch (error) {
      console.log(error);
      return {
        status: "Failed",
        data: "failed to fetch booking list",
      };
    }
  }

  async getBookingDetailsByBookingId(request: { bookingId: string }) {
    console.log("ethi mone..", request);

    // const booking = await this.bookingService.fetchDriverBookingDetails(request.bookingId);
    const data = {
      name: "sribin",
      driver: false,
    };
    return {
      status: "Success",
      data,
    };
  }

  // Method to validate booking ID for payment service
  async validateBookingId(data: { bookingId: string }) {
    try {
      const booking = {
        status: "success",
        id: " booking.id",
        userId: "booking.userId",
        driverId: "booking.driverId",
        price: "booking.price",
        bookingStatus: "booking.status",
      };
      // await this.bookingService.getBookingById(data.bookingId);

      if (!booking) {
        return {
          status: "failed",
          message: "Booking not found",
        };
      }

      return {
        status: "success",
        bookingId: booking.id,
        userId: booking.userId,
        driverId: booking.driverId,
        price: booking.price,
        bookingStatus: booking.status,
      };
    } catch (error) {
      console.error("Error validating booking ID:", error);
      return {
        status: "failed",
        message: (error as Error).message,
      };
    }
  }

  // Method to update booking payment status for saga operations
  async updateBookingPaymentStatus(data: {
    bookingId: string;
    status: string;
    transactionId: string;
    amount: number;
  }) {
    try {
      const { bookingId, status, transactionId, amount } = data;

      // Update booking with payment information

      const updateResult = true;
      // await this.bookingService.updateBookingPaymentStatus({
      //     bookingId,
      //     paymentStatus: status,
      //     transactionId,
      //     paidAmount: amount,
      //     paymentCompletedAt: new Date()
      // });

      if (updateResult) {
        return {
          status: "success",
          message: "Booking payment status updated successfully",
        };
      } else {
        return {
          status: "failed",
          message: "Failed to update booking payment status",
        };
      }
    } catch (error) {
      console.error("Error updating booking payment status:", error);
      return {
        status: "failed",
        message: (error as Error).message,
      };
    }
  }
}
