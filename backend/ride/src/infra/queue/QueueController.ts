import { ProcessPayment } from "@/application/usecases/ProcessPayment";
import { inject } from "../di/Registry";
import { Queue } from "./Queue";
import { RideCompletedEvent } from "@/domain/events/RideCompleted";
import { UpdateRideProjectionHandler } from "@/application/handler/UpdateRideProjectionHandler";
import { RideStartedEvent } from "@/domain/events/RideStarted";

export class QueueController {
  @inject("processPayment") readonly processPayment?: ProcessPayment;
  @inject("queue") readonly queue?: Queue;
  @inject("updateRideProjectionHandler")
  updateRideProjectionHandler?: UpdateRideProjectionHandler;

  constructor() {
    this.queue?.consume(RideCompletedEvent.name, async (data: any) => {
      await this.processPayment?.execute(data);
    });
    this.queue?.consume(RideStartedEvent.eventName, async (data: any) => {
      await this.updateRideProjectionHandler?.execute(data.rideId);
    });
  }
}
