import axios from "axios";

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
