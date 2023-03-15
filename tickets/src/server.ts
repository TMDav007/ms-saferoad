import http from "http";
import express from "express";
import { Logging } from "@sfroads/common";
import connectDB, { SERVER_PORT } from "./DB/connectDB";
import createServer from "./app";
import dotenv from "dotenv";
import createMQProducer, { CreateChannel } from "./producer";
import { natsWrapper } from "./nats-wrapper";
dotenv.config();

// natsWrapper.connect(
//   process.env.NATS_CLUSTER_ID!,
//   process.env.NATS_CLIENT_ID!,
//   process.env.NATS_URL!
// );
// natsWrapper.client.on("close", () => {
//   console.log("NATS connection closed!");
//   process.exit();
// });
// process.on("SIGINT", () => {
//   natsWrapper.client.close();
// });
// process.on("SIGTERM", () => {
//   natsWrapper.client.close();
// });

const AMQP_URL = process.env.AMQP_URL!;
const QUEUE_NAME = "saferoad";
// export const producer = createMQProducer(AMQP_URL, QUEUE_NAME)

const start = async () => {
  const channel = await CreateChannel();
  connectDB();

  // mqWrapper.connect(AMQP_URL, QUEUE_NAME);
  // consumer()
  // const consume = "Ticket:Created"
  //consumer(consume, consumer)
  const app = express();
  createServer(app, channel);

  http
    .createServer(app)
    .listen(SERVER_PORT, () =>
      Logging.info(`Ticket server is running on port ${SERVER_PORT}`)
    );
};
start();
