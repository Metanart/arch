import { FC, Fragment, JSX, useCallback } from 'react'

import { TSettingsClientDTO, TSettingsUpdateClientDTO } from '@arch/contracts'
import { createLog } from '@arch/utils'
import { useGetSettingsQuery, useUpdateSettingsMutation } from '@domains/Settings/SettingsRoot'
import { Message } from '@shared/components'
import { notify } from '@shared/utils'

import { SettingsUpdateForm } from '../components/SettingsUpdateForm'

const log = createLog({ category: 'RENDERER', tag: 'Settings' })

export const SettingsUpdateFormContainer: FC = () => {
  const { data: settingsDto, isLoading, error } = useGetSettingsQuery()
  const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation()

  const handleSave = useCallback(
    async (settingsUpdateDto: TSettingsUpdateClientDTO, isDirty: boolean): Promise<void> => {
      if (!isDirty) {
        notify('No changes to save', 'warning')
        return
      }

      try {
        await updateSettings(settingsUpdateDto).unwrap()
        notify('Settings updated successfully', 'success')
      } catch (error) {
        log.error('Failed to update settings', error)
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
        <SettingsUpdateForm
          isDisabled={isDisabled}
          settingsDto={settingsDto as TSettingsClientDTO}
          onSave={handleSave}
        />
      </Fragment>
    )
  }

  return renderContent()
}
