import express, { Response, Request } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { CheckRequestType, errorHandler, not_found } from "@sfroads/common";
import v1 from "./api/v1/v1";

const createServer = (app: any, channel?: any) => {
  app
    .use(express.json())
    .use(helmet())
    .use(morgan("tiny"))
    .use(CheckRequestType)
    .use(
      cors({
        origin: ["*", "http://localhost:3000"],
        credentials: true,
      })
    );
  v1(app, channel);
  app
    .get("/ping", (_req: Request, res: Response) =>
      res.status(200).json({ message: "ping" })
    )
    .use(not_found)
    .use(errorHandler);

  return app;
};

export default createServer;
