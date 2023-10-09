import { createLogger, format, transports } from "winston";

export const logger = createLogger({
  level: "info", // Log level (e.g., 'info', 'warn', 'error')
  format: format.combine(
    format.timestamp(),
    format.colorize(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new transports.Console(), // Log to the console
    new transports.File({ filename: "error.log", level: "error" }), // Log errors to a file
    new transports.File({ filename: "combined.log" }), // Log all messages to another file
  ],
});
