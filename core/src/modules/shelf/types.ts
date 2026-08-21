import type { z } from "zod"

import type { shelfBodySchema } from "./schema.js"

export type ShelfBody = z.infer<typeof shelfBodySchema>
export type ShelfEntry = {
	id: number
	manhwaId: number
	addedAt: Date
	updatedAt: Date
}