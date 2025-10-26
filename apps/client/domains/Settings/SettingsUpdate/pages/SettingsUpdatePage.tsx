import { FC } from 'react'

import { Page, PageContent, PageHeader } from '@shared/components'

import { SettingsUpdateFormContainer } from '../containers/SettingsUpdateFormContainer'

export const SettingsUpdatePage: FC = () => {
  return (
    <Page>
      <PageHeader title={'Settings'} />
      <PageContent>
        <SettingsUpdateFormContainer />
      </PageContent>
    </Page>
  )
}
