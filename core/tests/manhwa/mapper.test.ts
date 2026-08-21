import { describe, expect, it } from "vitest"

import { mapSeriesToManhwa } from "../../src/modules/manhwa/mapper.js"

describe("mapSeriesToManhwa", () => {
	it("maps a MangaUpdates record into import data", () => {
		const result = mapSeriesToManhwa({
			series_id: 17360452316,
			title: "9 Madeleine Street",
			url: "https://www.mangaupdates.com/series/example/9-madeleine-street",
			description: "A slice of life story.",
			image: {
				url: {
					original: "https://cdn.mangaupdates.com/image/original.jpg",
					thumb: "https://cdn.mangaupdates.com/image/thumb.jpg",
				},
				height: 213,
				width: 160,
			},
			type: "Manhwa",
			genres: [{ genre: "Drama" }, { genre: "Slice of Life" }],
		})

		expect(result).toEqual({
			title: "9 Madeleine Street",
			description: "A slice of life story.",
			thumbnailUrl: "https://cdn.mangaupdates.com/image/original.jpg",
			externalId: "17360452316",
			genres: ["Drama", "Slice of Life"],
		})
	})
})
