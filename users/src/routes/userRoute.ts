import express from "express";
import {
  addUserInfo,
  getAllUsers,
  getCurrentUser,
} from "../controllers/UserController";
import { auth } from "@sfroads/common";
import { requireOfficerAuth } from "../middlewares/require-auth";

const UserRoute = express.Router();

UserRoute.get("/users", getAllUsers);
UserRoute.get("/currentUser", auth, getCurrentUser);
UserRoute.put("/", auth, addUserInfo);

export { UserRoute };
