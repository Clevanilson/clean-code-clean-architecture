import { AccountDAODatabase } from "./AccountDAODatabase";

export async function getAccount(accountId: string): Promise<any> {
  const accountDAO = new AccountDAODatabase();
  return accountDAO.getById(accountId);
}
