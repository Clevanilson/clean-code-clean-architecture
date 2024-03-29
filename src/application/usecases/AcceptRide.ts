import { AccountRepository } from "@/infra/repositories/AccountRepository";
import { RideRepository } from "@/infra/repositories/RideRepository";

export class AcceptRide {
  constructor(
    private readonly riderepository: RideRepository,
    private readonly accountRepository: AccountRepository
  ) {}

  async execute(input: Input): Promise<void> {
    const ride = await this.riderepository.getById(input.rideId);
    if (!ride) throw new Error("Ride not found");
    ride.accept(input.driverId);
    await this.riderepository.update(ride);
  }
}

type Input = {
  rideId: string;
  driverId: string;
};
