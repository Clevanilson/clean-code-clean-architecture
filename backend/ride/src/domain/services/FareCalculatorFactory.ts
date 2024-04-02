import { FareCalculator } from "@/domain/services/FareCalculator";
import { NormalFareCalculator } from "./NormalFareCalculator";
import { OverNightFareCalculator } from "./OverNightFareCalculator";

export class FareCalculatorFactory {
  static create(date: Date): FareCalculator {
    if (date.getHours() > 22 || date.getHours() < 6) {
      return new OverNightFareCalculator();
    }
    return new NormalFareCalculator();
  }
}
