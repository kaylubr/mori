import type { Request, Response, NextFunction } from "express"
import { ZodError } from "zod"

import { manhwaIdParamsSchema, manhwaListQuerySchema } from "./manhwa.schema.js"
import manhwaService from "./service.js"

const list = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { page, perPage } = manhwaListQuerySchema.parse(req.query)
		return res.json(await manhwaService.listManhwa(page, perPage))
	} catch (error) {
		if (error instanceof ZodError) {
			return res.status(400).json({ error: "Invalid manhwa listing parameters" })
		}

		return next(error)
	}
}

const get = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = manhwaIdParamsSchema.parse(req.params)
		const manhwa = await manhwaService.getManhwaById(id)

		if (!manhwa) {
			return res.status(404).json({ error: "Manhwa not found" })
		}

		return res.json({ manhwa, attribution: "Data from MangaUpdates" })
	} catch (error) {
		if (error instanceof ZodError) {
			return res.status(400).json({ error: "Invalid manhwa id" })
		}

		return next(error)
	}
}

export default { list, get }
