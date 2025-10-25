import { consola, ConsolaInstance, LogLevel } from 'consola'

import { getEnv } from '../platform/getEnv'

const ENV_LOGS_ENABLED = getEnv('VITE_LOGS_ENABLED') === 'true'

type LogOptions = {
  tag?: string
  category?: string
  level?: LogLevel
}

const createLog = (options: LogOptions = {}): ConsolaInstance => {
  const { tag, category = 'MAIN', level } = options

  const isCategoryEnabled = ENV_LOGS_ENABLED

  const log = isCategoryEnabled
    ? consola.create({
        level: level || 5,
        formatOptions: { colors: true }
      })
    : consola.create({ level: 0 })

  return log.withTag(`${category}${tag ? `: ${tag}` : ''}`)
}

export { createLog }
