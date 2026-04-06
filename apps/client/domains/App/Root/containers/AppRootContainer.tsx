import { JSX, PropsWithChildren, useState } from 'react'

import { AppContent } from '../components/AppContent'
import { AppRoot } from '../components/AppRoot'

import { AppNavigationContainer } from './AppNavigationContainer'

const NAVIGATION_OPEN_WIDTH = 240
const NAVIGATION_CLOSE_WIDTH = 64

export function AppRootContainer({ children }: PropsWithChildren): JSX.Element {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false)

  return (
    <AppRoot>
      <AppNavigationContainer
        onToggleClick={() => setIsNavigationOpen(!isNavigationOpen)}
        navigation={{
          isOpen: isNavigationOpen,
          openWidth: NAVIGATION_OPEN_WIDTH,
          closeWidth: NAVIGATION_CLOSE_WIDTH
        }}
      />
      <AppContent
        navigationWidth={isNavigationOpen ? NAVIGATION_OPEN_WIDTH : NAVIGATION_CLOSE_WIDTH}
      >
        {children}
      </AppContent>
    </AppRoot>
  )
}
