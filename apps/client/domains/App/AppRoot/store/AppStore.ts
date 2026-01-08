import { configureStore } from '@reduxjs/toolkit'

import { SettingsIpcApi } from '../../../Settings/Root/public-api'

export const AppStore = configureStore({
  reducer: {
    [SettingsIpcApi.reducerPath]: SettingsIpcApi.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(SettingsIpcApi.middleware)
})
