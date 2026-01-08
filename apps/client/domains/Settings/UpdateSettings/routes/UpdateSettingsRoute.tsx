import { AppRoute } from '@domains/App/AppRoot'
import SettingsIcon from '@mui/icons-material/Settings'

import { UpdateSettingsPage } from '../pages/UpdateSettingsPage'

export const UpdateSettingsRoute: AppRoute = {
  title: 'Settings',
  id: 'UpdateSettingsRoute',
  testId: 'update-settings-route',
  icon: <SettingsIcon />,
  path: '/Settings/Update',
  element: <UpdateSettingsPage />
}
