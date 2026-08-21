import { db } from "../../lib/database.js"
import { searchSeries } from "../../lib/mangaUpdatesClient.js"
import { mapSeriesToManhwa } from "./mapper.js"
import {
	mangaUpdatesSearchRequestSchema,
	mangaUpdatesSearchResponseSchema,
} from "./types.js"

export const buildSearchRequest = (page = 1, perPage = 50) => {
	return mangaUpdatesSearchRequestSchema.parse({
		search: "",
		type: ["Manhwa"],
		page,
		perpage: perPage,
	})
}

export const importManhwaFromMangaUpdates = async () => {
	const response = mangaUpdatesSearchResponseSchema.parse(await searchSeries(buildSearchRequest()))

	for (const { record } of response.results) {
		const mapped = mapSeriesToManhwa(record)
		const { genres, ...manhwaData } = mapped

		await db.manhwa.upsert({
			where: { externalId: mapped.externalId },
			create: {
				...manhwaData,
				latestChapterNumber: 0,
				tags: {
					connectOrCreate: genres.map((name) => ({
						where: { name },
						create: { name },
					})),
				},
			},
			update: {
				...manhwaData,
				tags: {
					connectOrCreate: genres.map((name) => ({
						where: { name },
						create: { name },
					})),
				},
			},
		})
	}

	return { imported: response.results.length }
}