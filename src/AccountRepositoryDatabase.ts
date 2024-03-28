import { Client } from "pg";
import dotenv from "dotenv";
import crypto from "crypto";
import { AccountRepository } from "./AccountRepository";
import { Account } from "./Account";

dotenv.config({ path: ".env.development" });

export async function query(text: string, values?: unknown[]) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    port: Number(process.env.POSTGRES_PORT)
  });

  try {
    await client.connect();
    const result = await client.query(text, values);
    return result;
  } catch (error) {
    console.error(error);
  } finally {
    await client.end();
  }
}

export class AccountRepositoryDatabase implements AccountRepository {
  async save(account: Account): Promise<void> {
    const SQL = `
      INSERT INTO cccat15.account 
      (account_id, name, email, cpf, car_plate, is_passenger, is_driver)
      VALUES
      ($1, $2, $3, $4, $5, $6, $7);
    `;
    await query(SQL, [
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
    const result = await query(SQL, [email]);
    const account = result?.rows[0];
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
    const result = await query(SQL, [id]);
    const account = result?.rows[0];
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
