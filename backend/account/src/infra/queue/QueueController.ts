import { Queue } from "@/infra/queue/Queue";
import { inject } from "@/infra/di/Registry";
import { Signup } from "@/application/usecases/Signup";

export class QueueController {
  @inject("signup") signup?: Signup;

  constructor(queue: Queue) {
    queue.consume("signup", async (input: any) => {
      await this.signup?.execute(input);
    });
  }
}
