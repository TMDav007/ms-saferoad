"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
const http_status_codes_1 = require("http-status-codes");
class AppError extends Error {
    constructor(code, message) {
        super();
        this.code = code;
        this.message = message;
        this.stack =
            process.env.NODE_ENV === "production" ? "" : this.stack;
    }
}
exports.AppError = AppError;
const errorHandler = (error, req, res, next) => {
    const code = error.code || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
    let message = error.message;
    if (!(error instanceof AppError)) {
        message = "This problem is from our end, please try again";
    }
    return res.status(code).send({
        message: message,
        success: false,
        data: null,
    });
};
exports.errorHandler = errorHandler;
