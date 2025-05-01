import { sign, SignOptions, decode as jwtDecode, verify } from "jsonwebtoken"
import {
  BadRequestError,
  BadTokenError,
  InternalError,
  TokenExpiredError,
} from "./CustomError"

export class JwtPayload {
  aud: string
  sub: string
  iss: string
  iat: number
  exp: number
  prm: string
  constructor(
    issuer: string,
    audience: string,
    subject: string,
    param: string,
    validity: number
  ) {
    this.iss = issuer
    this.aud = audience
    this.sub = subject
    this.iat = Math.floor(Date.now() / 1000)
    this.exp = this.iat + validity
    this.prm = param
  }
}

function encode(payload: JwtPayload, secret: string): Promise<string> {
  if (!secret) throw new InternalError("Token generation failure")
  const options: SignOptions = { algorithm: "HS256" }
  try {
    return new Promise((resolve, reject) => {
      sign({ ...payload }, secret, options, (err, token) => {
        if (err) return reject(new InternalError("Token generation failure"))
        resolve(token as string)
      })
    })
  } catch (error) {
    throw new InternalError("Token generation failure")
  }
}

async function decode(token: string): Promise<JwtPayload> {
  if (!token) throw new InternalError("Token decoding failure")

  try {
    const decoded = jwtDecode(token)
    console.log("🚀 ~ decode ~ decoded:", decoded)
    if (!decoded || typeof decoded === "string") throw new BadTokenError()
    return decoded as JwtPayload
  } catch (error) {
    throw new BadTokenError()
  }
}

async function validate(token: string, secret: string): Promise<JwtPayload> {
  if (!token) throw new InternalError("Token validation failure")
  try {
    return new Promise((resolve, reject) => {
      verify(token, secret, (err, decoded) => {
        if (err) {
          if (err?.name === "TokenExpiredError") {
            return reject(new TokenExpiredError())
          }
          return reject(new BadRequestError())
        }
        resolve(decoded as JwtPayload)
      })
    })
  } catch (error) {
    throw new InternalError("Token generation failure")
  }
}

export default {
  encode,
  decode,
  validate,
}
