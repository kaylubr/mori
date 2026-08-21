import { db } from "../../lib/database.js"

const listManhwas = async (page: number, perPage: number) => {
	const [manhwas, total] = await Promise.all([
		db.manhwa.findMany({
			skip: (page - 1) * perPage,
			take: perPage,
			orderBy: { title: "asc" },
			select: { id: true, externalId: true, title: true, thumbnailUrl: true },
		}),
		db.manhwa.count(),
	])

	return {
		total,
		page,
		perPage,
		manhwas,
	}
}

const getManhwa = async (externalId: string) => {
	const manhwa = await db.manhwa.findUnique({
		where: { externalId },
		include: {
			tags: true,
			reviews: {
				include: {
					user: {
						select: { id: true, username: true, avatarUrl: true },
					},
				},
				orderBy: { createdAt: "desc" },
			},
			chapters: { orderBy: { chapterNumber: "desc" } },
		},
	})

	if (!manhwa) {
		return null
	}

	return {
		...manhwa,
		comments: manhwa.reviews.map(({ id, comment, user, createdAt, updatedAt }) => ({
			id,
			comment,
			user,
			createdAt,
			updatedAt,
		})),
	}
}

export default { listManhwas, getManhwa }
