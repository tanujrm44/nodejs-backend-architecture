import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"
import { afterAll, beforeAll, beforeEach, vi } from "vitest"
import { RoleModel } from "../src/models/roleModel"

let mongo: any

beforeAll(async () => {
  console.error = vi.fn()
  console.log = vi.fn()
  console.warn = vi.fn()
  console.info = vi.fn()
  mongo = await MongoMemoryServer.create()
  const mongoUri = mongo.getUri()
  await mongoose.connect(mongoUri)
})

beforeEach(async () => {
  const collections = await mongoose.connection?.db?.collections()

  if (!collections) return
  for (let collection of collections) {
    await collection.deleteMany({})
  }
  await RoleModel.create({
    code: "USER",
    status: true,
  })
})

afterAll(async () => {
  if (mongo) {
    await mongo.stop()
  }
  await mongoose.connection.close()
})
