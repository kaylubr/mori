import { z } from "zod"

export const reviewBodySchema = z.object({
	rating: z.coerce.number().int().min(1).max(5),
	comment: z.string().trim().min(1),
})

export const reviewParamsSchema = z.object({
	id: z.coerce.number().int().positive(),
})

export const reviewListQuerySchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	perPage: z.coerce.number().int().positive().max(50).default(10),
})