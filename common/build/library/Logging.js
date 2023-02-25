"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logging = void 0;
const chalk_1 = __importDefault(require("chalk"));
class Logging {
}
exports.Logging = Logging;
_a = Logging;
Logging.log = (args) => _a.info;
Logging.info = (args) => console.log(chalk_1.default.blue(`[${new Date().toLocaleString()}] [INFO] `), typeof args === "string" ? chalk_1.default.blue(args) : args);
Logging.warn = (args) => console.log(chalk_1.default.yellow(`[${new Date().toLocaleString()}] [WARN] `), typeof args === "string" ? chalk_1.default.yellowBright(args) : args);
Logging.error = (args) => console.log(chalk_1.default.red(`[${new Date().toLocaleString()}] [ERROR] `), typeof args === "string" ? chalk_1.default.redBright(args) : args);
