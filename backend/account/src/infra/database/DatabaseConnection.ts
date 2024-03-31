export interface DatabaseConnection {
  query<T = any>(statement: string, params?: unknown[]): Promise<T | undefined>;
}
