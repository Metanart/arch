import { DBError } from './types'

export const convertDBErrorToMessage = (error: DBError): string | null => {
  if (!error) return null

  if (error.message) return error.message

  switch (error.code) {
    case 'UNIQUE_VIOLATION':
      return 'Unique violation'

    case 'NOT_NULL_VIOLATION':
      return 'Not null violation'

    case 'FOREIGN_KEY_VIOLATION':
      return 'Foreign key violation'

    case 'CHECK_VIOLATION':
      return 'Check violation'

    case 'CONSTRAINT_VIOLATION':
      return 'Constraint violation'

    default:
      return null
  }
}
