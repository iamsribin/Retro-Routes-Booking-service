import mongoose from 'mongoose';
import { PricingInterface } from '../interfaces/interface';

const PricingSchema = new mongoose.Schema({
  vehicleModel: { type: String, required: true, unique: true }, 
  image: { type: String, required: true },
  minDistanceKm:{type: String, required: true},
  basePrice: { type: Number, required: true },
  pricePerKm: { type: Number, required: true },
  eta: { type: String, required: true },
  features: { type: [String], required: true },
  updatedBy: { type: String, default: "system" },
  updatedAt: { type: Date, default: Date.now }
});

export const PricingModel = mongoose.model<PricingInterface>('Pricing', PricingSchema);
