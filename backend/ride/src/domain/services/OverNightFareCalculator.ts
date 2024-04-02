import { FareCalculator } from "@/domain/services/FareCalculator";

export class OverNightFareCalculator extends FareCalculator {
  constructor() {
    super();
  }

  getFare(): number {
    const FARE = 3.9;
    return FARE;
  }
}
