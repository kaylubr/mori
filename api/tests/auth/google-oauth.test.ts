import { describe, it } from "vitest"

// Tests:
// - A Google profile with no matching googleId and no matching email creates a new account and logs the user in.
// - A Google profile whose googleId already matches a user logs that same user in (repeat login), no duplicate created.
// - A Google profile whose email matches an existing account links googleId onto that account and logs in as it, rather than creating a second account.

describe("GET /api/auth/google (callback)", () => {
  it.todo("creates a new account when no googleId or email matches and logs in")
  it.todo("logs in existing user when googleId matches")
  it.todo("links googleId to existing account when email matches and logs in")
})
