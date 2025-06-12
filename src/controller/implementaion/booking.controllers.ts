import { mongo } from "mongoose";
import BookingService from "../../services/implementation/booking_service";
import {
  CreateBookingRequest,
  UpdateBookingRequest,
  ControllerResponse,
  CreateBookingResponse,
  IBookingController,
  requestUpdateAcceptRide,
} from "../interfaces/IBookingController";

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
      const { userId, userName, pickupLocation, dropoffLocation, vehicleModel, duration, price, distance, distanceInfo, userNumber, userProfile} = data;

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
        distanceInfo
      });

      const response: CreateBookingResponse = {
        userData:{
        user_id: booking.user.user_id,
        userName: booking.user.userName,
        userNumber: booking.user.userNumber,
        userProfile: booking.user.userProfile
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
  /**
   * Updates a booking's status
   * @param data - Object containing booking ID and action
   * @returns Promise resolving to updated booking or error response
   */
  async updateBooking(data: UpdateBookingRequest): Promise<ControllerResponse> {
    try {

      const response = await this.bookingService.updateBooking(
        data.id,
        data.action
      );
      return { message: "Success", data: response };
    } catch (error) {
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

  async fetchVehicles():Promise <ControllerResponse> {
    try {

      const response = await this.bookingService.fetchVehicles();

      return { message: "Success", data: response };    
    } catch (error) {
      return {
        message: `Error get vehicles: ${(error as Error).message}`,
        status: "Failed",
      };
    }
  }

 async fetchDriverBookingList(id:mongo.ObjectId){
  try {
    
   const data = await this.bookingService.fetchDriverBookingList(id);
   
   return {
    status:"Success",
    data
   }
  } catch (error) {
    console.log(error);
    return {
      status:"Failed",
      data: "failed to fetch booking list"
    }
  }
 }

 async fetchDriverBookingDetails(id:mongo.ObjectId){
  try{
   const data = await this.bookingService.fetchDriverBookingDetails(id);
   console.log("dta====",{
    status:"Success",
    data
   });
   
   return {
    status:"Success", 
    data
   }
  } catch (error) {
    console.log(error);
    return {
      status:"Failed",
      data: "failed to fetch booking list"
    }
  }
 }
}
