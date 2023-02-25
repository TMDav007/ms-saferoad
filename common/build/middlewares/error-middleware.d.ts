import { ErrorRequestHandler } from "express";
declare class AppError extends Error {
    code: number;
    constructor(code: number, message: string);
}
declare const errorHandler: ErrorRequestHandler;
export { AppError, errorHandler };
