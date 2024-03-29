export class CarPlate {
  constructor(readonly value: string) {
    if (!this.isValid(value)) throw new Error("Invalid car plate");
  }

  private isValid(carPlate?: string): boolean {
    return !!carPlate?.match(/[A-Z]{3}[0-9]{4}/);
  }
}
