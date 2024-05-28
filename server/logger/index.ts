import { createLogger, format, transports } from "winston";
import * as path from "node:path";
import config from "@config";
import errors = format.errors;

const env = process.env.NODE_ENV || "development";
const logDir = config.LOG_DIR;
const logFile = path.join(logDir, "querygenie_server.log");

const customFormat = format.printf(({ level, message, timestamp, service }) => {
  return `{"asctime": "${timestamp}","service": "[${service}]", "level": "${level}", "message": "${message}"}`;
});

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
