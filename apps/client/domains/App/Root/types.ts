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
  id: string
  title: string
  testId?: string
  icon: ReactElement
  path: string
  element: ReactElement
}

export type AppBaseDomains = 'App' | 'Common'

export type AppFeatureDomains = 'Home' | 'Models' | 'Sources' | 'Settings' | 'Tasks'

export type AppDomains = AppBaseDomains | AppFeatureDomains
