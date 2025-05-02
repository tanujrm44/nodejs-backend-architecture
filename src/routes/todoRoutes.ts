import express from "express"
import {
  createTodo,
  getTodos,
  editTodo,
  deleteTodo,
} from "../controllers/todoController"
import apiKey from "../auth/apiKey"
import permission from "../helpers/permission"
import { Permission } from "../models/apiKeyModel"
import authentication from "../auth/authentication"
import role from "../helpers/role"
import { RoleCode } from "../models/roleModel"
import authorization from "../auth/authorization"
const router = express.Router()

router.use(apiKey)

router.use(permission(Permission.GENERAL))

router.use(authentication)

router
  .route("/")
  .post(createTodo)
  .get(role(RoleCode.ADMIN), authorization, getTodos)
router.route("/:id").put(editTodo).delete(deleteTodo)

export default router
