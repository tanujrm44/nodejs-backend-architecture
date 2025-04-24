import express from "express"
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/userController"
import validateRequest, { ValidationSource } from "../helpers/validator"
import { userLoginSchema, userRegisterSchema } from "./userSchema"
import apiKey from "../auth/apiKey"

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
router.route("/logout").get(logoutUser)

export default router
