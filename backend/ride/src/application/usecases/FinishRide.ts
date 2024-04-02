import { RideRepository } from "@/infra/repositories/RideRepository";

export class FinishRide {
  constructor(private readonly rideRepository: RideRepository) {}

  async execute(id: string): Promise<void> {
    const ride = await this.rideRepository.getById(id);
    if (!ride) throw new Error("Ride not found");
    ride.finish();
    await this.rideRepository.update(ride);
  }
}
