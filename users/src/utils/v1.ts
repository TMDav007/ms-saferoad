import { Router, Request, Response, NextFunction } from "express";
import { Logging } from "@sfroads/common";
import AuthRoute from "../routes/authRoute";
import { SubscribeMessage } from "../consumer";
import { SubscribeEvents } from "../services/user-services";
import { UserRoute } from "../routes/userRoute";

const v1 = Router();
export default (app: any, channel: any) => {
  SubscribeMessage(channel, SubscribeEvents);
  app.use("/", async (_req: Request, res: Response) => {
    res.status(200).json({ message: "Welcome to safe road API entry point" });
  });

  app
    .use((req: Request, _res: Response, next: NextFunction) => {
      Logging.info(
        `Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${req.statusCode}]`
      );

      next();
    })
    .use("/api/v1/auth", AuthRoute)
    .use("/api/v1/user", UserRoute);
};
//export default v1;
