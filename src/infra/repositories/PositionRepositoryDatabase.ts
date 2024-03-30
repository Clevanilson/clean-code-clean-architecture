import { Position } from "@/domain/entities/Position";
import { PositionRepository } from "@/infra/repositories/PositionRepository";
import { DatabaseConnection } from "../database/DatabaseConnection";

export class PositionRepositoryDatabase implements PositionRepository {
  constructor(private readonly connection: DatabaseConnection) {}

  async save(position: Position): Promise<void> {
    const SQL = `
      INSERT INTO cccat15.position
      (position_id, ride_id, lat, long, date)
      VALUES
      ($1, $2, $3, $4, $5);
    `;
    return this.connection.query(SQL, [
      position.positionId,
      position.rideId,
      position.coord.lat,
      position.coord.long,
      position.date
    ]);
  }

  async listByRideId(rideId: string): Promise<Position[]> {
    const SQL = `SELECT * FROM cccat15.position WHERE ride_id = $1`;
    const positions = await this.connection.query(SQL, [rideId]);
    return (
      positions?.map((position: any) =>
        Position.restore(
          position.position_id,
          position.ride_id,
          position.date,
          Number(position.lat),
          Number(position.long)
        )
      ) ?? []
    );
  }
}
