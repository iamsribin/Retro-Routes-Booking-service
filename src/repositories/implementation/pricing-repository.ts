import { PricingModel } from "../../model/pricing.model";
import { PricingInterface } from "../../interfaces/interface";
import { BaseRepository } from "./base-repository";
import { IPricingRepository } from "../interfaces/i-pricing-repository";

export class PricingRepository
  extends BaseRepository<PricingInterface>
  implements IPricingRepository
{
  constructor() {
    super(PricingModel);
  }
}
