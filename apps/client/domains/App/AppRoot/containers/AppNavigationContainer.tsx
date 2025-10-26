import { FC } from 'react'

import { APP_ROUTES } from '../routes'
import { AppNavigation } from '../components/AppNavigation'
import { AppNavigationButton } from '../components/AppNavigationButton'
import { AppNavigationParams } from '../types'

type Props = {
  onToggleClick: () => void
  navigation: AppNavigationParams
}

export const AppNavigationContainer: FC<Props> = (props) => {
  const {
    onToggleClick,
    navigation: { isOpen }
  } = props

  return (
    <AppNavigation onToggleClick={onToggleClick} isOpen={isOpen}>
      {APP_ROUTES.map((item) => (
        <AppNavigationButton
          id={item.id}
          testId={item.testId}
          key={item.id}
          text={item.id}
          icon={item.icon}
          to={item.path}
          isOpen={isOpen}
        />
      ))}
    </AppNavigation>
  )
}
