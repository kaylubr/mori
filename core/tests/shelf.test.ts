import argon2 from "argon2"
import request from "supertest"
import session from "express-session"
import { beforeEach, describe, expect, it, vi } from "vitest"

import app from "../src/app.js"
import { db } from "../src/lib/database.js"
import shelfService, { ShelfAlreadyExistsError } from "../src/modules/shelf/service.js"
import { Prisma } from "../src/generated/prisma/client.js"
import { makeUser } from "./utils/auth.js"

vi.mock("@quixo3/prisma-session-store", () => ({
	PrismaSessionStore: class extends session.MemoryStore {},
}))

vi.mock("../src/lib/database.js", () => ({
	db: {
		shelfEntry: {
			create: vi.fn(),
			deleteMany: vi.fn(),
			findMany: vi.fn(),
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

describe("Shelf endpoints", () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it.each([
		["POST", "/api/shelf"],
		["DELETE", "/api/shelf/1"],
		["GET", "/api/shelf"],
	])("rejects unauthenticated %s %s", async (method, path) => {
		const response = method === "POST"
			? await request(app).post(path).send({ manhwaId: 1 })
			: method === "DELETE"
				? await request(app).delete(path)
				: await request(app).get(path)

		expect(response.status).toBe(401)
		expect(response.body.error).toBe("Not authenticated")
	})

	it("adds a manhwa to the authenticated user's shelf", async () => {
		const agent = await login()
		vi.mocked(db.shelfEntry.create).mockResolvedValue({ id: 1, userId: 1, manhwaId: 7 } as never)

		const response = await agent.post("/api/shelf").send({ manhwaId: 7 })

		expect(response.status).toBe(201)
		expect(response.body.shelfEntry.manhwaId).toBe(7)
		expect(db.shelfEntry.create).toHaveBeenCalledWith(expect.objectContaining({ data: { userId: 1, manhwaId: 7 } }))
	})

	it("handles duplicate shelf entries gracefully", async () => {
		const agent = await login()
		vi.mocked(db.shelfEntry.create).mockRejectedValue(Object.assign(
			Object.create(Prisma.PrismaClientKnownRequestError.prototype),
			{ code: "P2002" },
		))

		const response = await agent.post("/api/shelf").send({ manhwaId: 7 })

		expect(response.status).toBe(409)
		expect(response.body.error).toBe("Manhwa is already on the shelf")
	})

	it("removes a manhwa from the authenticated user's shelf", async () => {
		const agent = await login()
		vi.mocked(db.shelfEntry.deleteMany).mockResolvedValue({ count: 1 })

		const response = await agent.delete("/api/shelf/7")

		expect(response.status).toBe(204)
		expect(db.shelfEntry.deleteMany).toHaveBeenCalledWith({ where: { userId: 1, manhwaId: 7 } })
	})

	it("lists the authenticated user's shelf", async () => {
		const agent = await login()
		vi.mocked(db.shelfEntry.findMany).mockResolvedValue([
			{ id: 1, userId: 1, manhwaId: 7, manhwa: { id: 7, title: "Example", thumbnailUrl: "thumb", status: "ONGOING" } },
		] as never)

		const response = await agent.get("/api/shelf")

		expect(response.status).toBe(200)
		expect(response.body.shelf).toEqual([{ id: 1, userId: 1, manhwaId: 7, manhwa: { id: 7, title: "Example", thumbnailUrl: "thumb", status: "ONGOING" } }])
		expect(db.shelfEntry.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { userId: 1 } }))
	})
})

describe("shelf service", () => {
	it("translates duplicate Prisma errors into a shelf domain error", async () => {
		vi.mocked(db.shelfEntry.create).mockRejectedValue(Object.assign(
			Object.create(Prisma.PrismaClientKnownRequestError.prototype),
			{ code: "P2002" },
		))

		await expect(shelfService.addToShelf(1, 7)).rejects.toBeInstanceOf(ShelfAlreadyExistsError)
	})
})
