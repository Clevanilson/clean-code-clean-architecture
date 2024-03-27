export interface RideDAO {
  save(ride: any): Promise<void>;
  getActiveByPassengerId(passengerId: string): Promise<any>;
  getById(id: string): Promise<any>;
}
