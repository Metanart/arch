import { configureStore } from '@reduxjs/toolkit'

import { SettingsIpcApi } from '@domains/Settings/Root'
import { SourcesIpcApi } from '@domains/Sources/Root'

import { AppUiSlice } from './AppUiSlice'

export const AppStore = configureStore({
  reducer: {
    appUi: AppUiSlice.reducer,
    [SettingsIpcApi.reducerPath]: SettingsIpcApi.reducer,
    [SourcesIpcApi.reducerPath]: SourcesIpcApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(SettingsIpcApi.middleware, SourcesIpcApi.middleware)
})

export type AppState = ReturnType<typeof AppStore.getState>

export type AppDispatch = typeof AppStore.dispatch
