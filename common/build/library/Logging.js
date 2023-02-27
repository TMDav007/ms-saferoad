"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logging = void 0;
const chalk = require('chalk');
class Logging {
}
exports.Logging = Logging;
_a = Logging;
Logging.log = (args) => _a.info;
Logging.info = (args) => console.log(chalk.blue(`[${new Date().toLocaleString()}] [INFO] `), typeof args === "string" ? chalk.blue(args) : args);
Logging.warn = (args) => console.log(chalk.yellow(`[${new Date().toLocaleString()}] [WARN] `), typeof args === "string" ? chalk.yellowBright(args) : args);
Logging.error = (args) => console.log(chalk.red(`[${new Date().toLocaleString()}] [ERROR] `), typeof args === "string" ? chalk.redBright(args) : args);
