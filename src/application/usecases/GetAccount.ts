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
      cpf: account.getCPf(),
      carPlate: account.getCarPlate(),
      isDriver: account.isDriver,
      isPassenger: account.isPassenger
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
