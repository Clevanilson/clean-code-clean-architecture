import axios from "axios";

axios.defaults.validateStatus = () => true;

test("Should create a new account for a passenger", async () => {
  const input = {
    name: "Passenger Doe",
    email: `john.passenger${Math.random()}@mail.com`,
    cpf: "11144466610",
    isPassenger: true
  };
  const endpoint = "http://localhost:3000";
  const responseSignup = await axios.post(`${endpoint}/signup`, input);
  expect(responseSignup.data.accountId).toEqual(expect.any(String));
  const responseGetAccount = await axios.get(
    `${endpoint}/accounts/${responseSignup.data.accountId}`
  );
  expect(responseGetAccount.data.name).toEqual(input.name);
  expect(responseGetAccount.data.email).toEqual(input.email);
  expect(responseGetAccount.data.cpf).toEqual(input.cpf);
  expect(responseGetAccount.data.is_passenger).toEqual(input.isPassenger);
});

test("Should request a ride", async () => {
  const inputSignup = {
    name: "Passenger Doe",
    email: `john.passenger${Math.random()}@mail.com`,
    cpf: "11144466610",
    isPassenger: true
  };
  const responseSignup = await axios.post(
    "http://localhost:3000/signup",
    inputSignup
  );
  const inputRequestRide = {
    passengerId: responseSignup.data.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476
  };
  const responseRequestRide = await axios.post(
    "http://localhost:3000/rides/request",
    inputRequestRide
  );
  expect(responseRequestRide.data.rideId).toEqual(expect.any(String));
  const responseGetRide = await axios.get(
    `http://localhost:3000/rides/${responseRequestRide.data.rideId}`
  );
  expect(responseGetRide.data.ride_id).toBe(responseRequestRide.data.rideId);
  expect(responseGetRide.data.passenger_id).toBe(responseSignup.data.accountId);
  expect(responseGetRide.data.from_lat).toBe(
    inputRequestRide.fromLat.toString()
  );
  expect(responseGetRide.data.from_long).toBe(
    inputRequestRide.fromLong.toString()
  );
  expect(responseGetRide.data.to_lat).toBe(inputRequestRide.toLat.toString());
  expect(responseGetRide.data.to_long).toBe(inputRequestRide.toLong.toString());
  expect(responseGetRide.data.status).toBe("requested");
});

test("Should not request a ride if user is not a passenger", async () => {
  const inputSignup = {
    name: "Passenger Doe",
    email: `john.passenger${Math.random()}@mail.com`,
    cpf: "11144466610",
    isDriver: true,
    carPlate: "AAA9999"
  };
  const responseSignup = await axios.post(
    "http://localhost:3000/signup",
    inputSignup
  );
  const inputRequestRide = {
    passengerId: responseSignup.data.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476
  };
  const responseRequestRide = await axios.post(
    "http://localhost:3000/rides/request",
    inputRequestRide
  );
  expect(responseRequestRide.status).toEqual(422);
  expect(responseRequestRide.data.message).toEqual("User must be a passenger");
});

test("Should not request a ride if user has an active ride", async () => {
  const inputSignup = {
    name: "Passenger Doe",
    email: `john.passenger${Math.random()}@mail.com`,
    cpf: "11144466610",
    isPassenger: true
  };
  const responseSignup = await axios.post(
    "http://localhost:3000/signup",
    inputSignup
  );
  const inputRequestRide = {
    passengerId: responseSignup.data.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476
  };
  await axios.post("http://localhost:3000/rides/request", inputRequestRide);
  const responseRequestRide = await axios.post(
    "http://localhost:3000/rides/request",
    inputRequestRide
  );
  expect(responseRequestRide.status).toEqual(422);
  expect(responseRequestRide.data.message).toEqual("User has an active ride");
});
