import { query } from "./AccountDAODatabase";
import crypto from "crypto";

export class RequestRide {
  async execute(input: Input): Promise<Output> {
    const rideId = crypto.randomUUID();
    const { passengerId } = input;
    const account = await query(
      `SELECT is_passenger FROM cccat15.account WHERE account_id = $1;`,
      [passengerId]
    );
    if (!account?.rows[0]?.is_passenger) {
      throw new Error("User must be a passenger");
    }
    const activeRide = await query(
      `SELECT 
    ride_id FROM cccat15.ride
    WHERE passenger_id = $1 AND status = $2`,
      [passengerId, "requested"]
    );
    if (activeRide?.rows[0]) {
      throw new Error("User has an active ride");
    }
    await query(
      `
    INSERT INTO
    cccat15.ride 
    (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) 
    VALUES 
    ($1, $2, $3, $4, $5, $6, $7, $8);`,
      [
        rideId,
        input.passengerId,
        input.fromLat.toString(),
        input.fromLong.toString(),
        input.toLat.toString(),
        input.toLong.toString(),
        "requested",
        new Date().toISOString()
      ]
    );
    return { rideId };
  }
}

interface Input {
  passengerId: string;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
}

interface Output {
  rideId: string;
}
