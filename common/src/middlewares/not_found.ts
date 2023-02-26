import { Logging } from "./../library/Logging";
import { Response, Request, NextFunction } from "express";

const not_found = (_req: Request, res: Response, _next: NextFunction) => {
  const error = new Error("Oops!!!, route not found");
  Logging.error(error);
  return res.status(404).json({ message: error.message });
};

export { not_found };
