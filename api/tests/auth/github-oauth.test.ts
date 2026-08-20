import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { db } from "../../src/lib/database.js"
import { githubVerify } from "../../src/modules/auth/passport.js"
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

describe("GET /api/auth/github (callback)", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(Math, "random").mockReturnValue(0.123456789)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("creates a new account when no githubId or email matches and logs in", async () => {
    const createdUser = makeUser({
      id: 10,
      email: "new-github@example.com",
      username: "new-github-1234567",
      githubId: "github-123",
      passwordHash: null,
      avatarUrl: "https://example.com/github-avatar.png",
    })

    vi.mocked(db.user.findUnique).mockResolvedValue(null)
    vi.mocked(db.user.findFirst).mockResolvedValue(null)
    vi.mocked(db.user.create).mockResolvedValue(createdUser)

    const done = vi.fn()
    await githubVerify("token", "refresh", {
      id: "github-123",
      emails: [{ value: "new-github@example.com" }],
      photos: [{ value: "https://example.com/github-avatar.png" }],
      _json: { email: "new-github@example.com", avatar_url: "https://example.com/github-avatar.png" },
    }, done)

    expect(done).toHaveBeenCalledWith(null, createdUser)
    expect(db.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        email: "new-github@example.com",
        githubId: "github-123",
        passwordHash: null,
      }),
    })
  })

  it("logs in the same user when the githubId already matches", async () => {
    const existingUser = makeUser({ id: 4, githubId: "github-456" })

    vi.mocked(db.user.findUnique).mockResolvedValue(existingUser)

    const done = vi.fn()
    await githubVerify("token", "refresh", {
      id: "github-456",
      emails: [{ value: "existing-gh@example.com" }],
      _json: { email: "existing-gh@example.com" },
    }, done)

    expect(done).toHaveBeenCalledWith(null, existingUser)
    expect(db.user.create).not.toHaveBeenCalled()
  })

  it("links githubId to an existing account by email and logs in as that account", async () => {
    const existingUser = makeUser({ id: 5, email: "gh-linked@example.com" })
    const updatedUser = { ...existingUser, githubId: "github-789" }

    vi.mocked(db.user.findUnique).mockResolvedValue(null)
    vi.mocked(db.user.findFirst).mockResolvedValue(existingUser)
    vi.mocked(db.user.update).mockResolvedValue(updatedUser)

    const done = vi.fn()
    await githubVerify("token", "refresh", {
      id: "github-789",
      emails: [{ value: "gh-linked@example.com" }],
      _json: { email: "gh-linked@example.com", avatar_url: "https://example.com/avatar.png" },
    }, done)

    expect(done).toHaveBeenCalledWith(null, updatedUser)
    expect(db.user.update).toHaveBeenCalledWith({
      where: { id: existingUser.id },
      data: expect.objectContaining({ githubId: "github-789" }),
    })
  })

  it("returns an error if the GitHub profile has no email", async () => {
    const done = vi.fn()

    await githubVerify("token", "refresh", {
      id: "github-404",
      emails: [],
      _json: {},
    }, done)

    expect(done).toHaveBeenCalledWith(expect.any(Error))
    const error = done.mock.calls[0]?.[0]
    expect(error).toBeInstanceOf(Error)
    expect((error as Error).message).toBe("GitHub account has no email")
  })
})
