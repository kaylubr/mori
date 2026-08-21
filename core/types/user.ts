import { z } from "zod"

export const userSchema = z.object({
	id: z.number(),
	email: z.string(),
	passwordHash: z.string().nullable(),
	googleId: z.string().nullable(),
	githubId: z.string().nullable(),
	username: z.string(),
	avatarUrl: z.string().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export const publicUserSchema = userSchema.omit({ passwordHash: true, googleId: true, githubId: true })

export type User = z.infer<typeof userSchema>
export type PublicUser = z.infer<typeof publicUserSchema>