import express, { Response, Request } from "express";
import cors from "cors";
import cookieSession from "cookie-session";
import helmet from "helmet";
import morgan from "morgan";
import { AppError, CheckRequestType, currentUser } from "@sfroads/common";
import { not_found } from "@sfroads/common";
import { errorHandler } from "@sfroads/common";
import v1 from "./utils/v1";

const createServer = (app, channel) => {
  if (!process.env.MONGO_URI) {
    throw new AppError(500, "MONGO_URI must be defined");
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new AppError(500, "NATS_CLIENT_ID must be defined");
  }

  if (!process.env.NATS_URL) {
    throw new AppError(500, "NATS_URL must be defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new AppError(500, "NATS_CLUSTER_ID must be defined");
  }


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
    )
    .use(
      cookieSession({
        signed: false,
        secure: true,
      })
    )
	.use(currentUser)
    .get("/ping", (_req: Request, res: Response) =>
      res.status(200).json({ message: "ping" })
    )
    .use(channel)
    .use("/api/v1", v1, channel)
    .use(not_found)
    .use(errorHandler);

  return app;
};

export default createServer;
