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

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     tags:
 *       - users
 *     summary: Register a new user
 *     description: Creates a new user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *     responses:
 *       201:
 *         description: User successfully registered
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: User already exists
 */

router
  .route("/register")
  .post(
    validateRequest(userRegisterSchema, ValidationSource.BODY),
    registerUser
  )

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     tags:
 *       - users
 *     summary: Login user
 *     description: Authenticate a user and return a token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 */

router
  .route("/login")
  .post(validateRequest(userLoginSchema, ValidationSource.BODY), loginUser)

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     tags:
 *       - users
 *     summary: Logout user
 *     description: Logout the currently authenticated user
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       401:
 *         description: Not authenticated
 */
router.route("/logout").get(logoutUser)

router
  .route("/refresh")
  .post(
    validateRequest(refreshTokenSchema, ValidationSource.BODY),
    refreshAccessToken
  )

export default router
