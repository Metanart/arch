import { ApiDomain, ApiMethod, ApiResponse, ApiTag } from '@arch/types'
import { createLog } from '@arch/utils'
import { BaseQueryFn } from '@reduxjs/toolkit/query'

export const baseApiQuery: BaseQueryFn<
  { domain: ApiDomain; method: ApiMethod; payload?: unknown },
  unknown,
  string
> = async ({ domain, method, payload }) => {
  const tag: ApiTag = `${domain}.${method}`
  const log = createLog({ tag, category: 'RENDERER' })

  try {
    // @ts-expect-error - window.api is not typed
    const api = window.api[domain.toLowerCase().trim()]

    if (!api || typeof api[method] !== 'function') {
      const error = `API method ${tag} not found`
      log.error(error)
      throw { error }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: ApiResponse<any> = await api[method](payload)

    if ('error' in response) {
      log.error(response.error)
      throw new Error(response.error)
    }

    if (!response.data) {
      log.error('Response is empty')
      throw new Error('Response is empty')
    }

    return response

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    log.error(error)
    const message = error?.message || 'Unknown error'
    return { error: message }
  }
}
