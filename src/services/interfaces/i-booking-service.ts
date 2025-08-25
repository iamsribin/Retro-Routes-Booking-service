import { IResponse } from '../../types/common/response';
import { BookingListDTO, CreateBookingResponseDTO } from '../../dto/booking.dto';
import { CreateBookingReq, DriverAssignmentPayload, UpdateAcceptRideReq } from '../../types/booking/request';

export interface IBookingService {
  createBooking(data: CreateBookingReq): Promise<IResponse<CreateBookingResponseDTO>>;
  updateBooking(id: string, action: string): Promise<IResponse<null>>;
  handleDriverAcceptance(data:DriverAssignmentPayload): Promise<void> 
  // updateAcceptedRide(data:UpdateAcceptRideReq): Promise<IResponse<null>>;
  fetchDriverBookingList(id:string): Promise<IResponse<BookingListDTO[]>>;
  fetchDriverBookingDetails(id:string): Promise<IResponse<null>>;
  cancelRide(user_id: string, ride_id: string): Promise<IResponse<null>>;
}