import { z } from "zod"

export const manhwaListQuerySchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	perPage: z.coerce.number().int().positive().max(100).default(50),
})

export const manhwaIdParamsSchema = z.object({
	id: z.coerce.number().int().positive(),
})

export type ManhwaListQuery = z.infer<typeof manhwaListQuerySchema>