import { SettingsIpcApi } from '@domains/Settings/SettingsRoot'
import { configureStore } from '@reduxjs/toolkit'

export const AppStore = configureStore({
  reducer: {
    [SettingsIpcApi.reducerPath]: SettingsIpcApi.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(SettingsIpcApi.middleware)
})
