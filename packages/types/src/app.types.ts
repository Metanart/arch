export type TAppPart = 'Server' | 'Bridge' | 'Client'

export type TAppDomain = 'Settings' | 'Sources' | 'Global' | 'Tasks' | 'Shared'

export type TAppLayer =
  | 'Database'
  | 'Service'
  | 'IpcAPI'
  | 'Store'
  | 'Container'
  | 'IPC'
  | 'API'
  | 'StartApp'
  | 'FileSystem'
  | 'Worker'

export type TAppContext = {
  domain: TAppDomain
  layer: TAppLayer
  origin: string
}
