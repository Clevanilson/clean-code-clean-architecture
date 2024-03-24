import { AccountDAODatabase } from "./AccountDAODatabase";

export class GetAccountById {
  constructor(private readonly accountDAO: AccountDAODatabase) {}

  async execute(accountId: string): Promise<any> {
    return this.accountDAO.getById(accountId);
  }
}
