import { model, Schema } from "mongoose"
import { UserDoc } from "./userModel"

export default interface KeyStoreDoc {
  _id: string
  client: UserDoc
  primaryKey: string
  secondaryKey: string
  status: boolean
}

export const DOCUMENT_NAME = "KeyStore"
export const COLLECTION_NAME = "keystores"

const schema = new Schema<KeyStoreDoc>(
  {
    client: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    primaryKey: {
      type: String,
      required: true,
      trim: true,
    },
    secondaryKey: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

schema.index({ client: 1 })
schema.index({ client: 1, primaryKey: 1, status: 1 })
schema.index({ client: 1, primaryKey: 1, secondaryKey: 1 })

export const KeyStoreModel = model<KeyStoreDoc>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME
)
