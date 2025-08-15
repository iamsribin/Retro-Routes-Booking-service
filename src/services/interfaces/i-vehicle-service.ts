import { PricingConfig, PricingInterface } from "../../interfaces/interface";
import { IResponse } from "../../types/common/response";

export interface IVehicleService {
  fetchVehicles(): Promise<IResponse<PricingInterface[]>>;
  getPrice(distanceKm: number, vehicleModel: string): Promise<number>;
  // updatePricing(
  //   adminId: string,
  //   vehicleModel: string,
  //   config: PricingConfig
  // ): Promise<PricingConfig>;
}
