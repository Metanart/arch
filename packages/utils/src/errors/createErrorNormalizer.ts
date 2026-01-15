import { AppContext } from '@arch/types'

import { AppError } from './AppError'

type ErrorAdapter<ErrorCode, ErrorDetails> = (
  error: unknown,
  context: AppContext
) => AppError<ErrorCode, ErrorDetails> | null

export function createErrorNormalizer<ErrorCode, ErrorDetails>(
  adapters: ErrorAdapter<ErrorCode, ErrorDetails>[]
) {
  return function normalizeError(
    error: unknown,
    context: AppContext
  ): AppError<ErrorCode, ErrorDetails> {
    for (const adapter of adapters) {
      const mappedAppError = adapter(error, context)
      if (mappedAppError) return mappedAppError
    }

    return new AppError<ErrorCode, ErrorDetails>({
      code: 'UNKNOWN',
      message: 'Something went wrong.',
      cause: error,
      ...context
    })
  }
}
