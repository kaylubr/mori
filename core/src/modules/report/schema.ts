import { z } from "zod"

export const reportBodySchema = z.object({
	reason: z.enum(["FAKE", "UNHELPFUL", "INAPPROPRIATE", "OTHER"]),
})

export const reportParamsSchema = z.object({
	reviewId: z.coerce.number().int().positive(),
})