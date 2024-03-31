import { Position } from "@/domain/entities/Position";
import { PositionRepository } from "@/infra/repositories/PositionRepository";
import { RideRepository } from "@/infra/repositories/RideRepository";

export class UpdatePosition {
  constructor(
    private readonly rideRepository: RideRepository,
    private readonly positionRepository: PositionRepository
  ) {}

  async execute(input: Input): Promise<void> {
    const ride = await this.rideRepository.getById(input.rideId);
    if (!ride) throw new Error("Ride not found");
    ride.updatePosition(input.lat, input.long);
    await this.rideRepository.update(ride);
    const position = Position.create(input.rideId, input.lat, input.long);
    await this.positionRepository.save(position);
  }
}

type Input = {
  rideId: string;
  lat: number;
  long: number;
};
