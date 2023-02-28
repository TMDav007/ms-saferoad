import { Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { Logging } from "../library/Logging";

class AppError extends Error {
  code: number;

  constructor(code: number, message: string) {
    super();
    this.code = code;
    this.message = message;
    this.stack =
      (process.env.NODE_ENV as string) === "production" ? "" : this.stack;
  }
}

const errorHandler: ErrorRequestHandler = (
  error: any | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const code = error.code || StatusCodes.INTERNAL_SERVER_ERROR;
  let message = error.message;
  if (!(error instanceof AppError)) {
    Logging.error(`Server error ${message}`);
    message = "This problem is from our end, please try again";
  }
  return res.status(code).send({
    message: message,
    success: false,
    data: null,
  });
};

export { AppError, errorHandler };
