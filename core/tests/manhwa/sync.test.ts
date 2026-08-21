import { beforeEach, describe, expect, it, vi } from "vitest"

import { db } from "../../src/lib/database.js"
import { searchSeries } from "../../src/lib/mangaUpdatesClient.js"
import { buildSearchRequest, importManhwaFromMangaUpdates } from "../../src/modules/manhwa/syncService.js"

vi.mock("../../src/lib/database.js", () => ({
	db: {
		manhwa: { upsert: vi.fn() },
	},
}))

vi.mock("../../src/lib/mangaUpdatesClient.js", () => ({
	searchSeries: vi.fn(),
}))

const makeRecord = (seriesId: number) => ({
	series_id: seriesId,
	title: `Manhwa ${seriesId}`,
	url: `https://www.mangaupdates.com/series/${seriesId}/manhwa-${seriesId}`,
	description: `Description ${seriesId}`,
	image: {
		url: {
			original: `https://cdn.mangaupdates.com/image/${seriesId}.jpg`,
			thumb: `https://cdn.mangaupdates.com/image/thumb-${seriesId}.jpg`,
		},
		height: 232,
		width: 160,
	},
	type: "Manhwa",
	genres: [{ genre: "Drama" }],
})

describe("importManhwaFromMangaUpdates", () => {
	beforeEach(() => {
		vi.clearAllMocks()
		vi.mocked(db.manhwa.upsert).mockResolvedValue({} as never)
		vi.mocked(searchSeries).mockResolvedValue({
			total_hits: 50,
			page: 1,
			per_page: 50,
			results: Array.from({ length: 50 }, (_, index) => ({ record: makeRecord(17360452316 + index) })),
		})
	})

	it("builds the default MangaUpdates search request", () => {
		expect(buildSearchRequest()).toEqual({ type: ["Manhwa"], page: 1, perpage: 50 })
	})

	it("upserts 50 records with connected genres and is safe to rerun", async () => {
		await importManhwaFromMangaUpdates()
		await importManhwaFromMangaUpdates()

		expect(searchSeries).toHaveBeenCalledWith({ type: ["Manhwa"], page: 1, perpage: 50 })
		expect(db.manhwa.upsert).toHaveBeenCalledTimes(100)
		expect(db.manhwa.upsert).toHaveBeenCalledWith(expect.objectContaining({
		where: { externalId: "17360452316" },
		create: expect.objectContaining({
			externalId: "17360452316",
			tags: { connectOrCreate: [{ where: { name: "Drama" }, create: { name: "Drama" } }] },
		}),
	}))
	})
})
