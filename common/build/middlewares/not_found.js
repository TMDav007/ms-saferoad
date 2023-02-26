"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.not_found = void 0;
const not_found = (_req, res, _next) => {
    const error = new Error("Oops!!!, route not found");
    console.error(error);
    return res.status(404).json({ message: error.message });
};
exports.not_found = not_found;
