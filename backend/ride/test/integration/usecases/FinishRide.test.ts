import { AcceptRide } from "@/application/usecases/AcceptRide";
import { FinishRide } from "@/application/usecases/FinishRide";
import { GetRide } from "@/application/usecases/GetRide";
import { RequestRide } from "@/application/usecases/RequestRide";
import { StartRide } from "@/application/usecases/StartRide";
import { UpdatePosition } from "@/application/usecases/UpdatePosision";
import { PGAdapter } from "@/infra/database/PGAdapter";
import { AccountGatewayHttp } from "@/infra/gateways/AccountGatewayHttp";
import { AxiosAdapter } from "@/infra/http/AxiosAdapter";
import { Mediator } from "@/infra/mediator/Mediator";
import { RabbitMQAdapter } from "@/infra/queue/RabbitMQAdapter";
import { PositionRepositoryDatabase } from "@/infra/repositories/PositionRepositoryDatabase";
import { RideRepositoryDatebase } from "@/infra/repositories/RideRepositoryDatebase";

test("Should finish a ride", async () => {
  const { getRide, rideId, sut } = await setup();
  await sut.execute(rideId);
  const outputGetRide = await getRide.execute(rideId);
  expect(outputGetRide?.status).toBe("completed");
  expect(outputGetRide?.fare).toBe(21);
});

test("Should finish a ride over night", async () => {
  jest.useFakeTimers().setSystemTime(new Date("2024-01-01T23:00:00-03:00"));
  const { getRide, rideId, sut } = await setup();
  await sut.execute(rideId);
  const outputGetRide = await getRide.execute(rideId);
  expect(outputGetRide?.status).toBe("completed");
  expect(outputGetRide?.fare).toBe(39);
});

async function setup() {
  const connection = new PGAdapter();
  const rideRepository = new RideRepositoryDatebase(connection);
  const positionRepository = new PositionRepositoryDatabase(connection);
  const httpClient = new AxiosAdapter();
  const accountGateway = new AccountGatewayHttp(httpClient);
  const mediator = new Mediator();
  const queue = new RabbitMQAdapter();
  await queue.connect();
  const { accountId: passengerId } = await accountGateway.signup({
    name: "Passenger Doe",
    email: `john.passenger${Math.random()}@mail.com`,
    cpf: "11144466610",
    isPassenger: true
  });
  const { rideId } = await new RequestRide(
    rideRepository,
    accountGateway
  ).execute({
    passengerId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476
  });
  const { accountId: driverId } = await accountGateway.signup({
    name: "Driver Doe",
    email: `john.driver${Math.random()}@mail.com`,
    cpf: "11144477735",
    isDriver: true,
    carPlate: "AAA9999"
  });
  await new AcceptRide(rideRepository).execute({ rideId, driverId });

  await new StartRide(rideRepository, queue).execute(rideId);
  await new UpdatePosition(rideRepository, positionRepository).execute({
    lat: -27.496887588317275,
    long: -48.522234807851476,
    rideId
  });
  const getRide = new GetRide(rideRepository);

  const sut = new FinishRide(rideRepository, queue);
  return {
    rideId,
    getRide,
    mediator,
    sut
  };
}
