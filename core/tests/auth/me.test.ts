import request from "supertest"
import session from "express-session"
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

describe("GET /api/auth/me", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns the current user for an authenticated session", async () => {
    const user = makeUser({ passwordHash: await import("argon2").then((m) => m.default.hash("secret123")) })

    vi.mocked(db.user.findUnique).mockResolvedValue(user)

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({ username: "demo", password: "secret123" })

    expect(loginResponse.status).toBe(200)
    const cookies = loginResponse.headers["set-cookie"]
    expect(cookies).toBeDefined()

    const meResponse = await request(app)
      .get("/api/auth/me")
      .set("Cookie", cookies!)

    expect(meResponse.status).toBe(200)
    expect(meResponse.body.user.email).toBe("demo@example.com")
  })

  it("returns 401 for unauthenticated requests", async () => {
    const response = await request(app).get("/api/auth/me")

    expect(response.status).toBe(401)
    expect(response.body.error).toBe("Not authenticated")
  })
})
