import { z } from "zod"

export const userLoginSchema = z.object({
  email: z.string().email({
    message: "Inavlid email",
  }),
  password: z.string(),
})
