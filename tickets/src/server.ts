import http from "http";
import express from "express";
import { Logging } from "@sfroads/common";
import connectDB, { SERVER_PORT } from "./DB/connectDB";
import createServer from "./app";
import dotenv from "dotenv";
import { CreateChannel } from "./producer";
dotenv.config();

const start = async () => {
  try {
    const channel = await CreateChannel();
    connectDB();

    const app = express();
    createServer(app, channel);

    http
      .createServer(app)
      .listen(SERVER_PORT, () =>
        Logging.info(`Ticket server is running on port ${SERVER_PORT}`)
      );
  } catch (err) {
    console.log(err, "server error");
  }
};

start();
