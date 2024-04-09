import { RideStartedEvent } from "@/domain/events/RideStarted";
import { Queue } from "@/infra/queue/Queue";
import { RideRepository } from "@/infra/repositories/RideRepository";

export class StartRide {
  constructor(
    private readonly rideRepository: RideRepository,
    private readonly queue: Queue
  ) {}

  async execute(rideId: string): Promise<void> {
    const ride = await this.rideRepository.getById(rideId);
    if (!ride) throw new Error("Ride not found");
    ride.register(RideStartedEvent.name, (event) => {
      this.queue.publish(RideStartedEvent.name, event);
    });
    ride.start();
    await this.rideRepository.update(ride);
  }
}
