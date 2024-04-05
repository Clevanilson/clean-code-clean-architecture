import { AccountController } from "@/infra/http/AccountController";
import { AccountRepositoryDatabase } from "@/infra/repositories/AccountRepositoryDatabase";
import { ExpressAdapter } from "@/infra/http/ExpressAdapter";
import { GetAccountById } from "@/application/usecases/GetAccount";
import { PGAdapter } from "@/infra/database/PGAdapter";
import { Signup } from "@/application/usecases/Signup";
import { Registry } from "@/infra/di/Registry";
import { RabbitMQAdapter } from "./infra/queue/RabbitMQAdapter";
import { QueueController } from "./infra/queue/QueueController";

async function main(): Promise<void> {
  const registry = Registry.getInstance();
  const httpServer = new ExpressAdapter();
  const connection = new PGAdapter();
  const accountRepository = new AccountRepositoryDatabase(connection);
  const signup = new Signup(accountRepository);
  const getAccountById = new GetAccountById(accountRepository);
  const queue = new RabbitMQAdapter();
  await queue.connect();
  registry.register("queue", queue);
  registry.register("signup", signup);
  registry.register("getAccountById", getAccountById);
  new AccountController(httpServer);
  new QueueController(queue);
  httpServer.listen(3000);
}
main();
