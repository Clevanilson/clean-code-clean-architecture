import { AccountRepositoryDatabase } from "../src/AccountRepositoryDatabase";
import { GetAccountById } from "../src/application/usecases/GetAccount";
import { PGAdapter } from "../src/PGAdapter";
import { Signup } from "../src/application/usecases/Signup";

test("Should create a new account for a passenger", async () => {
  const input = {
    name: "Passenger Doe",
    email: `john.passenger${Math.random()}@mail.com`,
    cpf: "11144466610",
    isPassenger: true
  };
  const { sut, getAccountById } = setup();
  const outputSignup = await sut.execute(input);
  expect(outputSignup.accountId).toEqual(expect.any(String));
  const outputGetAccount = await getAccountById.execute(outputSignup.accountId);
  expect(outputGetAccount?.name).toEqual(input.name);
  expect(outputGetAccount?.email).toEqual(input.email);
  expect(outputGetAccount?.cpf).toEqual(input.cpf);
  expect(outputGetAccount?.isPassenger).toEqual(input.isPassenger);
});

test("Should create a new account for a driver", async () => {
  const input = {
    name: "Driver Doe",
    email: `john.driver${Math.random()}@mail.com`,
    cpf: "11144477735",
    isDriver: true,
    carPlate: "AAA3333"
  };
  const { sut, getAccountById } = setup();
  const outputSignup = await sut.execute(input);
  expect(outputSignup.accountId).toEqual(expect.any(String));
  const outputGetAccount = await getAccountById.execute(outputSignup.accountId);
  expect(outputGetAccount?.name).toEqual(input.name);
  expect(outputGetAccount?.email).toEqual(input.email);
  expect(outputGetAccount?.cpf).toEqual(input.cpf);
  expect(outputGetAccount?.isDriver).toEqual(input.isDriver);
  expect(outputGetAccount?.carPlate).toEqual(input.carPlate);
});

test("Should not create an account with invalid name", async () => {
  const input = {
    name: "Doe",
    email: `john.passenger${Math.random()}@mail.com`,
    cpf: "11144466610",
    isPassenger: true
  };
  const { sut } = setup();
  await expect(() => sut.execute(input)).rejects.toThrow("Invalid name");
});

test("Should not create an account with invalid email", async () => {
  const input = {
    name: "John Doe",
    email: `john.passenger${Math.random()}`,
    cpf: "11144466610",
    isPassenger: true
  };
  const { sut } = setup();
  await expect(() => sut.execute(input)).rejects.toThrow("Invalid email");
});

test("Should not create an account with invalid CPF", async () => {
  const input = {
    name: "John Doe",
    email: `john.passenger${Math.random()}@mail.com`,
    cpf: "111444666",
    isPassenger: true
  };
  const { sut } = setup();
  await expect(() => sut.execute(input)).rejects.toThrow("Invalid CPF");
});

test("Should not create an account if account already exists", async () => {
  const input = {
    name: "John Doe",
    email: `john.passenger${Math.random()}@mail.com`,
    cpf: "11144466610",
    isPassenger: true
  };
  const { sut } = setup();
  await sut.execute(input);
  await expect(() => sut.execute(input)).rejects.toThrow(
    "Account already exists"
  );
});

test("Should not create an driver account with invalid car plate", async () => {
  const input = {
    name: "John Doe",
    email: `john.passenger${Math.random()}@mail.com`,
    cpf: "11144466610",
    isDriver: true,
    carPlate: ""
  };
  const { sut } = setup();
  await expect(() => sut.execute(input)).rejects.toThrow("Invalid car plate");
});

function setup() {
  const connection = new PGAdapter();
  const accountRepository = new AccountRepositoryDatabase(connection);
  const getAccountById = new GetAccountById(accountRepository);
  const sut = new Signup(accountRepository);
  return { sut, getAccountById };
}
