import { query } from "./signup";

export async function getAccount(accountId: string): Promise<any> {
  const SQL = "SELECT * FROM cccat15.account WHERE account_id = $1";
  const account = (await query(SQL, [accountId]))?.rows[0];
  return account;
}
