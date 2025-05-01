import express, { NextFunction, Request, Response } from "express"
import { ZodSchema } from "zod"
import validator, { ValidationSource } from "../helpers/validator"
import schema from "./schema"
import { getAccessToken, validateTokenData } from "./utils"
import { ProtectedRequest } from "../types/app-request"
import JWT from "../core/JWT"
import { tokenInfo } from "../config"
import User from "../models/userModel"
import { Types } from "mongoose"
import { BadRequestError, TokenExpiredError } from "../core/CustomError"
import { KeyStoreModel } from "../models/KeyStoreModel"
import asyncHandler from "../helpers/asyncHandler"

const router = express.Router()

export default router.use(
  validator(schema.auth, ValidationSource.HEADER),
  asyncHandler(
    async (req: ProtectedRequest, res: Response, next: NextFunction) => {
      req.accessToken = getAccessToken(req.headers.authorization)

      try {
        const payload = await JWT.validate(req.accessToken, tokenInfo.secret)
        validateTokenData(payload)

        const user = await User.findById(new Types.ObjectId(payload.sub))

        if (!user) throw new BadRequestError("User does not exist")
        req.user = user

        const keystore = await KeyStoreModel.findOne({
          client: req.user,
          primaryKey: payload.prm,
          status: true,
        })

        if (!keystore) throw new BadRequestError("Invalid access token")
        req.keystore = keystore

        next()
      } catch (error) {
        throw new TokenExpiredError("Token expired")
      }
    }
  )
)
