import mongoose, { Document, Schema } from 'mongoose';

export interface BookingInterface extends Document {
  _id: string;
  ride_id: string;
  driver_id: string;
  user_id: string;
  pickupCoordinates: { latitude: number; longitude: number };
  dropoffCoordinates: { latitude: number; longitude: number };
  pickupLocation: string;
  dropoffLocation: string;
  driverCoordinates?: { latitude: number; longitude: number };
  distance: string;
  duration: string;
  vehicleModel: string;
  price: number;
  date: Date;
  status: string;
  pin: number;
  paymentMode: string;
  feedback?: string;
  rating?: number;
}  

const BookingSchema: Schema = new Schema({
  ride_id: { type: String, required: true },
  driver_id: { type: String },
  user_id: { type: String, required: true },
  pickupCoordinates: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  dropoffCoordinates: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  pickupLocation: { type: String, required: true },
  dropoffLocation: { type: String, required: true },
  driverCoordinates: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  distance: { type: String },
  duration: { type: String },
  vehicleModel: { type: String, required: true },
  price: { type: Number },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['Pending', 'Accepted', 'Confirmed', 'Completed', 'Cancelled'], default: 'Pending' },
  pin: { type: Number },
  
  paymentMode: { type: String },
  feedback: { type: String },
  rating: { type: Number },
});

const bookingModel = mongoose.model<BookingInterface>('Booking', BookingSchema);
export default bookingModel;