import { db } from "../../lib/database.js"

type ListManhwaParams = {
	page: number
	perPage: number
}

const listManhwa = async ({ page, perPage }: ListManhwaParams) => {
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

	return { manhwas, total }
}

const getManhwaById = async (id: number) => {
	return await db.manhwa.findUnique({
		where: { id },
		include: { tags: true },
	})
}

export default { listManhwa, getManhwaById }