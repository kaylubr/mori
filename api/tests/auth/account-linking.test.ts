import { beforeEach, describe, expect, it, vi } from "vitest"

import { db } from "../../src/lib/database.js"
import { githubVerify, googleVerify } from "../../src/modules/auth/passport.js"
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

describe("Account linking across providers", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("links Google to an existing manual account by email and does not create a duplicate", async () => {
    const existingUser = makeUser({ id: 11, email: "shared@example.com", googleId: null })
    const updatedUser = { ...existingUser, googleId: "google-shared" }

    vi.mocked(db.user.findUnique)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)

    vi.mocked(db.user.findFirst).mockResolvedValue(existingUser)
    vi.mocked(db.user.update).mockResolvedValue(updatedUser)

    const googleDone = vi.fn()
    await googleVerify("token", "refresh", {
      id: "google-shared",
      emails: [{ value: "shared@example.com" }],
      photos: [{ value: "https://example.com/google-avatar.png" }],
    }, googleDone)

    expect(googleDone).toHaveBeenCalledWith(null, updatedUser)
    expect(db.user.create).not.toHaveBeenCalled()
    expect(db.user.update).toHaveBeenCalledWith({
      where: { id: existingUser.id },
      data: expect.objectContaining({ googleId: "google-shared" }),
    })
  })

  it("then links GitHub to the same account by email without creating a second user", async () => {
    const existingUser = makeUser({ id: 12, email: "shared@example.com", googleId: "google-shared", githubId: null })
    const updatedUser = { ...existingUser, githubId: "github-shared" }

    vi.mocked(db.user.findUnique)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)

    vi.mocked(db.user.findFirst).mockResolvedValue(existingUser)
    vi.mocked(db.user.update).mockResolvedValue(updatedUser)

    const githubDone = vi.fn()
    await githubVerify("token", "refresh", {
      id: "github-shared",
      emails: [{ value: "shared@example.com" }],
      _json: { email: "shared@example.com", avatar_url: "https://example.com/github-avatar.png" },
    }, githubDone)

    expect(githubDone).toHaveBeenCalledWith(null, updatedUser)
    expect(db.user.create).not.toHaveBeenCalled()
    expect(db.user.update).toHaveBeenCalledWith({
      where: { id: existingUser.id },
      data: expect.objectContaining({ githubId: "github-shared" }),
    })
  })
})
