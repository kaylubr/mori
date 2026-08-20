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

describe("POST /api/auth/login", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("logs in with the correct username and password", async () => {
    const user = makeUser({ passwordHash: await import("argon2").then((m) => m.default.hash("secret123")) })

    vi.mocked(db.user.findUnique).mockResolvedValue(user)

    const response = await request(app)
      .post("/api/auth/login")
      .send({ username: "demo", password: "secret123" })

    expect(response.status).toBe(200)
    expect(response.body.user.username).toBe("demo")
    expect(response.headers["set-cookie"]).toBeTruthy()
  })

  it("fails with a generic invalid credentials error for the wrong password", async () => {
    const user = makeUser({ passwordHash: await import("argon2").then((m) => m.default.hash("correct-password")) })

    vi.mocked(db.user.findUnique).mockResolvedValue(user)

    const response = await request(app)
      .post("/api/auth/login")
      .send({ username: "demo", password: "wrong-password" })

    expect(response.status).toBe(401)
    expect(response.body.error).toBe("Invalid username or password")
  })

  it("returns account doesn't exist for an unknown username", async () => {
    vi.mocked(db.user.findUnique).mockResolvedValue(null)

    const response = await request(app)
      .post("/api/auth/login")
      .send({ username: "missing-user", password: "secret123" })

    expect(response.status).toBe(404)
    expect(response.body.error).toBe("Account doesn't exist")
  })

  it("returns a provider sign-in message for OAuth-only accounts", async () => {
    const user = makeUser({ passwordHash: null })

    vi.mocked(db.user.findUnique).mockResolvedValue(user)

    const response = await request(app)
      .post("/api/auth/login")
      .send({ username: "demo", password: "secret123" })

    expect(response.status).toBe(400)
    expect(response.body.error).toBe("This account signs in with Google/GitHub")
  })
})
