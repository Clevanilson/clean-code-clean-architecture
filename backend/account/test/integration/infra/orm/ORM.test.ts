import { PGAdapter } from "@/infra/database/PGAdapter";
import { AccountModel } from "@/infra/orm/AccountModel";
import { ORM } from "@/infra/orm/ORM";
import crypto from "crypto";

test("Should test ORM", async () => {
  const { sut } = setup();
  const accountId = crypto.randomUUID();
  const accountModel = new AccountModel(
    accountId,
    "John Doe",
    `john.${Math.random()}@mail.com`,
    "11144466610",
    true,
    false,
    ""
  );
  await sut.save(accountModel);
  const savedAccountModel: AccountModel = await sut.findBy(
    AccountModel,
    "account_id",
    accountId
  );
  expect(savedAccountModel?.[0]?.accountId).toBe(accountModel.accountId);
  expect(savedAccountModel?.[0]?.carPlate).toBe(accountModel.carPlate);
  expect(savedAccountModel?.[0]?.cpf).toBe(accountModel.cpf);
  expect(savedAccountModel?.[0]?.email).toBe(accountModel.email);
  expect(savedAccountModel?.[0]?.isDriver).toBe(accountModel.isDriver);
  expect(savedAccountModel?.[0]?.isPassenger).toBe(accountModel.isPassenger);
  expect(savedAccountModel?.[0]?.name).toBe(accountModel.name);
});

function setup() {
  const connection = new PGAdapter();
  const sut = new ORM(connection);
  return { sut };
}
