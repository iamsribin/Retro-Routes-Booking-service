import BookingController from '../controller/implementaion/booking.controllers';
import rabbitClient from './client';

export default class MessageHandler {
  constructor(private bookingController: BookingController) {}

  async handle(operation: string, data: any, correlationId: string, replyTo: string) {
    let response;
    console.log('Operation===', operation, 'Data===', data);
    console.log('correlationId===', correlationId, 'replyTo===', replyTo);

    switch (operation) {
      case 'create-booking':
        response = await this.bookingController.createBooking(data);
        break;
      case 'update-booking-status':
        response = await this.bookingController.updateBooking(data);
        break;
      case 'accepted-booking':       
        response = await this.bookingController.updateAcceptedRide(data);
        break;
      case 'get-vehicles':
        response = await this.bookingController.fetchVehicles();
        break;
      case "get-driver-booking-list":
        response = await this.bookingController.fetchDriverBookingList(data);
        break;

      case "get-driver-booking-details":
        response = await this.bookingController.fetchDriverBookingDetails(data);
        break;
      case "cancel_ride":
        response = await this.bookingController.cancelRide(data);
        break;
      
      default:
        response = { message: 'Request-key not found', status: 'Failed' };
        break;
    }
    // console.log("response",response,"correlationId",correlationId,"replyTo",replyTo );

    await rabbitClient.produce(response, correlationId, replyTo);
  }
}