import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { Strategy as GitHubStrategy } from "passport-github2"

import { db } from "../../lib/database.js"
import config from "../../config/index.js"
import { verifyPassword } from "./password.js"

passport.serializeUser((user: any, done) => {
  done(null, user.id)
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
  new LocalStrategy(async (username: string, password: string, done: (error: Error | null, user?: any, info?: any) => void) => {
    try {
      const user = await db.user.findUnique({ where: { username } })

      if (!user || !user.passwordHash) {
        return done(null, false)
      }

      const isValid = await verifyPassword(password, user.passwordHash)
      if (!isValid) {
        return done(null, false)
      }

      return done(null, user)
    } catch (error) {
      return done(error as Error)
    }
  }),
)

if (config.GOOGLE_CLIENT_ID && config.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: config.GOOGLE_CALLBACK_URL,
      },
      async (
        _accessToken: string,
        _refreshToken: string,
        profile: any,
        done: (error: Error | null, user?: any, info?: any) => void,
      ) => {
        try {
          const email = profile.emails?.[0]?.value
          if (!email) {
            return done(new Error("Google account has no email"))
          }

          let user = await db.user.findUnique({ where: { googleId: profile.id } })
          if (user) return done(null, user)

          user = await db.user.findFirst({ where: { email } })
          if (user) {
            user = await db.user.update({
              where: { id: user.id },
              data: { googleId: profile.id, avatarUrl: profile.photos?.[0]?.value ?? user.avatarUrl ?? undefined },
            })
            return done(null, user)
          }

          const usernameBase = email.split("@")[0] ?? "user"
          const username = `${usernameBase}-${Math.random().toString(36).slice(2, 8)}`

          user = await db.user.create({
            data: {
              email,
              username,
              googleId: profile.id,
              passwordHash: null,
              avatarUrl: profile.photos?.[0]?.value ?? undefined,
            },
          })

          return done(null, user)
        } catch (error) {
          return done(error as Error)
        }
      },
    ),
  )
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
      async (
        _accessToken: string,
        _refreshToken: string,
        profile: any,
        done: (error: Error | null, user?: any, info?: any) => void,
      ) => {
        try {
          const email = profile.emails?.[0]?.value ?? profile._json?.email
          if (!email) {
            return done(new Error("GitHub account has no email"))
          }

          let user = await db.user.findUnique({ where: { githubId: profile.id } })
          if (user) return done(null, user)

          user = await db.user.findFirst({ where: { email } })
          if (user) {
            user = await db.user.update({
              where: { id: user.id },
              data: { githubId: profile.id, avatarUrl: profile.photos?.[0]?.value ?? profile._json?.avatar_url ?? user.avatarUrl ?? undefined },
            })
            return done(null, user)
          }

          const usernameBase = email.split("@")[0] ?? "user"
          const username = `${usernameBase}-${Math.random().toString(36).slice(2, 8)}`

          user = await db.user.create({
            data: {
              email,
              username,
              githubId: profile.id,
              passwordHash: null,
              avatarUrl: profile.photos?.[0]?.value ?? profile._json?.avatar_url ?? undefined,
            },
          })

          return done(null, user)
        } catch (error) {
          return done(error as Error)
        }
      },
    ),
  )
}

export default passport
