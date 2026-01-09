import { UpdateSettingsRoute } from '@domains/Settings/UpdateSettings'
import { SourcesListRoute } from '@domains/Sources/SourcesList'

import { AppRoute } from './types'

export const APP_ROUTES: AppRoute[] = [UpdateSettingsRoute, SourcesListRoute]
