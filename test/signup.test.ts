import { getAccount } from "../src/getAccount";
import { signup } from "../src/signup";

test("Should create a new account for a passenger", async () => {
  const input = {
    name: "Passenger Doe",
    email: `john.passenger${Math.random()}@mail.com`,
    cpf: "11144466610",
    isPassenger: true
  };
  const outputSignup = await signup(input);
  expect(outputSignup.accountId).toEqual(expect.any(String));
  const outputGetAccount = await getAccount(outputSignup.accountId);
  expect(outputGetAccount.name).toEqual(input.name);
  expect(outputGetAccount.email).toEqual(input.email);
  expect(outputGetAccount.cpf).toEqual(input.cpf);
  expect(outputGetAccount.is_passenger).toEqual(input.isPassenger);
});

test("Should create a new account for a driver", async () => {
  const input = {
    name: "Driver Doe",
    email: `john.driver${Math.random()}@mail.com`,
    cpf: "11144477735",
    isDriver: true,
    carPlate: "AAA3333"
  };
  const outputSignup = await signup(input);
  expect(outputSignup.accountId).toEqual(expect.any(String));
  const outputGetAccount = await getAccount(outputSignup.accountId);
  expect(outputGetAccount.name).toEqual(input.name);
  expect(outputGetAccount.email).toEqual(input.email);
  expect(outputGetAccount.cpf).toEqual(input.cpf);
  expect(outputGetAccount.is_driver).toEqual(input.isDriver);
  expect(outputGetAccount.car_plate).toEqual(input.carPlate);
});

test("Should not create an account with invalid name", async () => {
  const input = {
    name: "Doe",
    email: `john.passenger${Math.random()}@mail.com`,
    cpf: "11144466610",
    isPassenger: true
  };
  await expect(() => signup(input)).rejects.toThrow("Invalid name");
});

test("Should not create an account with invalid email", async () => {
  const input = {
    name: "John Doe",
    email: `john.passenger${Math.random()}`,
    cpf: "11144466610",
    isPassenger: true
  };
  await expect(() => signup(input)).rejects.toThrow("Invalid email");
});

test("Should not create an account with invalid CPF", async () => {
  const input = {
    name: "John Doe",
    email: `john.passenger${Math.random()}@mail.com`,
    cpf: "111444666",
    isPassenger: true
  };
  await expect(() => signup(input)).rejects.toThrow("Invalid CPF");
});

test("Should not create an account if account already exists", async () => {
  const input = {
    name: "John Doe",
    email: `john.passenger${Math.random()}@mail.com`,
    cpf: "11144466610",
    isPassenger: true
  };
  await signup(input);
  await expect(() => signup(input)).rejects.toThrow("Account already exists");
});

test("Should not create an driver account with invalid car plate", async () => {
  const input = {
    name: "John Doe",
    email: `john.passenger${Math.random()}@mail.com`,
    cpf: "11144466610",
    isDriver: true,
    carPlate: ""
  };
  await expect(() => signup(input)).rejects.toThrow("Invalid car plate");
});
