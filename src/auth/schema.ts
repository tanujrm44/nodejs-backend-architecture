import { z } from "zod"
import { Header } from "./utils"

export const ZodAuthBearer = z
  .string()
  .refine(value => value.startsWith("Bearer"), {
    message: "Authorization Header must start with Bearer",
  })
  .refine(value => value.split(" ")[1], {
    message: "Authorization Header must contain a token",
  })

export default {
  apiKey: z.object({
    [Header.API_KEY]: z.string().nonempty("API key is required"),
  }),
  auth: z.object({
    authorization: ZodAuthBearer,
  }),
}
