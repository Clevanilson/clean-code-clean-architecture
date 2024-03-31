import { ExpressAdapter } from "@/infra/http/ExpressAdapter";
import { GetRide } from "@/application/usecases/GetRide";
import { PGAdapter } from "@/infra/database/PGAdapter";
import { RequestRide } from "@/application/usecases/RequestRide";
import { RideController } from "@/infra/http/RideController";
import { RideRepositoryDatebase } from "@/infra/repositories/RideRepositoryDatebase";
import { Registry } from "./infra/di/Registry";
import { AccountGatewayHttp } from "./infra/gateways/AccountGatewayHttp";

const registry = Registry.getInstance();
const httpServer = new ExpressAdapter();
const connection = new PGAdapter();
const accountGateway = new AccountGatewayHttp();
const rideRepository = new RideRepositoryDatebase(connection);
const requestRide = new RequestRide(rideRepository, accountGateway);
const getRide = new GetRide(rideRepository);
registry.register("requestRide", requestRide);
registry.register("getRide", getRide);
new RideController(httpServer);
httpServer.listen(3001);
