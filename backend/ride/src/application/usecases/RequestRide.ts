import { Ride } from "@/domain/entities/Ride";
import { AccountGateway } from "@/infra/gateways/AccountGateway";
import { RideRepository } from "@/infra/repositories/RideRepository";

export class RequestRide {
  constructor(
    private readonly rideRepository: RideRepository,
    private readonly accountGateway: AccountGateway
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
    const account = await this.accountGateway.getById(passengerId);
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
