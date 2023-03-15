import express from "express";
import { getAllUsers, getCurrentUser } from "../controllers/UserController";
import { currentUser } from "@sfroads/common";
import { requireAuth } from "@sfroads/common";
//import { channel } from "../server";
import { SubscribeMessage } from "../consumer";
import { SubscribeEvents } from "../services/user-services";

const UserRoute = express.Router();
export default (app: any, channel: any) => {
  SubscribeMessage(channel, SubscribeEvents);
  
  app.get("/api/v1/user/allUsers", getAllUsers);
  app.get("/api/v1/user/currentUser", currentUser, requireAuth, getCurrentUser);
};
