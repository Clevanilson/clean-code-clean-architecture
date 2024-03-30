import crypto from "crypto";
import { Coord } from "./Coord";

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
      passengerId
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
    this.distance += this.calculateDistance(this.lastPosition, position);
    this.lastPosition = position;
  }

  calculateDistance(from: Coord, to: Coord): number {
    const earthRadius = 6371;
    const degreesToRadians = Math.PI / 180;
    const deltaLat = (to.lat - from.lat) * degreesToRadians;
    const deltaLon = (to.long - from.long) * degreesToRadians;
    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(from.lat * degreesToRadians) *
        Math.cos(to.lat * degreesToRadians) *
        Math.sin(deltaLon / 2) *
        Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(earthRadius * c);
  }
}
