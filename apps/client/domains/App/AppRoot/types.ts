import { JSX, ReactElement } from 'react'

export type AppNavigationItem = {
  id: string
  testId?: string
  text: string
  icon: JSX.Element
}

export type AppNavigationParams = {
  isOpen: boolean
  openWidth: number
  closeWidth: number
}

export type AppRoute = {
  id: `${AppDomains}Route`
  testId?: string
  icon: ReactElement
  path: AppURL
  element: ReactElement
}

export type AppBaseDomains = 'App' | 'Common'

export type AppFeatureDomains = 'Home' | 'Models' | 'Sources' | 'Settings' | 'Tasks'

export type AppDomains = AppBaseDomains | AppFeatureDomains

export type AppURL = '/' | `/${AppFeatureDomains}`
