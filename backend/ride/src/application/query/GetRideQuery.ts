import { DatabaseConnection } from "@/infra/database/DatabaseConnection";

export class GetRideProjectionQuery {
  constructor(private readonly connection: DatabaseConnection) {}

  async execute(rideId: string) {
    const [ride] = await this.connection.query(
      `
      SELECT * FROM cccat15.ride_projection
      WHERE ride_id = $1
    `,
      [rideId]
    );
    return ride;
  }
}
