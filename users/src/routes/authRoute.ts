import express from "express";
import {
  signout,
  signup,
  verifyAccount,
} from "./../controllers/AuthControllers";

const AuthRoute = express.Router();

AuthRoute.post("/signup", signup)
  .post("/verify", verifyAccount)
  .post("/signout", signout);

export = AuthRoute;
