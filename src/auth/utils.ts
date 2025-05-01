import { Types } from "mongoose"
import { tokenInfo } from "../config"
import { BadRequestError, InternalError } from "../core/CustomError"
import JWT, { JwtPayload } from "../core/JWT"
import { UserDoc } from "../models/userModel"

export enum Header {
  API_KEY = "x-api-key",
}

export async function createTokens(
  user: UserDoc,
  accessTokenKey: string,
  refreshTokenKey: string
) {
  const accessToken = await JWT.encode(
    new JwtPayload(
      tokenInfo.issuer,
      tokenInfo.audience,
      user._id.toString(),
      accessTokenKey,
      tokenInfo.accessTokenValidity
    ),
    tokenInfo.secret
  )

  if (!accessToken) throw new InternalError()

  const refreshToken = await JWT.encode(
    new JwtPayload(
      tokenInfo.issuer,
      tokenInfo.audience,
      user._id.toString(),
      refreshTokenKey,
      tokenInfo.refreshTokenValidity
    ),
    tokenInfo.secret
  )

  if (!refreshToken) throw new InternalError()

  return { accessToken, refreshToken }
}

export const getAccessToken = (authorization?: string) => {
  if (!authorization) throw new BadRequestError("Invalid Authorization")
  if (!authorization.startsWith("Bearer"))
    throw new BadRequestError("Invalid Authorization")
  return authorization.split(" ")[1]
}

export const validateTokenData = (payload: JwtPayload): boolean => {
  console.log("🚀 ~ validateTokenData ~ payload:", payload)
  if (
    !payload ||
    !payload.iss ||
    !payload.aud ||
    !payload.sub ||
    !payload.prm ||
    payload.iss !== tokenInfo.issuer ||
    payload.aud !== tokenInfo.audience ||
    !Types.ObjectId.isValid(payload.sub)
  ) {
    throw new BadRequestError("Invalid access/refresh token")
  }
  return true
}
