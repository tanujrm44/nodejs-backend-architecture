import validator, { ValidationSource } from "../helpers/validator"
import express, { NextFunction, Request, Response } from "express"
import apiKeySchema from "./schema"
import { Header } from "./utils"
import { ForbiddenError } from "../core/CustomError"
import { findByKey } from "../controllers/apiKeyController"
import { PublicRequest } from "../types/app-request"

const router = express.Router()

export default router.use(
  validator(apiKeySchema.apiKey, ValidationSource.HEADER),

  async (req: PublicRequest, res: Response, next: NextFunction) => {
    const key = req.headers[Header.API_KEY]?.toString()
    if (!key) return next(new ForbiddenError())

    const apiKey = await findByKey(key)
    console.log("🚀 ~ apiKey:", apiKey)

    if (!apiKey) return next(new ForbiddenError())
    req.apiKey = apiKey
    return next()
  }
)
