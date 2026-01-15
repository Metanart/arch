export function getMessageFromError(error: unknown): string {
  if (error instanceof Error) {
    return error.message || error.name
  }

  if (typeof error === 'string') {
    return error
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  ) {
    return (error as { message: string }).message
  }

  try {
    return JSON.stringify(error)
  } catch {
    return String(error)
  }
}
