export type AppPart = 'Server' | 'Bridge' | 'Client'

export type AppDomain = 'Settings' | 'Sources' | 'Global' | 'Tasks'

export type AppLayer =
  | 'Database'
  | 'Service'
  | 'IpcAPI'
  | 'Store'
  | 'Container'
  | 'IPC'
  | 'API'
  | 'StartApp'
  | 'FileSystem'

export type AppContext = {
  domain: AppDomain
  layer: AppLayer
  origin: string
}
