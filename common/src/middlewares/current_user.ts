import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload, UserPayload } from "../utils/types";

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
      session?: JwtPayload | null;
    }
  }
}

export const currentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;
    if (!payload.verified) {
      return next();
    }
    req.currentUser = payload;
  } catch (err) {}
  next();
};
