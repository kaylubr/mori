import { Prisma } from "../../generated/prisma/client.js"
import { db } from "../../lib/database.js"

export class ShelfAlreadyExistsError extends Error {
	constructor() {
		super("Manhwa is already on the shelf")
		this.name = "ShelfAlreadyExistsError"
	}
}

const addToShelf = async (userId: number, manhwaId: number) => {
	try {
		return await db.shelfEntry.create({
			data: { userId, manhwaId },
			include: { manhwa: true },
		})
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
			throw new ShelfAlreadyExistsError()
		}

		throw error
	}
}

const removeFromShelf = async (userId: number, manhwaId: number) => {
		return await db.shelfEntry.deleteMany({ where: { userId, manhwaId } })
}

const listShelfForUser = async (userId: number) => {
	return await db.shelfEntry.findMany({
		where: { userId },
		orderBy: { addedAt: "desc" },
		include: {
			manhwa: {
				select: { id: true, title: true, thumbnailUrl: true, status: true },
			},
		},
	})
}

export default { addToShelf, removeFromShelf, listShelfForUser }