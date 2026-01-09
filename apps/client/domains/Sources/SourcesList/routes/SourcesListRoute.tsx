import { AppRoute } from '@domains/App/Root'

import FolderZipIcon from '@mui/icons-material/FolderZip'

import { SourcesListPage } from '../pages/SourcesListPage'

export const SourcesListRoute: AppRoute = {
  id: 'SourcesRoute',
  title: 'Sources',
  icon: <FolderZipIcon />,
  path: '/Sources',
  element: <SourcesListPage />
}
