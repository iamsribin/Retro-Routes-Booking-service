import BookingRepository from "../../repositories/implementation/booking_repository";
import { PricingService } from "./pricing_service";
import { getDistance } from "geolib";
import { generatePIN } from "../../utils/generatePIN";
import {
  CreateBookingRequest,
  DriverDetails,
  requestUpdateAcceptRide,
} from "../../controller/interfaces/IBookingController";
import { BookingInterface } from "../../interfaces/interface";
import { IBookingService } from "../interfaces/IBookingService";
import { mongo } from "mongoose";

export default class BookingService implements IBookingService {
  private PricingService: PricingService;
  private bookingRepo: BookingRepository;

  constructor(pricingService: PricingService, bookingRepo: BookingRepository) {
    this.PricingService = pricingService;
    this.bookingRepo = bookingRepo;
  } 

  /**
   * Creates a new booking with calculated price and caches it in Redis
   * @param data - Booking details including user ID, locations, and vehicle model
   * @returns Promise resolving to the created booking
   */
  async createBooking(data: CreateBookingRequest): Promise<BookingInterface> {
    try {

      const pin = generatePIN();

      const booking = await this.bookingRepo.createBooking(
        data,
        data.distanceInfo.distanceInKm,
        data.price,
        pin
      );

      return booking;
    } catch (error) {
      throw new Error(`Failed to create booking: ${(error as Error).message}`);
    }
  }

  /**
   * Finds nearby drivers matching the vehicle model within 5km
   * @param latitude - Pickup location latitude
   * @param longitude - Pickup location longitude
   * @param vehicleModel - Vehicle model to match
   * @returns Promise resolving to sorted list of nearby drivers
   */

  /**
   * Updates a booking's status
   * @param id - Booking ID
   * @param action - New status
   * @returns Promise resolving to the updated booking or null
   */
  async updateBooking(
    id: string,
    action: string
  ): Promise<BookingInterface | null> {
    try {
      return await this.bookingRepo.updateBookingStatus(id, action);
    } catch (error) {
      throw new Error(`Failed to update booking: ${(error as Error).message}`);
    }
  }

  async fetchVehicles() {
    try {
      return await this.bookingRepo.fetchVehicles();
    } catch (error) {
      throw new Error(`Failed fetch vehicles: ${(error as Error).message}`);
    }
  }

  async updateAcceptedRide(
    data: requestUpdateAcceptRide
  ): Promise<BookingInterface | null> {
    try {
      const response = await this.bookingRepo.updateAcceptedRide(data);
      return response;
    } catch (error) {
      throw new Error(`Failed to update booking: ${(error as Error).message}`);
    }
  }

  async fetchDriverBookingList(id:mongo.ObjectId){
    try {
      const response = await this.bookingRepo.fetchBookingListWithDriverId(id)
      return response
    } catch (error) {
      console.log("fetchDriverBookingList service",error);
      throw new Error(`Failed fetch vehicles: ${(error as Error).message}`);
    }
  }

  async fetchDriverBookingDetails(id:mongo.ObjectId){
        try {
      const response = await this.bookingRepo.fetchBookingListWithBookingId(id)
      return response
    } catch (error) {
      console.log("fetchDriverBookingList service",error);
      throw new Error(`Failed fetch vehicles: ${(error as Error).message}`);
    }
  }
}
