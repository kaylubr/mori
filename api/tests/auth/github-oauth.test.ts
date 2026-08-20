import { describe, it } from "vitest"

// Tests:
// - A GitHub profile with no matching githubId and no matching email creates a new account and logs the user in.
// - A GitHub profile whose githubId already matches a user logs that same user in (repeat login), no duplicate created.
// - A GitHub profile whose email matches an existing account links githubId onto that account and logs in as it, rather than creating a second account.
// - A GitHub profile that comes back with no email should be handled (test the chosen behavior).

describe("GET /api/auth/github (callback)", () => {
  it.todo("creates a new account when no githubId or email matches and logs in")
  it.todo("logs in existing user when githubId matches")
  it.todo("links githubId to existing account when email matches and logs in")
  it.todo("handles GitHub profiles with no email (decide behavior)")
})
