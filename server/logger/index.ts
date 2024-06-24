import { createLogger, format, transports } from "winston";
import * as path from "node:path";
import config from "@config";
import errors = format.errors;

const env = process.env.NODE_ENV || "development";
const logDir = config.LOG_DIR;
const logFile = path.join(logDir, "querygenie_server.log");

const getLabel = function (callingModule: { filename: string }) {
  const parts = callingModule.filename.split("/");
  return parts[parts.length - 2] + "/" + parts.pop();
};

const customFormat = format.printf(
  ({ level, message, timestamp, service, ...temp }) => {
    const logMessage = {
      asctime: timestamp,
      level: level.toUpperCase(),
      service: service,
      message: message,
    };
    return JSON.stringify(logMessage);
  },
);

const logger = createLogger({
  level: env === "development" ? "debug" : "info",
  defaultMeta: { service: "QueryGenie Server" },
  format: format.combine(
    format.splat(),
    format.json(),
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    customFormat,
    errors({ stack: true }),
  ),
  transports: [new transports.File({ filename: logFile })],
  exitOnError: false,
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), customFormat),
    }),
  );
}

export default logger;
