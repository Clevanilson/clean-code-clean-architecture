import { Ride } from "@/domain/entities/Ride";

export interface RideRepository {
  save(ride: Ride): Promise<void>;
  update(ride: Ride): Promise<void>;
  getActiveByPassengerId(passengerId: string): Promise<Ride | undefined>;
  getById(id: string): Promise<Ride | undefined>;
}
