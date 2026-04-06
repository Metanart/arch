import { FC } from 'react'
import { Box } from '@mui/material'

import { Loader, TLoaderProps } from '../Loader/Loader'

export type TPageLoaderProps = {
  height?: number
} & TLoaderProps

export const PageLoader: FC<TPageLoaderProps> = (props) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight={props.height || 200}
      minWidth="100%"
    >
      <Loader {...props} />
    </Box>
  )
}
