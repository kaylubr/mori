import passport from "passport"
import { Strategy as LocalStrategy, type IVerifyOptions } from "passport-local"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { Strategy as GitHubStrategy } from "passport-github2"

import { db } from "../../lib/database.js"
import config from "../../config/index.js"
import { userSchema, type User } from "./types.js"
import { verifyPassword } from "./password.js"
import { oauthProfileSchema, type OAuthProfile } from "./schema.js"

passport.serializeUser((user, done) => {
  done(null, userSchema.parse(user).id)
})

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await db.user.findUnique({ where: { id } })
    done(null, user)
  } catch (error) {
    done(error as Error)
  }
})

passport.use(
  new LocalStrategy(async (username: string, password: string, done: (error: Error | null, user?: User | false, info?: IVerifyOptions & { code?: string }) => void) => {
    try {
      const user = await db.user.findUnique({ where: { username } })

      if (!user) {
        // No such account
        return done(null, false, { code: "no-account", message: "Account doesn't exist" })
      }

      if (!user.passwordHash) {
        // Account exists but has no password (OAuth-only)
        return done(null, false, { code: "passwordless", message: "Passwordless account" })
      }

      const isValid = await verifyPassword(password, user.passwordHash)
      if (!isValid) {
        // Wrong password for existing account
        return done(null, false, { code: "invalid-credentials", message: "Invalid credentials" })
      }

      return done(null, user)
    } catch (error) {
      return done(error as Error)
    }
  }),
)

export const googleVerify = async (
  _accessToken: string,
  _refreshToken: string,
  profile: OAuthProfile,
  done: (error: Error | null, user?: User | false, info?: { code: string }) => void,
) => {
  try {
    const parsedProfile = oauthProfileSchema.parse(profile)
    const email = parsedProfile.emails?.[0]?.value
    if (!email) {
      return done(new Error("Google account has no email"))
    }

    let user = await db.user.findUnique({ where: { googleId: parsedProfile.id } })
    if (user) return done(null, user)

    user = await db.user.findFirst({ where: { email } })
    if (user) {
      user = await db.user.update({
        where: { id: user.id },
        data: { googleId: parsedProfile.id, avatarUrl: parsedProfile.photos?.[0]?.value ?? user.avatarUrl ?? null },
      })
      return done(null, user)
    }

    const usernameBase = email.split("@")[0] ?? "user"
    const username = `${usernameBase}-${Math.random().toString(36).slice(2, 8)}`

    user = await db.user.create({
      data: {
        email,
        username,
        googleId: parsedProfile.id,
        passwordHash: null,
        avatarUrl: parsedProfile.photos?.[0]?.value ?? null,
      },
    })

    return done(null, user)
  } catch (error) {
    return done(error as Error)
  }
}

if (config.GOOGLE_CLIENT_ID && config.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: config.GOOGLE_CALLBACK_URL,
      },
      googleVerify,
    ),
  )
}

export const githubVerify = async (
  _accessToken: string,
  _refreshToken: string,
  profile: OAuthProfile,
  done: (error: Error | null, user?: User | false, info?: { code: string }) => void,
) => {
  try {
    const parsedProfile = oauthProfileSchema.parse(profile)
    const email = parsedProfile.emails?.[0]?.value ?? parsedProfile._json?.email
    if (!email) {
      return done(new Error("GitHub account has no email"))
    }

    let user = await db.user.findUnique({ where: { githubId: parsedProfile.id } })
    if (user) return done(null, user)

    user = await db.user.findFirst({ where: { email } })
    if (user) {
      user = await db.user.update({
        where: { id: user.id },
        data: { githubId: parsedProfile.id, avatarUrl: parsedProfile.photos?.[0]?.value ?? parsedProfile._json?.avatar_url ?? user.avatarUrl ?? null },
      })
      return done(null, user)
    }

    const usernameBase = email.split("@")[0] ?? "user"
    const username = `${usernameBase}-${Math.random().toString(36).slice(2, 8)}`

    user = await db.user.create({
      data: {
        email,
        username,
        githubId: parsedProfile.id,
        passwordHash: null,
        avatarUrl: parsedProfile.photos?.[0]?.value ?? parsedProfile._json?.avatar_url ?? null,
      },
    })

    return done(null, user)
  } catch (error) {
    return done(error as Error)
  }
}

if (config.GITHUB_CLIENT_ID && config.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: config.GITHUB_CLIENT_ID,
        clientSecret: config.GITHUB_CLIENT_SECRET,
        callbackURL: config.GITHUB_CALLBACK_URL,
        scope: ["user:email"],
      },
      githubVerify,
    ),
  )
}

export default passport
