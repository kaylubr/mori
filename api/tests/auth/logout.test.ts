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

describe("POST /api/auth/logout", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("ends the session and subsequent authenticated requests fail", async () => {
    const user = makeUser({ passwordHash: await import("argon2").then((m) => m.default.hash("secret123")) })

    vi.mocked(db.user.findUnique).mockResolvedValue(user)

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({ username: "demo", password: "secret123" })

    expect(loginResponse.status).toBe(200)
    const cookies = loginResponse.headers["set-cookie"]
    expect(cookies).toBeDefined()

    const logoutResponse = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", cookies!)

    expect(logoutResponse.status).toBe(200)

    const meResponse = await request(app)
      .get("/api/auth/me")
      .set("Cookie", cookies!)

    expect(meResponse.status).toBe(401)
  })
})
