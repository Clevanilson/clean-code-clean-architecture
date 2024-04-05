import { GetAccountById } from "@/application/usecases/GetAccount";
import { HttpServer } from "@/infra/http/HttpServer";
import { Signup } from "@/application/usecases/Signup";
import { inject } from "@/infra/di/Registry";
import { Queue } from "@/infra/queue/Queue";

export class AccountController {
  @inject("signup") signup?: Signup;
  @inject("queue") queue?: Queue;
  @inject("getAccountById") getAccountById?: GetAccountById;

  constructor(private readonly httpServer: HttpServer) {
    this.httpServer.register("post", "/signup", (_params: any, body: any) => {
      return this.signup?.execute(body);
    });
    this.httpServer.register(
      "post",
      "/signup-async",
      (_params: any, body: any) => {
        this.queue?.publish("signup", body);
      }
    );
    this.httpServer.register(
      "get",
      "/accounts/:id",
      (params: any, _body: any) => {
        return this.getAccountById?.execute(params.id);
      }
    );
  }
}
