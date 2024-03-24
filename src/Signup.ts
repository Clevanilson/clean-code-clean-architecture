import { AccountDAO } from "./AccountDAO";
import { validateCpf } from "./validateCpf";

export class Signup {
  constructor(private readonly accountDAO: AccountDAO) {}

  async execute(input: any): Promise<any> {
    const existingAccount = await this.accountDAO.getByEmail(input.email);
    if (existingAccount) throw new Error("Account already exists");
    if (!input.name.match(/[a-zA-Z] [a-zA-Z]+/))
      throw new Error("Invalid name");
    if (!input.email.match(/^(.+)@(.+)$/)) throw new Error("Invalid email");
    if (!validateCpf(input.cpf)) throw new Error("Invalid CPF");
    if (input.isDriver && !input.carPlate.match(/[A-Z]{3}[0-9]{4}/))
      throw new Error("Invalid car plate");
    return this.accountDAO.save(input);
  }
}
