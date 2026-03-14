import { TAppContext } from '@arch/types'

import { AppError } from './AppError'

type ErrorAdapter<GErrorCode, GErrorDetails> = (
  error: unknown,
  context: TAppContext
) => AppError<GErrorCode, GErrorDetails> | null

export function createErrorNormalizer<GErrorCode, GErrorDetails>(
  adapters: ErrorAdapter<GErrorCode, GErrorDetails>[]
) {
  return function normalizeError(
    error: unknown,
    context: TAppContext
  ): AppError<GErrorCode, GErrorDetails> {
    for (const adapter of adapters) {
      const mappedAppError = adapter(error, context)
      if (mappedAppError) return mappedAppError
    }

    return new AppError<GErrorCode, GErrorDetails>({
      code: 'UNKNOWN',
      message: 'Something went wrong.',
      cause: error,
      ...context
    })
  }
}
