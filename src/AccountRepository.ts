import { Account } from "./Account";

export interface AccountRepository {
  save(account: Account): Promise<void>;
  getByEmail(email: string): Promise<Account | undefined>;
  getById(id: string): Promise<Account | undefined>;
}
