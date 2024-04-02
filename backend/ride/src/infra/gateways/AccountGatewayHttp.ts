import { HttpClient } from "../http/HttpClient";
import { AccountGateway } from "./AccountGateway";

export class AccountGatewayHttp implements AccountGateway {
  constructor(private httpClient: HttpClient) {}

  async getById(id: string): Promise<any> {
    return this.httpClient.get(`http://localhost:3000/accounts/${id}`);
  }

  async signup(input: any): Promise<any> {
    return this.httpClient.post("http://localhost:3000/signup", input);
  }
}
