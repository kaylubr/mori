import request from "supertest"
import session from "express-session"
import { beforeEach, describe, expect, it, vi } from "vitest"

import app from "../../src/app.js"
import manhwaRepository from "../../src/modules/manhwa/repository.js"

vi.mock("@quixo3/prisma-session-store", () => ({
	PrismaSessionStore: class extends session.MemoryStore {},
}))

vi.mock("../../src/modules/manhwa/repository.js", () => ({
	default: {
		listManhwa: vi.fn(),
		getManhwaById: vi.fn(),
	},
}))

describe("Manhwa endpoints", () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it("returns the requested page with public list fields", async () => {
		vi.mocked(manhwaRepository.listManhwa).mockResolvedValue({
			total: 2,
			manhwas: [
				{ id: 1, title: "Example Manhwa", thumbnailUrl: "https://cdn.example.com/thumb.jpg", status: "ONGOING" },
			],
		} as never)

		const response = await request(app).get("/api/manhwa?page=2&perPage=1")

		expect(response.status).toBe(200)
		expect(response.body).toEqual({
			total: 2,
			page: 2,
			perPage: 1,
			manhwas: [{
				id: 1,
				title: "Example Manhwa",
				thumbnailUrl: "https://cdn.example.com/thumb.jpg",
				status: "ONGOING",
			}],
		})
		expect(manhwaRepository.listManhwa).toHaveBeenCalledWith({ page: 2, perPage: 1 })
	})

	it("rejects a page size over the configured cap", async () => {
		vi.mocked(manhwaRepository.listManhwa).mockResolvedValue({ total: 0, manhwas: [] } as never)

		const response = await request(app).get("/api/manhwa?perPage=101")

		expect(response.status).toBe(400)
		expect(manhwaRepository.listManhwa).not.toHaveBeenCalled()
	})

	it("returns detail with description and tags", async () => {
		vi.mocked(manhwaRepository.getManhwaById).mockResolvedValue({
			id: 1,
			title: "Example Manhwa",
			description: "A detailed description.",
			thumbnailUrl: "https://cdn.example.com/original.jpg",
			status: "ONGOING",
			tags: [{ id: 1, name: "Romance" }],
		} as never)

		const response = await request(app).get("/api/manhwa/1")

		expect(response.status).toBe(200)
		expect(response.body.manhwa).toEqual({
			id: 1,
			title: "Example Manhwa",
			description: "A detailed description.",
			thumbnailUrl: "https://cdn.example.com/original.jpg",
			status: "ONGOING",
			tags: [{ id: 1, name: "Romance" }],
		})
		expect(response.body.attribution).toBe("Data from MangaUpdates")
		expect(manhwaRepository.getManhwaById).toHaveBeenCalledWith(1)
	})

	it("returns 404 when the manhwa does not exist", async () => {
		vi.mocked(manhwaRepository.getManhwaById).mockResolvedValue(null)

		const response = await request(app).get("/api/manhwa/999")

		expect(response.status).toBe(404)
		expect(response.body.error).toBe("Manhwa not found")
	})
})
