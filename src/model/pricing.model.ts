import mongoose, { Schema } from "mongoose";

const PricingSchema = new Schema({
    vehicleModel: { type: String, required: true, unique: true },
    basePrice: { type: Number, required: true },
    pricePerKm: { type: Number, required: true },
    minDistanceKm: { type: Number, required: true },
    updatedBy: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now }
  });

export const PricingModel = mongoose.model('Pricing', PricingSchema);