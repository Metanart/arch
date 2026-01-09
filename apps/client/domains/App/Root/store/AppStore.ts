import { configureStore } from '@reduxjs/toolkit'

import { SettingsIpcApi } from '@domains/Settings/Root'
import { SourcesIpcApi } from '@domains/Sources/Root'

export const AppStore = configureStore({
  reducer: {
    [SettingsIpcApi.reducerPath]: SettingsIpcApi.reducer,
    [SourcesIpcApi.reducerPath]: SourcesIpcApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(SettingsIpcApi.middleware, SourcesIpcApi.middleware)
})
