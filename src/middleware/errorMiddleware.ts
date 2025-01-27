import { NextFunction, Response, Request } from "express"

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode
  let message = err.message
  if (err.name === "CastError") {
    message = "Resource Not Found"
    statusCode = 404
  }
  res.status(statusCode)
  res.json({
    message: message,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  })
}

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found: ${req.originalUrl}`)
  res.status(404)
  next(error)
}

export { errorHandler, notFound }
