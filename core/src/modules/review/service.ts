import { Prisma } from "../../generated/prisma/client.js"
import { db } from "../../lib/database.js"
import type { ReviewBody } from "./types.js"

export class ReviewAlreadyExistsError extends Error {
	constructor() {
		super("You've already reviewed this manhwa")
		this.name = "ReviewAlreadyExistsError"
	}
}

const getReviewByUserAndManhwa = async (userId: number, manhwaId: number) => {
	return await db.review.findUnique({ where: { userId_manhwaId: { userId, manhwaId } } })
}

const createReview = async (userId: number, manhwaId: number, input: ReviewBody) => {
	if (await getReviewByUserAndManhwa(userId, manhwaId)) {
		throw new ReviewAlreadyExistsError()
	}

	try {
		return await db.review.create({
			data: { userId, manhwaId, rating: input.rating, comment: input.comment },
			include: { user: { select: { id: true, username: true, avatarUrl: true } } },
		})
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
			throw new ReviewAlreadyExistsError()
		}

		throw error
	}
}

const listReviewsForManhwa = async (manhwaId: number, page: number, perPage = 10) => {
	const [reviews, total] = await Promise.all([
		db.review.findMany({
			where: { manhwaId },
			skip: (page - 1) * perPage,
			take: perPage,
			orderBy: { createdAt: "desc" },
			include: { user: { select: { id: true, username: true, avatarUrl: true } } },
		}),
		db.review.count({ where: { manhwaId } }),
	])

	return { reviews, total, page, perPage }
}

const updateReview = async (userId: number, manhwaId: number, input: ReviewBody) => {
	return await db.review.update({
		where: { userId_manhwaId: { userId, manhwaId } },
		data: { rating: input.rating, comment: input.comment },
		include: { user: { select: { id: true, username: true, avatarUrl: true } } },
	})
}

const getReviewSummaryForManhwa = async (manhwaId: number) => {
	const [aggregate, reviews] = await Promise.all([
		db.review.aggregate({ where: { manhwaId }, _avg: { rating: true }, _count: { _all: true } }),
		db.review.findMany({
			where: { manhwaId },
			take: 5,
			orderBy: { createdAt: "desc" },
			include: { user: { select: { id: true, username: true, avatarUrl: true } } },
		}),
	])

	return {
		averageRating: aggregate._avg.rating,
		reviewCount: aggregate._count._all,
		reviews,
	}
}

export default {
	createReview,
	listReviewsForManhwa,
	getReviewByUserAndManhwa,
	updateReview,
	getReviewSummaryForManhwa,
}