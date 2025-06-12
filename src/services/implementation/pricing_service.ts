import { PricingModel } from '../../model/pricing.model';
import { PricingConfig } from '../../interfaces/interface';
import { IPricingService } from '../interfaces/IPricingService';

export class PricingService implements IPricingService {
  /**
   * Calculates the price for a ride based on distance and vehicle model
   * @param distanceKm - Distance in kilometers
   * @param vehicleModel - Vehicle model
   * @returns Promise resolving to the calculated price
   */
async getPrice(distanceKm: number, vehicleModel: string): Promise<number> {
  try {
    const config = await PricingModel.findOne({ vehicleModel });
    if (!config) {
      throw new Error(`Pricing configuration not found for ${vehicleModel}`);
    }

    const { basePrice, pricePerKm, minDistanceKm } = config;

    const minKm = parseFloat(minDistanceKm ?? "0");
    const additionalDistance = Math.max(0, distanceKm - minKm);
    const price = basePrice + additionalDistance * pricePerKm;

    return Math.round(price);
  } catch (error) {
    throw new Error(`Price calculation failed: ${(error as Error).message}`);
  }
}



  /**
   * Updates or creates pricing configuration for a vehicle model
   * @param adminId - ID of the admin performing the update
   * @param vehicleModel - Vehicle model
   * @param config - Pricing configuration
   * @returns Promise resolving to the updated pricing configuration
   */
  async updatePricing(adminId: string, vehicleModel: string, config: PricingConfig): Promise<PricingConfig> {
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