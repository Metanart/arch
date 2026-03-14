import { QueryFailedError } from 'typeorm'

import { AppContext } from '@arch/types'
import { AppError } from '@arch/utils'

export type TDBErrorCode =
  | 'UNIQUE_VIOLATION'
  | 'FOREIGN_KEY_VIOLATION'
  | 'NOT_NULL_VIOLATION'
  | 'CHECK_VIOLATION'
  | 'CONSTRAINT_VIOLATION'
  | 'DB_ENTITY_NOT_FOUND'

export type TDBErrorDetails = {
  table?: string
  columns?: string[]
}

export function dbErrorAdapter(
  error: unknown,
  context: AppContext
): AppError<TDBErrorCode, TDBErrorDetails> | null {
  if (!(error instanceof QueryFailedError)) return null

  const driverError = error.driverError as { message: string; errno: number }
  const errorNumber: number | undefined = driverError?.errno
  const message: string = driverError?.message ?? error.message ?? ''

  if (errorNumber === 19) {
    if (message.includes('UNIQUE constraint failed')) {
      const code: TDBErrorCode = 'UNIQUE_VIOLATION'
      const match = message.match(/UNIQUE constraint failed:\s*(.+)$/)
      const columns =
        match && match[1] ? match[1].split(',').map((f) => f.trim().split('.')[1] || f.trim()) : []
      const table = match && match[1] ? match[1].split('.')[0] : undefined

      return new AppError<TDBErrorCode, TDBErrorDetails>({
        code,
        message,
        cause: error,
        details: {
          table,
          columns
        },
        ...context
      })
    }
  }

  if (message.includes('FOREIGN KEY constraint failed')) {
    return new AppError<TDBErrorCode, TDBErrorDetails>({
      code: 'FOREIGN_KEY_VIOLATION',
      message,
      cause: error,
      ...context
    })
  }

  if (message.includes('NOT NULL constraint failed')) {
    const regex = /NOT NULL constraint failed:\s*(.+)$/
    const match = message.match(regex)

    return new AppError<TDBErrorCode, TDBErrorDetails>({
      code: 'NOT_NULL_VIOLATION',
      message,
      cause: error,
      details: {
        table: match && match[1] ? match[1].split('.')[0] : undefined,
        columns: match && match[1] ? [match[1]] : []
      },
      ...context
    })
  }

  if (message.includes('CHECK constraint failed')) {
    return new AppError<TDBErrorCode, TDBErrorDetails>({
      code: 'CHECK_VIOLATION',
      message,
      cause: error,
      ...context
    })
  }

  return new AppError<TDBErrorCode, TDBErrorDetails>({
    code: 'CONSTRAINT_VIOLATION',
    message,
    cause: error,
    ...context
  })
}
