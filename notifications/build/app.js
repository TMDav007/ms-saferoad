"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const common_1 = require("@sfroads/common");
const v1_1 = __importDefault(require("./api/v1/v1"));
const createServer = (app, channel) => {
    app
        .use(express_1.default.json())
        .use((0, helmet_1.default)())
        .use((0, morgan_1.default)("tiny"))
        .use(common_1.CheckRequestType)
        .use((0, cors_1.default)({
        origin: ["*", "http://localhost:3000"],
        credentials: true,
    }));
    (0, v1_1.default)(app, channel);
    app
        .get("/ping", (_req, res) => res.status(200).json({ message: "ping" }))
        .use(common_1.not_found)
        .use(common_1.errorHandler);
    return app;
};
exports.default = createServer;
