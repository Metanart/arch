import { AppDomain, AppLayer } from '@arch/types'

type AppErrorCode = 'UNKNOWN' | 'EMPTY_ARGUMENTS'

export class AppError<GErrorCode, GErrorDetails = Record<string, unknown>> extends Error {
  readonly kind = 'AppError' as const

  readonly layer: AppLayer
  readonly domain: AppDomain
  readonly origin?: string

  readonly code: GErrorCode | AppErrorCode
  readonly details?: GErrorDetails
  readonly cause?: unknown

  constructor(params: {
    layer: AppLayer
    domain: AppDomain
    origin?: string
    code: GErrorCode | AppErrorCode
    message: string
    details?: GErrorDetails
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
