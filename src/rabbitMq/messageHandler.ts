import BookingController from '../controller/booking.controllers';
import rabbitClient from './client';

export default class MessageHandler {
  constructor(private bookingController: BookingController) {}

  async handle(operation: string, data: any, correlationId: string, replyTo: string) {
    let response;
    console.log('Operation:', operation, 'Data:', data);

    switch (operation) {
      case 'create-booking':
        response = await this.bookingController.createBooking(data);
        break;
      // case 'update-booking':
      //   response = await this.bookingController.updateBooking(data);
      //   break;
      // case 'ride-confirm':
      //   response = await this.bookingController.confirmRide(data);
      //   break;
      default:
        response = { message: 'Request-key not found', status: 'Failed' };
        break;
    }

    await rabbitClient.produce(response, correlationId, replyTo);
  }
}