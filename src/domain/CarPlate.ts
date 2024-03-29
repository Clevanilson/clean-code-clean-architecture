export class CarPlate {
  constructor(readonly value: string) {
    if (!this.isCarPlateValid(value)) throw new Error("Invalid car plate");
  }

  private isCarPlateValid(carPlate?: string): boolean {
    return !!carPlate?.match(/[A-Z]{3}[0-9]{4}/);
  }
}
