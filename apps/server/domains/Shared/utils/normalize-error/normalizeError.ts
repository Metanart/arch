import { createErrorNormalizer } from '@arch/utils'

import { dbErrorAdapter, TDBErrorCode, TDBErrorDetails } from './error-adapters/dbErrorAdapter'
import { zodErrorAdapter, TZodErrorCode } from './error-adapters/zodErrorAdapter'

type TErrorCode = TDBErrorCode | TZodErrorCode
type TErrorDetails = TDBErrorDetails | Record<string, unknown>

export const normalizeError = createErrorNormalizer<TErrorCode, TErrorDetails>([
  dbErrorAdapter,
  zodErrorAdapter
])
