import { AppContext } from '@arch/types'

import { consola, ConsolaInstance, LogLevel } from 'consola'

const createLogger = (context: AppContext, level: LogLevel = 5): ConsolaInstance => {
  const { domain, layer, origin } = context

  const log = consola.create({ level, formatOptions: { colors: true } })

  return log.withTag(`${domain}:${layer}:${origin}`)
}

export { createLogger }
