import { FC } from 'react'

import { Page, PageContent, PageHeader } from '@shared/components'

import { UpdateSettingsFormContainer } from '../containers/UpdateSettingsFormContainer'

export const UpdateSettingsPage: FC = () => {
  return (
    <Page>
      <PageHeader title={'Settings'} />
      <PageContent>
        <UpdateSettingsFormContainer />
      </PageContent>
    </Page>
  )
}
