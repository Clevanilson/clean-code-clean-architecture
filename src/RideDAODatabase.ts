import { query } from "./AccountDAODatabase";
import { RideDAO } from "./RideDAO";

export class RideDAODatabase implements RideDAO {
  async getById(id: string): Promise<any> {
    const SQL = `SELECT * FROM cccat15.ride WHERE ride_id = $1;`;
    const rides = await query(SQL, [id]);
    if (!rides?.rows[0]) return;
    const [ride] = rides.rows;
    console.log(ride);
    return {
      rideId: ride.ride_id,
      passengerId: ride.passenger_id,
      fromLat: Number(ride.from_lat),
      fromLong: Number(ride.from_long),
      toLat: Number(ride.to_lat),
      toLong: Number(ride.to_long),
      status: ride.status,
      date: ride.date
    };
  }

  async getActiveByPassengerId(passengerId: string): Promise<any> {
    const SQL = `
      SELECT ride_id FROM cccat15.ride
      WHERE passenger_id = $1 AND status = $2;
    `;
    const rides = await query(SQL, [passengerId, "requested"]);
    return rides?.rows[0];
  }
  async save(ride: any): Promise<void> {
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
      "requested",
      new Date().toISOString()
    ]);
  }
}
