import { DatabaseConnection } from "@/infra/database/DatabaseConnection";

export class UpdateRideProjectionHandler {
  constructor(private readonly connection: DatabaseConnection) {}

  async execute(rideId: string) {
    const [ride] = await this.connection.query(
      "SELECT * FROM cccat15.ride WHERE ride_id = $1",
      [rideId]
    );
    await this.connection.query(
      "DELETE FROM cccat15.ride_projection WHERE ride_id = $1",
      [rideId]
    );
    await this.connection.query(
      `INSERT INTO cccat15.ride_projection (status, ride_id) VALUES ($1, $2)`,
      [ride.status, rideId]
    );
  }
}
