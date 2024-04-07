import { ProcessPayment } from "@/application/usecases/ProcessPayment";
import { inject } from "../di/Registry";
import { Queue } from "./Queue";
import { RideCompletedEvent } from "@/domain/events/RideCompleted";

export class QueueController {
  @inject("processPayment") readonly processPayment?: ProcessPayment;
  @inject("queue") readonly queue?: Queue;

  constructor() {
    this.queue?.consume(RideCompletedEvent.name, async (data: any) => {
      await this.processPayment?.execute(data);
    });
  }
}
