import { Client } from "pg";
import dotenv from "dotenv";
import crypto from "crypto";
import { AccountDAO } from "./AccountDAO";

dotenv.config({ path: ".env.development" });

export async function query(text: string, values?: string[]) {
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

export class AccountDAODatabase implements AccountDAO {
  async save(account: any) {
    const accountId = crypto.randomUUID();
    const SQL = `
      INSERT INTO cccat15.account 
      (account_id, name, email, cpf, car_plate, is_passenger, is_driver)
      VALUES
      ($1, $2, $3, $4, $5, $6, $7);
    `;
    await query(SQL, [
      accountId,
      account.name,
      account.email,
      account.cpf,
      account.carPlate,
      !!account.isPassenger,
      !!account.isDriver
    ]);
    return { accountId };
  }

  async getByEmail(email: string) {
    const SQL = "SELECT * FROM cccat15.account WHERE email = $1;";
    const result = await query(SQL, [email]);
    return result?.rows[0];
  }

  async getById(id: string) {
    const SQL = "SELECT * FROM cccat15.account WHERE account_id = $1;";
    const result = await query(SQL, [id]);
    return result?.rows[0];
  }
}
