import { PricingConfig } from "../interfaces/interface";
import { PricingModel } from "../model/pricing.model";

export class PricingService {
    async getPrice(distanceKm: number, vehicleModel: string): Promise<number> {
      try {
        
        const config = await PricingModel.findOne({ vehicleModel });
        if (!config) {
          throw new Error(`Pricing configuration not found for ${vehicleModel}`);
        }
  
        const { basePrice, pricePerKm, minDistanceKm } = config;
        const additionalDistance = Math.max(0, distanceKm - minDistanceKm);
        return basePrice + (additionalDistance * pricePerKm);
      } catch (error) {
        throw new Error(`Price calculation failed: ${(error as Error).message}`);
      }
    }
  
    async updatePricing(adminId: string, vehicleModel: string, config: PricingConfig) {
      try {
        return await PricingModel.findOneAndUpdate(
          { vehicleModel },
          { ...config, updatedBy: adminId, updatedAt: new Date() },
          { new: true, upsert: true }
        );
      } catch (error) {
        throw new Error(`Failed to update pricing: ${(error as Error).message}`);
      }
    }
  }