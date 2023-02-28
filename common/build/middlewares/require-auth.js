"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireOfficerAuth = exports.requireAuth = void 0;
const error_middleware_1 = require("./error-middleware");
const requireAuth = (req, res, next) => {
    if (!req.currentUser) {
        throw new error_middleware_1.AppError(401, "User not authenticated");
    }
    next();
};
exports.requireAuth = requireAuth;
const requireOfficerAuth = (req, res, next) => {
    var _a;
    if (((_a = req === null || req === void 0 ? void 0 : req.currentUser) === null || _a === void 0 ? void 0 : _a.userType) !== "Officer") {
        throw new error_middleware_1.AppError(403, "Not authorized!!!");
    }
    next();
};
exports.requireOfficerAuth = requireOfficerAuth;
