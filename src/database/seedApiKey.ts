import { dbURI } from "."
import { ApiKeyModel } from "../models/apiKeyModel"
import { Permission } from "../models/apiKeyModel"
import mongoose from "mongoose"
import crypto from "crypto"

async function seedApiKey() {
  try {
    // Connect to MongoDB
    await mongoose.connect(dbURI)

    console.log("Connected to MongoDB")

    // Generate a secure API key using the crypto module
    const generatedApiKey = crypto.randomBytes(32).toString("hex")

    // Create a new API key
    const apiKey = new ApiKeyModel({
      key: generatedApiKey,
      version: 1,
      permissions: [Permission.GENERAL],
      status: true,
    })

    // Save the API key to the database
    await apiKey.save()
    console.log("Sample API key seeded successfully:", apiKey)
  } catch (error) {
    console.error("Error seeding API key:", error)
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect()
    console.log("Disconnected from MongoDB")
  }
}

// Run the seed function
seedApiKey()
