import { Account } from "@/domain/Account";
import { AccountRepository } from "@/infra/repositories/AccountRepository";

export class GetAccountById {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(accountId: string): Promise<Account | undefined> {
    return this.accountRepository.getById(accountId);
  }
}
