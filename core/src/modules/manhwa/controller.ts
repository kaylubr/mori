import type { Request, Response, NextFunction } from "express"
import { ZodError } from "zod"

import { manhwaListQuerySchema, manhwaParamsSchema } from "./types.js"
import manhwaService from "./service.js"

const list = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { page, perPage } = manhwaListQuerySchema.parse(req.query)
		return res.json(await manhwaService.listManhwas(page, perPage))
	} catch (error) {
		if (error instanceof ZodError) {
			return res.status(400).json({ error: "Invalid manhwa listing parameters" })
		}

		return next(error)
	}
}

const get = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { seriesId } = manhwaParamsSchema.parse(req.params)
		return res.json({ manhwa: await manhwaService.getManhwa(seriesId) })
	} catch (error) {
		if (error instanceof ZodError) {
			return res.status(400).json({ error: "Invalid series id" })
		}

		return next(error)
	}
}

export default { list, get }
