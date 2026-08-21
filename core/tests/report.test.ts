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
		review: { findUnique: vi.fn() },
		report: { create: vi.fn() },
		user: {
			findFirst: vi.fn(),
			findUnique: vi.fn(),
			create: vi.fn(),
			update: vi.fn(),
			findMany: vi.fn(),
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

describe("Report endpoints", () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it("requires authentication", async () => {
		const response = await request(app)
			.post("/api/reviews/1/report")
			.send({ reason: "FAKE" })

		expect(response.status).toBe(401)
		expect(response.body.error).toBe("Not authenticated")
	})

	it("creates a report for an existing review", async () => {
		const agent = await login()
		vi.mocked(db.review.findUnique).mockResolvedValue({ id: 1 } as never)
		vi.mocked(db.report.create).mockResolvedValue({
			id: 1,
			reporterId: 1,
			reviewId: 1,
			reason: "INAPPROPRIATE",
			status: "PENDING",
		} as never)

		const response = await agent
			.post("/api/reviews/1/report")
			.send({ reason: "INAPPROPRIATE" })

		expect(response.status).toBe(201)
		expect(response.body.report).toMatchObject({
			reporterId: 1,
			reviewId: 1,
			reason: "INAPPROPRIATE",
			status: "PENDING",
		})
		expect(db.report.create).toHaveBeenCalledWith({
			data: {
				reporterId: 1,
				reviewId: 1,
				reason: "INAPPROPRIATE",
				status: "PENDING",
			},
		})
	})

	it("returns 404 when the review does not exist", async () => {
		const agent = await login()
		vi.mocked(db.review.findUnique).mockResolvedValue(null)

		const response = await agent
			.post("/api/reviews/999/report")
			.send({ reason: "OTHER" })

		expect(response.status).toBe(404)
		expect(response.body.error).toBe("Review not found")
		expect(db.report.create).not.toHaveBeenCalled()
	})
})
