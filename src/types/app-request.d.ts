import { Request } from "express"
import ApiKeyDoc from "../models/ApiKeyModel"

declare interface PublicRequest extends Request {
  apiKey?: ApiKeyDoc
}
