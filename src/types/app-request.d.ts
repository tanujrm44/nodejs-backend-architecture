import { Request } from "express"
import ApiKeyDoc from "../models/ApiKeyModel"
import KeyStoreDoc from "../models/KeyStoreModel"
import { UserDoc } from "../models/userModel"

declare interface PublicRequest extends Request {
  apiKey?: ApiKeyDoc
}

declare interface ProtectedRequest extends Request {
  user: UserDoc
  accessToken: string
  keystore: KeyStoreDoc
}
