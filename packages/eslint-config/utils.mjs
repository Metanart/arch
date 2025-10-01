const CLIENT_EXT = `ts,tsx`

const SERVER_EXT = `ts`

const BRIDGE_EXT = `ts`

const CONFIGS_EXT = `mjs`

export const clientFiles = `./apps/client/**/*.{${CLIENT_EXT}}`

export const serverFiles = `./apps/server/**/*.{${SERVER_EXT}}`

export const bridgeFiles = `./apps/bridge/**/*.{${BRIDGE_EXT}}`

export const configsFiles = `./configs/**/*.{${CONFIGS_EXT}}`
