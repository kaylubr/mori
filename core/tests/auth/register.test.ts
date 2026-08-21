import argon2 from "argon2"
import session from "express-session"
import request from "supertest"
import { beforeEach, describe, expect, it, vi } from "vitest"

import app from "../../src/app.js"
import { db } from "../../src/lib/database.js"
import { makeUser } from "../utils/auth.js"

vi.mock("@quixo3/prisma-session-store", () => ({
  PrismaSessionStore: class extends session.MemoryStore {},
}))

vi.mock("../../src/lib/database.js", () => ({
  db: {
    user: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      findMany: vi.fn(),
    },
  },
}))

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("stores a hashed password and logs the user in immediately", async () => {
    const user = makeUser({ passwordHash: await argon2.hash("secret123") })

    vi.mocked(db.user.findFirst).mockResolvedValue(null)
    vi.mocked(db.user.create).mockResolvedValue(user)

    const response = await request(app)
      .post("/api/auth/register")
      .send({ username: "demo", email: "demo@example.com", password: "secret123" })

    expect(response.status).toBe(201)
    expect(response.body.user.email).toBe("demo@example.com")
    expect(response.headers["set-cookie"]).toBeTruthy()

    const createdPayload = vi.mocked(db.user.create).mock.calls[0]?.[0]
    expect(createdPayload!.data.passwordHash).not.toBe("secret123")
    expect(createdPayload!.data.passwordHash).toBeTruthy()
    expect(await argon2.verify(createdPayload!.data.passwordHash!, "secret123")).toBe(true)
  })

  it("returns 409 when the username is already taken", async () => {
    vi.mocked(db.user.findFirst).mockResolvedValue(makeUser({ username: "demo" }))

    const response = await request(app)
      .post("/api/auth/register")
      .send({ username: "demo", email: "other@example.com", password: "secret123" })

    expect(response.status).toBe(409)
    expect(response.body.error).toBe("Username or email already exists")
  })

  it("returns 409 when the email is already taken", async () => {
    vi.mocked(db.user.findFirst).mockResolvedValue(makeUser({ email: "demo@example.com" }))

    const response = await request(app)
      .post("/api/auth/register")
      .send({ username: "newuser", email: "demo@example.com", password: "secret123" })

    expect(response.status).toBe(409)
    expect(response.body.error).toBe("Username or email already exists")
  })
})
