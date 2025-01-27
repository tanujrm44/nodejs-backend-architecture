import { Response } from "express"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"

const generateToken = (res: Response, userId: mongoose.Types.ObjectId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  })

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, //30days
  })
}

export default generateToken
