import { IBookingController } from "../interfaces/i-booking-controller";
import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import { IResponse } from "../../types/common/response";
import { BookingDetailsDto, BookingListDTO, CreateBookingResponseDTO } from "../../dto/booking.dto";
import { StatusCode } from "../../types/common/status-code";
import { IBookingService } from "../../services/interfaces/i-booking-service";
import {
  CreateBookingReq,
  DriverAssignmentPayload,
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

      callback(null, response);
    } catch (error) {
      callback(null, {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      });
    }
  }

  // async updateBooking(
  //   call: ServerUnaryCall<UpdateBookingReq, IResponse<null>>,
  //   callback: sendUnaryData<IResponse<null>>
  // ): Promise<void> {
  //   try {
  //     const data = { ...call.request };
  //     const response = await this._bookingService.updateBooking(
  //       data.id,
  //       data.action
  //     );

  //     callback(null, response);
  //   } catch (error) {
  //     console.log("error", error);

  //     callback(null, {
  //       status: StatusCode.InternalServerError,
  //       message: (error as Error).message,
  //     });
  //   }
  // }

  async handleDriverAcceptance(data:DriverAssignmentPayload): Promise<void> {
    try {
     await this._bookingService.handleDriverAcceptance(data);
    } catch (error) {
     console.log("error",error);
     
    }
  }

  async fetchDriverBookingList(
    call: ServerUnaryCall<{ id: string }, IResponse<BookingListDTO[]>>,
    callback: sendUnaryData<IResponse<BookingListDTO[]>>
  ): Promise<void> {
    try {
      const { id } = call.request;
      
      const response = await this._bookingService.fetchDriverBookingList(id);
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
    call: ServerUnaryCall<{ id: string }, IResponse<BookingDetailsDto>>,
    callback: sendUnaryData<IResponse<BookingDetailsDto>>
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
