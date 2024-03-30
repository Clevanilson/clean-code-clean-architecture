import crypto from "crypto";
import { Coord } from "../valueObjects/Coord";

export class Position {
  readonly coord: Coord;

  private constructor(
    readonly positionId: string,
    readonly rideId: string,
    readonly date: Date,
    lat: number,
    long: number
  ) {
    this.coord = new Coord(lat, long);
  }

  static create(rideId: string, lat: number, long: number): Position {
    return new Position(crypto.randomUUID(), rideId, new Date(), lat, long);
  }

  static restore(
    positionId: string,
    rideId: string,
    date: Date,
    lat: number,
    long: number
  ): Position {
    return new Position(positionId, rideId, date, lat, long);
  }
}
