import type { MangaUpdatesSeriesSummary, MappedManhwa } from "./types.js"

export const mapSeriesToManhwa = (record: MangaUpdatesSeriesSummary): MappedManhwa => ({
  title: record.title,
  description: record.description,
  thumbnailUrl: record.image?.url.original ?? record.image?.url.thumb ?? "",
  externalId: String(record.series_id),
  genres: record.genres.map(({ genre }) => genre),
})
