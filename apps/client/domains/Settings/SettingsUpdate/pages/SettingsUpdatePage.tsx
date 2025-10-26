import { FC } from 'react'

import { Page, PageContent, PageHeader } from '@shared/components'

import { SettingsUpdateForm } from '../components/SettingsUpdateForm'

export const SettingsUpdatePage: FC = () => {
  return (
    <Page>
      <PageHeader title={'Settings'} />
      <PageContent>
        <SettingsUpdateForm
          settingsDto={undefined}
          onSave={() => {
            void 0
          }}
          isDisabled={false}
        />
      </PageContent>
    </Page>
  )
}
