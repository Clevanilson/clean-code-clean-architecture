import { Account } from "@/domain/Account";
import { AccountRepository } from "@/infra/repositories/AccountRepository";

export class Signup {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(input: any): Promise<Output> {
    const existingAccount = await this.accountRepository.getByEmail(
      input.email
    );
    if (existingAccount) throw new Error("Account already exists");
    const account = Account.create(
      input.name,
      input.email,
      input.cpf,
      !!input.isPassenger,
      !!input.isDriver,
      input.carPlate
    );
    await this.accountRepository.save(account);
    return { accountId: account.accountId };
  }
}

type Output = {
  accountId: string;
};
