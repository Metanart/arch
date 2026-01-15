import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type AppUiState = {
  theme: 'light' | 'dark'
}

const initialState: AppUiState = {
  theme: 'light'
}

export const AppUiSlice = createSlice({
  name: 'AppUi',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<'light' | 'dark'>) {
      state.theme = action.payload
    }
  }
})

export const { setTheme } = AppUiSlice.actions
