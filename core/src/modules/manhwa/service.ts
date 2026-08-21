import manhwaRepository from "./repository.js"

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
	}
}

export default { listManhwa, getManhwaById }
