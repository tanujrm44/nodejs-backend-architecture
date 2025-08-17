import dotenv from "dotenv"

dotenv.config()

export const environment = process.env.NODE_ENV
export const port = process.env.PORT || 8080

export const logDirectory = process.env.LOG_DIR

export const db = {
  name: process.env.DB_NAME || "",
  host: process.env.DB_HOST || "",
  port: process.env.DB_PORT || "",
  user: process.env.DB_USER || "",
  password: process.env.DB_USER_PWD || "",
  minPoolSize: parseInt(process.env.DB_MIN_POOL_SIZE ?? "5"),
  maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE ?? "10"),
}

export const corsUrl = process.env.CORS_URL

export const tokenInfo = {
  accessTokenValidity: parseInt(
    process.env.ACCESS_TOKEN_VALIDITY_SEC ?? "3600"
  ),
  refreshTokenValidity: parseInt(
    process.env.REFRESH_TOKEN_VALIDITY_SEC ?? "86400"
  ),
  issuer: process.env.TOKEN_ISSUER ?? "todo-backend",
  audience: process.env.TOKEN_AUDIENCE ?? "todo-frontend",
  secret: process.env.TOKEN_SECRET ?? "abc123def456",
  algorithm: process.env.TOKEN_ALGORITHM ?? "HS256",
}

export const redis = {
  host: process.env.REDIS_HOST || "",
  port: process.env.REDIS_PORT || "",
  password: process.env.REDIS_PASSWORD || "",
  username: process.env.REDIS_USERNAME || "",
}

export const caching = {
  contentCacheDuration: process.env.CONTENT_CACHE_DURATION_MILLIS ?? "6000000",
}
