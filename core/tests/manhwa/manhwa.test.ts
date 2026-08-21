import request from "supertest"
import session from "express-session"
import { beforeEach, describe, expect, it, vi } from "vitest"

import app from "../../src/app.js"
import { db } from "../../src/lib/database.js"

vi.mock("@quixo3/prisma-session-store", () => ({
	PrismaSessionStore: class extends session.MemoryStore {},
}))

vi.mock("../../src/lib/database.js", () => ({
	db: {
		manhwa: {
			findMany: vi.fn(),
			count: vi.fn(),
			findUnique: vi.fn(),
		},
		user: {
			findFirst: vi.fn(),
			findUnique: vi.fn(),
			create: vi.fn(),
			update: vi.fn(),
			findMany: vi.fn(),
		},
	},
}))

describe("Manhwa endpoints", () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it("returns the imported manhwa list from Postgres", async () => {
		vi.mocked(db.manhwa.findMany).mockResolvedValue([
			{ id: 1, externalId: "40205318159", title: "Example Manhwa", thumbnailUrl: "https://cdn.example.com/thumb.jpg" },
		] as never)
		vi.mocked(db.manhwa.count).mockResolvedValue(1)

		const response = await request(app).get("/api/manhwa")

		expect(response.status).toBe(200)
		expect(response.body.manhwas).toEqual([{
			id: 1,
			externalId: "40205318159",
			title: "Example Manhwa",
			thumbnailUrl: "https://cdn.example.com/thumb.jpg",
		}])
		expect(db.manhwa.findMany).toHaveBeenCalledWith(expect.objectContaining({ skip: 0, take: 50 }))
	})

	it("returns one imported manhwa with reviews, comments, and attribution", async () => {
		vi.mocked(db.manhwa.findUnique).mockResolvedValue({
			id: 1,
			externalId: "40205318159",
			title: "Example Manhwa",
			description: "A detailed description.",
			thumbnailUrl: "https://cdn.example.com/original.jpg",
			tags: [{ id: 1, name: "Romance" }],
			reviews: [],
			chapters: [],
		} as never)

		const response = await request(app).get("/api/manhwa/40205318159")

		expect(response.status).toBe(200)
		expect(response.body.manhwa).toMatchObject({
			externalId: "40205318159",
			title: "Example Manhwa",
			description: "A detailed description.",
			reviews: [],
		})
		expect(response.body.attribution).toBe("Data from MangaUpdates")
		expect(db.manhwa.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { externalId: "40205318159" } }))
	})

	it("returns 404 for an unimported manhwa", async () => {
		vi.mocked(db.manhwa.findUnique).mockResolvedValue(null)

		const response = await request(app).get("/api/manhwa/40205318159")

		expect(response.status).toBe(404)
		expect(response.body.error).toBe("Manhwa not found")
	})
})
