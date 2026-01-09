import { FC, PropsWithChildren, useCallback } from 'react'

import { CreateSourceClientDTO } from '@arch/contracts'
import { createLogger } from '@arch/utils'

import { notify } from '@domains/Shared'

import { useCreateSourceMutation } from '@domains/Sources/Root'

import { CreateSourceForm } from '../components/CreateSourceForm'

const logger = createLogger({
  domain: 'Sources',
  layer: 'Container',
  origin: 'CreateSourceFormContainer'
})

const messages = {
  notify: {
    isEmpty: 'Source is required',
    success: 'Source created successfully',
    failed: 'Failed to create source'
  }
}

export const CreateSourceFormContainer: FC<PropsWithChildren> = () => {
  const [createSource, { isLoading }] = useCreateSourceMutation()

  const handleSave = useCallback(
    async (sourceCreateFormDTO: CreateSourceClientDTO, isDirty: boolean): Promise<void> => {
      if (!isDirty) {
        notify(messages.notify.isEmpty, 'warning')
        return
      }

      try {
        await createSource(sourceCreateFormDTO).unwrap()
        notify(messages.notify.success, 'success')
      } catch (error) {
        const errorMessage = String(error)
        logger.error(errorMessage || messages.notify.failed, error)
        notify(errorMessage || messages.notify.failed, 'error')
      }
    },
    [createSource]
  )

  return <CreateSourceForm onSave={handleSave} isDisabled={isLoading} />
}
