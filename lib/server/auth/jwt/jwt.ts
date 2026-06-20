import 'server-only'

import { SignJWT, jwtVerify } from 'jose'

import { serverEnvironment } from '@/lib/server/env'

const secretKey = new TextEncoder().encode(serverEnvironment.JWT_SECRET)
const TOKEN_ISSUER = 'baca-admin'
const TOKEN_AUDIENCE = 'baca-admin-session'
const TOKEN_ALGORITHM = 'HS256'
const TOKEN_TTL = '8h'

export interface SessionPayload {
  adminId: string
  role: string
}

export async function signSessionToken(
  payload: SessionPayload,
): Promise<string> {
  return new SignJWT({ role: payload.role })
    .setProtectedHeader({ alg: TOKEN_ALGORITHM })
    .setSubject(payload.adminId)
    .setIssuer(TOKEN_ISSUER)
    .setAudience(TOKEN_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(TOKEN_TTL)
    .sign(secretKey)
}

export async function verifySessionToken(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey, {
      // Pin algorithm + audience so a forged "alg: none" or cross-service token
      // with the same secret can't authenticate against this app.
      algorithms: [TOKEN_ALGORITHM],
      issuer: TOKEN_ISSUER,
      audience: TOKEN_AUDIENCE,
    })
    if (typeof payload.sub !== 'string' || typeof payload.role !== 'string') {
      return null
    }
    return { adminId: payload.sub, role: payload.role }
  } catch {
    return null
  }
}
