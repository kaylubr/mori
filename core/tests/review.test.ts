import argon2 from "argon2"
import request from "supertest"
import session from "express-session"
import { beforeEach, describe, expect, it, vi } from "vitest"

import app from "../src/app.js"
import { db } from "../src/lib/database.js"
import { makeUser } from "./utils/auth.js"

vi.mock("@quixo3/prisma-session-store", () => ({
	PrismaSessionStore: class extends session.MemoryStore {},
}))

vi.mock("../src/lib/database.js", () => ({
	db: {
		review: {
			findUnique: vi.fn(),
			create: vi.fn(),
			findMany: vi.fn(),
			count: vi.fn(),
			update: vi.fn(),
			aggregate: vi.fn(),
		},
		user: {
			findFirst: vi.fn(),
			findUnique: vi.fn(),
			create: vi.fn(),
			update: vi.fn(),
			findMany: vi.fn(),
		},
		manhwa: {
			findMany: vi.fn(),
			count: vi.fn(),
			findUnique: vi.fn(),
		},
	},
}))

const login = async () => {
	const user = makeUser({ passwordHash: await argon2.hash("secret123") })
	vi.mocked(db.user.findUnique).mockResolvedValue(user)

	const agent = request.agent(app)
	const response = await agent.post("/api/auth/login").send({ username: "demo", password: "secret123" })

	expect(response.status).toBe(200)
	return agent
}

describe("Review endpoints", () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it("requires authentication to create a review", async () => {
		const response = await request(app).post("/api/manhwa/1/reviews").send({ rating: 5, comment: "Great" })

		expect(response.status).toBe(401)
		expect(response.body.error).toBe("Not authenticated")
	})

	it("creates a review", async () => {
		const agent = await login()
		vi.mocked(db.review.findUnique).mockResolvedValue(null)
		vi.mocked(db.review.create).mockResolvedValue({
			id: 1,
			userId: 1,
			manhwaId: 1,
			rating: 5,
			comment: "Great",
		} as never)

		const response = await agent.post("/api/manhwa/1/reviews").send({ rating: 5, comment: "Great" })

		expect(response.status).toBe(201)
		expect(response.body.review).toMatchObject({ rating: 5, comment: "Great" })
		expect(db.review.create).toHaveBeenCalledWith(expect.objectContaining({
			data: { userId: 1, manhwaId: 1, rating: 5, comment: "Great" },
		}))
	})

	it("rejects a duplicate review", async () => {
		const agent = await login()
		vi.mocked(db.review.findUnique).mockResolvedValue({ id: 1 } as never)

		const response = await agent.post("/api/manhwa/1/reviews").send({ rating: 5, comment: "Great" })

		expect(response.status).toBe(409)
		expect(response.body.error).toBe("You've already reviewed this manhwa")
	})

	it("lists reviews with pagination", async () => {
		vi.mocked(db.review.findMany).mockResolvedValue([
			{ id: 2, manhwaId: 1, userId: 1, rating: 4, comment: "Good" },
		] as never)
		vi.mocked(db.review.count).mockResolvedValue(6)

		const response = await request(app).get("/api/manhwa/1/reviews?page=2&perPage=1")

		expect(response.status).toBe(200)
		expect(response.body).toMatchObject({ total: 6, page: 2, perPage: 1, reviews: [{ id: 2, rating: 4 }] })
		expect(db.review.findMany).toHaveBeenCalledWith(expect.objectContaining({ skip: 1, take: 1, where: { manhwaId: 1 } }))
	})
})
