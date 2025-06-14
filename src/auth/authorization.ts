import express, { NextFunction, Request, Response } from "express"
import asyncHandler from "../helpers/asyncHandler"
import { BadRequestError, ForbiddenError } from "../core/CustomError"
import { RoleRequest } from "../types/app-request"
import { RoleModel } from "../models/roleModel"

const router = express.Router()

export default router.use(
  asyncHandler(async (req: RoleRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.roles || !req.currentRoleCodes) {
      throw new ForbiddenError("Permission Denied")
    }

    const roles = await RoleModel.find({
      code: {
        $in: req.currentRoleCodes,
      },
      status: true,
    })

    if (!roles.length) throw new ForbiddenError("Permission Denied")

    const roleids = roles.map(role => role._id.toString())

    let authorized = false

    for (const userRole of req.user.roles) {
      if (authorized) break
      if (roleids.includes(userRole.toString())) {
        authorized = true
        break
      }
    }

    if (!authorized) throw new ForbiddenError("Permission Denied")

    return next()
  })
)
