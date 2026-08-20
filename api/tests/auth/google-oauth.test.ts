import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { db } from "../../src/lib/database.js"
import { googleVerify } from "../../src/modules/auth/passport.js"
import { makeUser } from "../utils/auth.js"

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

describe("GET /api/auth/google (callback)", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(Math, "random").mockReturnValue(0.123456789)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("creates a new account when no googleId or email matches and logs in", async () => {
    const createdUser = makeUser({
      id: 9,
      email: "new-google@example.com",
      username: "new-google-1234567",
      googleId: "google-123",
      passwordHash: null,
      avatarUrl: "https://example.com/google-avatar.png",
    })

    vi.mocked(db.user.findUnique).mockResolvedValue(null)
    vi.mocked(db.user.findFirst).mockResolvedValue(null)
    vi.mocked(db.user.create).mockResolvedValue(createdUser)

    const done = vi.fn()
    await googleVerify("token", "refresh", {
      id: "google-123",
      emails: [{ value: "new-google@example.com" }],
      photos: [{ value: "https://example.com/google-avatar.png" }],
    }, done)

    expect(done).toHaveBeenCalledWith(null, createdUser)
    expect(db.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        email: "new-google@example.com",
        googleId: "google-123",
        passwordHash: null,
      }),
    })
  })

  it("logs in the same user when the googleId already matches", async () => {
    const existingUser = makeUser({ id: 2, googleId: "google-456" })

    vi.mocked(db.user.findUnique).mockResolvedValue(existingUser)

    const done = vi.fn()
    await googleVerify("token", "refresh", {
      id: "google-456",
      emails: [{ value: "existing@example.com" }],
      photos: [{ value: "https://example.com/photo.png" }],
    }, done)

    expect(done).toHaveBeenCalledWith(null, existingUser)
    expect(db.user.create).not.toHaveBeenCalled()
  })

  it("links googleId to an existing account by email and logs in as that account", async () => {
    const existingUser = makeUser({ id: 3, email: "linked@example.com" })
    const updatedUser = { ...existingUser, googleId: "google-789" }

    vi.mocked(db.user.findUnique).mockResolvedValue(null)
    vi.mocked(db.user.findFirst).mockResolvedValue(existingUser)
    vi.mocked(db.user.update).mockResolvedValue(updatedUser)

    const done = vi.fn()
    await googleVerify("token", "refresh", {
      id: "google-789",
      emails: [{ value: "linked@example.com" }],
      photos: [{ value: "https://example.com/photo.png" }],
    }, done)

    expect(done).toHaveBeenCalledWith(null, updatedUser)
    expect(db.user.update).toHaveBeenCalledWith({
      where: { id: existingUser.id },
      data: expect.objectContaining({ googleId: "google-789" }),
    })
  })
})
