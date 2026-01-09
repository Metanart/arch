import { AppContext } from '@arch/types'

import { consola, ConsolaInstance, LogLevel } from 'consola'

import { getEnv } from '../platform/getEnv'

const ENV_LOGS_ENABLED = getEnv('VITE_LOGS_ENABLED') === 'true'

const createLogger = (context: AppContext, level: LogLevel = 5): ConsolaInstance => {
  const { domain, layer, origin } = context

  const log = ENV_LOGS_ENABLED
    ? consola.create({
        level,
        formatOptions: { colors: true }
      })
    : consola.create({ level: 0 })

  return log.withTag(`${domain}:${layer}:${origin}`)
}

export { createLogger }
