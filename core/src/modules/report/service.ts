import { db } from "../../lib/database.js"
import type { ReportBody } from "./types.js"

export class ReviewNotFoundError extends Error {
	constructor() {
		super("Review not found")
		this.name = "ReviewNotFoundError"
	}
}

const createReport = async (reporterId: number, reviewId: number, reason: ReportBody["reason"]) => {
	const review = await db.review.findUnique({ where: { id: reviewId }, select: { id: true } })

	if (!review) {
		throw new ReviewNotFoundError()
	}

	return await db.report.create({
		data: {
			reporterId,
			reviewId,
			reason,
			status: "PENDING",
		},
	})
}

export default { createReport }