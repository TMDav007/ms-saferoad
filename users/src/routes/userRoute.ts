import express from "express";
import { getAllUsers, getCurrentUser } from "../controllers/UserController";
import { currentUser } from "@sfroads/common";
import { requireAuth } from "@sfroads/common";

const UserRoute = express.Router();

UserRoute.get("/allUsers", getAllUsers);
UserRoute.get("/currentUser", currentUser, requireAuth, getCurrentUser);

export { UserRoute };
