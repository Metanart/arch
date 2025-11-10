import { AppRoute } from '@domains/App/AppRoot'
import SettingsIcon from '@mui/icons-material/Settings'

import { SettingsUpdatePage } from '../pages/SettingsUpdatePage'

export const SettingsUpdateRoute: AppRoute = {
  title: 'Settings',
  id: 'SettingsUpdateRoute',
  testId: 'settings-update-route',
  icon: <SettingsIcon />,
  path: '/Settings/Update',
  element: <SettingsUpdatePage />
}
