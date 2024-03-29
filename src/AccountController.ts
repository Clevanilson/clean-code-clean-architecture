import { GetAccountById } from "./application/usecases/GetAccount";
import { HttpServer } from "./HttpServer";
import { Signup } from "./application/usecases/Signup";

export class AccountController {
  constructor(
    private readonly httpServer: HttpServer,
    private readonly signup: Signup,
    private readonly getAccountById: GetAccountById
  ) {
    this.httpServer.register("post", "/signup", (_params: any, body: any) => {
      return this.signup.execute(body);
    });
    this.httpServer.register(
      "get",
      "/accounts/:id",
      (params: any, _body: any) => {
        return this.getAccountById.execute(params.id);
      }
    );
  }
}
