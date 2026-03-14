import { FC } from 'react'

import ControlPointIcon from '@mui/icons-material/ControlPoint'
import { CardActions, IconButton, Tooltip } from '@mui/material'

type TProps = { onAddNew: () => void }

export const SourcesPageControls: FC<TProps> = (props) => {
  const { onAddNew } = props

  return (
    <CardActions sx={{ justifyContent: 'flex-end' }}>
      <Tooltip title="Add new source folder">
        <IconButton onClick={onAddNew} color="success">
          <ControlPointIcon />
        </IconButton>
      </Tooltip>
    </CardActions>
  )
}
