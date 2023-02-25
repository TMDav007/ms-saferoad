const { chalk } = require("chalk");

class Logging {
  public static log = (args: any) => this.info;
  public static info = (args: any) =>
    console.log(
      chalk.blue(`[${new Date().toLocaleString()}] [INFO] `),
      typeof args === "string" ? chalk.blue(args) : args
    );

  public static warn = (args: any) =>
    console.log(
      chalk.yellow(`[${new Date().toLocaleString()}] [WARN] `),
      typeof args === "string" ? chalk.yellowBright(args) : args
    );

  public static error = (args: any) =>
    console.log(
      chalk.red(`[${new Date().toLocaleString()}] [ERROR] `),
      typeof args === "string" ? chalk.redBright(args) : args
    );
}

export {Logging}
