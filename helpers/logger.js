const log4js = require("log4js");
const config = require("config");

log4js.configure({
  appenders: {
    ezd: { type: "file", filename: "./logs/ezd.log" },
  },
  categories: {
    default: { appenders: ["ezd"], level: "error" },
  },
});

const logger = log4js.getLogger();
logger.level = "debug";

const logMessage = (messageType, message) => {
  if (config.log) {
    switch (messageType) {
      case "trace":
        logger.trace(message);
        break;
      case "debug":
        logger.debug(message);
        break;
      case "info":
        logger.info(message);
        break;
      case "warn":
        logger.warn(message);
        break;
      case "error":
        logger.error(message);
        break;
      case "fatal":
        logger.fatal(message);
        break;
      default:
        logger.trace("[unknown] : ");
    }
  }
};

module.exports = {
  logMessage,
};
