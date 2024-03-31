import { Ride } from "@/domain/entities/Ride";
import { DatabaseConnection } from "@/infra/database/DatabaseConnection";
import { RideRepository } from "@/infra/repositories/RideRepository";

export class RideRepositoryDatebase implements RideRepository {
  constructor(private readonly connection: DatabaseConnection) {}

  async getById(id: string): Promise<Ride | undefined> {
    const SQL = `SELECT * FROM cccat15.ride WHERE ride_id = $1;`;
    const rides = await this.connection.query(SQL, [id]);
    const ride = rides?.[0];
    if (!ride) return;
    return Ride.restore(
      Number(ride.from_lat),
      Number(ride.from_long),
      Number(ride.to_lat),
      Number(ride.to_long),
      Number(ride.last_lat),
      Number(ride.last_long),
      Number(ride.distance),
      ride.status,
      ride.date,
      ride.ride_id,
      ride.passenger_id,
      ride.driver_id
    );
  }

  async getActiveByPassengerId(passengerId: string): Promise<any> {
    const SQL = `
      SELECT * FROM cccat15.ride
      WHERE passenger_id = $1 AND status = $2;
    `;
    const rides = await this.connection.query(SQL, [passengerId, "requested"]);
    const ride = rides?.[0];
    if (!ride) return;
    return Ride.restore(
      Number(ride.from_lat),
      Number(ride.from_long),
      Number(ride.to_lat),
      Number(ride.to_long),
      Number(ride.last_lat),
      Number(ride.last_long),
      Number(ride.distance),
      ride.status,
      ride.date,
      ride.ride_id,
      ride.passenger_id,
      ride.driver_id
    );
  }
  async save(ride: Ride): Promise<void> {
    const SQL = `
      INSERT INTO cccat15.ride 
      (
        from_lat,
        from_long,
        to_lat,
        to_long,
        last_lat,
        last_long,
        distance,
        status,
        date,
        ride_id,
        passenger_id      
      ) 
      VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);`;
    await this.connection.query(SQL, [
      ride.from.lat,
      ride.from.long,
      ride.to.lat,
      ride.to.long,
      ride.getLastLat(),
      ride.getLastLong(),
      ride.getDistance(),
      ride.status,
      ride.date,
      ride.rideId,
      ride.passengerId
    ]);
  }

  async update(ride: Ride): Promise<void> {
    const SQL = `
      UPDATE cccat15.ride 
      SET
        driver_id = $2,
        status = $3,
        last_lat = $4,
        last_long = $5,
        distance = $6
      WHERE 
        ride_id = $1;
    `;
    await this.connection.query(SQL, [
      ride.rideId,
      ride.driverId,
      ride.status,
      ride.getLastLat(),
      ride.getLastLong(),
      ride.getDistance()
    ]);
  }
}
