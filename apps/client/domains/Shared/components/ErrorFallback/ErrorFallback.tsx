import { FC } from 'react'

import { Message } from '../Message'

type TProps = {
  error: Error
  resetErrorBoundary: () => void
}

export const ErrorFallback: FC<TProps> = ({ error }) => {
  return <Message type="error" message={`Something went wrong: ${error.message}`} />
}
