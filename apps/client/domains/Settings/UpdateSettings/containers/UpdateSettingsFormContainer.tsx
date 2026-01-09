import { FC, Fragment, JSX, useCallback } from 'react'

import { UpdateSettingsClientDTO } from '@arch/contracts'
import { createLogger } from '@arch/utils'

import { Message, notify } from '@domains/Shared'

import { useGetSettingsQuery, useUpdateSettingsMutation } from '@domains/Settings/Root'

import { UpdateSettingsForm } from '../components/UpdateSettingsForm'

const logger = createLogger({
  domain: 'Settings',
  layer: 'Container',
  origin: 'SettingsUpdateFormContainer'
})

export const UpdateSettingsFormContainer: FC = () => {
  const { data, isLoading, error } = useGetSettingsQuery()
  const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation()

  const handleSave = useCallback(
    async (dto: UpdateSettingsClientDTO, isDirty: boolean): Promise<void> => {
      if (!isDirty) {
        notify('No changes to save', 'warning')
        return
      }

      try {
        await updateSettings(dto).unwrap()
        notify('Settings updated successfully', 'success')
      } catch (error) {
        logger.error('Failed to update settings', error)
        notify('Failed to update settings', 'error')
      }
    },
    [updateSettings]
  )

  const renderContent = (): JSX.Element => {
    const isDisabled = isLoading || isUpdating
    let errorComponent: JSX.Element | null = null

    if (error) {
      const errorMessage =
        typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message: string }).message
          : 'Unknown error'

      errorComponent = <Message type="error" message={errorMessage} />
    }

    return (
      <Fragment>
        {errorComponent}
        <UpdateSettingsForm isDisabled={isDisabled} dto={data} onSave={handleSave} />
      </Fragment>
    )
  }

  return renderContent()
}
