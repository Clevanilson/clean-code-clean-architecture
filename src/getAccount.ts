import { AccountDAO } from "./AccountDAO";

export async function getAccount(accountId: string): Promise<any> {
  const accountDAO = new AccountDAO();
  return accountDAO.getById(accountId);
}
