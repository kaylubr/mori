import { describe, it } from "vitest"

// Tests:
// - Logging out ends the session — a follow-up authenticated request fails.

describe("POST /api/auth/logout", () => {
  it.todo("ends the session and subsequent authenticated requests fail")
})
