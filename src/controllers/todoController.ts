// import todoCache from "../cache/todoCache"
import asyncHandler from "../helpers/asyncHandler"
import Todo from "../models/todoModel"
import { ProtectedRequest } from "../types/app-request"
import { Response } from "express"
const createTodo = asyncHandler(
  async (req: ProtectedRequest, res: Response) => {
    const { title, description } = req.body

    if (!title || !description) {
      res.status(400)
      throw new Error("Title and Description are required")
    }

    await Todo.create({ user: req.user, title, description })

    // await todoCache.invalidateUserTodos(req.user._id.toString())

    res.status(201).json({ title, description })
  }
)

const getTodos = asyncHandler(
  async (req: ProtectedRequest, res: Response): Promise<void> => {
    // Try fetching todos from cache first
    // let todos = await todoCache.fetchUserTodos(req.user._id.toString())
    let todos: any = await Todo.find({ user: req.user._id })
    // if (todos) {

    // console.log("cache found", todos)

    if (!todos) {
      // If not in cache, fetch from database
      todos = await Todo.find({ user: req.user._id })
      if (!todos || todos.length === 0) {
        res.status(404)
        throw new Error("No todos found")
      }

      // Save to cache
      // await todoCache.saveUserTodos(req.user._id.toString(), todos)
    }

    res.status(200).json(todos)
  }
)

const editTodo = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const { title, description, status } = req.body

  const user = req.user

  if (!title || !description || !status) {
    res.status(400)
    throw new Error("Title, Description, and Status are required")
  }

  const todo = await Todo.findById(req.params.id)

  if (todo?.user.toString() !== user._id.toString()) {
    res.status(401)
    throw new Error("Not authorized to update this todo")
  }

  if (!todo) {
    res.status(404)
    throw new Error("Todo not found")
  }

  todo.title = title
  todo.description = description
  todo.status = status

  const updatedTodo = await todo.save()

  // await todoCache.invalidateUserTodos(req.user._id.toString())

  res.json(updatedTodo)
})

const deleteTodo = asyncHandler(
  async (req: ProtectedRequest, res: Response) => {
    const todo = await Todo.findById(req.params.id)

    if (todo) {
      await todo.deleteOne()
      // await todoCache.invalidateUserTodos(req.user._id.toString())
      res.json({ message: "Todo removed" })
    } else {
      res.status(404)
      throw new Error("Todo not found")
    }
  }
)

export { createTodo, getTodos, editTodo, deleteTodo }
