import crypto from "crypto";
import { Coord } from "../valueObjects/Coord";
import { DistanceCalculator } from "../services/DistanceCalculator";

export class Ride {
  private lastPosition: Coord;
  readonly from: Coord;
  readonly to: Coord;

  private constructor(
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    lastLat: number,
    lastLong: number,
    private distance: number,
    private _status: string,
    readonly date: Date,
    readonly rideId: string,
    readonly passengerId: string,
    private fare: number,
    private _driverId?: string
  ) {
    this.from = new Coord(fromLat, fromLong);
    this.lastPosition = new Coord(lastLat, lastLong);
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
      fromLat,
      fromLong,
      toLat,
      toLong,
      fromLat,
      fromLong,
      0,
      "requested",
      new Date(),
      rideId,
      passengerId,
      0
    );
  }
  static restore(
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    lastLat: number,
    lastLong: number,
    distance: number,
    status: string,
    date: Date,
    rideId: string,
    passengerId: string,
    fare: number,
    driverId?: string
  ): Ride {
    return new Ride(
      fromLat,
      fromLong,
      toLat,
      toLong,
      lastLat,
      lastLong,
      distance,
      status,
      date,
      rideId,
      passengerId,
      fare,
      driverId
    );
  }
  get status(): string {
    return this._status;
  }

  get driverId(): string | undefined {
    return this._driverId;
  }

  getDistance(): number {
    return this.distance;
  }

  getLastLat(): number {
    return this.lastPosition.lat;
  }

  getLastLong(): number {
    return this.lastPosition.long;
  }

  getFare(): number {
    return this.fare;
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

  updatePosition(lat: number, long: number): void {
    if (this.status !== "in_progress") throw new Error("Invalid status");
    const position = new Coord(lat, long);
    this.distance += DistanceCalculator.calculate(this.lastPosition, position);
    this.lastPosition = position;
  }

  finish(): void {
    if (this.status !== "in_progress") throw new Error("Invalid status");
    if (this.date.getHours() > 22 || this.date.getHours() < 6) {
      this.fare = this.distance * 3.9;
    } else {
      this.fare = this.distance * 2.1;
    }
    this._status = "completed";
  }
}