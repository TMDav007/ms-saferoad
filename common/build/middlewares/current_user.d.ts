import { NextFunction, Request, Response } from "express";
import { JwtPayload, UserPayload } from "../utils/types";
declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload;
            session?: JwtPayload | null;
        }
    }
}
export declare const currentUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
