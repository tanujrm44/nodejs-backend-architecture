import express from "express"
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/userController"
import validateRequest, { ValidationSource } from "../helpers/validator"
import {
  refreshTokenSchema,
  userLoginSchema,
  userRegisterSchema,
} from "./userSchema"

const router = express.Router()

router
  .route("/login")
  .post(validateRequest(userLoginSchema, ValidationSource.BODY), loginUser)
router
  .route("/register")
  .post(
    validateRequest(userRegisterSchema, ValidationSource.BODY),
    registerUser
  )
router
  .route("/refresh")
  .post(
    validateRequest(refreshTokenSchema, ValidationSource.BODY),
    refreshAccessToken
  )
router.route("/logout").get(logoutUser)

export default router
