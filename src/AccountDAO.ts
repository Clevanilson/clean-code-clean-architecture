export interface AccountDAO {
  save(account: any): Promise<{ accountId: string }>;
  getByEmail(email: string): Promise<any>;
  getById(id: string): Promise<any>;
}
