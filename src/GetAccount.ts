import { Account } from "./Account";
import { AccountRepository } from "./AccountRepository";

export class GetAccountById {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(accountId: string): Promise<Account | undefined> {
    return this.accountRepository.getById(accountId);
  }
}
