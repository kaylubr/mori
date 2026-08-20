import request from "supertest"
import { describe, expect, it, vi } from "vitest"

vi.mock("../../src/lib/database.js", () => ({
  db: {
    user: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    session: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      deleteMany: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

import app from "../../src/app.js"
import { db } from "../../src/lib/database.js"

describe("session auth", () => {
  it("registers a new user and starts a session", async () => {
    const user = {
      id: 1,
      email: "demo@example.com",
      username: "demo",
      passwordHash: "hashed-password",
      googleId: null,
      githubId: null,
      avatarUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(db.user.findUnique).mockResolvedValueOnce(null)
    vi.mocked(db.user.create).mockResolvedValueOnce(user as any)

    const response = await request(app)
      .post("/api/auth/register")
      .send({ username: "demo", email: "demo@example.com", password: "secret123" })
      .expect(201)

    expect(response.body.user.email).toBe("demo@example.com")
    expect(db.user.create).toHaveBeenCalled()
  })
})
