import { Position } from "@/domain/entities/Position";
import { PositionRepository } from "@/infra/repositories/PositionRepository";

export class GetPositions {
  constructor(private positionRepository: PositionRepository) {}

  async execute(rideId: string): Promise<Output[]> {
    const positions = await this.positionRepository.listByRideId(rideId);
    return positions.map((position) => ({
      positionId: position.positionId,
      date: position.date,
      lat: position.coord.lat,
      long: position.coord.long,
      rideId: position.rideId
    }));
  }
}

type Output = {
  positionId: string;
  rideId: string;
  lat: number;
  long: number;
  date: Date;
};
