import http from "http";
import express from "express";
import { Logging } from "@sfroads/common";
import connectDB, { SERVER_PORT } from "./database/connectDB";
import createServer from "./app";
import dotenv from "dotenv";
import { CreateChannel } from "./services/messageBroker";

dotenv.config();

const start = async () => {
  connectDB();

  const app = express();
  const channel = await CreateChannel();
  createServer(app, channel);

  http
    .createServer(app)
    .listen(SERVER_PORT, () =>
      Logging.info(`Notification server is running on port ${SERVER_PORT}`)
    );
};
start();
