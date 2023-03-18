import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWTPayload } from "../utils/types";

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

const auth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).send({
      message: "unauthorized",
      success: false,
      data: null,
    });
  }
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWTSECRET!) as JWTPayload;
    // attach the user to the job routes
    req.user = {
      userId: payload.userId,
      fullName: payload.fullName,
      email: payload.email,
      verified: payload.verified,
      status: payload.status,
      isSignup: payload.isSignup,
      userType: payload.userType,
    };
    next();
  } catch (err) {
    return res.status(400).send({
      message: "Invalid token",
      success: false,
      data: null,
    });
  }
};

export { auth };
