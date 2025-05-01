import asyncHandler from "../helpers/asyncHandler"
import Todo from "../models/todoModel"
import { ProtectedRequest } from "../types/app-request"
import { Response } from "express"

const createTodo = asyncHandler(
  async (req: ProtectedRequest, res: Response) => {
    const { title, description } = req.body
    console.log(req.user)

    if (!title || !description) {
      res.status(400)
      throw new Error("Title and Description are required")
    }

    await Todo.create({ user: req.user, title, description })

    res.status(201).json({ title, description })
  }
)

const getTodos = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const user = req.user
  const todos = await Todo.find({
    user: user,
  })
  res.json(todos)
})

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

  res.json(updatedTodo)
})

const deleteTodo = asyncHandler(
  async (req: ProtectedRequest, res: Response) => {
    const todo = await Todo.findById(req.params.id)

    if (todo) {
      await todo.deleteOne()
      res.json({ message: "Todo removed" })
    } else {
      res.status(404)
      throw new Error("Todo not found")
    }
  }
)

export { createTodo, getTodos, editTodo, deleteTodo }
