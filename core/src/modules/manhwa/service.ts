import {
	mangaUpdatesSearchRequestSchema,
	mangaUpdatesSearchResponseSchema,
	mangaUpdatesSeriesSchema,
} from "../../../types/manhwa.js"
import { getSeries, searchSeries } from "../../lib/mangaUpdatesClient.js"

const listManhwas = async (page: number, perPage: number) => {
	const request = mangaUpdatesSearchRequestSchema.parse({ type: ["Manhwa"], page, perpage: perPage })
	const response = mangaUpdatesSearchResponseSchema.parse(await searchSeries(request))

	return {
		total: response.total_hits,
		page: response.page,
		perPage: response.per_page,
		manhwas: response.results.map(({ record }) => ({
			seriesId: record.series_id,
			title: record.title,
			thumbnailUrl: record.image?.url.thumb ?? null,
		})),
	}
}

const getManhwa = async (seriesId: number) => {
	const series = mangaUpdatesSeriesSchema.parse(await getSeries(seriesId))

	return {
		seriesId: series.series_id,
		title: series.title,
		description: series.description,
		thumbnailUrl: series.image?.url.original ?? null,
		sourceUrl: series.url,
		latestChapter: series.latest_chapter,
		status: series.status ?? null,
		reviews: [],
		comments: [],
	}
}

export default { listManhwas, getManhwa }
