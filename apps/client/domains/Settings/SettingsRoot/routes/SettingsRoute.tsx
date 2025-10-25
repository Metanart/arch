import { AppRoute } from '@domains/App/AppRoot'
import SettingsIcon from '@mui/icons-material/Settings'

import { SettingsPage } from '../pages/SettingsPage'

export const SettingsRoute: AppRoute = {
  id: 'SettingsRoute',
  testId: 'settings-route',
  icon: <SettingsIcon />,
  path: '/Settings',
  element: <SettingsPage />
}
