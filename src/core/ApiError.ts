import { Response } from "express"

export enum ErrorType {
  BAD_REQUEST = "BadRequest",
  NOT_FOUND = "NotFound",
  UNAUTHORIZED = "Unauthorized",
  FORBIDDEN = "Forbidden",
  INTERNAL = "Internal",
  TOKEN_EXPIRED = "TokenExpired",
  BAD_TOKEN = "BadToken",
  ACCESS_TOKEN_ERROR = "AccessTokenError",
}

export class ApiError extends Error {
  type: ErrorType
  statusCode: number
  constructor(type: ErrorType, statusCode: number, message: string) {
    super(message)
    this.type = type
    this.statusCode = statusCode
    Object.setPrototypeOf(this, new.target.prototype)
    Error.captureStackTrace(this, this.constructor)
  }

  static handle(err: ApiError, res: Response) {
    console.log(err.statusCode)
    res.status(err.statusCode || 500).json({
      type: err.type || ErrorType.INTERNAL,
      message: err.message || "Internal Server Error",
    })
  }
}
