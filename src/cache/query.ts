import cache from "."

export async function setJson(
  key: string,
  value: Record<string, unknown>,
  expireAt: Date | null = null
) {
  const json = JSON.stringify(value)
  if (expireAt) {
    const ttlMillis = expireAt?.getTime() - Date.now()
    return cache.set(key, json, { PX: ttlMillis })
  } else {
    return cache.set(key, json)
  }
}

export async function getJson<T>(key: string) {
  const type = await cache.type(key)
  if (type !== "string") return null

  const json = await cache.get(key)
  if (json) return JSON.parse(json) as T

  return null
}
