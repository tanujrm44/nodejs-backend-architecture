import { RequestHandler } from "express"
import { Permission } from "../models/apiKeyModel"
import { PublicRequest } from "../types/app-request"
import { ForbiddenError } from "../core/CustomError"

function permission(permission: Permission): RequestHandler {
  return (req: PublicRequest, res, next) => {
    try {
      if (!req.apiKey?.permissions) {
        return next(new ForbiddenError("Permission Denied"))
      }

      const exists = req.apiKey.permissions.includes(permission as Permission)
      if (!exists) {
        return next(new ForbiddenError("Permission Denied"))
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}

export default permission
