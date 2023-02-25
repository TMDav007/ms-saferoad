"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const error_middleware_1 = require("./error-middleware");
const requireAuth = (req, res, next) => {
    if (!req.currentUser) {
        throw new error_middleware_1.AppError(401, "User not authorized");
    }
    next();
};
exports.requireAuth = requireAuth;
