import { Router, Request, Response, NextFunction } from "express";
import {Logging} from "@sfroads/common";
import AuthRoute from "../routes/authRoute";


const v1 = Router();

v1.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ message: "Welcome to safe road API entry point" });
});

v1.use((req: Request, _res: Response, next: NextFunction) => {
  Logging.info(
    `Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${req.statusCode}]`
  );

  next();
})
  .use("/auth", AuthRoute)

export default v1;
