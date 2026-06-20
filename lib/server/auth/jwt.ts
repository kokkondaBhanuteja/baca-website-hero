import 'server-only'

import { SignJWT, jwtVerify } from 'jose'

import { serverEnvironment } from '@/lib/server/env'

const secretKey = new TextEncoder().encode(serverEnvironment.JWT_SECRET)
const TOKEN_ISSUER = 'baca-admin'
const TOKEN_TTL = '8h'

export interface SessionPayload {
  adminId: string
  role: string
}

export async function signSessionToken(
  payload: SessionPayload,
): Promise<string> {
  return new SignJWT({ role: payload.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.adminId)
    .setIssuer(TOKEN_ISSUER)
    .setIssuedAt()
    .setExpirationTime(TOKEN_TTL)
    .sign(secretKey)
}

export async function verifySessionToken(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey, {
      issuer: TOKEN_ISSUER,
    })
    if (typeof payload.sub !== 'string' || typeof payload.role !== 'string') {
      return null
    }
    return { adminId: payload.sub, role: payload.role }
  } catch {
    return null
  }
}
