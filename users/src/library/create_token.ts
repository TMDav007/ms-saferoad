import jwt from "jsonwebtoken";
//import { JWTPayload } from "../utils/types";

export const createToken = (user: any) => {
  return jwt.sign(
    {
      userId: user.id,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      verified: user.verified,
      email: user.email,
      isSignup: user.isSignup,
      status: user.status,
      NIN: user?.NIN,
      WID: user?.WID,
      userType: user.userType,
    },
    process.env.JWTSECRET!,
    {
      expiresIn: "30d",
    }
  );
};
