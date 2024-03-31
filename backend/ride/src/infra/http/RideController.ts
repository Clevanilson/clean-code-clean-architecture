import { GetRide } from "@/application/usecases/GetRide";
import { HttpServer } from "@/infra/http/HttpServer";
import { RequestRide } from "@/application/usecases/RequestRide";
import { inject } from "@/infra/di/Registry";

export class RideController {
  @inject("requestRide") requestRide?: RequestRide;
  @inject("getRide") getRide?: GetRide;

  constructor(private readonly httpServer: HttpServer) {
    this.httpServer.register(
      "post",
      "/rides/request",
      (_params: any, body: any) => {
        return this.requestRide?.execute(body);
      }
    );
    this.httpServer.register("get", "/rides/:id", (params: any, _body: any) => {
      return this.getRide?.execute(params.id);
    });
  }
}
