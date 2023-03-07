import { Router, Request, Response, NextFunction } from "express";
import { Logging } from "@sfroads/common";
import TicketRoute from "../routes/ticketRoute";

const v1 = Router();

v1.get("/ticket", (_req: Request, res: Response) => {
  res
    .status(200)
    .json({ message: "Welcome to safe road API Ticket Service enter point" });
});

v1.use((req: Request, _res: Response, next: NextFunction) => {
  Logging.info(
    `Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${req.statusCode}]`
  );
  v1.use("/ticket",TicketRoute);

  next();
});

export default v1 ;
