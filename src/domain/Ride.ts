import crypto from "crypto";
import { Coord } from "./Coord";

export class Ride {
  readonly from: Coord;
  readonly to: Coord;

  private constructor(
    readonly rideId: string,
    readonly passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    readonly date: Date,
    private _status: string,
    private _driverId?: string
  ) {
    this.from = new Coord(fromLat, fromLong);
    this.to = new Coord(toLat, toLong);
  }

  static create(
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number
  ): Ride {
    const rideId = crypto.randomUUID();
    return new Ride(
      rideId,
      passengerId,
      fromLat,
      fromLong,
      toLat,
      toLong,
      new Date(),
      "requested"
    );
  }
  static restore(
    rideId: string,
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    date: Date,
    status: string,
    driverId?: string
  ): Ride {
    return new Ride(
      rideId,
      passengerId,
      fromLat,
      fromLong,
      toLat,
      toLong,
      date,
      status,
      driverId
    );
  }
  get status(): string {
    return this._status;
  }

  get driverId(): string | undefined {
    return this._driverId;
  }

  accept(driverId: string): void {
    if (this.status !== "requested") throw new Error("Invalid status");
    this._driverId = driverId;
    this._status = "accepted";
  }

  start(): void {
    if (this.status !== "accepted") throw new Error("Invalid status");
    this._status = "in_progress";
  }
}
