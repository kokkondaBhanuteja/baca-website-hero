import 'server-only'

import { hash, verify } from '@node-rs/argon2'

/** Hash a plaintext password with argon2id (OWASP-recommended defaults). */
export function hashPassword(plainText: string): Promise<string> {
  return hash(plainText)
}

/** Verify a plaintext password against a stored argon2id hash. */
export function verifyPassword(
  storedHash: string,
  plainText: string,
): Promise<boolean> {
  return verify(storedHash, plainText)
}
