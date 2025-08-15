import { IResponse } from '../../types/common/response';
import { CreateBookingResponseDTO } from '../../dto/booking.dto';
import { CreateBookingReq, UpdateAcceptRideReq } from '../../types/booking/request';

export interface IBookingService {
  createBooking(data: CreateBookingReq): Promise<IResponse<CreateBookingResponseDTO>>;
  updateBooking(id: string, action: string): Promise<IResponse<null>>;
  updateAcceptedRide(data:UpdateAcceptRideReq): Promise<IResponse<null>>;
  fetchDriverBookingList(id:string): Promise<IResponse<null>>;
  fetchDriverBookingDetails(id:string): Promise<IResponse<null>>;
  cancelRide(user_id: string, ride_id: string): Promise<IResponse<null>>;
}