import { query } from "./AccountDAODatabase";
import crypto from "crypto";
import { RideDAO } from "./RideDAO";
import { AccountDAO } from "./AccountDAO";

export class RequestRide {
  constructor(
    private readonly rideDAO: RideDAO,
    private readonly accountDAO: AccountDAO
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
    const account = await this.accountDAO.getById(passengerId);
    if (!account?.is_passenger) throw new Error("User must be a passenger");
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
