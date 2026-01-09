import { configureStore } from '@reduxjs/toolkit'

import { SettingsIpcApi } from '@domains/Settings/Root'

export const AppStore = configureStore({
  reducer: {
    [SettingsIpcApi.reducerPath]: SettingsIpcApi.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(SettingsIpcApi.middleware)
})
