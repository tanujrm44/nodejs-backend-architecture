import { NextFunction, Request, Response } from "express"
import { RoleCode } from "../models/roleModel"
import { RoleRequest } from "../types/app-request"

export default (...roleCodes: RoleCode[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const roleReq = req as RoleRequest
    roleReq.currentRoleCodes = roleCodes
    next()
  }
