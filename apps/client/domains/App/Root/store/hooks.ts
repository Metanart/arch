import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import type { TAppDispatch, TAppState } from './AppStore'

export const useAppDispatch = () => useDispatch<TAppDispatch>()

export const useAppSelector: TypedUseSelectorHook<TAppState> = useSelector
