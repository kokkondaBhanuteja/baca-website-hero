export type AdminRole = 'ADMIN' | 'SUPER_ADMIN'

/** Safe admin representation returned to the client (never includes the hash). */
export interface AdminUserDto {
  id: string
  email: string
  name: string
  role: AdminRole
}
