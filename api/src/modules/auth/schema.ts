import { z } from "zod"

export const registerSchema = z.object({
  username: z.string().min(1),
  email: z.email(),
  password: z.string().min(8),
})

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})