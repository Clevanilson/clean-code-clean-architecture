import { query } from "./AccountRepositoryDatabase";
import { Ride } from "./Ride";
import { RideRepository } from "./RideRepository";

export class RideRepositoryDatebase implements RideRepository {
  async getById(id: string): Promise<Ride | undefined> {
    const SQL = `SELECT * FROM cccat15.ride WHERE ride_id = $1;`;
    const rides = await query(SQL, [id]);
    const ride = rides?.rows[0];
    if (!ride) return;
    return Ride.restore(
      ride.ride_id,
      ride.passenger_id,
      Number(ride.from_lat),
      Number(ride.from_long),
      Number(ride.to_lat),
      Number(ride.to_long),
      ride.date,
      ride.status
    );
  }

  async getActiveByPassengerId(passengerId: string): Promise<any> {
    const SQL = `
      SELECT ride_id FROM cccat15.ride
      WHERE passenger_id = $1 AND status = $2;
    `;
    const rides = await query(SQL, [passengerId, "requested"]);
    const ride = rides?.rows[0];
    if (!ride) return;
    return Ride.restore(
      ride.ride_id,
      ride.passenger_id,
      Number(ride.from_lat),
      Number(ride.from_long),
      Number(ride.to_lat),
      Number(ride.to_long),
      ride.date,
      ride.status
    );
  }
  async save(ride: Ride): Promise<void> {
    const SQL = `
      INSERT INTO cccat15.ride 
      (
        ride_id,
        passenger_id,
        from_lat,
        from_long,
        to_lat,
        to_long,
        status,
        date
      ) 
      VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8);`;
    await query(SQL, [
      ride.rideId,
      ride.passengerId,
      ride.fromLat.toString(),
      ride.fromLong.toString(),
      ride.toLat.toString(),
      ride.toLong.toString(),
      ride.status,
      ride.date
    ]);
  }
}
