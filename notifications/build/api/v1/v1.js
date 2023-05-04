"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@sfroads/common");
const notification_1 = __importDefault(require("./notification"));
const messageBroker_1 = require("../../services/messageBroker");
const services_1 = require("../../services/services");
exports.default = (app, channel) => {
    (0, messageBroker_1.SubscribeMessage)(channel, services_1.SubscribeEvents);
    app.use((req, _res, next) => {
        common_1.Logging.info(`Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${req.statusCode}]`);
        next();
    });
    (0, notification_1.default)(app, channel);
};
