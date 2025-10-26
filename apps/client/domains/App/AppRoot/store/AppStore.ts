import { SettingsApi } from '@domains/Settings/SettingsRoot'
import { configureStore } from '@reduxjs/toolkit'

export const AppStore = configureStore({
  reducer: {
    [SettingsApi.reducerPath]: SettingsApi.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(SettingsApi.middleware)
})
