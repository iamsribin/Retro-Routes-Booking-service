import { IBookingController } from "../interfaces/i-booking-controller";
import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import { IResponse } from "../../types/common/response";
import { CreateBookingResponseDTO } from "../../dto/booking.dto";
import { StatusCode } from "../../types/common/status-code";
import { IBookingService } from "../../services/interfaces/i-booking-service";
import {
  CreateBookingReq,
  UpdateAcceptRideReq,
  UpdateBookingReq,
} from "../../types/booking/request";

export class BookingController implements IBookingController {
  constructor(private _bookingService: IBookingService) {}

  async createBooking(
    call: ServerUnaryCall<
      CreateBookingReq,
      IResponse<CreateBookingResponseDTO>
    >,
    callback: sendUnaryData<IResponse<CreateBookingResponseDTO>>
  ): Promise<void> {
    try {
      const data = { ...call.request };

      const response = await this._bookingService.createBooking(data);
      console.log("response", response);

      callback(null, response);
    } catch (error) {
      callback(null, {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      });
    }
  }

  async updateBooking(
    call: ServerUnaryCall<UpdateBookingReq, IResponse<null>>,
    callback: sendUnaryData<IResponse<null>>
  ): Promise<void> {
    try {
      const data = { ...call.request };
      const response = await this._bookingService.updateBooking(
        data.id,
        data.action
      );

      callback(null, response);
    } catch (error) {
      console.log("error", error);

      callback(null, {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      });
    }
  }

  async updateAcceptedRide(
    call: ServerUnaryCall<UpdateAcceptRideReq, IResponse<null>>,
    callback: sendUnaryData<IResponse<null>>
  ): Promise<void> {
    try {
      const data = { ...call.request };
      const response = await this._bookingService.updateAcceptedRide(data);
      callback(null, response);
      // return { message: "Success", data: response };
    } catch (error) {
      callback(null, {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      });
    }
  }

  async fetchDriverBookingList(
    call: ServerUnaryCall<{ id: string }, IResponse<null>>,
    callback: sendUnaryData<IResponse<null>>
  ): Promise<void> {
    try {
      const { id } = call.request;
      const response = await this._bookingService.fetchDriverBookingList(id);
      console.log("data====", response);
      callback(null, response);
    } catch (error) {
      console.log(error);
      callback(null, {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      });
    }
  }

  async fetchDriverBookingDetails(
    call: ServerUnaryCall<{ id: string }, IResponse<null>>,
    callback: sendUnaryData<IResponse<null>>
  ): Promise<void> {
    try {
      const { id } = call.request;
      const response = await this._bookingService.fetchDriverBookingDetails(id);
      callback(null, response);
    } catch (error) {
      console.log(error);
      callback(null, {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      });
    }
  }

  async cancelRide(
    call: ServerUnaryCall<{ userId: string; ride_id: string }, IResponse<null>>,
    callback: sendUnaryData<IResponse<null>>
  ): Promise<void> {
    try {
      const data = { ...call.request };
      const response = await this._bookingService.cancelRide(
        data.userId,
        data.ride_id
      );
      callback(null, response);
    } catch (error) {
      console.log(error);
      callback(null, {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      });
    }
  }
}
