import { describe, it } from "vitest"

// Tests:
// - An authenticated request returns the current user.
// - An unauthenticated request returns 401.

describe("GET /api/auth/me", () => {
  it.todo("returns the current user for an authenticated session")
  it.todo("returns 401 for unauthenticated requests")
})
