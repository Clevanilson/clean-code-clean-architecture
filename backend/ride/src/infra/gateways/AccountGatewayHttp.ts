import { AccountGateway } from "./AccountGateway";
import axios from "axios";

export class AccountGatewayHttp implements AccountGateway {
  async getById(id: string): Promise<any> {
    const response = await axios.get(`http://localhost:3000/accounts/${id}`);
    return response.data;
  }

  async signup(input: any): Promise<any> {
    const response = await axios.post("http://localhost:3000/signup", input);
    return response.data;
  }
}
