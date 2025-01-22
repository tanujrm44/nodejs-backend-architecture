import mongoose, { Schema } from "mongoose"

const todoModel = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "not-started",
      enum: ["not-started", "in-progress", "done"],
    },
  },
  {
    timestamps: true,
  }
)

const Todo = mongoose.model("Todo", todoModel)

export default Todo
