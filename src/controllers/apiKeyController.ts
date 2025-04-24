import ApiKey, { ApiKeyModel } from "../models/ApiKeyModel"

async function findByKey(key: string): Promise<ApiKey | null> {
  return ApiKeyModel.findOne({ key, status: true })
}

export { findByKey }
