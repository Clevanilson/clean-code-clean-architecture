export interface PositionRepository {
  save(position: Position): Promise<void>;
}
