import { createClient } from "redis"
import { redis } from "../config"

const redisURL = `redis://:${redis.password}@${redis.host}:${redis.port}`

const client = createClient({ url: redisURL })

client.on("connect", () => console.info("Cache is connecting"))
client.on("ready", () => console.info("Cache is ready"))
client.on("end", () => console.info("Cache disconnected"))
client.on("reconnecting", () => console.info("Cache is reconnecting"))
client.on("error", e => console.error(e))

async function connect() {
  try {
    await client.connect()
  } catch (error) {
    console.error("Redis connection failed, retrying in 5 seconds ")
    setTimeout(connect, 5000)
  }
}

connect()

process.on("SIGINT", async () => {
  await client.disconnect()
})

export default client
