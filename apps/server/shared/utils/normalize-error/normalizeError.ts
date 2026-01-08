import { createErrorNormalizer } from '@arch/utils'

import { dbErrorAdapter, DBErrorCode, DBErrorDetails } from './error-adapters/dbErrorAdapter'
import { zodErrorAdapter, ZodErrorCode } from './error-adapters/zodErrorAdapter'

type ErrorCode = DBErrorCode | ZodErrorCode
type ErrorDetails = DBErrorDetails | Record<string, unknown>

export const normalizeError = createErrorNormalizer<ErrorCode, ErrorDetails>([
  dbErrorAdapter,
  zodErrorAdapter
])
