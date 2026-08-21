import { z } from "zod"

export const mangaUpdatesSearchRequestSchema = z.object({
  type: z.array(z.literal("Manhwa")).min(1),
  page: z.number().int().positive(),
  perpage: z.number().int().positive().max(50),
})

export type MangaUpdatesSearchRequest = z.infer<typeof mangaUpdatesSearchRequestSchema>

export const manhwaListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().positive().max(50).default(50),
})

export const manhwaParamsSchema = z.object({
  externalId: z.string().min(1),
})

const mangaUpdatesImageSchema = z.object({
  url: z.object({
    original: z.url(),
    thumb: z.url(),
  }),
  height: z.number().nonnegative(),
  width: z.number().nonnegative(),
})

const mangaUpdatesGenreSchema = z.object({ genre: z.string() })

const mangaUpdatesLastUpdatedSchema = z.object({
  timestamp: z.number(),
  as_rfc3339: z.string().nullable(),
  as_string: z.string().nullable(),
})

export const mangaUpdatesSeriesSummarySchema = z.object({
  series_id: z.number(),
  title: z.string(),
  url: z.url(),
  description: z.string().nullable().transform((description) => description ?? "").default(""),
  image: mangaUpdatesImageSchema.optional(),
  type: z.string(),
  year: z.string().optional(),
  bayesian_rating: z.number().nullable().optional(),
  rating_votes: z.number().nullable().optional(),
  genres: z.array(mangaUpdatesGenreSchema).optional().default([]),
  last_updated: mangaUpdatesLastUpdatedSchema.nullable().optional(),
})

export const mangaUpdatesSearchResponseSchema = z.object({
  total_hits: z.number().nonnegative(),
  page: z.number().positive(),
  per_page: z.number().positive(),
  results: z.array(z.object({
    record: mangaUpdatesSeriesSummarySchema,
  })),
})

export const mangaUpdatesSeriesSchema = mangaUpdatesSeriesSummarySchema.extend({
  associated: z.array(z.object({ title: z.string() })).optional().default([]),
  categories: z.array(z.unknown()).optional().default([]),
  latest_chapter: z.number().nonnegative(),
  status: z.string().optional(),
  licensed: z.boolean().optional(),
  completed: z.boolean().optional(),
  authors: z.array(z.unknown()).optional().default([]),
  publishers: z.array(z.unknown()).optional().default([]),
})

export type MangaUpdatesSeriesSummary = z.infer<typeof mangaUpdatesSeriesSummarySchema>
export type MangaUpdatesSeries = z.infer<typeof mangaUpdatesSeriesSchema>

export const manhwaListItemSchema = z.object({
  seriesId: z.number(),
  title: z.string(),
  thumbnailUrl: z.string().nullable(),
})

export const manhwaDetailSchema = z.object({
  externalId: z.string(),
  title: z.string(),
  description: z.string(),
  thumbnailUrl: z.string().nullable(),
  sourceUrl: z.url(),
  latestChapter: z.number().nonnegative(),
  status: z.string().nullable(),
  reviews: z.array(z.unknown()),
  comments: z.array(z.unknown()),
})

export type MappedManhwa = {
  title: string
  description: string
  thumbnailUrl: string
  externalId: string
  genres: string[]
}