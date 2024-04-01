import { RideRepository } from "@/infra/repositories/RideRepository";

export class GetRide {
  constructor(private readonly rideRepository: RideRepository) {}

  async execute(rideId: string): Promise<Output | undefined> {
    const ride = await this.rideRepository.getById(rideId);
    if (!ride) return;
    return {
      date: ride.date,
      fromLat: ride.from.lat,
      fromLong: ride.from.long,
      passengerId: ride.passengerId,
      rideId: ride.rideId,
      status: ride.status,
      toLat: ride.to.lat,
      toLong: ride.to.long,
      driverId: ride.driverId,
      lastLat: ride.getLastLat(),
      lastLong: ride.getLastLong(),
      distance: ride.getDistance(),
      fare: ride.getFare()
    };
  }
}

type Output = {
  rideId: string;
  passengerId: string;
  driverId?: string;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
  date: Date;
  status: string;
  lastLat: number;
  lastLong: number;
  distance: number;
  fare?: number;
};
