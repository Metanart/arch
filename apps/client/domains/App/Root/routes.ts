import { UpdateSettingsRoute } from '@domains/Settings/UpdateSettings'
import { SourcesListRoute } from '@domains/Sources/SourcesList'

import { TAppRoute } from './types'

export const APP_ROUTES: TAppRoute[] = [UpdateSettingsRoute, SourcesListRoute]
