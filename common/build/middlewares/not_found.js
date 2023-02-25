"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logging_1 = __importDefault(require("../../../common/src/library/Logging"));
const not_found = (_req, res, _next) => {
    const error = new Error("Oops!!!, route not found");
    Logging_1.default.error(error);
    return res.status(404).json({ message: error.message });
};
exports.default = not_found;
