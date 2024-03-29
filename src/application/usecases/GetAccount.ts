import { Account } from "@/domain/Account";
import { AccountRepository } from "@/infra/repositories/AccountRepository";

export class GetAccountById {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(accountId: string): Promise<Output | undefined> {
    const account = await this.accountRepository.getById(accountId);
    if (!account) return;
    return {
      name: account.getName(),
      email: account.getEmail(),
      cpf: account.cpf,
      isDriver: account.isDriver,
      isPassenger: account.isPassenger,
      carPlate: account.carPlate
    };
  }
}

type Output = {
  name: string;
  email: string;
  cpf: string;
  isDriver: boolean;
  isPassenger: boolean;
  carPlate?: string;
};
