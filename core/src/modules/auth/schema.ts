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

export const oauthProfileSchema = z.object({
  id: z.string(),
  emails: z.array(z.object({ value: z.string().optional() })).optional(),
  photos: z.array(z.object({ value: z.string().optional() })).optional(),
  _json: z.object({
    email: z.string().optional(),
    avatar_url: z.string().optional(),
  }).optional(),
})

export type OAuthProfile = z.infer<typeof oauthProfileSchema>

export const passportInfoSchema = z.object({
  code: z.enum(["no-account", "passwordless", "invalid-credentials"]),
})

export type PassportInfo = z.infer<typeof passportInfoSchema>