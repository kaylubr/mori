import type { Request, Response, NextFunction } from "express"
import { ZodError } from "zod"

import type { User } from "../auth/types.js"
import { shelfBodySchema, shelfParamsSchema } from "./schema.js"
import shelfService, { ShelfAlreadyExistsError } from "./service.js"

const getUserId = (req: Request) => (req.user as User).id

const add = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { manhwaId } = shelfBodySchema.parse(req.body)
		const shelfEntry = await shelfService.addToShelf(getUserId(req), manhwaId)

		return res.status(201).json({ shelfEntry })
	} catch (error) {
		if (error instanceof ZodError) {
			return res.status(400).json({ error: "Invalid manhwaId" })
		}

		if (error instanceof ShelfAlreadyExistsError) {
			return res.status(409).json({ error: error.message })
		}

		return next(error)
	}
}

const remove = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { manhwaId } = shelfParamsSchema.parse(req.params)
		const result = await shelfService.removeFromShelf(getUserId(req), manhwaId)

		if (result.count === 0) {
			return res.status(404).json({ error: "Manhwa is not on the shelf" })
		}

		return res.status(204).send()
	} catch (error) {
		if (error instanceof ZodError) {
			return res.status(400).json({ error: "Invalid manhwaId" })
		}

		return next(error)
	}
}

const list = async (req: Request, res: Response, next: NextFunction) => {
	try {
		return res.json({ shelf: await shelfService.listShelfForUser(getUserId(req)) })
	} catch (error) {
		return next(error)
	}
}

export default { add, remove, list }