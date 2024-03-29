import express from "express";
import { HttpServer } from "./HttpServer";

const app = express();
app.use(express.json());

export class ExpressAdapter implements HttpServer {
  listen(port: number): void {
    app.listen(port, () => console.log(`Running on ${port}`));
  }

  register(method: string, url: string, callback: Function): void {
    app[method as keyof express.Express](
      url,
      async (req: express.Request, res: express.Response) => {
        try {
          const output = await callback(req.params, req.body);
          return res.status(200).json(output);
        } catch (error: any) {
          return res.status(422).json({ message: error.message });
        }
      }
    );
  }
}
