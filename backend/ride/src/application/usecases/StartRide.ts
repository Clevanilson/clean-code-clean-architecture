import { RideRepository } from "@/infra/repositories/RideRepository";

export class StartRide {
  constructor(private readonly rideRepository: RideRepository) {}

  async execute(rideId: string): Promise<void> {
    const ride = await this.rideRepository.getById(rideId);
    if (!ride) throw new Error("Ride not found");
    ride.start();
    await this.rideRepository.update(ride);
  }
}
