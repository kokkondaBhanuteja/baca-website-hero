import { NextResponse } from 'next/server'

/** Thin JSON response helpers for route handlers. */
export const ok = <T>(data: T) => NextResponse.json(data, { status: 200 })
export const created = <T>(data: T) => NextResponse.json(data, { status: 201 })
export const noContent = () => new NextResponse(null, { status: 204 })
