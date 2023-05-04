"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@sfroads/common");
const payment_1 = __importDefault(require("./payment"));
exports.default = (app, channel) => {
    app.use((req, _res, next) => {
        common_1.Logging.info(`Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${req.statusCode}]`);
        next();
    });
    (0, payment_1.default)(app, channel);
};
