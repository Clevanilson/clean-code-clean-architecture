import { AcceptRide } from "@/application/usecases/AcceptRide";
import { GetPositions } from "@/application/usecases/GetPositions";
import { GetRide } from "@/application/usecases/GetRide";
import { RequestRide } from "@/application/usecases/RequestRide";
import { Signup } from "@/application/usecases/Signup";
import { StartRide } from "@/application/usecases/StartRide";
import { UpdatePosition } from "@/application/usecases/UpdatePosision";
import { PGAdapter } from "@/infra/database/PGAdapter";
import { AccountRepositoryDatabase } from "@/infra/repositories/AccountRepositoryDatabase";
import { PositionRepositoryDatabase } from "@/infra/repositories/PositionRepositoryDatabase";
import { RideRepositoryDatebase } from "@/infra/repositories/RideRepositoryDatebase";

test("Should update position", async () => {
  const {
    getRide,
    signup,
    requestRide,
    sut,
    acceptRide,
    startRide,
    getPositions
  } = setup();
  const { accountId: passengerId } = await signup.execute({
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
  const { accountId: driverId } = await signup.execute({
    name: "Driver Doe",
    email: `john.driver${Math.random()}@mail.com`,
    cpf: "11144477735",
    isDriver: true,
    carPlate: "AAA9999"
  });
  await acceptRide.execute({ rideId, driverId });
  await startRide.execute(rideId);
  const inputUpdatePosition = {
    rideId,
    lat: -27.496887588317275,
    long: -48.522234807851476
  };
  await sut.execute(inputUpdatePosition);
  const outputGetRide = await getRide.execute(rideId);
  expect(outputGetRide?.distance).toBe(10);
  expect(outputGetRide?.lastLat).toBe(-27.496887588317275);
  expect(outputGetRide?.lastLong).toBe(-48.522234807851476);
  const outputGetPositions = await getPositions.execute(rideId);
  expect(outputGetPositions[0]?.positionId).toEqual(expect.any(String));
  expect(outputGetPositions[0]?.lat).toBe(inputUpdatePosition.lat);
  expect(outputGetPositions[0]?.long).toBe(inputUpdatePosition.long);
  expect(outputGetPositions[0]?.rideId).toBe(inputUpdatePosition.rideId);
});

function setup() {
  const connection = new PGAdapter();
  const accountRepository = new AccountRepositoryDatabase(connection);
  const rideRepository = new RideRepositoryDatebase(connection);
  const signup = new Signup(accountRepository);
  const getRide = new GetRide(rideRepository);
  const requestRide = new RequestRide(rideRepository, accountRepository);
  const acceptRide = new AcceptRide(rideRepository, accountRepository);
  const startRide = new StartRide(rideRepository);
  const positionRepository = new PositionRepositoryDatabase(connection);
  const getPositions = new GetPositions(positionRepository);
  const sut = new UpdatePosition(rideRepository, positionRepository);
  return {
    signup,
    getRide,
    requestRide,
    acceptRide,
    startRide,
    getPositions,
    sut
  };
}
