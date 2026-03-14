import { TAppDomain, TAppLayer } from '@arch/types'

type TAppErrorCode = 'UNKNOWN' | 'EMPTY_ARGUMENTS'

export class AppError<GErrorCode, GErrorDetails = Record<string, unknown>> extends Error {
  readonly kind = 'AppError' as const

  readonly layer: TAppLayer
  readonly domain: TAppDomain
  readonly origin?: string

  readonly code: GErrorCode | TAppErrorCode
  readonly details?: GErrorDetails
  readonly cause?: unknown

  constructor(params: {
    layer: TAppLayer
    domain: TAppDomain
    origin?: string
    code: GErrorCode | TAppErrorCode
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
