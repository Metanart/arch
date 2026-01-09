import { FC, JSX, useState } from 'react'

import { Modal, Page, PageContent, PageHeader } from '@domains/Shared'

import { CreateSourceFormContainer } from '@domains/Sources/CreateSource'

import ControlPointIcon from '@mui/icons-material/ControlPoint'
import { CardActions, IconButton, Tooltip } from '@mui/material'

import { SourcesListContainer } from '../containers/SourcesListContainer'

const messages = {
  page: {
    title: 'Sources'
  },
  controls: {
    addNew: 'Add new source folder'
  },
  modal: {
    title: 'Create source folder'
  }
}

function Controls({ onAddNew }: { onAddNew: () => void }): JSX.Element {
  return (
    <CardActions sx={{ justifyContent: 'flex-end' }}>
      <Tooltip title={messages.controls.addNew}>
        <IconButton onClick={onAddNew} color="success">
          <ControlPointIcon />
        </IconButton>
      </Tooltip>
    </CardActions>
  )
}

export const SourcesListPage: FC = () => {
  const [isCreateFormVisible, setIsCreateFormVisible] = useState(false)

  return (
    <Page>
      <PageHeader
        title={messages.page.title}
        controls={<Controls onAddNew={() => setIsCreateFormVisible(true)} />}
      />
      <PageContent>
        <SourcesListContainer />
        <Modal
          title={messages.modal.title}
          isOpen={isCreateFormVisible}
          onClose={() => setIsCreateFormVisible(false)}
        >
          <CreateSourceFormContainer />
        </Modal>
      </PageContent>
    </Page>
  )
}
