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
      const mapped = adapter(error, context)
      if (mapped) return mapped
    }

    return new AppError<ErrorCode, ErrorDetails>({
      code: 'UNKNOWN',
      message: 'Something went wrong.',
      cause: error,
      ...context
    })
  }
}
