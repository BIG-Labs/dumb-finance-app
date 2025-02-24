import { randomBytes } from "crypto"
import { getIronSession, SessionOptions } from "iron-session"
import { cookies } from "next/headers"
import { SessionData } from "types/session"
import { clean } from "."
import config from "constants/config"

export const sessionOptions: SessionOptions = {
  cookieName: "webauthn-token",
  password: config.sessionSecret!,
  cookieOptions: {
    secure: config.isProduction,
  },
}

export const generateChallenge = (): string => {
  return clean(randomBytes(32).toString("base64"))
}

export async function getSession() {
  const c = await cookies()
  const session = await getIronSession<SessionData>(c, sessionOptions)
  return session
}

export async function createProps() {
  const session = await getSession()
  const challenge = generateChallenge()
  session.challenge = challenge
  await session.save()
  return challenge
}

export async function getLoggedUser() {
  const session = await getSession()
  return session.userId
}
