import { Request, Response, NextFunction } from "express";
declare const CheckRequestType: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export { CheckRequestType };
