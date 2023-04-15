import http from "http";
import express from "express";
import { Logging } from "@sfroads/common";
import connectDB, { SERVER_PORT } from "./DB/connectDB";
import createServer from "./app";
import dotenv from "dotenv";
import { natsWrapper } from "./nats-wrapper";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { CreateChannel } from "./consumer";

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

// new TicketCreatedListener(natsWrapper.client ).listen();

// process.on("SIGINT", () => {
//   natsWrapper.client.close();
// });
// process.on("SIGTERM", () => {
//   natsWrapper.client.close();
// });
// export const producer = createMQProducer(AMQP_URL, QUEUE_NAME);
const AMQP_URL = process.env.AMQP_URL!;
const QUEUE_NAME = "saferoad";

// mqWrapper.connect(AMQP_URL, QUEUE_NAME)

// mqWrapper

// export const consumer = createMQConsumer(AMQP_URL, QUEUE_NAME);
export const start = async () => {
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
      Logging.info(`Auth Server is running on port ${SERVER_PORT}!!`)
    );
};
start();
