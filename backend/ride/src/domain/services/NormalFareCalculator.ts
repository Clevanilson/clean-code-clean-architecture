import { FareCalculator } from "@/domain/services/FareCalculator";

export class NormalFareCalculator extends FareCalculator {
  constructor() {
    super();
  }

  getFare(): number {
    const FARE = 2.1;
    return FARE;
  }
}
