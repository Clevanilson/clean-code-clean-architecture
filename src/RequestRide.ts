import { query } from "./AccountRepositoryDatabase";
import crypto from "crypto";
import { RideDAO } from "./RideDAO";
import { AccountRepository } from "./AccountRepository";

export class RequestRide {
  constructor(
    private readonly rideDAO: RideDAO,
    private readonly accountRepository: AccountRepository
  ) {}

  async execute(input: Input): Promise<Output> {
    const rideId = crypto.randomUUID();
    const ride = {
      ...input,
      rideId,
      status: "requested",
      data: new Date()
    };
    const { passengerId } = input;
    const account = await this.accountRepository.getById(passengerId);
    if (!account?.isPassenger) throw new Error("User must be a passenger");
    const activeRide = await this.rideDAO.getActiveByPassengerId(passengerId);
    if (activeRide) throw new Error("User has an active ride");
    this.rideDAO.save(ride);
    return { rideId };
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
