import { db } from "../../lib/database.js"
import reviewService from "../review/service.js"

const listManhwa = async (page: number, perPage: number) => {
	const [manhwas, total] = await Promise.all([
    db.manhwa.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { title: "asc" },
      select: {
        id: true,
        title: true,
        thumbnailUrl: true,
        status: true,
      },
    }),
    db.manhwa.count(),
  ])

	return {
		total,
		page,
		perPage,
		manhwas: manhwas.map(({ id, title, thumbnailUrl, status }) => ({
			id,
			title,
			thumbnailUrl,
			status,
		})),
	}
}

const getManhwaById = async (id: number) => {
	const manhwa = await db.manhwa.findUnique({
    where: { id },
    include: { tags: true },
  })

	if (!manhwa) {
		return null
	}

	const reviewSummary = await reviewService.getReviewSummaryForManhwa(manhwa.id)

	return {
		id: manhwa.id,
		title: manhwa.title,
		description: manhwa.description,
		thumbnailUrl: manhwa.thumbnailUrl,
		status: manhwa.status,
		tags: manhwa.tags.map(({ id: tagId, name }) => ({
			id: tagId,
			name,
		})),
		averageRating: reviewSummary.averageRating,
		reviewCount: reviewSummary.reviewCount,
		reviews: reviewSummary.reviews,
	}
}

export default { listManhwa, getManhwaById }
