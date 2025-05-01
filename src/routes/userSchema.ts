import { z } from "zod"

export const userLoginSchema = z.object({
  email: z.string().email({
    message: "Inavlid email",
  }),
  password: z.string(),
})

export const userRegisterSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters long",
  }),
  email: z.string().email({
    message: "Inavlid email",
  }),
  password: z
    .string()
    .min(6, {
      message: "Password must be at least 6 characters long",
    })
    .max(20, {
      message: "Password must be at most 20 characters long",
    }),
})

export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
})
