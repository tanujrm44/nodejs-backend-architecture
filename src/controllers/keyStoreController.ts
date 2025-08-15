import { KeyStoreModel } from "../models/keyStoreModel"
import { UserDoc } from "../models/userModel"

async function create(
  client: UserDoc,
  primaryKey: string,
  secondaryKey: string
) {
  const keys = await KeyStoreModel.create({
    client,
    primaryKey,
    secondaryKey,
  })
  return keys
}

export { create }
