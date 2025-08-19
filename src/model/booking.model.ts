import mongoose, { Schema } from "mongoose";
import { BookingInterface } from "../interfaces/interface";

const BookingSchema: Schema = new Schema({
  rideId: { type: String, required: true },

  user: {
    userId: { type: String, required: true },
    userName: { type: String },
    userNumber: { type: String },
    userProfile: { type: String },
  },

  driver: {
    driverId: { type: String },
    driverName: { type: String },
    driverNumber: { type: String },
    driverProfile: { type: String },
  },

  pickupCoordinates: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, required: true },
  },
  dropoffCoordinates: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, required: true },
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
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Confirmed", "Completed", "Cancelled"],
    default: "Pending",
  },
  pin: { type: Number },
  paymentMode: { type: String },
  feedback: { type: String },
  rating: { type: Number },
});

const bookingModel = mongoose.model<BookingInterface>("Booking", BookingSchema);
export default bookingModel;
