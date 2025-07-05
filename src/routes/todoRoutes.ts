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

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     ApiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: x-api-key
 *     Bearer:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Todo:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the todo
 *         description:
 *           type: string
 *           description: Detailed description of the todo
 *         status:
 *           type: boolean
 *           default: false
 *           description: Status of the todo
 */

/**
 * @swagger
 * /api/todo:
 *   post:
 *     tags:
 *       - todos
 *     summary: Create a new todo
 *     security:
 *       - ApiKeyAuth: []
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Todo'
 *     responses:
 *       201:
 *         description: Todo created successfully
 *       401:
 *         description: Not authenticated
 *       400:
 *         description: Invalid input data
 */
router.route("/").post(role(RoleCode.USER), authorization, createTodo)

/**
 * @swagger
 * /api/todo:
 *   get:
 *     tags:
 *       - todos
 *     summary: Get all todos for authenticated user
 *     security:
 *       - ApiKeyAuth: []
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: List of todos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 *       401:
 *         description: Not authenticated
 */
router.route("/").get(role(RoleCode.USER), authorization, getTodos)

/**
 * @swagger
 * /api/todo/{id}:
 *   put:
 *     tags:
 *       - todos
 *     summary: Update a todo
 *     security:
 *       - ApiKeyAuth: []
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Todo ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Todo'
 *     responses:
 *       200:
 *         description: Todo updated successfully
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Todo not found
 */
router.route("/:id").put(editTodo)

/**
 * @swagger
 * /api/todo/{id}:
 *   delete:
 *     tags:
 *       - todos
 *     summary: Delete a todo
 *     security:
 *       - ApiKeyAuth: []
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Todo ID
 *     responses:
 *       200:
 *         description: Todo deleted successfully
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Todo not found
 */
router.route("/:id").delete(deleteTodo)

/**
 * @swagger
 * /api/todo/{id}/status:
 *   put:
 *     tags:
 *       - todos
 *     summary: Update todo status
 *     security:
 *       - ApiKeyAuth: []
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Todo ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - completed
 *             properties:
 *               status:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Todo status updated successfully
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Todo not found
 */
router.route("/:id/status").put(editTodo)

export default router
