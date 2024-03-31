import { AccountController } from "@/infra/http/AccountController";
import { AccountRepositoryDatabase } from "@/infra/repositories/AccountRepositoryDatabase";
import { ExpressAdapter } from "@/infra/http/ExpressAdapter";
import { GetAccountById } from "@/application/usecases/GetAccount";
import { PGAdapter } from "@/infra/database/PGAdapter";
import { Signup } from "@/application/usecases/Signup";
import { Registry } from "@/infra/di/Registry";

const registry = Registry.getInstance();
const httpServer = new ExpressAdapter();
const connection = new PGAdapter();
const accountRepository = new AccountRepositoryDatabase(connection);
const signup = new Signup(accountRepository);
const getAccountById = new GetAccountById(accountRepository);
registry.register("signup", signup);
registry.register("getAccountById", getAccountById);
new AccountController(httpServer);
httpServer.listen(3000);
