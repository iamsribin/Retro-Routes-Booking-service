import { PricingConfig } from '../../interfaces/interface';

export interface IPricingService {
  getPrice(distanceKm: number, vehicleModel: string): Promise<number>;
  updatePricing(adminId: string, vehicleModel: string, config: PricingConfig): Promise<PricingConfig>;
}