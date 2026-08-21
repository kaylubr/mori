import type { Request, Response, NextFunction } from "express"
import { ZodError } from "zod"

import type { User } from "../auth/types.js"
import { reviewBodySchema, reviewListQuerySchema, reviewParamsSchema } from "./schema.js"
import reviewService, { ReviewAlreadyExistsError } from "./service.js"

const getUserId = (req: Request) => (req.user as User).id

const create = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id: manhwaId } = reviewParamsSchema.parse(req.params)
		const input = reviewBodySchema.parse(req.body)
		const review = await reviewService.createReview(getUserId(req), manhwaId, input)

		return res.status(201).json({ review })
	} catch (error) {
		if (error instanceof ZodError) {
			return res.status(400).json({ error: "Invalid review" })
		}

		if (error instanceof ReviewAlreadyExistsError) {
			return res.status(409).json({ error: error.message })
		}

		return next(error)
	}
}

const list = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id: manhwaId } = reviewParamsSchema.parse(req.params)
		const { page, perPage } = reviewListQuerySchema.parse(req.query)

		return res.json(await reviewService.listReviewsForManhwa(manhwaId, page, perPage))
	} catch (error) {
		if (error instanceof ZodError) {
			return res.status(400).json({ error: "Invalid review listing parameters" })
		}

		return next(error)
	}
}

export default { create, list }