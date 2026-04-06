import { beforeEach, describe, expect, it, vi } from 'vitest'

import { SETTINGS_IPC_CHANNELS } from '@arch/enums'
import type { TIpcChannel } from '@arch/types'

import { addIpcListener, addIpcListenerWithPayload } from './addIpcListener'

const handleMock = vi.fn()
vi.mock('electron', () => ({
  ipcMain: { handle: (...args: unknown[]) => handleMock(...args) }
}))

vi.mock('@arch/utils', () => ({
  getMessageFromError: (error: unknown) => (error instanceof Error ? error.message : String(error))
}))

describe('addIpcListener', () => {
  const channel: TIpcChannel = SETTINGS_IPC_CHANNELS.GET

  beforeEach(() => {
    handleMock.mockClear()
  })

  it('registers a handler with ipcMain.handle for the given channel', () => {
    const listener = vi.fn().mockResolvedValue({ status: 'success', data: null })

    addIpcListener(listener, channel)

    expect(handleMock).toHaveBeenCalledTimes(1)
    expect(handleMock).toHaveBeenCalledWith(channel, expect.any(Function))
  })

  it('when handler is invoked and listener resolves, returns the success response', async () => {
    const data = { id: 1, theme: 'dark' }
    const listener = vi.fn().mockResolvedValue({ status: 'success', data })
    addIpcListener(listener, channel)
    const wrappedHandler = handleMock.mock.calls[0][1]

    const result = await wrappedHandler({})

    expect(listener).toHaveBeenCalledOnce()
    expect(result).toEqual({ status: 'success', data })
  })

  it('when listener throws Error, returns error response with message', async () => {
    const listener = vi.fn().mockRejectedValue(new Error('Something failed'))
    addIpcListener(listener, channel)
    const wrappedHandler = handleMock.mock.calls[0][1]

    const result = await wrappedHandler({})

    expect(result).toEqual({
      status: 'error',
      error: { message: 'Something failed' }
    })
  })

  it('when listener throws non-Error, returns error response with stringified value', async () => {
    const listener = vi.fn().mockRejectedValue('string error')
    addIpcListener(listener, channel)
    const wrappedHandler = handleMock.mock.calls[0][1]

    const result = await wrappedHandler({})

    expect(result).toEqual({
      status: 'error',
      error: { message: 'string error' }
    })
  })
})

describe('addIpcListenerWithPayload', () => {
  const channel: TIpcChannel = SETTINGS_IPC_CHANNELS.UPDATE

  beforeEach(() => {
    handleMock.mockClear()
  })

  it('registers a handler with ipcMain.handle for the given channel', () => {
    const listener = vi.fn().mockResolvedValue({ status: 'success', data: null })

    addIpcListenerWithPayload(listener, channel)

    expect(handleMock).toHaveBeenCalledTimes(1)
    expect(handleMock).toHaveBeenCalledWith(channel, expect.any(Function))
  })

  it('when handler is invoked with payload, calls listener with payload and returns result', async () => {
    const payload = { theme: 'light' }
    const data = { id: 1, theme: 'light' }
    const listener = vi.fn().mockResolvedValue({ status: 'success', data })
    addIpcListenerWithPayload(listener, channel)
    const wrappedHandler = handleMock.mock.calls[0][1]

    const result = await wrappedHandler({}, payload)

    expect(listener).toHaveBeenCalledWith(payload)
    expect(result).toEqual({ status: 'success', data })
  })

  it('when listener throws, returns error response', async () => {
    const payload = { theme: 'light' }
    const listener = vi.fn().mockRejectedValue(new Error('Update failed'))
    addIpcListenerWithPayload(listener, channel)
    const wrappedHandler = handleMock.mock.calls[0][1]

    const result = await wrappedHandler({}, payload)

    expect(result).toEqual({
      status: 'error',
      error: { message: 'Update failed' }
    })
  })
})
