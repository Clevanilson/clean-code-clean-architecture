import dotenv from "dotenv";
import { Client } from "pg";
import { DatabaseConnection } from "./DatabaseConnection";

dotenv.config({ path: ".env.development" });

export class PGAdapter implements DatabaseConnection {
  async query<T = any>(
    statement: string,
    params?: unknown[] | undefined
  ): Promise<T | undefined> {
    const client = new Client({
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      port: Number(process.env.POSTGRES_PORT)
    });

    try {
      await client.connect();
      const result = await client.query(statement, params);
      return result?.rows as T;
    } catch (error) {
      console.error(error);
    } finally {
      await client.end();
    }
  }
}
