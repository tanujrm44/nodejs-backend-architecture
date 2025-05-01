import express from "express"
import {
  createTodo,
  getTodos,
  editTodo,
  deleteTodo,
} from "../controllers/todoController"
import { protect } from "../middleware/authMiddleware"
import apiKey from "../auth/apiKey"
import permission from "../helpers/permission"
import { Permission } from "../models/ApiKeyModel"
import authentication from "../auth/authentication"
const router = express.Router()

router.use(apiKey)

router.use(permission(Permission.GENERAL))

router.route("/").post(protect, createTodo).get(authentication, getTodos)
router.route("/:id").put(protect, editTodo).delete(protect, deleteTodo)

export default router
