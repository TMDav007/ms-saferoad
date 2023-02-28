import { NextFunction, Request, Response } from "express";
export declare const requireAuth: (req: Request, res: Response, next: NextFunction) => void;
export declare const requireOfficerAuth: (req: Request, res: Response, next: NextFunction) => void;
