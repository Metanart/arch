import { FC, Fragment, JSX, useMemo } from 'react'

import { SourceClientDTO } from '@arch/contracts'

import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { IconButton, Tooltip } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'

type Props = {
  sources: SourceClientDTO[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  isLoading: boolean
}

export function Controls({
  onEdit,
  onDelete
}: {
  onEdit: () => void
  onDelete: () => void
}): JSX.Element {
  return (
    <Fragment>
      <Tooltip title="Edit">
        <IconButton onClick={onEdit}>
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Fragment>
  )
}

export const SourcesList: FC<Props> = (props) => {
  const { sources, onEdit, onDelete, isLoading } = props

  const columns = useMemo<GridColDef<SourceClientDTO>[]>(
    () => [
      { field: 'name', headerName: 'Name', flex: 1, editable: false },
      { field: 'path', headerName: 'Path', flex: 2 },
      { field: 'comment', headerName: 'Comment', flex: 2 },
      {
        field: 'actions',
        headerName: 'Actions',
        sortable: false,
        flex: 1,
        renderCell: (params: GridRenderCellParams<SourceClientDTO>) => (
          <Controls onEdit={() => onEdit(params.row.id)} onDelete={() => onDelete(params.row.id)} />
        )
      }
    ],
    [onEdit, onDelete]
  )

  return (
    <DataGrid<SourceClientDTO>
      rows={sources}
      columns={columns}
      getRowId={(row) => row.id}
      disableRowSelectionOnClick
      loading={isLoading}
    />
  )
}
