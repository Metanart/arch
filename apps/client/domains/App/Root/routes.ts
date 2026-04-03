import { UpdateSettingsRoute } from '@domains/Settings/UpdateSettings/routes'
import { SourcesListRoute } from '@domains/Sources/SourcesList/routes'

import { TAppRoute } from './types'

export const APP_ROUTES: TAppRoute[] = [UpdateSettingsRoute, SourcesListRoute]
