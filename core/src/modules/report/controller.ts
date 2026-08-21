import type { Request, Response, NextFunction } from "express"
import { ZodError } from "zod"

import type { User } from "../auth/types.js"
import { reportBodySchema, reportParamsSchema } from "./schema.js"
import reportService, { ReviewNotFoundError } from "./service.js"

const create = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { reviewId } = reportParamsSchema.parse(req.params)
		const { reason } = reportBodySchema.parse(req.body)
		const report = await reportService.createReport((req.user as User).id, reviewId, reason)

		return res.status(201).json({ report })
	} catch (error) {
		if (error instanceof ZodError) {
			return res.status(400).json({ error: "Invalid report" })
		}

		if (error instanceof ReviewNotFoundError) {
			return res.status(404).json({ error: error.message })
		}

		return next(error)
	}
}

export default { create }