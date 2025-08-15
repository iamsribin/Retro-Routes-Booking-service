import { PricingInterface } from "../../interfaces/interface";
import { IVehicleService } from "../interfaces/i-vehicle-service";
import { IResponse } from "../../types/common/response";
import { IPricingRepository } from "../../repositories/interfaces/i-pricing-repository";
import { StatusCode } from "../../types/common/status-code";

export class VehicleService implements IVehicleService {
  constructor(private _pricingRepo: IPricingRepository) {}

  async getPrice(distanceKm: number, vehicleModel: string): Promise<number> {
    try {
      const config = await this._pricingRepo.findOne({ vehicleModel });
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

  async fetchVehicles(): Promise<IResponse<PricingInterface[]>> {
    try {
      const response: PricingInterface[] = await this._pricingRepo.find({});
      return {
        message: "vehicle list fetch",
        status: StatusCode.OK,
        data: response,
      };
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  // async updatePricing(
  //   adminId: string,
  //   vehicleModel: string,
  //   config: PricingConfig
  // ): Promise<PricingConfig> {
  //   try {
  //     return await this._pricingRepo.findOneAndUpdat(
  //       { vehicleModel },
  //       { ...config, updatedBy: adminId, updatedAt: new Date() },
  //       { new: true, upsert: true }
  //     );
  //   } catch (error) {
  //     throw new Error(`Failed to update pricing: ${(error as Error).message}`);
  //   }
  // }
}
