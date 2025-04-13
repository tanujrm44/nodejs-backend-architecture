import express from "express"
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/userController"
import validateRequest, { ValidationSource } from "../helpers/validator"
import { userLoginSchema } from "./userSchema"

const router = express.Router()

router
  .route("/login")
  .post(validateRequest(userLoginSchema, ValidationSource.BODY), loginUser)
router.route("/register").post(registerUser)
router.route("/logout").get(logoutUser)

export default router
