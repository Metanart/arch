import { FC } from 'react'
import { Alert, AlertTitle, Box } from '@mui/material'

type TMessageType = 'error' | 'warning' | 'info' | 'success'

type TProps = {
  type: TMessageType
  title?: string
  message: string
}

export const Message: FC<TProps> = ({ type, title, message }) => {
  return (
    <Box my={2}>
      <Alert severity={type}>
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </Box>
  )
}
