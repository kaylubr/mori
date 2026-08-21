import request from "supertest"
import { describe, expect, it, vi } from "vitest"
import { getSeries, searchSeries } from "../../src/lib/mangaUpdatesClient.js"

import app from "../../src/app.js"

vi.mock("../../src/lib/mangaUpdatesClient.js", () => ({
  searchSeries: vi.fn(),
  getSeries: vi.fn(),
}))


describe("Manhwa endpoints", () => {
  it("returns a default list of 50 manhwas with titles and thumbnails", async () => {
    vi.mocked(searchSeries).mockResolvedValue({
      total_hits: 1,
      page: 1,
      per_page: 50,
      results: [{
        record: {
          series_id: 1,
          title: "Example Manhwa",
          url: "https://www.mangaupdates.com/series/example/example-manhwa",
          description: "An example.",
          image: {
            url: {
              original: "https://cdn.mangaupdates.com/image/example.jpg",
              thumb: "https://cdn.mangaupdates.com/image/thumb/example.jpg",
            },
            height: 232,
            width: 160,
          },
          type: "Manhwa",
        },
      }],
    })

    const response = await request(app).get("/api/manhwa")

    expect(response.status).toBe(200)
    expect(response.body.manhwas).toEqual([{
      seriesId: 1,
      title: "Example Manhwa",
      thumbnailUrl: "https://cdn.mangaupdates.com/image/thumb/example.jpg",
    }])
    expect(searchSeries).toHaveBeenCalledWith({ type: ["Manhwa"], page: 1, perpage: 50 })
  })

  it("returns one manhwa with description and review/comment collections", async () => {
    vi.mocked(getSeries).mockResolvedValue({
      series_id: 1,
      title: "Example Manhwa",
      url: "https://www.mangaupdates.com/series/example/example-manhwa",
      description: "A detailed description.",
      image: {
        url: {
          original: "https://cdn.mangaupdates.com/image/example.jpg",
          thumb: "https://cdn.mangaupdates.com/image/thumb/example.jpg",
        },
        height: 232,
        width: 160,
      },
      type: "Manhwa",
      latest_chapter: 12,
      status: "12 Chapters (Ongoing)",
    })

    const response = await request(app).get("/api/manhwa/1")

    expect(response.status).toBe(200)
    expect(response.body.manhwa).toMatchObject({
      seriesId: 1,
      title: "Example Manhwa",
      description: "A detailed description.",
      latestChapter: 12,
      reviews: [],
      comments: [],
    })
    expect(getSeries).toHaveBeenCalledWith(1)
  })

  it("rejects an invalid series id", async () => {
    const response = await request(app).get("/api/manhwa/not-a-number")

    expect(response.status).toBe(400)
    expect(response.body.error).toBe("Invalid series id")
  })
})
