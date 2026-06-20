import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

import { HttpError } from './http-error'

type RouteContext = { params: Promise<Record<string, string>> }
type RouteHandler = (
  request: Request,
  context: RouteContext,
) => Promise<Response>

function fieldErrorsFromZod(error: ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {}
  for (const issue of error.issues) {
    const key = issue.path.join('.') || '_root'
    ;(fieldErrors[key] ??= []).push(issue.message)
  }
  return fieldErrors
}

/**
 * Wraps a route handler so thrown `HttpError`/`ZodError` become consistent JSON
 * error responses and nothing leaks an unhandled 500 stack to the client.
 */
export function handleRoute(handler: RouteHandler): RouteHandler {
  return async (request, context) => {
    try {
      return await handler(request, context)
    } catch (error) {
      if (error instanceof HttpError) {
        return NextResponse.json(
          {
            code: error.code,
            message: error.message,
            fieldErrors: error.fieldErrors,
          },
          { status: error.status },
        )
      }
      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            code: 'VALIDATION_ERROR',
            message: 'Validation failed',
            fieldErrors: fieldErrorsFromZod(error),
          },
          { status: 422 },
        )
      }
      console.error('[api] Unhandled error:', error)
      return NextResponse.json(
        { code: 'INTERNAL_ERROR', message: 'Something went wrong' },
        { status: 500 },
      )
    }
  }
}
