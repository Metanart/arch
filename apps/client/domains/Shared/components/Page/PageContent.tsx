import { FC, PropsWithChildren } from 'react'

import { Box } from '@mui/material'

type TProps = {
  p?: number
} & PropsWithChildren

export const PageContent: FC<TProps> = ({ p = 4, children }) => {
  return <Box p={p}>{children}</Box>
}
