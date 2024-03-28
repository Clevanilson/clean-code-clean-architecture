import { AccountRepository } from "./AccountRepository";
import { Account } from "./Account";
import { DatabaseConnection } from "./DatabaseConnection";

export class AccountRepositoryDatabase implements AccountRepository {
  constructor(private readonly connection: DatabaseConnection) {}

  async save(account: Account): Promise<void> {
    const SQL = `
      INSERT INTO cccat15.account 
      (account_id, name, email, cpf, car_plate, is_passenger, is_driver)
      VALUES
      ($1, $2, $3, $4, $5, $6, $7);
    `;
    await this.connection.query(SQL, [
      account.accountId,
      account.name,
      account.email,
      account.cpf,
      account.carPlate,
      account.isPassenger,
      account.isDriver
    ]);
    return;
  }

  async getByEmail(email: string): Promise<Account | undefined> {
    const SQL = "SELECT * FROM cccat15.account WHERE email = $1;";
    const result = await this.connection.query(SQL, [email]);
    const account = result?.[0];
    if (!account) return;
    return Account.restore(
      account.account_id,
      account.name,
      account.email,
      account.cpf,
      account.is_passenger,
      account.is_driver,
      account.car_plate
    );
  }

  async getById(id: string): Promise<Account | undefined> {
    const SQL = "SELECT * FROM cccat15.account WHERE account_id = $1;";
    const result = await this.connection.query(SQL, [id]);
    const account = result?.[0];
    if (!account) return;
    return Account.restore(
      account.account_id,
      account.name,
      account.email,
      account.cpf,
      account.is_passenger,
      account.is_driver,
      account.car_plate
    );
  }
}
