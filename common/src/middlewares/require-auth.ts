import { NextFunction, Request, Response } from "express";
import { AppError } from "./error-middleware";

const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    throw new AppError(401, "User not authenticated");
  }
  next();
};

const requireOfficerAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req?.user?.userType !== "Officer") {
    throw new AppError(403, "Not authorized!!!");
  }
  next();
};

export { requireAuth, requireOfficerAuth}