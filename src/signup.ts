import dotenv from "dotenv";
import { Client } from "pg";
import { validateCpf } from "./validateCpf";
import crypto from "crypto";

dotenv.config({ path: ".env.development" });

async function query(text: string, values?: string[]) {
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

export async function signup(input: any): Promise<any> {
  try {
    const id = crypto.randomUUID();

    const [acc] = (
      await query("select * from cccat15.account where email = $1", [
        input.email
      ])
    )?.rows as any[];
    if (!acc) {
      if (input.name.match(/[a-zA-Z] [a-zA-Z]+/)) {
        if (input.email.match(/^(.+)@(.+)$/)) {
          if (validateCpf(input.cpf)) {
            if (input.isDriver) {
              if (input.carPlate.match(/[A-Z]{3}[0-9]{4}/)) {
                await query(
                  "insert into cccat15.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)",
                  [
                    id,
                    input.name,
                    input.email,
                    input.cpf,
                    input.carPlate,
                    !!input.isPassenger,
                    !!input.isDriver
                  ]
                );

                const obj = {
                  accountId: id
                };
                return obj;
              } else {
                // invalid car plate
                return -5;
              }
            } else {
              await query(
                "insert into cccat15.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)",
                [
                  id,
                  input.name,
                  input.email,
                  input.cpf,
                  input.carPlate,
                  !!input.isPassenger,
                  !!input.isDriver
                ]
              );

              const obj = {
                accountId: id
              };
              return obj;
            }
          } else {
            // invalid cpf
            return -1;
          }
        } else {
          // invalid email
          return -2;
        }
      } else {
        // invalid name
        return -3;
      }
    } else {
      // already exists
      return -4;
    }
  } finally {
    // return;
  }
}
