import { NextFunction, Request, Response } from "express";
import { AppError } from "./error-middleware";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    throw new AppError(401, "User not authorized");
  }
  next();
};
