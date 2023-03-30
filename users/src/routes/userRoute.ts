import express from "express";
import { getAllUsers, getCurrentUser } from "../controllers/UserController";;
import { auth } from "@sfroads/common";
import { requireOfficerAuth } from "../middlewares/require-auth";

const UserRoute = express.Router();

UserRoute.get("/users", getAllUsers);
UserRoute.get("/currentUser", auth, requireOfficerAuth, getCurrentUser);

export { UserRoute };
