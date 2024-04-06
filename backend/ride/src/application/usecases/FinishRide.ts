import { RideRepository } from "@/infra/repositories/RideRepository";
import { ProcessPayment } from "./ProcessPayment";
import { Mediator } from "@/infra/mediator/Mediator";
import { Queue } from "@/infra/queue/Queue";

export class FinishRide {
  constructor(
    private readonly rideRepository: RideRepository,
    private readonly queue: Queue
  ) {}

  async execute(id: string): Promise<void> {
    const ride = await this.rideRepository.getById(id);
    if (!ride) throw new Error("Ride not found");
    ride.finish();
    await this.rideRepository.update(ride);
    await this.queue.publish("rideCompleted", { rideId: ride.rideId });
  }
}
