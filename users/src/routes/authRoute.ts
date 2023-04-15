import express from "express";
import AuthController from "./../controllers/AuthControllers";

const authController = new AuthController();
const { signup, signIn, verifyAccount, resendOtp } = authController;
const AuthRoute = express.Router();

AuthRoute.post("/signup", signup)
  .post("/verify", verifyAccount)
  .post("/otp", resendOtp)
  .post("/signin", signIn);

export = AuthRoute;
