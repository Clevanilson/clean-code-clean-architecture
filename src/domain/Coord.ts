export class Coord {
  constructor(
    readonly lat: number,
    readonly long: number
  ) {
    if (!this.isLatValid(lat)) throw new Error("Invalid latitude");
    if (!this.isLongValid(long)) throw new Error("Invalid long");
  }

  private isLatValid(lat: number): boolean {
    const min = -90;
    const max = 90;
    return lat >= min && lat <= max;
  }

  private isLongValid(long: number): boolean {
    const min = -100;
    const max = 100;
    return long >= min && long <= max;
  }
}
