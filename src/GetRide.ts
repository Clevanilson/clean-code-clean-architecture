import { RideDAO } from "./RideDAO";

export class GetRide {
  constructor(private readonly rideDAO: RideDAO) {}

  async execute(rideId: string): Promise<Output | undefined> {
    return await this.rideDAO.getById(rideId);
  }
}

interface Output {
  passengerId: string;
  rideId: string;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
  status: string;
  date: Date;
}
