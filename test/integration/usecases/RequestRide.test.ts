import { GetRide } from "@/application/usecases/GetRide";
import { RequestRide } from "@/application/usecases/RequestRide";
import { Signup } from "@/application/usecases/Signup";
import { PGAdapter } from "@/infra/database/PGAdapter";
import { AccountRepositoryDatabase } from "@/infra/repositories/AccountRepositoryDatabase";
import { RideRepositoryDatebase } from "@/infra/repositories/RideRepositoryDatebase";

test("Should request a ride", async () => {
  const { getRide, signup, sut } = setup();
  const inputSignup = {
    name: "Passenger Doe",
    email: `john.passenger${Math.random()}@mail.com`,
    cpf: "11144466610",
    isPassenger: true
  };
  const outputSignup = await signup.execute(inputSignup);
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476
  };
  const outputRequestRide = await sut.execute(inputRequestRide);
  expect(outputRequestRide.rideId).toEqual(expect.any(String));
  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetRide?.rideId).toBe(outputRequestRide.rideId);
  expect(outputGetRide?.passengerId).toBe(outputSignup.accountId);
  expect(outputGetRide?.fromLat).toBe(inputRequestRide.fromLat);
  expect(outputGetRide?.fromLong).toBe(inputRequestRide.fromLong);
  expect(outputGetRide?.toLat).toBe(inputRequestRide.toLat);
  expect(outputGetRide?.toLong).toBe(inputRequestRide.toLong);
  expect(outputGetRide?.status).toBe("requested");
});

function setup() {
  const connection = new PGAdapter();
  const accountRepository = new AccountRepositoryDatabase(connection);
  const rideRepository = new RideRepositoryDatebase(connection);
  const signup = new Signup(accountRepository);
  const getRide = new GetRide(rideRepository);
  const sut = new RequestRide(rideRepository, accountRepository);
  return { signup, getRide, sut };
}
