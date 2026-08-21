import { z } from "zod"

export const shelfBodySchema = z.object({
	manhwaId: z.coerce.number().int().positive(),
})

export const shelfParamsSchema = z.object({
	manhwaId: z.coerce.number().int().positive(),
})