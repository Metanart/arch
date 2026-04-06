import FolderZipIcon from '@mui/icons-material/FolderZip'

import type { TAppRoute } from '@/App/Root'

import { SourcesListPage } from '../pages/SourcesListPage'

export const SourcesListRoute: TAppRoute = {
  id: 'SourcesRoute',
  title: 'Sources',
  icon: <FolderZipIcon />,
  path: '/Sources',
  element: <SourcesListPage />
}
