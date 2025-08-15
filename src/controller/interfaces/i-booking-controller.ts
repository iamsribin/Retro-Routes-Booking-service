import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import { BookingInterface, Coordinates } from "../../interfaces/interface";
import {
  CreateBookingReq,
  UpdateAcceptRideReq,
  UpdateBookingReq,
} from "../../types/booking/request";
import { IResponse } from "../../types/common/response";
import { CreateBookingResponseDTO } from "../../dto/booking.dto";

export interface ControllerResponse {
  message: string;
  data?: any;
  status?: string;
}

export interface DriverDetails {
  driverId: string;
  distance: number;
  rating: number;
  cancelCount: number;
}

export interface IBookingController {
  createBooking(
    call: ServerUnaryCall<
      CreateBookingReq,
      IResponse<CreateBookingResponseDTO>
    >,
    callback: sendUnaryData<IResponse<CreateBookingResponseDTO>>
  ): Promise<void>;
  // createBooking(data: CreateBookingReq): Promise<ControllerResponse>;

  updateBooking(
    call: ServerUnaryCall<UpdateBookingReq, IResponse<null>>,
    callback: sendUnaryData<IResponse<null>>
  ): Promise<void>;
  // updateBooking(data: UpdateBookingRequest): Promise<ControllerResponse>;

  updateAcceptedRide(
    call: ServerUnaryCall<UpdateAcceptRideReq, IResponse<null>>,
    callback: sendUnaryData<IResponse<null>>
  ): Promise<void>;
  // updateAcceptedRide(
  //   data: UpdateAcceptRideReq
  // ): Promise<ControllerResponse>;
  fetchDriverBookingList(
    call: ServerUnaryCall<{id:string}, IResponse<null>>,
    callback: sendUnaryData<IResponse<null>>
  ): Promise<void>;

   fetchDriverBookingDetails(
    call: ServerUnaryCall<{ id: string }, IResponse<null>>,
    callback: sendUnaryData<IResponse<null>>
  ): Promise<void>

  cancelRide(
    call: ServerUnaryCall<{ userId: string; ride_id: string }, IResponse<null>>,
    callback: sendUnaryData<IResponse<null>>
  ): Promise<void>
}
