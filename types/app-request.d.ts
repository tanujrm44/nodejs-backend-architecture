import { Request } from "express"
import { UserDoc, UserModel } from "../src/models/userModel"

declare interface ProtectedRequest extends Request {
  user?: any
}
