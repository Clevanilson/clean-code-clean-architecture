export abstract class FareCalculator {
  calculate(distance: number): number {
    return distance * this.getFare();
  }

  abstract getFare(): number;
}
