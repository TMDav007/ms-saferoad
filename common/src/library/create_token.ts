import jwt from "jsonwebtoken";
import { JWTPayload } from "../utils/types";

export const createToken = (user: JWTPayload) => {
  return jwt.sign(
    {
      userId: user.id ,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      verified: user.verified,
      email: user.email,
      isSignup: user.isSignup,
      status: user.status,
      idNum: user.idNum,
      userType: user.userType,
    },
    process.env.JWTSECRET!,
    {
      expiresIn: "30d",
    }
  );
};
