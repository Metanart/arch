export function getEnv(key: string): string | undefined {
  if (typeof process !== 'undefined' && process.env?.NODE_ENV) {
    return process.env[key]
  }
  // @ts-expect-error - import.meta.env is not typed
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // @ts-expect-error - import.meta.env is not typed
    return import.meta.env[key]
  }

  return undefined
}
