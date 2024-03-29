import { RideRepository } from "@/infra/repositories/RideRepository";

export class GetRide {
  constructor(private readonly rideRepository: RideRepository) {}

  async execute(rideId: string): Promise<Output | undefined> {
    const ride = await this.rideRepository.getById(rideId);
    if (!ride) return;
    return {
      date: ride.date,
      fromLat: ride.fromLat,
      fromLong: ride.fromLong,
      passengerId: ride.passengerId,
      rideId: ride.rideId,
      status: ride.status,
      toLat: ride.toLat,
      toLong: ride.toLong
    };
  }
}

type Output = {
  rideId: string;
  passengerId: string;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
  date: Date;
  status: string;
};
