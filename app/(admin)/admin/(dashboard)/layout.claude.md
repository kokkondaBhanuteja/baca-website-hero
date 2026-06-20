---
kind: 'layout'
name: 'AdminDashboardLayout'
file: 'app/(admin)/admin/(dashboard)/layout.tsx'
exports:
  - 'AdminDashboardLayout'
  - 'default'
imports_from:
  - '@/lib/server/auth/session'
auth: 'Admin-only (gated by parent (dashboard) layout)'
---

# AdminDashboardLayout

Route: `n/a`  
Kind: layout (Next.js route convention file)  
Rendering: Server  
Auth: Admin-only (gated by parent (dashboard) layout)

Purpose:
Gate-keeper for all admin dashboard routes. Server component that calls getCurrentAdmin(). If no admin, redirects to /admin/login. Renders AdminShell (sidebar nav) around children.

Data:

- getCurrentAdmin() — fetches current admin from session cookie, returns null if unauthorized

Business Logic:

- Awaits getCurrentAdmin()
- If falsy, redirect('/admin/login') immediately
- Passes admin object to AdminShell component

Renders:

- AdminShell (wraps children with sidebar, sign-out button)

Notes:
This is a route group layout. All routes inside (dashboard)/\* are protected. AdminShell is the admin-shell component from components/.
