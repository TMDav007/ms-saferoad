import { Request, Response, NextFunction } from "express";
import { Logging } from "@sfroads/common";

import notification from "./notification";
import { SubscribeMessage } from "../../services/messageBroker";
import { SubscribeEvents } from "../../services/services";

export default (app: any, channel?: any) => {
  SubscribeMessage(channel, SubscribeEvents);
  app.use((req: Request, _res: Response, next: NextFunction) => {
    Logging.info(
      `Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${req.statusCode}]`
    );

    next();
  });
  notification(app, channel);
};
