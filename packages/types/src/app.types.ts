export type AppPart = 'Server' | 'Bridge' | 'Client'

export type AppDomain = 'Settings' | 'Sources' | 'Global'

export type AppLayer =
  | 'Database'
  | 'Service'
  | 'IpcAPI'
  | 'Store'
  | 'Container'
  | 'IPC'
  | 'API'
  | 'StartApp'

export type AppContext = {
  domain: AppDomain
  layer: AppLayer
  origin: string
}
