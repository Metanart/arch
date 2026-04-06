import SettingsIcon from '@mui/icons-material/Settings'

import type { TAppRoute } from '@/App/Root/types'

import { UpdateSettingsPage } from '../pages/UpdateSettingsPage'

export const UpdateSettingsRoute: TAppRoute = {
  title: 'Settings',
  id: 'UpdateSettingsRoute',
  testId: 'update-settings-route',
  icon: <SettingsIcon />,
  path: '/Settings/Update',
  element: <UpdateSettingsPage />
}
