import express, { Response, Request } from "express";
import cors from "cors";
import cookieSession from "cookie-session";
import helmet from "helmet";
import morgan from "morgan";
import { CheckRequestType } from "@sfroads/common";
import { not_found } from "@sfroads/common";
import { AppError, errorHandler } from "@sfroads/common";
//import v1 from "./utils/v1";
// import user from "./routes/userRoute";
import v1 from './utils/v1'

const createServer = (app?: any, channel?: any) => {
  if (!process.env?.JWT_KEY) {
    throw new AppError(500, "JWT_KEY must be defined");
  }

  if (process.env.NODE_ENV !== "test" && !process.env.MONGO_URI) {
    throw new AppError(500, "MONGO_URI must be defined");
  }

  app.set("trust proxy", true);
  app
    .use(express.json())
    .use(helmet())
    .use(morgan("tiny"))
    .use(CheckRequestType)
    .use(
      cookieSession({
        signed: false,
        secure: true,
      })
    )
    .use(
      cors({
        origin: ["*", "http://localhost:3000"],
        credentials: true,
      })
    );
  // user(app, channel);
  v1(app, channel)
  app
    .get("/ping", (_req: Request, res: Response) =>
      res.status(200).json({ message: "ping" })
    )
    // .use("/api/v1", v1)
    .use(not_found)
    .use(errorHandler);

  return app;
};

export default createServer;