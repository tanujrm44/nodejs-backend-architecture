import { NextFunction, Request, Response } from "express"
import { ZodError, ZodSchema } from "zod"
import { BadRequestError } from "../core/CustomError"

export enum ValidationSource {
  BODY = "body",
  QUERY = "query",
  HEADER = "header",
  PARAM = "params",
}

const validateRequest = (
  schema: ZodSchema,
  source: ValidationSource = ValidationSource.BODY
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = schema.parse(req[source])
      Object.assign(req[source], data)
      next()
    } catch (err) {
      if (err instanceof ZodError) {
        const message = err.errors.map(e => e.message).join(", ")
        return next(new BadRequestError(message))
      }
      next(err)
    }
  }
}

export default validateRequest
