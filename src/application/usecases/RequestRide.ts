import { AccountRepository } from "@/infra/repositories/AccountRepository";
import { RideRepository } from "@/infra/repositories/RideRepository";
import { Ride } from "@/domain/Ride";

export class RequestRide {
  constructor(
    private readonly rideRepository: RideRepository,
    private readonly accountRepository: AccountRepository
  ) {}

  async execute(input: Input): Promise<Output> {
    const ride = Ride.create(
      input.passengerId,
      input.fromLat,
      input.fromLong,
      input.toLat,
      input.toLong
    );
    const { passengerId } = input;
    const account = await this.accountRepository.getById(passengerId);
    if (!account?.isPassenger) throw new Error("User must be a passenger");
    const activeRide =
      await this.rideRepository.getActiveByPassengerId(passengerId);
    if (activeRide) throw new Error("User has an active ride");
    await this.rideRepository.save(ride);
    return { rideId: ride.rideId };
  }
}

interface Input {
  passengerId: string;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
}

interface Output {
  rideId: string;
}
