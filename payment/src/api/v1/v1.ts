import { Request, Response, NextFunction } from "express";
import { Logging } from "@sfroads/common";

import payment from "./payment";

export default (app: any, channel?: any) => {
  app.use((req: Request, _res: Response, next: NextFunction) => {
    Logging.info(
      `Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${req.statusCode}]`
    );

    next();
  });
  payment(app, channel);
};
