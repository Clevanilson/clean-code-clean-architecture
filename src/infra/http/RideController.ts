import { GetRide } from "@/application/usecases/GetRide";
import { HttpServer } from "@/infra/http/HttpServer";
import { RequestRide } from "@/application/usecases/RequestRide";

export class RideController {
  constructor(
    private readonly httpServer: HttpServer,
    private readonly requestRide: RequestRide,
    private readonly getRide: GetRide
  ) {
    this.httpServer.register(
      "post",
      "/rides/request",
      (_params: any, body: any) => {
        return this.requestRide.execute(body);
      }
    );
    this.httpServer.register("get", "/rides/:id", (params: any, _body: any) => {
      return this.getRide.execute(params.id);
    });
  }
}
