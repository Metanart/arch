import { JSX, ReactElement } from 'react'

export type TAppNavigationItem = {
  id: string
  testId?: string
  text: string
  icon: JSX.Element
}

export type TAppNavigationParams = {
  isOpen: boolean
  openWidth: number
  closeWidth: number
}

export type TAppRoute = {
  id: string
  title: string
  testId?: string
  icon: ReactElement
  path: string
  element: ReactElement
}

export type TAppBaseDomains = 'App' | 'Common'

export type TAppFeatureDomains = 'Home' | 'Models' | 'Sources' | 'Settings' | 'Tasks'

export type TAppDomains = TAppBaseDomains | TAppFeatureDomains
