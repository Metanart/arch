import { TAppRoute } from '@domains/App/Root'

import FolderZipIcon from '@mui/icons-material/FolderZip'

import { SourcesListPage } from '../pages/SourcesListPage'

export const SourcesListRoute: TAppRoute = {
  id: 'SourcesRoute',
  title: 'Sources',
  icon: <FolderZipIcon />,
  path: '/Sources',
  element: <SourcesListPage />
}
