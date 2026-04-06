import { consola, ConsolaInstance, LogLevel } from 'consola'

import { TAppContext } from '@arch/types'

const createLogger = (context: TAppContext, level: LogLevel = 5): ConsolaInstance => {
  const { domain, layer, origin } = context

  const log = consola.create({ level, formatOptions: { colors: true } })

  return log.withTag(`${domain}:${layer}:${origin}`)
}

export { createLogger }
