import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.simple(),
  transports: [
    new winston.transports.File({ filename: "app.log" }),
    new winston.transports.Console()
  ]
});

export default logger;
