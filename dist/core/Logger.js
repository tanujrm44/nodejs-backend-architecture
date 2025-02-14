"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const config_1 = require("../config");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
let dir = config_1.logDirectory !== null && config_1.logDirectory !== void 0 ? config_1.logDirectory : "logs";
if (!dir)
    dir = path_1.default.resolve("logs");
if (!fs_1.default.existsSync(dir)) {
    fs_1.default.mkdirSync(dir);
}
const logLevel = config_1.environment === "development" ? "debug" : "warn";
const dailyRotateFile = new winston_daily_rotate_file_1.default({
    level: logLevel,
    filename: `${dir}/%DATE%-results.log`,
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    handleExceptions: true,
    maxSize: "20m",
    maxFiles: "14d",
    format: winston_1.format.combine(winston_1.format.errors({ stack: true }), winston_1.format.timestamp(), winston_1.format.json()),
});
exports.default = (0, winston_1.createLogger)({
    transports: [
        new winston_1.transports.Console({
            level: logLevel,
            format: winston_1.format.combine(winston_1.format.errors({ stack: true }), winston_1.format.colorize(), winston_1.format.prettyPrint()),
        }),
        dailyRotateFile,
    ],
    exceptionHandlers: [dailyRotateFile],
    exitOnError: false,
});
