import { Ride } from "../../domain/Ride";

export interface RideRepository {
  save(ride: Ride): Promise<void>;
  getActiveByPassengerId(passengerId: string): Promise<Ride | undefined>;
  getById(id: string): Promise<Ride | undefined>;
}
