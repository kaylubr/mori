import { describe, it } from "vitest"

// Tests:
// - Register manually with an email, then log in via Google using that same email → resolves to the one account, googleId gets set, no duplicate created.
// - Then log in via GitHub using that same email → the same account now has both googleId and githubId set.

describe("Account linking across providers", () => {
  it.todo("links Google to existing manual account by email and does not create duplicate")
  it.todo("then links GitHub to the same account by email, resulting in both provider IDs set")
})
