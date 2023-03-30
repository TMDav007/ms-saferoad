import express from "express";
import {
  resendOtp,
  signIn,
  signout,
  signup,
  verifyAccount,
} from "./../controllers/AuthControllers";

const AuthRoute = express.Router();

AuthRoute.post("/signup", signup)
  .post("/verify", verifyAccount)
  .post("/signout", signout)
  .post("/otp", resendOtp)
  .post("/signin", signIn);

export = AuthRoute;
