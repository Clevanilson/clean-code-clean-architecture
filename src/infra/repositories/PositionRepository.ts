import { Position } from "@/domain/entities/Position";

export interface PositionRepository {
  save(position: Position): Promise<void>;
  listByRideId(rideId: string): Promise<Position[]>;
}
