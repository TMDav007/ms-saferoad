import { Twilio } from "twilio"
import jwt from "jsonwebtoken";
import { AnyObject } from "mongoose";
import UserVerification from "../models/UserVerification";
require("dotenv");

export const smsOtp = async (otp: number, user: AnyObject) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
  const authToken = process.env.TWILIO_AUTH_TOKEN as string;
  const twilioNumber = process.env.TWILIO_PHONE_NUMBER as string;
  const client = new Twilio(accountSid, authToken);
  const response = await client.messages.create({
    body: `your OTP is ${otp}`,
    from: twilioNumber,
    to: "+234" + user.phoneNumber.slice(1, user.phoneNumber.length),
  });

  console.log("here")
  const newUserVerification = new UserVerification({
    userId: user._id,
    otp,
    createdAt: Date.now(),
    expiresAt: Date.now() + 60 * 15,
  });
  await newUserVerification.save();
  return response;
};

export const GenerateSignature = (data: any) => {
  const signature = jwt.sign(data, process.env.JWTSECRET as string, {
    expiresIn: "5m",
  });
  return signature;
};

export const verifySignature = (signature: string) => {
  try {
    const decoded = jwt.verify(signature, process.env.JWTSECRET as string);
    return decoded;
  } catch (error) {
    return false;
  }
};

export const Authenticate = (req: any, res: any, next: any) => {
  const validate = verifySignature(req.headers.authorization);
  if (!validate) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  next();
};
