import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import "./database/index"
import cookieParser from "cookie-parser"
import userRoutes from "./routes/userRoutes"
import { corsUrl, environment, port } from "./config"
import todoRoutes from "./routes/todoRoutes"
import { ApiError, ErrorType } from "./core/ApiError"
// import Logger from "./core/Logger"
import { InternalError } from "./core/CustomError"
import swagger from "./swagger"

const app = express()

app.use(cors({ origin: corsUrl }))

app.use(cookieParser())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/users", userRoutes)
app.use("/api/todo", todoRoutes)
app.use("/api-docs", swagger)

app.use("/", (req, res) => {
  res.json({ message: "Hey there!" })
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    ApiError.handle(err, res)

    // if (err.type === ErrorType.INTERNAL) {
    //   Logger.error(
    //     `500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    //   )
    // } else {
    //   Logger.error(
    //     `500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    //   )
    // }
    // Logger.error(err.stack)

    if (environment === "development") {
      res.status(500).send({
        message: err.message,
        stack: err.stack,
      })
    }
  }
  ApiError.handle(new InternalError(), res)
})

export default app
