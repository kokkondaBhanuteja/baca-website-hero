/**
 * Domain error carrying an HTTP status + machine code. Thrown by services and
 * guards; translated to a JSON response by `handleRoute`.
 */
export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly fieldErrors?: Record<string, string[]>,
  ) {
    super(message)
    this.name = 'HttpError'
  }
}

export const badRequest = (message = 'Bad request') =>
  new HttpError(400, 'BAD_REQUEST', message)
export const unauthorized = (message = 'Unauthorized') =>
  new HttpError(401, 'UNAUTHORIZED', message)
export const forbidden = (message = 'Forbidden') =>
  new HttpError(403, 'FORBIDDEN', message)
export const notFoundError = (message = 'Not found') =>
  new HttpError(404, 'NOT_FOUND', message)
export const conflictError = (message = 'Conflict') =>
  new HttpError(409, 'CONFLICT', message)
