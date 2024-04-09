import { UpdateRideProjectionHandler } from "@/application/handler/UpdateRideProjectionHandler";
import { GetRideProjectionQuery } from "@/application/query/GetRideQuery";
import { AcceptRide } from "@/application/usecases/AcceptRide";
import { GetRide } from "@/application/usecases/GetRide";
import { RequestRide } from "@/application/usecases/RequestRide";
import { StartRide } from "@/application/usecases/StartRide";
import { PGAdapter } from "@/infra/database/PGAdapter";
import { AccountGatewayHttp } from "@/infra/gateways/AccountGatewayHttp";
import { AxiosAdapter } from "@/infra/http/AxiosAdapter";
import { RabbitMQAdapter } from "@/infra/queue/RabbitMQAdapter";
import { RideRepositoryDatebase } from "@/infra/repositories/RideRepositoryDatebase";

test("Should start a ride", async () => {
  const {
    getRide,
    accountGateway,
    requestRide,
    sut,
    acceptRide,
    updateRideProjectionHandler
  } = setup();
  const { accountId: passengerId } = await accountGateway.signup({
    name: "Passenger Doe",
    email: `john.passenger${Math.random()}@mail.com`,
    cpf: "11144466610",
    isPassenger: true
  });
  const inputRequestRide = {
    passengerId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476
  };
  const { rideId } = await requestRide.execute(inputRequestRide);
  const { accountId: driverId } = await accountGateway.signup({
    name: "Driver Doe",
    email: `john.driver${Math.random()}@mail.com`,
    cpf: "11144477735",
    isDriver: true,
    carPlate: "AAA9999"
  });
  await acceptRide.execute({ rideId, driverId });
  await sut.execute(rideId);
  await updateRideProjectionHandler.execute(rideId);
  const outputGetRide = await getRide.execute(rideId);
  expect(outputGetRide?.status).toBe("in_progress");
});

function setup() {
  const connection = new PGAdapter();
  const httpClient = new AxiosAdapter();
  const accountGateway = new AccountGatewayHttp(httpClient);
  const rideRepository = new RideRepositoryDatebase(connection);
  const getRide = new GetRideProjectionQuery(connection);
  const requestRide = new RequestRide(rideRepository, accountGateway);
  const acceptRide = new AcceptRide(rideRepository);
  const updateRideProjectionHandler = new UpdateRideProjectionHandler(
    connection
  );
  const queue = new RabbitMQAdapter();
  queue.connect();
  const sut = new StartRide(rideRepository, queue);
  return {
    accountGateway,
    getRide,
    requestRide,
    acceptRide,
    sut,
    updateRideProjectionHandler
  };
}
