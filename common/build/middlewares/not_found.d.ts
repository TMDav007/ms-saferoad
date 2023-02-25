import { Response, Request, NextFunction } from "express";
declare const not_found: (_req: Request, res: Response, _next: NextFunction) => Response<any, Record<string, any>>;
export { not_found };
