export enum DynamicKey {
  USER_TODOS = "USER_TODOS",
}

function getDynamicKey(key: DynamicKey, userId: string) {
  return `${key}:${userId}`
}

export function getUserTodosKey(userId: string) {
  return getDynamicKey(DynamicKey.USER_TODOS, userId)
}
