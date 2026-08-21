import manhwaRepository from "./repository.js"
import reviewService from "../review/service.js"

const listManhwa = async (page: number, perPage: number) => {
	const { manhwas, total } = await manhwaRepository.listManhwa({ page, perPage })

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
	const manhwa = await manhwaRepository.getManhwaById(id)

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
