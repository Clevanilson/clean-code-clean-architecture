import { RideRepository } from "@/infra/repositories/RideRepository";
import { ProcessPayment } from "./ProcessPayment";
import { Mediator } from "@/infra/mediator/Mediator";
import { Queue } from "@/infra/queue/Queue";
import { RideCompletedEvent } from "@/domain/events/RideCompleted";

export class FinishRide {
  constructor(
    private readonly rideRepository: RideRepository,
    private readonly queue: Queue
  ) {}

  async execute(id: string): Promise<void> {
    const ride = await this.rideRepository.getById(id);
    if (!ride) throw new Error("Ride not found");
    ride.register(RideCompletedEvent.name, async (event) => {
      await this.rideRepository.update(ride);
      this.queue.publish(RideCompletedEvent.name, event);
    });
    ride.finish();
  }
}
