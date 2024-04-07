import { ExpressAdapter } from "@/infra/http/ExpressAdapter";
import { GetRide } from "@/application/usecases/GetRide";
import { PGAdapter } from "@/infra/database/PGAdapter";
import { RequestRide } from "@/application/usecases/RequestRide";
import { RideController } from "@/infra/http/RideController";
import { RideRepositoryDatebase } from "@/infra/repositories/RideRepositoryDatebase";
import { Registry } from "./infra/di/Registry";
import { AccountGatewayHttp } from "./infra/gateways/AccountGatewayHttp";
import { AxiosAdapter } from "./infra/http/AxiosAdapter";
import { RabbitMQAdapter } from "./infra/queue/RabbitMQAdapter";
import { ProcessPayment } from "./application/usecases/ProcessPayment";
import { QueueController } from "./infra/queue/QueueController";

async function main(): Promise<void> {
  const registry = Registry.getInstance();
  const httpServer = new ExpressAdapter();
  const connection = new PGAdapter();
  const httpClient = new AxiosAdapter();
  const accountGateway = new AccountGatewayHttp(httpClient);
  const rideRepository = new RideRepositoryDatebase(connection);
  const requestRide = new RequestRide(rideRepository, accountGateway);
  const getRide = new GetRide(rideRepository);
  const processPayment = new ProcessPayment();
  const queue = new RabbitMQAdapter();
  await queue.connect();
  registry.register("queue", queue);
  registry.register("processPayment", processPayment);
  registry.register("requestRide", requestRide);
  registry.register("getRide", getRide);
  new RideController(httpServer);
  new QueueController();
  httpServer.listen(3001);
}

main();
