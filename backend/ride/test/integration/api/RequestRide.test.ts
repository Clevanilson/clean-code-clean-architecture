import { AccountGatewayHttp } from "@/infra/gateways/AccountGatewayHttp";
import { AxiosAdapter } from "@/infra/http/AxiosAdapter";
import axios from "axios";

axios.defaults.validateStatus = () => true;

test("Should request a ride", async () => {
  const { accountGateway } = setup();
  const inputSignup = {
    name: "Passenger Doe",
    email: `john.passenger${Math.random()}@mail.com`,
    cpf: "11144466610",
    isPassenger: true
  };
  const outputSignup = await accountGateway.signup(inputSignup);
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476
  };
  const responseRequestRide = await axios.post(
    "http://localhost:3001/rides/request",
    inputRequestRide
  );
  expect(responseRequestRide.data.rideId).toEqual(expect.any(String));
  const responseGetRide = await axios.get(
    `http://localhost:3001/rides/${responseRequestRide.data.rideId}`
  );
  expect(responseGetRide.data.rideId).toBe(responseRequestRide.data.rideId);
  expect(responseGetRide.data.passengerId).toBe(outputSignup.accountId);
  expect(responseGetRide.data.fromLat).toBe(inputRequestRide.fromLat);
  expect(responseGetRide.data.fromLong).toBe(inputRequestRide.fromLong);
  expect(responseGetRide.data.toLat).toBe(inputRequestRide.toLat);
  expect(responseGetRide.data.toLong).toBe(inputRequestRide.toLong);
  expect(responseGetRide.data.status).toBe("requested");
});

test("Should not request a ride if user is not a passenger", async () => {
  const { accountGateway } = setup();
  const inputSignup = {
    name: "Passenger Doe",
    email: `john.passenger${Math.random()}@mail.com`,
    cpf: "11144466610",
    isDriver: true,
    carPlate: "AAA9999"
  };
  const outputSignup = await accountGateway.signup(inputSignup);
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476
  };
  const responseRequestRide = await axios.post(
    "http://localhost:3001/rides/request",
    inputRequestRide
  );
  expect(responseRequestRide.status).toEqual(422);
  expect(responseRequestRide.data.message).toEqual("User must be a passenger");
});

test("Should not request a ride if user has an active ride", async () => {
  const { accountGateway } = setup();
  const inputSignup = {
    name: "Passenger Doe",
    email: `john.passenger${Math.random()}@mail.com`,
    cpf: "11144466610",
    isPassenger: true
  };
  const outputSignup = await accountGateway.signup(inputSignup);
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476
  };
  await axios.post("http://localhost:3001/rides/request", inputRequestRide);
  const responseRequestRide = await axios.post(
    "http://localhost:3001/rides/request",
    inputRequestRide
  );
  expect(responseRequestRide.status).toEqual(422);
  expect(responseRequestRide.data.message).toEqual("User has an active ride");
});

function setup() {
  const httpClient = new AxiosAdapter();
  const accountGateway = new AccountGatewayHttp(httpClient);
  return { accountGateway };
}
