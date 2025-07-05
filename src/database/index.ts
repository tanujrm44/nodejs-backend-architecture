import mongoose from "mongoose"
// import Logger from "../core/Logger"
import { db, environment } from "../config"

// Build the connection string
export const dbURI = process.env.MONGODB_URI as string

const options = {
  autoIndex: true,
  minPoolSize: db.minPoolSize,
  maxPoolSize: db.maxPoolSize,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
}

// Logger.debug(dbURI)

function setRunValidators() {
  return { runValidators: true }
}

mongoose.set("strictQuery", true)

// Create the database connection
if (environment !== "test") {
  mongoose
    .plugin((schema: any) => {
      schema.pre("findOneAndUpdate", setRunValidators)
      schema.pre("updateMany", setRunValidators)
      schema.pre("updateOne", setRunValidators)
      schema.pre("update", setRunValidators)
    })
    .connect(dbURI, options)
    .then(() => {
      // Logger.info("Mongoose connection done")
    })
    .catch(e => {
      // Logger.info("Mongoose connection error")
      // Logger.error(e)
    })
}

// CONNECTION EVENTS
// When successfully connected
// mongoose.connection.on("connected", () => {
//   Logger.debug("Mongoose default connection open to " + dbURI)
// })

// // If the connection throws an error
// mongoose.connection.on("error", err => {
//   Logger.error("Mongoose default connection error: " + err)
// })

// // When the connection is disconnected
// mongoose.connection.on("disconnected", () => {
//   Logger.info("Mongoose default connection disconnected")
// })

// // If the Node process ends, close the Mongoose connection
// process.on("SIGINT", () => {
//   mongoose.connection.close().finally(() => {
//     Logger.info(
//       "Mongoose default connection disconnected through app termination"
//     )
//     process.exit(0)
//   })
// })

export const connection = mongoose.connection
