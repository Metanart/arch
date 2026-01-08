import { AppDomain, AppLayer } from '@arch/types'

type AppErrorCode = 'UNKNOWN' | 'EMPTY_ARGUMENTS'

export class AppError<ErrorCode, ErrorDetails = Record<string, unknown>> extends Error {
  readonly kind = 'AppError' as const

  readonly layer: AppLayer
  readonly domain: AppDomain
  readonly origin?: string

  readonly code: ErrorCode | AppErrorCode
  readonly details?: ErrorDetails
  readonly cause?: unknown

  constructor(params: {
    layer: AppLayer
    domain: AppDomain
    origin?: string
    code: ErrorCode | AppErrorCode
    message: string
    details?: ErrorDetails
    cause?: unknown
  }) {
    super(params.message)

    Object.setPrototypeOf(this, new.target.prototype)

    this.name = 'AppError'

    this.layer = params.layer
    this.domain = params.domain
    this.origin = params.origin

    this.code = params.code
    this.details = params.details
    this.cause = params.cause

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError)
    }
  }
}
