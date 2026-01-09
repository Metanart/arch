import { FC, useCallback } from 'react'

import { createLogger } from '@arch/utils'

import { notify } from '@domains/Shared'

import { useGetAllSourcesQuery, useRemoveSourceMutation } from '@domains/Sources/Root'

import { SourcesList } from '../components/SourcesList'

const logger = createLogger({
  domain: 'Sources',
  layer: 'Container',
  origin: 'SourcesListContainer'
})

const messages = {
  notify: {
    removed: 'Source removed successfully',
    failedRemove: 'Failed to remove source'
  }
}

export const SourcesListContainer: FC = () => {
  const { data: sources } = useGetAllSourcesQuery()
  const [removeSource, { isLoading }] = useRemoveSourceMutation()

  const handleDelete = useCallback(
    async (id: string): Promise<void> => {
      if (!id) return

      try {
        const response = await removeSource(id).unwrap()
        if (response) {
          notify(messages.notify.removed, 'success')
        } else {
          notify(messages.notify.failedRemove, 'error')
        }
      } catch (error) {
        const errorMessage = String(error)
        logger.error(errorMessage || messages.notify.failedRemove, error)
        notify(errorMessage || messages.notify.failedRemove, 'error')
      }
    },
    [removeSource]
  )

  return (
    <SourcesList
      sources={sources || []}
      onDelete={handleDelete}
      onEdit={() => null}
      isLoading={isLoading}
    />
  )
}
