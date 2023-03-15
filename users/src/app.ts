import express, { Response, Request } from "express";
import cors from "cors";
import amqplib from "amqplib";
import cookieSession from "cookie-session";
import helmet from "helmet";
import morgan from "morgan";
import { CheckRequestType } from "@sfroads/common";
import { not_found } from "@sfroads/common";
import { AppError, errorHandler } from "@sfroads/common";
import v1 from "./utils/v1";
import createMQConsumer from "./consumer";
import user from "./routes/userRoute";

const createServer = (app: any, channel: any) => {
  if (!process.env?.JWT_KEY) {
    throw new AppError(500, "JWT_KEY must be defined");
  }

  if (!process.env.MONGO_URI) {
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
  user(app, channel);
  app
    .get("/ping", (_req: Request, res: Response) =>
      res.status(200).json({ message: "ping" })
    )
    .use("/api/v1", v1)
    .use(not_found)
    .use(errorHandler);

  return app;
};

export default createServer;

// Message Broker 

export const CreateChannel = async () => {
  try {
    const connection = await amqplib.connect(process.env.MESSAGE_BROKER_URL!);
    const channel = await connection.createChannel();
    await channel.assertExchange(process.env.EXCHANGE_NAME!, "direct", {
      durable: false,
    });
    return channel;
  } catch (err: any) {
    throw new AppError(500, err?.message);
  }
};

export const PublishMessage = async (
  channel: any,
  binding_key: any,
  message: any
) => {
  try {
    await channel.publish(
      process.env.EXCHANGE_NAME,
      message,
      binding_key,
      Buffer.from(message)
    );
  } catch (err: any) {
    throw new AppError(500, err?.message);
  }
};

export const SubscribeMessage = async (
  channel: any,
  service: any,
  binding_key: any
) => {
  const appQueue = new channel.assertQueue("QUEUE_NAME");

  channel.bindQueue(appQueue.queue, process.env.EXCHANGE_NAME, binding_key);

  channel.consume(appQueue.queue, (data: any) => {
    console.log("recieved data");
    console.log(data.content.toString());
    channel.ack(data);
  });
};
