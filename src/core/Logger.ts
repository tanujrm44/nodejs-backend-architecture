// import { createLogger, transports, format } from "winston"
// import { environment, logDirectory } from "../config"
// import path from "path"
// import fs from "fs"
// import DailyRotateFile from "winston-daily-rotate-file"

// let dir = logDirectory ?? "logs"

// if (!dir) dir = path.resolve("logs")

// if (!fs.existsSync(dir)) {
//   fs.mkdirSync(dir)
// }

// const logLevel = environment === "development" ? "debug" : "warn"

// const dailyRotateFile = new DailyRotateFile({
//   level: logLevel,
//   filename: `${dir}/%DATE%-results.log`,
//   datePattern: "YYYY-MM-DD",
//   zippedArchive: true,
//   handleExceptions: true,
//   maxSize: "20m",
//   maxFiles: "14d",
//   format: format.combine(
//     format.errors({ stack: true }),
//     format.timestamp(),
//     format.json()
//   ),
// })

// export default createLogger({
//   transports: [
//     new transports.Console({
//       level: logLevel,
//       format: format.combine(
//         format.errors({ stack: true }),
//         format.colorize(),
//         format.prettyPrint()
//       ),
//     }),
//     dailyRotateFile,
//   ],
//   exceptionHandlers: [dailyRotateFile],
//   exitOnError: false,
// })
